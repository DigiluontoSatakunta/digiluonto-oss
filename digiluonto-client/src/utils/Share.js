export const share = (
  url = `${process.env.REACT_APP_ENDPOINT}/`,
  title = "Digiluonto",
  text = "Digiluonto",
  errorMsg = "Your browser does not support share functionality"
) => {
  if (navigator.canShare && navigator.canShare({ url, title, text })) {
    navigator
      .share({ url, title, text })
      // .then(() => console.log("Shared: ", shareData))
      .catch(err => console.log("Sharing failed", err));
  } else {
    alert(errorMsg);
  }
};
