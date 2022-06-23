"use strict";

const { sanitizeEntity } = require("strapi-utils");

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const getTranslatedTagName = async (from, to, name) => {
  return await strapi.services.i18n.translate(from, to, name);
};

module.exports = {
  async find(ctx) {
    let entities;
    let language =
      ctx.params && ctx.params._where && ctx.params._where.language_eq
        ? ctx.params._where.language_eq
        : "fi";

    // ei käytetä kieliparametria itse haussa koska sulkisi pois tulokset
    if (ctx.query && ctx.query.language_eq) delete ctx.query.language_eq;

    if (ctx.query._q) {
      entities = await strapi.services.tag.search(ctx.query);
    } else {
      entities = await strapi.services.tag.find(ctx.query);
    }

    const records = entities.map((entity) =>
      sanitizeEntity(entity, { model: strapi.models.tag })
    );

    return records.map((record) => {
      if (record.language !== language) {
        let name = getTranslatedTagName(record.language, language, record.name);
        record.name = name;
      }
      return record;
    });
  },
};
