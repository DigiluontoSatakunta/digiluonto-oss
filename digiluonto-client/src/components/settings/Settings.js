export function useSettings() {
  // default Settings or if already set then use localStorage value
  return {
    favMode: false,
    previewMode: false,
    debug: false,
    audio: localStorage.getItem("audio") || true,
    devMode:
      localStorage.getItem("devmode") ||
      process.env.NODE_ENV === "development" ||
      false,
    vibrate: localStorage.getItem("vibrate") || true,
  };
}
