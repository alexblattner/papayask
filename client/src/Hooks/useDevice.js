import { useEffect, useState } from "react";

// hook to get the device we are on
const useDevice = () => {
  // initilize the device state with desktop
  const [deviceKind, setDeviceKind] = useState({ device: "desktop" });

  //function to check if the device is a desktop or a mobile or a tablet
  const checkDevice = () => {
    if (
      navigator.userAgent
        .toLowerCase()
        .match(
          /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/i
        )
    ) {
      if (window.screen.orientation.type.match(/landscape/i)) {
        setDeviceKind({ device: "desktop" });
      } else {
        setDeviceKind({ device: "tablet" });
      }
    } else if (navigator.userAgent.toLowerCase().match(/mobile/i)) {
      setDeviceKind({ device: "mobile" });
    } else {
      setDeviceKind({ device: "desktop" });
    }
  };

  // fire check function when we start the app
  useEffect(() => {
    checkDevice();
    return () => {
      checkDevice();
    };
  }, []);
  return deviceKind;
};

export default useDevice;
