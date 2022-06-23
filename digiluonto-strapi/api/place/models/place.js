"use strict";

const slugify = require("slugify");
const Boom = require("@hapi/boom");
const { sanitizeEntity } = require("strapi-utils");

module.exports = {
  lifecycles: {
    beforeCreate: async (data) => {
      if (typeof data.ownerGroup === "undefined")
        throw Boom.badRequest(
          "Virhe! Paikalle pitää lisätä omistaja ennen tallentamista."
        );

      if (
        typeof data.latitude === "undefined" ||
        typeof data.latitude === "object"
      ) {
        throw Boom.badRequest(
          "Virhe! Latitude pitää täyttää sijaintia varten."
        );
      }

      if (
        typeof data.longitude === "undefined" ||
        typeof data.longitude === "object"
      ) {
        throw Boom.badRequest(
          "Virhe! Longitude pitää täyttää sijaintia varten."
        );
      }

      const count = await strapi.services.place.count({
        ownerGroup: data.ownerGroup,
        _publicationState: "preview",
      });

      const groupEntity = await strapi.services.group.findOne({
        id: data.ownerGroup,
      });
      const group = sanitizeEntity(groupEntity, {
        model: strapi.models.group,
      });

      if (group && count > group.numberOfPlaces) {
        throw Boom.badRequest(
          "Virhe! Paikkaa ei voida liittää ryhmään. Ryhmä on täynnä."
        );
      }

      if (data.name) data.name = data.name.trim();
      if (data.name) data.slug = slugify(data.name).toLowerCase();
      if (data.token) data.token = data.token.trim().toUpperCase();
      if (data.content) data.content = data.content.trim();
      if (data.description) data.description = data.description.trim();

      if (data.latitude && data.longitude) {
        let geometry = {
          type: "Point",
          coordinates: [data.longitude, data.latitude],
        };
        let geoJSON = {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [data.longitude, data.latitude],
          },
          properties: {
            radius: data.radius,
          },
        };

        data.geometry = geometry;
        data.geoJSON = geoJSON;
      }
    },
    beforeUpdate: async (params, data) => {
      if (typeof data.ownerGroup === "object") {
        // omistaja poistettu päivitysvaiheessa
        throw Boom.badRequest(
          "Virhe! Paikalle pitää lisätä omistaja ennen tallentamista."
        );
      }

      if (typeof data.ownerGroup === "string") {
        // omistaja asetettu päivitysvaiheessa
        const count = await strapi.services.place.count({
          ownerGroup: data.ownerGroup,
          _publicationState: "preview",
        });

        const groupEntity = await strapi.services.group.findOne({
          id: data.ownerGroup,
        });
        const group = sanitizeEntity(groupEntity, {
          model: strapi.models.group,
        });

        if (group && count >= group.numberOfPlaces) {
          throw Boom.badRequest(
            "Virhe! Paikkaa ei voida liittää ryhmään. Ryhmä on täynnä."
          );
        }
      }

      if (data.name) data.name = data.name.trim();
      if (data.name) data.slug = slugify(data.name).toLowerCase();
      if (data.token) data.token = data.token.trim().toUpperCase();
      if (data.content) data.content = data.content.trim();

      if (data.description) data.description = data.description.trim();

      if (data.latitude && data.longitude) {
        let geometry = {
          type: "Point",
          coordinates: [data.longitude, data.latitude],
        };
        let geoJSON = {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [data.longitude, data.latitude],
          },
          properties: {
            radius: data.radius,
          },
        };

        data.geometry = geometry;
        data.geoJSON = geoJSON;
      }
    },
  },
};
