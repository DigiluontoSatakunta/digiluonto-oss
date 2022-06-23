"use strict";

const mongoose = require("mongoose");

/**
 * An asynchronous bootstrap function that runs before
 * your application gets started.
 *
 * This gives you an opportunity to set up your data model,
 * run jobs, or perform some special logic.
 *
 * See more details here: https://strapi.io/documentation/v3.x/concepts/configurations.html#bootstrap
 */

const create2dsphereIndexes = async () => {
  try {
    // const places = await strapi.model("place").index({ geometry: "2dsphere" });
    // const places = await strapi.model("place").index({ geometry: "2dsphere" });
    // const place = mongoose.model("place");
    // place.createIndexes({ geometry: "2dsphere" });
    // strapi.query("place").model.createIndexes({ geometry: "2dsphere" });
    // var db = mongoose.connection;
    // strapi.model("place").createIndexes({ geometry: "2dsphere" });
    // db.collection("places").createIndexes({ geometry: "2dsphere" });
    // db.collection("journey").createIndexes({ geometry: "2dsphere" });
  } catch (e) {
    strapi.log.error(e);
  }
};

module.exports = () => {
  create2dsphereIndexes();
};
