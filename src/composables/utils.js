import * as data from "@/api/db.json";

export default function useUtils() {
  function UUID() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
      (
        c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
      ).toString(16)
    );
  }

  function getDistance(lat1, lon1, lat2, lon2, unit) {
    var radlat1 = (Math.PI * lat1) / 180;
    var radlat2 = (Math.PI * lat2) / 180;
    var theta = lon1 - lon2;
    var radtheta = (Math.PI * theta) / 180;
    var dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit == "K") {
      dist = dist * 1.609344;
    }
    if (unit == "N") {
      dist = dist * 0.8684;
    }
    return dist;
  }

  function findNearbyObject(lat, lon) {
    for (const location of data.default) {
      const distance = getDistance(
        lat,
        lon,
        location.gps.lat,
        location.gps.lng,
        "K"
      );

      if (distance <= 0.005) {
        return { distance, ...location };
      }

      if (distance <= 0.008) {
        return { distance, ...location };
      }
    }

    return false;
  }

  function localDate(date) {
    const options = {
      month: "2-digit",
      year: "numeric",
    };
    const newDate = new Date(date);
    return newDate.toLocaleDateString("de-DE", options).replace(/\./g, "-");
  }

  return { UUID, findNearbyObject, localDate };
}
