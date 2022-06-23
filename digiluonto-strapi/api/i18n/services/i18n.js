const axios = require("axios");

module.exports = {
  translate: async (from = "fi", to = "en", text = "") => {
    try {
      const { data } = await axios.post(
        `http://translate:${process.env.TRANSLATE_PORT}/translate`,
        {
          from,
          to,
          text,
        }
      );
      return typeof data.text === "string" ? data.text : text;
    } catch {
      strapi.log.error(
        `ERROR: Can't reach http://translate:${process.env.TRANSLATE_PORT}/translate`
      );
      return text;
    }
  },
};
