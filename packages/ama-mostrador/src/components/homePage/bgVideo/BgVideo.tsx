import "./BgVideo.scss";
import { useEffect, useState } from "react";

const verticalVideoUrl = "https://crudecrude.com/wp-content/uploads/2025/05/mostrador.mp4";
const horizontalVideoUrl = "https://crudecrude.com/wp-content/uploads/2025/05/mostrador.mp4";


function BgVideo() {

    const [screenRes, setScreenRes] = useState(window.innerWidth < 592);
    const [videoUrl, setVideoUrl] = useState(
      window.innerWidth < 592 ? verticalVideoUrl : horizontalVideoUrl
    );

    useEffect(() => {
      const handleResize = () => {
        const isMobile = window.innerWidth < 592;
        setScreenRes(isMobile);
        setVideoUrl(isMobile ? verticalVideoUrl : horizontalVideoUrl);
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <>
      <video
        className={`bg-video ${screenRes ? "bg-video--mob" : "bg-video--des"}`}
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
