module.exports = ({ env }) => ({
  graphql: {
    endpoint: "/graphql",
    shadowCRUD: true,
    playgroundAlways: false,
    depthLimit: 4,
    amountLimit: 1000,
    apolloServer: {
      tracing: env.bool("APOLLO_SERVER_TRACING", true),
    },
  },
  sentry: {
    dsn: env(
      "SENTRY_DSN",
      "http://sentry.example.org/token"
    ),
  },
});
