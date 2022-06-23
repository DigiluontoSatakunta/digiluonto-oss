import { useState, useEffect } from "react";
import { isFirefox } from "react-device-detect";

const useNavigatorPermissions = (name, configuration) => {
  const [error, setError] = useState(false);
  const [permitted, setPermitted] = useState("");

  useEffect(() => {
    if (
      window &&
      window.navigator &&
      window.navigator.permissions &&
      !isFirefox
    ) {
      window.navigator.permissions
        .query({ name, ...configuration })
        .then(status => {
          setPermitted(status.state);
        });
    } else {
      setError(true);
    }
  }, [name, configuration]);
  return { status: permitted, error };
};

export default useNavigatorPermissions;
