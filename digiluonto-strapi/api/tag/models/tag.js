"use strict";

const slugify = require("slugify");

module.exports = {
  lifecycles: {
    beforeCreate: async (data) => {
      if (data.name) {
        data.slug = slugify(data.name).toLowerCase();
        // strapi.log.debug(data.slug);
      }
    },
    beforeUpdate: async (params, data) => {
      if (data.name) {
        data.slug = slugify(data.name).toLowerCase();
        // strapi.log.debug(data.slug);
      }
    },
  },
};
