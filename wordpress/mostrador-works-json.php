<?php
/**
 * Plugin Name: Mostrador Works JSON
 * Description: Genera un JSON estático con los trabajos (tipo "work") y las exposiciones (tipo "exhibition") cada vez que se crean, editan o borran, para que la web los lea sin arrancar PHP.
 * Version: 1.2.0
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
 * It also exposes the "heroimage" Pods field (a single file/image field of the
 * "work" pod) as `hero_image`, a plain URL, both in works.json and in the
 * regular REST API. The featured image is used for the card in the home feed,
 * and the hero image for the top of the product page.
 *
 * The "exhibition" post type (pod "exhibition", same fields as "work") gets the
 * same treatment: exhibitions.json, with its own hero_image field. If its pod
 * does not exist yet, it is simply skipped.
 *
 * The same plugin also publishes the content of the About page as about.json
 * (email, based, about text and image). That content lives in the Pods pod
 * "about" (a custom post type), in its first published item, with the fields
 * "email", "based", "text" and "image".
 * See src/api/about.ts and src/pages/About.tsx in the website.
 *
 * Output: wp-content/uploads/mostrador/works.json, exhibitions.json and about.json
 * Status and manual rebuild button: WordPress admin > Tools > Mostrador JSON
 *
 * IMPORTANT: if the fields of the "work" pod are changed in WordPress, or the
 * post type is renamed, review this file and the src/api/works.ts layer of the
 * website.
 */

defined( 'ABSPATH' ) || exit;

// Post types que se publican como JSON estático: post type => archivo
const MOSTRADOR_COLLECTIONS = array(
	'work'       => 'works.json',
	'exhibition' => 'exhibitions.json',
);
const MOSTRADOR_PER_PAGE  = 100;
const MOSTRADOR_HERO_FIELD = 'heroimage';

// Pod "about": se usa su primer item (los campos son email, based, text e image)
const MOSTRADOR_ABOUT_POD = 'about';

/**
 * Campo REST `hero_image`: URL de la imagen del hero (campo de Pods "heroimage").
 * Pods guarda el campo de archivo como ID de adjunto en los metadatos; se
 * aceptan también los formatos array/objeto por si cambia la configuración.
 * Vacío si el trabajo no tiene imagen de hero.
 */
add_action( 'rest_api_init', function () {
	foreach ( array_keys( MOSTRADOR_COLLECTIONS ) as $post_type ) {
		register_rest_field( $post_type, 'hero_image', array(
			'get_callback' => function ( $post ) {
				$value = get_post_meta( $post['id'], MOSTRADOR_HERO_FIELD, true );

				if ( is_array( $value ) ) {
					$value = $value['ID'] ?? $value['id'] ?? reset( $value );
				}

				$attachment_id = (int) $value;
				if ( ! $attachment_id ) {
					return '';
				}

				$url = wp_get_attachment_image_url( $attachment_id, 'medium_large' );
				return $url ? $url : '';
			},
			'schema'       => array(
				'description' => 'URL de la imagen del hero',
				'type'        => 'string',
			),
		) );
	}
} );

function mostrador_json_dir() {
	return trailingslashit( wp_upload_dir()['basedir'] ) . 'mostrador';
}

function mostrador_json_path( $post_type ) {
	return mostrador_json_dir() . '/' . MOSTRADOR_COLLECTIONS[ $post_type ];
}

function mostrador_json_url( $post_type ) {
	return trailingslashit( wp_upload_dir()['baseurl'] ) . 'mostrador/' . MOSTRADOR_COLLECTIONS[ $post_type ];
}

/**
 * Post types de MOSTRADOR_COLLECTIONS que existen de verdad en WordPress
 * (la exposición no existe hasta que se crea su pod)
 */
function mostrador_active_post_types() {
	return array_values( array_filter( array_keys( MOSTRADOR_COLLECTIONS ), 'post_type_exists' ) );
}

function mostrador_about_json_path() {
	return mostrador_json_dir() . '/about.json';
}

/**
 * ID del primer item publicado del pod "about" (es un custom post type),
 * o 0 si todavía no hay ninguno
 */
function mostrador_about_item_id() {
	$ids = get_posts( array(
		'post_type'      => MOSTRADOR_ABOUT_POD,
		'post_status'    => 'publish',
		'posts_per_page' => 1,
		'orderby'        => 'ID',
		'order'          => 'ASC',
		'fields'         => 'ids',
	) );

	return $ids ? (int) $ids[0] : 0;
}

/**
 * Contenido de la página About. Los campos vacíos se devuelven vacíos
 * ("" o lista vacía) y la web no pinta nada en su lugar.
 * - about: lista de textos (campo repetible o texto con saltos de línea);
 *   puede llevar HTML en línea, que la web sanea antes de mostrarlo.
 * - image: URL de la imagen (campo de archivo, guardado como ID de adjunto).
 */
