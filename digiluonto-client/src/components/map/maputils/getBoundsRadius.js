export default function getBoundsRadius(mapInstance) {
    var r = 6378.8;
    var ne_lat =
      mapInstance.getBounds()._northEast.lat / 57.2958;
    var ne_lng =
      mapInstance.getBounds()._northEast.lng / 57.2958;
    var c_lat = mapInstance.getCenter().lat / 57.2958;
    var c_lng = mapInstance.getCenter().lng / 57.2958;

    var r_km =
      r *
      Math.acos(
        Math.sin(c_lat) * Math.sin(ne_lat) +
          Math.cos(c_lat) * Math.cos(ne_lat) * Math.cos(ne_lng - c_lng)
      );
    return r_km * 1000; // Radius metreinä
  }
