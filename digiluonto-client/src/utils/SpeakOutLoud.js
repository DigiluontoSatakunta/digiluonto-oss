import removeMd from "remove-markdown";

export const speakOutLoud = (lang = "fi-FI", text = "muur mur") => {
  if (window.speechSynthesis) {
    setTimeout(() => {
      let msg = new SpeechSynthesisUtterance(
        removeMd(text, {
          useImgAltText: true, // replace images with alt-text, if present (default: true)
        })
      );
      msg.lang = lang;
      msg.voice = window.speechSynthesis
        .getVoices()
        .find(language => language.lang === lang);
      window.speechSynthesis.speak(msg);
    }, 200);
  }

  return true;
};
