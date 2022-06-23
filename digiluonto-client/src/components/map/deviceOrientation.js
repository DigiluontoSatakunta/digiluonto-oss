import "./mapcss/Mainmap.css";
import { isAndroid } from "react-device-detect";

export default function deviceOrientation(userLocation, setOrientation) {
  // if (isIOS && location) {
  //   DeviceMotionEvent.requestPermission()
  //     .then(response => {
  //       if (response === "granted") {
  //         window.addEventListener("deviceorientation", event => {
  //           if (typeof DeviceMotionEvent.requestPermission === "function") {
  //             // iOS 13+
  //             let alpha = null;
  //             if (event.webkitCompassHeading) {
  //               alpha = event.webkitCompassHeading;
  //             } else {
  //               alpha = event.alpha;
  //             }
  //             let icon = document.getElementsByClassName("css-icon")[0];
  //             let direction = alpha;

  //             setOrientation(parseInt(direction));
  //             icon?.style.setProperty("--arrow-direction", +direction + "deg");
  //           } else {
  //             // non iOS 13+
  //             let alpha = null;
  //             if (event.webkitCompassHeading) {
  //               alpha = event.webkitCompassHeading;
  //             } else {
  //               alpha = event.alpha;
  //             }
  //             let icon = document.getElementsByClassName("css-icon")[0];
  //             let direction = alpha;
  //             setOrientation(parseInt(direction));
  //             icon?.style.setProperty("--arrow-direction", +direction + "deg");
  //           }
  //         });
  //       }
  //     })
  //     .catch(console.error);
  // }
  if (isAndroid && userLocation) {
    window.addEventListener("deviceorientation", event => {
      let alpha = null;
      alpha = event.alpha;

      let icon = document.getElementsByClassName("css-icon")[0];
      let direction = alpha;
      setOrientation(parseInt(direction));
      icon?.style.setProperty("--arrow-direction", -+direction + "deg");
    });
  }
}
