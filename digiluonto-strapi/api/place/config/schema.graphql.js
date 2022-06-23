module.exports = {
  definition: `
    input LocationInput {
      latitude: Float!
      longitude: Float!
      distance: Int!
    }
  `,
  query: `
    placesByLocation(sort: String, limit: Int, start: Int, location: LocationInput!, where: JSON): [Place]!
    placesOnMap(sort: String, limit: Int, start: Int, location: LocationInput!, where: JSON): [Place]!
  `,
  resolver: {
    Query: {
      placesByLocation: {
        description:
          "Return the places by the location within the given distance (in meters)",
        resolverOf: "application::place.place.find", // Will apply the same policy on the custom resolver as the controller's action `find`.
        resolver: "application::place.place.findByLocation",
      },
      placesOnMap: {
        description:
          "Return the places by the location within the given distance (in meters) to be used on Map with minimal information.",
        resolverOf: "application::place.place.find",
        resolver: "application::place.place.onMap",
      },
    },
  },
};
