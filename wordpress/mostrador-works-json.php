<?php
/**
 * Plugin Name: Mostrador Works JSON
 * Description: Genera un JSON estático con los trabajos (tipo "work") cada vez que se crean, editan o borran, para que la web los lea sin arrancar PHP.
 * Version: 1.0.0
 */

/*
 * WHAT THIS IS AND WHY IT IS STORED HERE
 *
 * This file is NOT part of the React app. It is a WordPress plugin that lives
 * on the IONOS server, in wp-content/mu-plugins/mostrador-works-json.php.
 * It is kept in this repository only as a backup and to keep the code the
 * website depends on under version control. If it is lost on the server,
 * upload it again from here.
 *
 * What it is for: reading the works from the WordPress API (/wp-json) took
 * over a second, because WordPress needs almost a second just to boot. This
 * plugin generates a works.json file with the same data every time a work is
 * created, edited or deleted, and Apache serves it directly without booting
 * WordPress (about 0.17 s). The website reads it from
 * packages/ama-mostrador/src/api/works.ts, and falls back to the regular API
 * if the file does not exist.
 *
 * Whoever manages the content does not need to do anything: they keep editing
 * works in the Pods fields and the JSON is regenerated automatically.
 *
 * Installation: upload this file to wp-content/mu-plugins/ (create the folder
 * if it does not exist). Plugins in that folder are activated automatically.
 * That same folder also holds automation-by-installatron.php, which is created
 * by IONOS: leave it alone.
 *
 * Output: wp-content/uploads/mostrador/works.json
 * Status and manual rebuild button: WordPress admin > Tools > Mostrador JSON
 *
 * IMPORTANT: if the fields of the "work" pod are changed in WordPress, or the
 * post type is renamed, review this file and the src/api/works.ts layer of the
 * website.
 */

defined( 'ABSPATH' ) || exit;

const MOSTRADOR_POST_TYPE = 'work';
const MOSTRADOR_PER_PAGE  = 100;

function mostrador_json_dir() {
	return trailingslashit( wp_upload_dir()['basedir'] ) . 'mostrador';
}

function mostrador_json_path() {
	return mostrador_json_dir() . '/works.json';
}

function mostrador_json_url() {
	return trailingslashit( wp_upload_dir()['baseurl'] ) . 'mostrador/works.json';
}

/**
 * Pide todos los trabajos a la REST API interna (con imágenes embebidas),
 * con el mismo formato que devuelve /wp-json/wp/v2/work
 */
function mostrador_collect_works() {
	$route = function_exists( 'rest_get_route_for_post_type_items' )
		? rest_get_route_for_post_type_items( MOSTRADOR_POST_TYPE )
		: '/wp/v2/' . MOSTRADOR_POST_TYPE;

	if ( ! $route ) {
		return null;
	}

	$works       = array();
	$page        = 1;
	$total_pages = 1;

	do {
		$request = new WP_REST_Request( 'GET', $route );
		$request->set_query_params( array(
			'per_page' => MOSTRADOR_PER_PAGE,
			'page'     => $page,
		) );

		$response = rest_do_request( $request );
		if ( $response->is_error() ) {
			return null;
		}

		$headers     = $response->get_headers();
		$total_pages = (int) ( $headers['X-WP-TotalPages'] ?? 1 );
		$works       = array_merge( $works, rest_get_server()->response_to_data( $response, true ) );
		$page++;
	} while ( $page <= $total_pages );

	return $works;
}

/**
 * Cabeceras para la carpeta del JSON: permite leerlo desde otro origen
 * (por ejemplo localhost en desarrollo) y obliga al navegador a revisar
 * si ha cambiado, para que los cambios se vean al momento.
 */
function mostrador_write_htaccess( $dir ) {
	$file = $dir . '/.htaccess';
	if ( file_exists( $file ) ) {
		return;
	}

	$rules  = "<IfModule mod_headers.c>\n";
	$rules .= "Header set Access-Control-Allow-Origin \"*\"\n";
	$rules .= "Header set Cache-Control \"no-cache\"\n";
	$rules .= "</IfModule>\n";

	file_put_contents( $file, $rules );
}

function mostrador_rebuild_works_json() {
	$works = mostrador_collect_works();
	if ( null === $works ) {
		return false;
	}

	$dir = mostrador_json_dir();
	if ( ! wp_mkdir_p( $dir ) ) {
		return false;
	}

	mostrador_write_htaccess( $dir );

	// Se escribe en un archivo temporal y se renombra, para que nunca se lea a medias
	$tmp = $dir . '/works.json.tmp';
	if ( false === file_put_contents( $tmp, wp_json_encode( $works ) ) ) {
		return false;
	}

	return rename( $tmp, mostrador_json_path() );
}