function mostrador_collect_about() {
	$item_id = mostrador_about_item_id();

	// Con Pods se leen los campos con su API (maneja repetibles y archivos);
	// si no está disponible, se leen los metadatos del item directamente
	$pod = ( $item_id && function_exists( 'pods' ) ) ? pods( MOSTRADOR_ABOUT_POD, $item_id ) : null;
	if ( $pod && ! $pod->exists() ) {
		$pod = null;
	}

	$get = function ( $field ) use ( $pod, $item_id ) {
		if ( $pod ) {
			return $pod->field( $field );
		}
		return $item_id ? get_post_meta( $item_id, strtok( $field, '.' ), true ) : '';
	};

	$text = $get( 'text' );
	if ( ! is_array( $text ) ) {
		$text = array( $text );
	}
	$text = array_values( array_filter( array_map( 'trim', array_filter( $text, 'is_string' ) ) ) );

	$image = $get( 'image.ID' );
	if ( is_array( $image ) ) {
		$image = $image['ID'] ?? $image['id'] ?? reset( $image );
	}
	$image_id = (int) $image;

	return array(
		'email'     => trim( (string) $get( 'email' ) ),
		'based'     => trim( (string) $get( 'based' ) ),
		'about'     => $text,
		'image'     => $image_id ? (string) wp_get_attachment_image_url( $image_id, 'full' ) : '',
		'image_alt' => $image_id ? (string) get_post_meta( $image_id, '_wp_attachment_image_alt', true ) : '',
	);
}

// Mismo contenido por la API normal, por si no existe el archivo estático
add_action( 'rest_api_init', function () {
	register_rest_route( 'mostrador/v1', '/about', array(
		'methods'             => 'GET',
		'callback'            => 'mostrador_collect_about',
		'permission_callback' => '__return_true',
	) );
} );

/**
 * Pide todos los items de un post type a la REST API interna (con imágenes
 * embebidas), con el mismo formato que devuelve /wp-json/wp/v2/{tipo}
 */
function mostrador_collect_items( $post_type ) {
	$route = function_exists( 'rest_get_route_for_post_type_items' )
		? rest_get_route_for_post_type_items( $post_type )
		: '/wp/v2/' . $post_type;

	if ( ! $route ) {
		return null;
	}

	$items       = array();
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
		$items       = array_merge( $items, rest_get_server()->response_to_data( $response, true ) );
		$page++;
	} while ( $page <= $total_pages );

	return $items;
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

/**
 * Escribe un JSON en uploads/mostrador. Se escribe en un archivo temporal y se
 * renombra, para que nunca se lea a medias
 */
function mostrador_write_json( $filename, $data ) {
	$dir = mostrador_json_dir();
	if ( ! wp_mkdir_p( $dir ) ) {
		return false;
	}

	mostrador_write_htaccess( $dir );

	$tmp = $dir . '/' . $filename . '.tmp';
	if ( false === file_put_contents( $tmp, wp_json_encode( $data ) ) ) {
		return false;
	}

	return rename( $tmp, $dir . '/' . $filename );
}

function mostrador_rebuild_collection_json( $post_type ) {
	$items = mostrador_collect_items( $post_type );
	if ( null === $items ) {
		return false;
	}

	return mostrador_write_json( MOSTRADOR_COLLECTIONS[ $post_type ], $items );
}

// Regenera todos los JSON que existen; true si todos han ido bien
function mostrador_rebuild_all() {
	$ok = mostrador_rebuild_about_json();
	foreach ( mostrador_active_post_types() as $post_type ) {
		$ok = mostrador_rebuild_collection_json( $post_type ) && $ok;
	}
	return $ok;
}

function mostrador_rebuild_about_json() {
	return mostrador_write_json( 'about.json', mostrador_collect_about() );
}

/**
 * La regeneración se hace al final de la petición ("shutdown"), una sola vez,
 * cuando ya se han guardado todos los campos de Pods.
 */
function mostrador_schedule_rebuild( $post_type ) {
	static $scheduled = array();
	if ( isset( $scheduled[ $post_type ] ) ) {
		return;
	}
	$scheduled[ $post_type ] = true;
	add_action( 'shutdown', function () use ( $post_type ) {
		mostrador_rebuild_collection_json( $post_type );
	} );
}

function mostrador_schedule_rebuild_all() {
	foreach ( mostrador_active_post_types() as $post_type ) {
		mostrador_schedule_rebuild( $post_type );
	}
	mostrador_schedule_about_rebuild();
}

