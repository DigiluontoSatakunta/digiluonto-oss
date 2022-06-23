import React, { useState, useEffect } from "react";
import { VoiceOverOff, RecordVoiceOver } from "@material-ui/icons/";
import { useTheme } from "@material-ui/core/styles";
import { Avatar } from "@material-ui/core/";
import removeMd from "remove-markdown";
import { isIOS } from "react-device-detect";

export const Speaker = ({ lang, text, setSpeechUsed }) => {
  const theme = useTheme();
  const btnColor =
    theme.palette.primary.main !== "#ffffff"
      ? theme.palette.primary.main
      : theme.palette.secondary.main;

  const synth = window.speechSynthesis;

  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    setSpeaking(synth.speaking);
    return () => {
      synth.cancel();
      setSpeechUsed(true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [synth, synth.speaking]);

  useEffect(() => {
    if (text?.length && speaking) {
      let msgs = [];
      let language = lang === "en" ? "en-GB" : "fi-FI";

      var voices = synth.getVoices();
      let voice = voices.find(l => l.lang === language);

      // safarille oma koska ei osaa ottaa yhtä oikein
      if (isIOS && language === "fi-FI")
        voice = voices.find(
          l => l.voiceURI === "com.apple.speech.synthesis.voice.satu"
        );

      let msg = new SpeechSynthesisUtterance(
        removeMd(text, {
          useImgAltText: true, // replace images with alt-text, if present (default: true)
        }) || ""
      );

      msg.lang = language;
      msg.voice = voice;
      msgs.push(msg); // if you will comment this line, end event will not work!
      synth.speak(msg);

      msg.onend = () => {
        setSpeaking(false);
        setSpeechUsed(true);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, text, synth, speaking]);

  const speak = () => {
    if (speaking) {
      setSpeaking(false);
    } else {
      setSpeaking(true);
    }
  };

  return (
    <Avatar
      onClick={() => speak()}
      style={{
        float: "right",
        backgroundColor: btnColor || "#222222",
        boxShadow:
          "0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)",
      }}
    >
      {speaking ? <VoiceOverOff /> : <RecordVoiceOver />}
    </Avatar>
  );
};
