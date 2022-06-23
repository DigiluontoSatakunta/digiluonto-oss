export const JOURNEY_BASIC = {
  name: "",             // "name"
  excerpt: "",          // description
  radius: 10,           // number/slider (with location)
  latitude: 0,          // number/location (null, 0 or 61.4923?)
  longitude: 0,         // number/location (null, 0 or 21.8004?)
  cover: null,          // file/media image upload
  gpx: null,            // file/media gpx
};

export const JOURNEY_EXTENDED_CONTENT = {
  description: "",      // content
  // commonGroups: [],     // group, i.e., shared with someone
  audioGuide: null,     // file/media
  accessibility: null,  // selection (enum id: accessibilityNormal, accessibilityHard)
  category: null,       // selection (enum id: photographic_exhibition, vr_installation)
  difficulty: null,     // selection (enum id: easy, normal, hard)
  groupSize: null,      // selection (enum id: individual, small_group, group)
  targetGroup: null,    // selection (enum id: individual, group, b2c, b2b)
  allowRating: false,      // boolean (rating)
  audioLoop: false,        // boolean
  calculateDistance: true, // boolean
  distance: 0,          // number (or automatic thru calculateDistance)
  duration: 0,          // number
  elevation: 0,         // number
  links: [],            // { type+name+url }
  // unassigned? slug, geometry, geoJSON, badge, route
};

export const JOURNEY_VISIBILITY = {
  tags: [],             // tags
  places: [],           // journeyPlaceOrganizer
  public: true,         // visibility
  featured: false,      // visibility
  showNextPlace: true,  // visibility
  showPlacesInJourneysArea: true, // visibility
  publishDate: "2022-01-01T12:00:00Z",    // datetime (ISO8601/RFC3339)
  expirationDate: "2029-12-31T23:59:00Z", // datetime (ISO8601/RFC3339)
};

export const PLACE_BASIC = {
  name: "",
  description: "",
  latitude: 0,
  longitude: 0,
  radius: 10,
  cover: null,
};

export const PLACE_EXTENDED_CONTENT = {
  content: "",
  allowRating: false,
  audioGuide: null,
  links: [],
  // unassigned: slug, geometry, geoJSON, groups
  // not used: order
  gallery: null,  // [file/media]
  ar: null,       // component {modelFile/Media, background/Media}
  questions: null // component {question, explanation, answers: {answer, correctAnswer}}
};

export const PLACE_VISIBILITY = {
  tags: [],
  journeys: [],
  publicContent: true,
  public: true,
  token: "",
  qr: false,
  publishDate: "2022-01-01T12:00:00Z",
  expirationDate: "2029-12-31T23:59:00Z",
  icon: "postal_code",  // selection (enum id: ...)
}

/**
 * gets the declared default property names of a form,
 * and look for suitable data in the activePoi to resolve the form data
 * @param {Object} defaultValue one of exported JOURNEY_* or PLACE_* objects
 * @param {Object} activePoi
 * @param {String} poiType
 * @param {Object} extraProps
 * @returns 
 */
export const formValueResolver = (defaultValue, activePoi, poiType, extraProps) => {
  if (activePoi?.__typename !== poiType) {
    return null;
  }
  let resolvedObjects = {};
  let unhandledObjects = {};

  Object.keys(defaultValue).forEach(prop => {
    let value = null;
    switch (prop) {
      case "latitude":
        value = activePoi.geoJSON?.geometry?.coordinates[1];
        break;
      case "longitude":
        value = activePoi.geoJSON?.geometry?.coordinates[0];
        if (activePoi.geoJSON?.geometry?.coordinates) {
          const [lng, lat] = activePoi.geoJSON.geometry.coordinates;
          // TODO the component partially suppors setValue&controller
          unhandledObjects["latlng"] = {lat, lng};
        }
        break;
      case "radius":
        if (activePoi?.geoJSON?.properties?.radius) {
          // the correct way to access radius
          value = activePoi.geoJSON.properties.radius;
        } else if (activePoi.hasOwnProperty(prop)) {
          // the legacy way, just in case
          console.log("WARN: The radius parameter is in the old place");
          value = activePoi[prop];
        }
        break;
      case "links":
        value = activePoi.links?.map(({id, name, url, type}) => ({
          id,
          name,
          url,
          type,
        }));
        break;
      case "ar":
        // ar value is handled on its own in the ar-component
        unhandledObjects["ar"] = activePoi.ar?.map(({id, background, modelFile}) => ({
          id,
          background,
          modelFile,
        }));
        break;
      // the following cases need to access id from the data
      case "audioGuide":
      case "cover":
      case "gpx":
        if (activePoi.hasOwnProperty(prop)) {
          value = activePoi[prop]?.id;
        }
        break;
      /**
       * DIG-1085 reimplementing ordering logic for places in journey
       * from highest priority to lowest
       * #1 CURRENT:
       *         Use JSON-array journey.order as determining factor.
       *         Will put the missing entries to end of the journey as-is.
       *         (this may happen if place is added from Place Visibility component)
       *         NB! place.order *will/should* not have any effect in this case
       * #2 LEGACY:
       *         The query has places ordered ascending according to each place.order, use it as-is.
       *         NB! The next save with editor will save the order into journey.order (as indicated in #1).
       *         NB! place.order will remain untouched, and it *will* mess up any unselected sorting
       *         NB! any new places created will have order value=0
       *
       * "JourneyPlaceOrganizer" only knows about the places-array-of-id (i.e., the output of this case)
       * Upon the submitting of data, "Journey Visibility" should inject the JSON-array journey.order into data
       */
      case "places":  // places appears only in journey related forms
        value = activePoi[prop].map(item => item.id); // This is enough for case #2 LEGACY
        if (activePoi.order) { // makes order for case #1 CURRENT
          let journeyOrder;
          if (extraProps?.placeIds) {
            // the following filters any unreachable/nonexistent place ids away
            journeyOrder = activePoi.order.filter(item => extraProps.placeIds.includes(item));
          } else {
            journeyOrder = activePoi.order; // unfiltered ordered set
          }
          const missingEntries = value.filter(j => !journeyOrder.includes(j)); // find any missing places
          value = journeyOrder.concat(missingEntries); // finally, use the correctly ordered journey
        }
        break;
      // the following cases use a simple [array].object.id mapper
      case "commonGroups": // shared with other groups
      case "groups":    // groups related
      case "journeys": // journeys appears only in place related forms
      case "tags":
        if (activePoi.hasOwnProperty(prop)) {
          value = activePoi[prop].map(item => item.id);
        }
        break;
      default: // getting the value of everything else can be done as is
        if (activePoi.hasOwnProperty(prop)) {
          value = activePoi[prop];
        }
        break;
    }
    if (value !== null) {
      // value was found, the form controller will handle it
      resolvedObjects[prop] = value;
    }
  });
  // return all values to caller in somewhat generalized format
  return { resolvedObjects, unhandledObjects };
};
