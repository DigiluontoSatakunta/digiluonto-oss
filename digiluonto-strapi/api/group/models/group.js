"use strict";

const Boom = require("@hapi/boom");
const slugify = require("slugify");

module.exports = {
  lifecycles: {
    beforeCreate: async (data) => {
      if (data.name) data.slug = slugify(data.name).toLowerCase();

      if (
        data?.ownJourneys &&
        data?.numberOfJourneys &&
        data?.ownJourneys.length > data?.numberOfJourneys
      ) {
        throw Boom.badRequest(
          "Virhe! Liitettyjen polkujen maksimimäärä on saavutettu."
        );
      }

      if (
        data?.places &&
        data?.numberOfPlaces &&
        data?.places.length > data?.numberOfPlaces
      ) {
        throw Boom.badRequest(
          "Virhe! Liitettyjen kohteiden maksimimäärä on saavutettu."
        );
      }
    },
    beforeUpdate: async (params, data) => {
      if (data.name) data.slug = slugify(data.name).toLowerCase();

      if (
        data?.ownJourneys &&
        data?.numberOfJourneys &&
        data?.ownJourneys.length > data?.numberOfJourneys
      ) {
        throw Boom.badRequest(
          "Ryhmää ei voida tallentaa! Liitettyjen polkujen maksimimäärä on saavutettu."
        );
      }

      if (
        data?.places &&
        data?.numberOfPlaces &&
        data?.places.length > data?.numberOfPlaces
      ) {
        throw Boom.badRequest(
          "Ryhmää ei voida tallentaa! Liitettyjen kohteiden maksimimäärä on saavutettu."
        );
      }
    },
  },
};
