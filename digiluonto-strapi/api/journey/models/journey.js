"use strict";

const fs = require("fs");
const Boom = require("@hapi/boom");
const process = require("process");
const slugify = require("slugify");
const togeojson = require("@tmcw/togeojson");
const DOMParser = require("xmldom").DOMParser;
const { sanitizeEntity } = require("strapi-utils");

async function convert2GeoJSON(id) {
  const { fetch } = strapi.plugins.upload.services["upload"];

  try {
    const dbFile = await fetch({ id });

    if (dbFile?.ext !== ".gpx") return null;

    if (typeof dbFile === "object") {
      const filePath = process.cwd() + "/public" + dbFile?.url;

      const gpx = new DOMParser().parseFromString(
        fs.readFileSync(filePath, "utf8")
      );

      if (gpx) return togeojson.gpx(gpx);
    }
  } catch (error) {
    strapi.log.error("GPX to geoJSON: File not found ;( - ", error);
  }

  return null;
}

module.exports = {
  lifecycles: {
    beforeCreate: async (data) => {
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

      if (typeof data.ownerGroup === "undefined")
        throw Boom.badRequest(
          "Virhe! Polulle pitää lisätä omistaja ennen tallentamista."
        );

      const count = await strapi.services.journey.count({
        ownerGroup: data.ownerGroup,
        _publicationState: "preview",
      });

      const groupEntity = await strapi.services.group.findOne({
        id: data.ownerGroup,
      });
      const group = sanitizeEntity(groupEntity, {
        model: strapi.models.group,
      });

      if (group && count >= group.numberOfJourneys) {
        throw Boom.badRequest(
          "Virhe! Polkua ei voida liittää ryhmään. Ryhmä on täynnä."
        );
      }

      if (data.name) data.name = data.name.trim();
      if (data.name) data.slug = slugify(data.name).toLowerCase();
      if (data.excerpt) data.excerpt = data.excerpt.trim();

      // gpx to geojson
      if (data.gpx !== undefined)
        data.route = data.gpx ? await convert2GeoJSON(data.gpx) : null;

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
            name: data.name,
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
          "Virhe! Polulle pitää lisätä omistaja ennen tallentamista."
        );
      }

      if (typeof data.ownerGroup === "string") {
        // omistaja asetettu päivitysvaiheessa
        const count = await strapi.services.journey.count({
          ownerGroup: data.ownerGroup,
          _publicationState: "preview",
        });

        const groupEntity = await strapi.services.group.findOne({
          id: data.ownerGroup,
        });
        const group = sanitizeEntity(groupEntity, {
          model: strapi.models.group,
        });

        if (group && count > group.numberOfJourneys) {
          throw Boom.badRequest(
            "Virhe! Polkua ei voida liittää ryhmään. Ryhmä on täynnä."
          );
        }
      }

      if (data.name) data.name = data.name.trim();
      if (data.name) data.slug = slugify(data.name).toLowerCase();
      if (data.excerpt) data.excerpt = data.excerpt.trim();

      // gpx to geojson
      if (data.gpx !== undefined)
        data.route = data.gpx ? await convert2GeoJSON(data.gpx) : null;

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
            name: data.name,
            radius: data.radius,
          },
        };
        // https://docs.mongodb.com/manual/reference/operator/aggregation/geoNear/#example
        data.geometry = geometry;
        data.geoJSON = geoJSON;
      }
    },
  },
};
