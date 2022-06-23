export const elevation_options = {
  // Default chart colors: theme lime-theme, magenta-theme, ...
  theme: "lightblue-theme",

  // Chart container outside/inside map container
  detached: true,

  // if (detached), the elevation chart container
  elevationDiv: "elevation-test",

  // if (!detached) autohide chart profile on chart mouseleave
  autohide: true,

  // if (!detached) initial state of chart profile control
  collapsed: false,

  // if (!detached) control position on one of map corners
  position: "bottomleft",

  // Autoupdate map center on chart mouseover.
  followMarker: true,

  // Autoupdate map bounds on chart update.
  autofitBounds: true,

  // Chart distance/elevation units.
  imperial: false,

  // [Lat, Long] vs [Long, Lat] points. (leaflet default: [Lat, Long])
  reverseCoords: false,

  // Acceleration chart profile: true || "summary" || "disabled" || false
  acceleration: false,

  // Slope chart profile: true || "summary" || "disabled" || false
  slope: false,

  // Speed chart profile: true || "summary" || "disabled" || false
  speed: false,

  // Display time info: true || "summary" || false
  time: false,

  // Display distance info: true || "summary"
  distance: true,

  // Display altitude info: true || "summary"
  altitude: true,

  // Summary track info style: "inline" || "multiline" || false
  summary: false,

  // Download link: "link" || false || "modal"
  downloadLink: false,

  // Toggle chart ruler filter
  ruler: true,

  // Toggle chart legend filter
  legend: true,

  // Toggle "leaflet-almostover" integration
  almostOver: false,

  // Toggle "leaflet-distance-markers" integration
  distanceMarkers: false,

  // Display track waypoints
  waypoints: false,

  // Render chart profiles as Canvas or SVG Paths
  preferCanvas: true,
};
