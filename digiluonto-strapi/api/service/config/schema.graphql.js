module.exports = {
  query: `
    servicesByLocation(sort: String, limit: Int, start: Int, location: LocationInput!, where: JSON): [Service]!
  `,
  resolver: {
    Query: {
      servicesByLocation: {
        description:
          "Return the services by the location within the given distance (in meters)",
        resolverOf: "application::service.service.find", // Will apply the same policy on the custom resolver as the controller's action `find`.
        resolver: "application::service.service.findByLocation",
      },
    },
  },
};
