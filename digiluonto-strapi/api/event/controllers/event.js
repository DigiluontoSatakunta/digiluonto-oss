"use strict";

const { sanitizeEntity } = require("strapi-utils");

module.exports = {
  async find(ctx) {
    let entities;

    if (ctx.state?.user?.id) {
      for (let key in ctx.query) {
        if (key.includes("group")) {
          delete ctx.query[key];
        }
      }

      entities = await strapi.services.event.find({
        ...ctx.query,
        group: ctx.state.user.group?.id,
      });
    } else {
      if (ctx.query._q) {
        entities = await strapi.services.event.search(ctx.query);
      } else {
        entities = await strapi.services.event.find(ctx.query);
      }
    }

    return entities.map((entity) =>
      sanitizeEntity(entity, { model: strapi.models.event })
    );
  },
};
