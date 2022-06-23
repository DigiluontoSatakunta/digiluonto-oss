module.exports = ({ env }) => ({
  host: env("STRAPI_HOST", "0.0.0.0"),
  port: env.int("STRAPI_PORT", 1337),
  admin: {
    url: env("STRAPI_ADMIN", "/dashboard"),
    auth: {
      secret: env("ADMIN_JWT_SECRET", "decac2baf915491ab590ce8e220de50a"),
    },
  },
});
