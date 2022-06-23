"use strict";

module.exports = {
  lifecycles: {
    beforeCreate: async (data) => {
      if (data.name) data.name = data.name.trim();
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
            name: data.name,
            radius: 30,
          },
        };
        data.geometry = geometry;
        data.geoJSON = geoJSON;
      }
    },
    beforeUpdate: async (params, data) => {
      if (data.name) data.name = data.name.trim();
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
            name: data.name,
            radius: 30,
          },
        };

        data.geometry = geometry;
        data.geoJSON = geoJSON;
      }
    },
  },
};
