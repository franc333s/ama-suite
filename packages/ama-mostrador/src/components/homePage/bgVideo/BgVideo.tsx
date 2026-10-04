import "./BgVideo.scss";

const videoUrl = "https://mostradorgallery.com/wp-content/uploads/2026/10/mostrador.mp4";

function BgVideo() {

    return (
        <>
      <video
        className="bg-video"
        autoPlay
        loop
        muted
        playsInline
        disablePictureInPicture
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </>
    )
}


export default BgVideo;