/**
 * La regeneración se hace al final de la petición ("shutdown"), una sola vez,
 * cuando ya se han guardado todos los campos de Pods.
 */
function mostrador_schedule_rebuild() {
	static $scheduled = false;
	if ( $scheduled ) {
		return;
	}
	$scheduled = true;
	add_action( 'shutdown', 'mostrador_rebuild_works_json' );
}

function mostrador_maybe_rebuild_for_post( $post_id ) {
	if ( wp_is_post_revision( $post_id ) || wp_is_post_autosave( $post_id ) ) {
		return;
	}
	if ( MOSTRADOR_POST_TYPE === get_post_type( $post_id ) ) {
		mostrador_schedule_rebuild();
	}
}

// Crear, editar, publicar o despublicar
add_action( 'save_post_' . MOSTRADOR_POST_TYPE, 'mostrador_maybe_rebuild_for_post' );

// Papelera y borrado
add_action( 'trashed_post', 'mostrador_maybe_rebuild_for_post' );
add_action( 'untrashed_post', 'mostrador_maybe_rebuild_for_post' );
add_action( 'before_delete_post', 'mostrador_maybe_rebuild_for_post' );

// Campos personalizados e imagen destacada (se guardan como metadatos del trabajo)
foreach ( array( 'added_post_meta', 'updated_post_meta', 'deleted_post_meta' ) as $hook ) {
	add_action( $hook, function ( $meta_id, $post_id ) {
		mostrador_maybe_rebuild_for_post( $post_id );
	}, 10, 2 );
}

// Pods: al guardar un trabajo desde su pantalla
add_action( 'pods_api_post_save_pod_item', function ( $pieces ) {
	if ( isset( $pieces['pod']['name'] ) && MOSTRADOR_POST_TYPE === $pieces['pod']['name'] ) {
		mostrador_schedule_rebuild();
	}
} );

// Si se edita o se borra una imagen de la mediateca
add_action( 'edit_attachment', 'mostrador_schedule_rebuild' );
add_action( 'delete_attachment', 'mostrador_schedule_rebuild' );

// Primera vez: si el archivo no existe, se genera al entrar al panel
add_action( 'admin_init', function () {
	if ( ! file_exists( mostrador_json_path() ) ) {
		mostrador_schedule_rebuild();
	}
} );

// Herramientas > Mostrador JSON: estado y botón para regenerar a mano
add_action( 'admin_menu', function () {
	add_management_page( 'Mostrador JSON', 'Mostrador JSON', 'manage_options', 'mostrador-works-json', 'mostrador_render_admin_page' );
} );

function mostrador_render_admin_page() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}

	$message = '';
	if ( isset( $_POST['mostrador_rebuild'] ) && check_admin_referer( 'mostrador_rebuild' ) ) {
		$message = mostrador_rebuild_works_json()
			? 'JSON regenerado correctamente.'
			: 'No se ha podido regenerar el JSON. Revisa los permisos de la carpeta uploads.';
	}

	$path   = mostrador_json_path();
	$exists = file_exists( $path );
	$count  = $exists ? count( (array) json_decode( file_get_contents( $path ), true ) ) : 0;

	echo '<div class="wrap"><h1>Mostrador JSON</h1>';

	if ( $message ) {
		echo '<div class="notice notice-info"><p>' . esc_html( $message ) . '</p></div>';
	}

	echo '<p>El JSON se regenera solo cada vez que se crea, edita o borra un trabajo. Este botón solo hace falta si algo no se ha actualizado.</p>';

	if ( $exists ) {
		printf(
			'<p>Archivo: <a href="%1$s" target="_blank" rel="noopener">%1$s</a><br>Trabajos incluidos: %2$d<br>Última actualización: %3$s</p>',
			esc_url( mostrador_json_url() ),
			(int) $count,
			esc_html( wp_date( 'd/m/Y H:i:s', filemtime( $path ) ) )
		);
	} else {
		echo '<p><strong>El archivo todavía no existe.</strong></p>';
	}

	echo '<form method="post">';
	wp_nonce_field( 'mostrador_rebuild' );
	echo '<p><button type="submit" name="mostrador_rebuild" class="button button-primary">Regenerar ahora</button></p>';
	echo '</form></div>';
}