function mostrador_schedule_about_rebuild() {
	static $scheduled = false;
	if ( $scheduled ) {
		return;
	}
	$scheduled = true;
	add_action( 'shutdown', 'mostrador_rebuild_about_json' );
}

function mostrador_maybe_rebuild_for_post( $post_id ) {
	if ( wp_is_post_revision( $post_id ) || wp_is_post_autosave( $post_id ) ) {
		return;
	}

	$post_type = get_post_type( $post_id );
	if ( array_key_exists( $post_type, MOSTRADOR_COLLECTIONS ) ) {
		mostrador_schedule_rebuild( $post_type );
	} elseif ( MOSTRADOR_ABOUT_POD === $post_type ) {
		mostrador_schedule_about_rebuild();
	}
}

// Crear, editar, publicar o despublicar
foreach ( array_keys( MOSTRADOR_COLLECTIONS ) as $mostrador_type ) {
	add_action( 'save_post_' . $mostrador_type, 'mostrador_maybe_rebuild_for_post' );
}
add_action( 'save_post_' . MOSTRADOR_ABOUT_POD, 'mostrador_maybe_rebuild_for_post' );

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
	$name = $pieces['pod']['name'] ?? '';
	if ( array_key_exists( $name, MOSTRADOR_COLLECTIONS ) ) {
		mostrador_schedule_rebuild( $name );
	} elseif ( MOSTRADOR_ABOUT_POD === $name ) {
		mostrador_schedule_about_rebuild();
	}
} );

// Si se edita o se borra una imagen de la mediateca
foreach ( array( 'edit_attachment', 'delete_attachment' ) as $hook ) {
	add_action( $hook, 'mostrador_schedule_rebuild_all' );
}

// Primera vez: si los archivos no existen, se generan al entrar al panel
add_action( 'admin_init', function () {
	foreach ( mostrador_active_post_types() as $post_type ) {
		if ( ! file_exists( mostrador_json_path( $post_type ) ) ) {
			mostrador_schedule_rebuild( $post_type );
		}
	}
	if ( ! file_exists( mostrador_about_json_path() ) ) {
		mostrador_schedule_about_rebuild();
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

	echo '<div class="wrap">';

	$message = '';
	if ( isset( $_POST['mostrador_rebuild'] ) && check_admin_referer( 'mostrador_rebuild' ) ) {
		$message = mostrador_rebuild_all()
			? 'JSON regenerados correctamente.'
			: 'No se han podido regenerar los JSON. Revisa los permisos de la carpeta uploads.';
	}

	echo '<h1>Mostrador JSON</h1>';

	if ( $message ) {
		echo '<div class="notice notice-info"><p>' . esc_html( $message ) . '</p></div>';
	}

	echo '<p>Los JSON se regeneran solos cada vez que se crea, edita o borra un trabajo, una exposición o el item de About. Este botón solo hace falta si algo no se ha actualizado.</p>';

	foreach ( array_keys( MOSTRADOR_COLLECTIONS ) as $post_type ) {
		if ( ! post_type_exists( $post_type ) ) {
			printf( '<p><strong>%s</strong>: el pod todavía no existe.</p>', esc_html( $post_type ) );
			continue;
		}

		$path = mostrador_json_path( $post_type );
		if ( file_exists( $path ) ) {
			printf(
				'<p>Archivo: <a href="%1$s" target="_blank" rel="noopener">%1$s</a><br>Items incluidos: %2$d<br>Última actualización: %3$s</p>',
				esc_url( mostrador_json_url( $post_type ) ),
				count( (array) json_decode( file_get_contents( $path ), true ) ),
				esc_html( wp_date( 'd/m/Y H:i:s', filemtime( $path ) ) )
			);
		} else {
			printf( '<p><strong>%s</strong>: el archivo todavía no existe.</p>', esc_html( $post_type ) );
		}
	}

	$about_counts = wp_count_posts( MOSTRADOR_ABOUT_POD );
	$about_id     = mostrador_about_item_id();
	printf(
		'<h2>About</h2><p>Versión del plugin: %1$s<br>Items del pod "%2$s": %3$d publicados, %4$d en borrador<br>Item usado: %5$s</p>',
		esc_html( get_file_data( __FILE__, array( 'v' => 'Version' ) )['v'] ),
		esc_html( MOSTRADOR_ABOUT_POD ),
		(int) ( $about_counts->publish ?? 0 ),
		(int) ( $about_counts->draft ?? 0 ),
		$about_id ? '#' . (int) $about_id : 'ninguno (hay que publicar un item del pod)'
	);

	echo '<form method="post">';
	wp_nonce_field( 'mostrador_rebuild' );
	echo '<p><button type="submit" name="mostrador_rebuild" class="button button-primary">Regenerar ahora</button></p>';
	echo '</form></div>';
}
