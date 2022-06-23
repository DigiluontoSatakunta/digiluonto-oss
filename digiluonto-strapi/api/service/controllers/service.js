"use strict";

const { sanitizeEntity } = require("strapi-utils");
const mongoose = require("mongoose");
const Boom = require("@hapi/boom");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  /* Find By Location */
  async findByLocation(ctx) {
    let { latitude, longitude, distance } = ctx.params._location;
    let locale =
      ctx.params && ctx.params._where && ctx.params._where.locale_eq
        ? ctx.params._where.locale_eq
        : "fi";
    let limit = parseInt(ctx.params._limit) || 1000;
    let entities = [];

    latitude = parseFloat(latitude);
    longitude = parseFloat(longitude);
    distance = parseInt(distance);

    let queryFilter = {
      locale: { $eq: locale },
    };

    try {
      entities = await strapi
        .query("service")
        .model.aggregate([
          {
            $geoNear: {
              near: {
                type: "Point",
                coordinates: [longitude, latitude],
              },
              distanceField: "dist.calculated",
              maxDistance: distance,
              query: queryFilter,
              spherical: true,
            },
          },
          {
            $lookup: {
              from: "upload_file",
              localField: "cover",
              foreignField: "_id",
              as: "cover",
            },
          },
          {
            $unwind: { path: "$cover", preserveNullAndEmptyArrays: true },
          },
          {
            $limit: limit,
          },
        ])
        .exec();
    } catch (err) {
      strapi.log.error(err);
    }

    return entities.map((entity) =>
      sanitizeEntity(entity, { model: strapi.models.service })
    );
  },
};
