"use strict";

const Boom = require("@hapi/boom");

module.exports = {
  lifecycles: {
    beforeCreate: async (data) => {
      const v4 = new RegExp(
        /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
      );

      if (!data?.uid?.match(v4)) {
        throw Boom.badRequest("Virhe!");
      }

      if (data?.type === "vote") {
        const entity = await strapi.services.event.findOne({
          place: data.place,
          uid: data.uid,
          type: "vote",
        });

        if (entity) {
          await strapi.services.event.delete({ id: entity.id });
        }
      } // vote end
    },
  },
};
