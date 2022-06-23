module.exports = {
  query: `
    journeysByLocation(sort: String, limit: Int, start: Int, location: LocationInput!, where: JSON): [Journey]!
    findGroupJourneysByLocation(sort: String, limit: Int, start: Int, location: LocationInput!, where: JSON): [Journey]!
    findOtherJourneysByLocation(sort: String, limit: Int, start: Int, location: LocationInput!, where: JSON): [Journey]!
  `,
  resolver: {
    Query: {
      journeysByLocation: {
        description:
          "Return the journeys by the location within the given distance (in meters)",
        resolverOf: "application::journey.journey.find", // Will apply the same policy on the custom resolver as the controller's action `find`.
        resolver: "application::journey.journey.findByLocation",
      },
      findGroupJourneysByLocation: {
        description:
          "Return the groups journeys by the location within the given distance (in meters)",
        resolverOf: "application::journey.journey.find", // Will apply the same policy on the custom resolver as the controller's action `find`.
        resolver: "application::journey.journey.findGroupJourneysByLocation",
      },
      findOtherJourneysByLocation: {
        description:
          "Return the groups other (not owner) journeys by the location within the given distance (in meters)",
        resolverOf: "application::journey.journey.find", // Will apply the same policy on the custom resolver as the controller's action `find`.
        resolver: "application::journey.journey.findOtherJourneysByLocation",
      },
    },
  },
};
