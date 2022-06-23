"use strict";

const { parseMultipartData, sanitizeEntity } = require("strapi-utils");
const mongoose = require("mongoose");

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

      entities = await strapi.services.journey.find({
        ...ctx.query,
        author: ctx.state.user.id,
        _publicationState: "preview",
      });
    } else {
      if (ctx.query._q) {
        entities = await strapi.services.journey.search(ctx.query);
      } else {
        entities = await strapi.services.journey.find(ctx.query);
      }
    }

    return entities.map((entity) =>
      sanitizeEntity(entity, { model: strapi.models.journey })
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

      const [journey] = await strapi.services.journey.find(params);

      if (!journey) {
        return ctx.unauthorized(`You can't browse this entry`);
      }

      const entity = await strapi.services.journey.findOne(params);
      return sanitizeEntity(entity, { model: strapi.models.journey });
    }

    const entity = await strapi.services.journey.findOne({ id });
    return sanitizeEntity(entity, { model: strapi.models.journey });
  },

  async create(ctx) {
    let entity;

    if (ctx.is("multipart")) {
      const { data, files } = parseMultipartData(ctx);
      data.author = ctx.state.user.id;
      entity = await strapi.services.journey.create(data, { files });
    } else {
      ctx.request.body.author = ctx.state.user.id;
      entity = await strapi.services.journey.create(ctx.request.body);
    }
    return sanitizeEntity(entity, { model: strapi.models.journey });
  },

  async delete(ctx) {
    const { id } = ctx.params;

    const [journey] = await strapi.services.journey.find({
      id: ctx.params.id,
      author: ctx.state.user.id,
      _publicationState: "preview",
    });

    if (!journey) {
      return ctx.unauthorized(`You can't delete this entry`);
    }

    const entity = await strapi.services.journey.delete({ id });
    return sanitizeEntity(entity, { model: strapi.models.journey });
  },

  async update(ctx) {
    const { id } = ctx.params;

    let entity;

    const [journey] = await strapi.services.journey.find({
      id: ctx.params.id,
      author: ctx.state.user.id,
      _publicationState: "preview",
    });

    if (!journey) {
      return ctx.unauthorized(`You can't update this entry`);
    }

    if (ctx.is("multipart")) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services.journey.update({ id }, data, {
        files,
      });
    } else {
      entity = await strapi.services.journey.update({ id }, ctx.request.body);
    }

    return sanitizeEntity(entity, { model: strapi.models.journey });
  },

  /* Find By Location */
  async findByLocation(ctx) {
    let { latitude, longitude, distance } = ctx.params._location;
    latitude = parseFloat(latitude);
    longitude = parseFloat(longitude);
    distance = parseInt(distance);

    const locale =
      ctx.params && ctx.params._where && ctx.params._where.locale_eq
        ? ctx.params._where.locale_eq
        : "fi";

    let limit = parseInt(ctx.params._limit) || 1000;
    let entities = [];

    const entity = await strapi.services.group.findOne({
      id: ctx.params._where.group_eq,
    });
    const group = sanitizeEntity(entity, { model: strapi.models.group });

    const now = new Date();
    const nowISOString = now.toISOString();
    let ObjectId = mongoose.Types.ObjectId;

    let queryFilter = {};

    // TODO refactor if else
    // if preview then published_at_eq is set
    if (ctx.params?._where?.published_at_null === true) {
      queryFilter = {
        locale: { $eq: locale },
        publishDate: { $lt: new Date(nowISOString) },
        expirationDate: { $gt: new Date(nowISOString) },
        $or: [
          {
            public: true,
          },
          {
            commonGroups: { $in: [new ObjectId(ctx.params._where.group_eq)] },
          },
          { ownerGroup: { $eq: new ObjectId(ctx.params._where.group_eq) } },
        ],
      };
    } else {
      queryFilter = {
        published_at: { $ne: null },
        locale: { $eq: locale },
        publishDate: { $lt: new Date(nowISOString) },
        expirationDate: { $gt: new Date(nowISOString) },
        $or: [
          {
            public: true,
          },
          {
            commonGroups: { $in: [new ObjectId(ctx.params._where.group_eq)] },
          },
          { ownerGroup: { $eq: new ObjectId(ctx.params._where.group_eq) } },
        ],
      };
    }

    // if Group is set and Groups rules dont allow other content to be visible
    // let groupId = new ObjectId("5fdb7e5f353b6812516cb92a");
    if (group.showPublicContent === false && !!ctx.params._where.group_eq) {
      // if preview then published_at_eq is set
      if (ctx.params?._where?.published_at_null === true) {
        queryFilter = {
          publishDate: { $lt: new Date(nowISOString) },
          expirationDate: { $gt: new Date(nowISOString) },
          locale: { $eq: locale },
          $or: [
            {
              commonGroups: { $in: [new ObjectId(ctx.params._where.group_eq)] },
            },
            { ownerGroup: { $eq: new ObjectId(ctx.params._where.group_eq) } },
          ],
        };
      } else {
        queryFilter = {
          published_at: { $ne: null },
          publishDate: { $lt: new Date(nowISOString) },
          expirationDate: { $gt: new Date(nowISOString) },
          locale: { $eq: locale },
          $or: [
            {
              commonGroups: { $in: [new ObjectId(ctx.params._where.group_eq)] },
            },
            { ownerGroup: { $eq: new ObjectId(ctx.params._where.group_eq) } },
          ],
        };
      }
    }

    try {
      entities = await strapi
        .query("journey")
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
            $lookup: {
              from: "upload_file",
              localField: "gpx",
              foreignField: "_id",
              as: "gpx",
            },
          },
          {
            $unwind: { path: "$gpx", preserveNullAndEmptyArrays: true },
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
      sanitizeEntity(entity, { model: strapi.models.journey })
    );
  },

  /* Find By Location */
  async findOtherJourneysByLocation(ctx) {
    let { latitude, longitude, distance } = ctx.params._location;
    latitude = parseFloat(latitude);
    longitude = parseFloat(longitude);
    distance = parseInt(distance);

    const locale =
      ctx.params && ctx.params._where && ctx.params._where.locale_eq
        ? ctx.params._where.locale_eq
        : "fi";

    let limit = parseInt(ctx.params._limit) || 1000;
    let entities = [];

    const entity = await strapi.services.group.findOne({
      id: ctx.params._where.group_eq,
    });
    const group = sanitizeEntity(entity, { model: strapi.models.group });

    const now = new Date();
    const nowISOString = now.toISOString();
    let ObjectId = mongoose.Types.ObjectId;

    let queryFilter = {};

    queryFilter = {
      locale: { $eq: locale },
      publishDate: { $lt: new Date(nowISOString) },
      expirationDate: { $gt: new Date(nowISOString) },
      ownerGroup: { $ne: new ObjectId(ctx.params._where.group_eq) },
      locale: { $eq: locale },
      $or: [
        {
          public: true,
        },
        {
          commonGroups: { $in: [new ObjectId(ctx.params._where.group_eq)] },
        },
      ],
    };

    // if Group is set and Groups rules dont allow public content to be visible
    if (group.showPublicContent === false && !!ctx.params._where.group_eq) {
      queryFilter = {
        published_at: { $ne: null },
        publishDate: { $lt: new Date(nowISOString) },
        expirationDate: { $gt: new Date(nowISOString) },
        ownerGroup: { $ne: new ObjectId(ctx.params._where.group_eq) },
        locale: { $eq: locale },
        $or: [
          {
            commonGroups: { $in: [new ObjectId(ctx.params._where.group_eq)] },
          },
        ],
      };
    }

    try {
      entities = await strapi
        .query("journey")
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
            $lookup: {
              from: "upload_file",
              localField: "gpx",
              foreignField: "_id",
              as: "gpx",
            },
          },
          {
            $unwind: { path: "$gpx", preserveNullAndEmptyArrays: true },
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
      sanitizeEntity(entity, { model: strapi.models.journey })
    );
  },

  /* Find Groups Journeys By Location */
  async findGroupJourneysByLocation(ctx) {
    let { latitude, longitude, distance } = ctx.params._location;
    latitude = parseFloat(latitude);
    longitude = parseFloat(longitude);
    distance = parseInt(distance);

    const locale =
      ctx.params && ctx.params._where && ctx.params._where.locale_eq
        ? ctx.params._where.locale_eq
        : "fi";

    let limit = parseInt(ctx.params._limit) || 1000;
    let entities = [];

    const entity = await strapi.services.group.findOne({
      id: ctx.params._where.group_eq,
    });
    const group = sanitizeEntity(entity, { model: strapi.models.group });

    const now = new Date();
    const nowISOString = now.toISOString();
    let ObjectId = mongoose.Types.ObjectId;

    let queryFilter = {};

    // if preview then published_at_eq is set
    if (ctx.params?._where?.published_at_null === true) {
      queryFilter = {
        locale: { $eq: locale },
        publishDate: { $lt: new Date(nowISOString) },
        expirationDate: { $gt: new Date(nowISOString) },
        ownerGroup: { $eq: new ObjectId(ctx.params._where.group_eq) },
      };
    } else {
      queryFilter = {
        published_at: { $ne: null },
        locale: { $eq: locale },
        publishDate: { $lt: new Date(nowISOString) },
        expirationDate: { $gt: new Date(nowISOString) },
        ownerGroup: { $eq: new ObjectId(ctx.params._where.group_eq) },
      };
    }

    try {
      entities = await strapi
        .query("journey")
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
            $lookup: {
              from: "upload_file",
              localField: "gpx",
              foreignField: "_id",
              as: "gpx",
            },
          },
          {
            $unwind: { path: "$gpx", preserveNullAndEmptyArrays: true },
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
      sanitizeEntity(entity, { model: strapi.models.journey })
    );
  },
};
