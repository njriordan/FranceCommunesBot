interface EncodedPolyline {
    coordinates: string[]
}

declare module 'geojson-polyline' {
    import turf from '@turf/turf'
    export function encode(geojson: turf.Geometry): EncodedPolyline
}
