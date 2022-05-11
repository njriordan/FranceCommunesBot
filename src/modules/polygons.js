const polyline = require('geojson-polyline')
const turf = require('@turf/turf')

exports.encodePolygon = geojson => {
    const encodedPolygon = polyline.encode(geojson).coordinates
    // TODO: Find a better way to handle MultiPolygons
    const principalPolygon = encodedPolygon.sort((a, b) => b[0].length - a[0].length)[0]
    return principalPolygon
}

exports.simplifyPolygon = geojson => {
    return geojson.coordinates[0].length > 300 ? turf.simplify(geojson, { tolerance: 0.0005, highQuality: true }) : geojson
}
