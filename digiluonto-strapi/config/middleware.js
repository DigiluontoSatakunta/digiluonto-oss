module.exports = {
  settings: {
    logger: {
      //level: "warn",
      level: "trace",
      exposeInContext: true,
      requests: true,
    },
    responseTime: {
      enabled: false,
    },
    poweredBy: {
      enabled: true,
      value: "iPhone",
    },
    cors: {
      enabled: true,
    },
  },
};
