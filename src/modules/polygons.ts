import polyline from 'geojson-polyline'
import * as turf from '@turf/turf'

export function encodePolygon(geojson: turf.Geometry): string {
    const encodedPolygon: string[] = polyline.encode(geojson).coordinates
    // TODO: Find a better way to handle MultiPolygons
    const principalPolygon = encodedPolygon.sort((a, b) => b[0].length - a[0].length)[0]
    return principalPolygon
}

export function simplifyPolygon(geojson: turf.Geometry): turf.Geometry {
    return (geojson.coordinates[0] as turf.helpers.Position[]).length > 300
        ? turf.simplify(geojson, { tolerance: 0.0005, highQuality: true })
        : geojson
}
