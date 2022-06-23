"use strict";

const { parseMultipartData, sanitizeEntity } = require("strapi-utils");
const mongoose = require("mongoose");
const Boom = require("@hapi/boom");

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */
module.exports = {
  async find(ctx) {
    let entities;

    if (ctx.state?.user?.id) {
      // Remove everything about author in the query eg. owner.id_in, owner.id, owner etc.
      for (let key in ctx.query) {
        if (key.includes("author")) {
          delete ctx.query[key];
        }
      }

      entities = await strapi.services.place.find({
        ...ctx.query,
        author: ctx.state.user.id,
        _publicationState: "preview",
      });
    } else {
      if (ctx.query._q) {
        entities = await strapi.services.place.search(ctx.query);
      } else {
        entities = await strapi.services.place.find(ctx.query);
      }
    }

    return entities.map((entity) =>
      sanitizeEntity(entity, { model: strapi.models.place })
    );
  },

  async findOne(ctx) {
    const { id } = ctx.params;

    if (ctx.state?.user?.id) {
      const params = {
        id: ctx.params.id,
        author: ctx.state.user.id,
        _publicationState: "preview",
      };

      const [place] = await strapi.services.place.find(params);

      if (!place) {
        return ctx.unauthorized(`You can't browse this entry`);
      }

      const entity = await strapi.services.place.findOne(params);
      return sanitizeEntity(entity, { model: strapi.models.place });
    }

    const entity = await strapi.services.place.findOne({ id });
    return sanitizeEntity(entity, { model: strapi.models.place });
  },

  async create(ctx) {
    let entity;

    if (ctx.is("multipart")) {
      const { data, files } = parseMultipartData(ctx);
      data.author = ctx.state.user.id;
      entity = await strapi.services.place.create(data, { files });
    } else {
      ctx.request.body.author = ctx.state.user.id;
      entity = await strapi.services.place.create(ctx.request.body);
    }
    return sanitizeEntity(entity, { model: strapi.models.place });
  },

  async delete(ctx) {
    const { id } = ctx.params;

    if (ctx.state?.user?.id) {
      const [place] = await strapi.services.place.find({
        id: ctx.params.id,
        author: ctx.state.user.id,
        _publicationState: "preview",
      });

      if (!place) {
        return ctx.unauthorized(`You can't delete this entry`);
      }
    }

    const entity = await strapi.services.place.delete({ id });
    return sanitizeEntity(entity, { model: strapi.models.place });
  },

  async update(ctx) {
    const { id } = ctx.params;

    let entity;

    const [place] = await strapi.services.place.find({
      id: ctx.params.id,
      author: ctx.state.user.id,
      _publicationState: "preview",
    });

    if (!place) {
      return ctx.unauthorized(`You can't update this entry`);
    }

    if (ctx.is("multipart")) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services.place.update({ id }, data, {
        files,
      });
    } else {
      entity = await strapi.services.place.update({ id }, ctx.request.body);
    }

    return sanitizeEntity(entity, { model: strapi.models.place });
  },

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

    const now = new Date();
    const nowISOString = now.toISOString();

    let queryFilter = {};

    // if preview then published_at_eq is set
    if (ctx.params?._where?.published_at_null === true) {
      queryFilter = {
        public: true,
        locale: { $eq: locale },
        publishDate: { $lt: new Date(nowISOString) },
      };
    } else {
      queryFilter = {
        public: true,
        locale: { $eq: locale },
        published_at: { $ne: null },
        publishDate: { $lt: new Date(nowISOString) },
      };
    }

    let group = {};
    if (ctx.params && ctx.params._where && ctx.params._where.group_eq) {
      const entity = await strapi.services.group.findOne({
        id: ctx.params._where.group_eq,
      });
      group = sanitizeEntity(entity, { model: strapi.models.group });
    }
    // if Group is set and Groups rules dont allow other content to be visible
    // let groupId = new ObjectId("5fdb7e5f353b6812516cb92a");
    if (group.showPublicContent === false && !!ctx.params._where.group_eq) {
      let ObjectId = mongoose.Types.ObjectId;

      // if preview then published_at_eq is set
      if (ctx.params?._where?.published_at_null === true) {
        queryFilter = {
          publishDate: { $lt: new Date(nowISOString) },
          locale: { $eq: locale },
          groups: { $in: [new ObjectId(ctx.params._where.group_eq)] },
        };
      } else {
        queryFilter = {
          published_at: { $ne: null },
          publishDate: { $lt: new Date(nowISOString) },
          locale: { $eq: locale },
          groups: { $in: [new ObjectId(ctx.params._where.group_eq)] },
        };
      }
    }

    try {
      entities = await strapi
        .query("place")
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
      sanitizeEntity(entity, { model: strapi.models.place })
    );
  },

  /* Places on Map */
  async onMap(ctx) {
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

    const now = new Date();
    const nowISOString = now.toISOString();

    let queryFilter = {};

    // if preview then published_at_eq is set
    if (ctx.params?._where?.published_at_null === true) {
      queryFilter = {
        public: true,
        locale: { $eq: locale },
        publishDate: { $lt: new Date(nowISOString) },
      };
    } else {
      queryFilter = {
        public: true,
        locale: { $eq: locale },
        published_at: { $ne: null },
        publishDate: { $lt: new Date(nowISOString) },
      };
    }

    let group = {};
    if (ctx.params && ctx.params._where && ctx.params._where.group_eq) {
      const entity = await strapi.services.group.findOne({
        id: ctx.params._where.group_eq,
      });
      group = sanitizeEntity(entity, { model: strapi.models.group });
    }
    // if Group is set and Groups rules dont allow other content to be visible
    if (group.showPublicContent === false && !!ctx.params._where.group_eq) {
      let ObjectId = mongoose.Types.ObjectId;

      // if preview then published_at_eq is set
      if (ctx.params?._where?.published_at_null === true) {
        queryFilter = {
          publishDate: { $lt: new Date(nowISOString) },
          locale: { $eq: locale },
          groups: { $in: [new ObjectId(ctx.params._where.group_eq)] },
        };
      } else {
        queryFilter = {
          published_at: { $ne: null },
          publishDate: { $lt: new Date(nowISOString) },
          locale: { $eq: locale },
          groups: { $in: [new ObjectId(ctx.params._where.group_eq)] },
        };
      }
    }

    try {
      entities = await strapi
        .query("place")
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
            $limit: limit,
          },
        ])
        .exec();
    } catch (err) {
      strapi.log.error(err);
    }

    return entities.map((entity) =>
      sanitizeEntity(entity, { model: strapi.models.place })
    );
  },
};
