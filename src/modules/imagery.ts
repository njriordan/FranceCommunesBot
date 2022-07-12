import axios from 'axios'
import * as turf from '@turf/turf'
import { encodePolygon } from './polygons'
import { Commune } from './communes'

interface GetImageryParams {
    type: 'overview' | 'contour'
    polygon: turf.Geometry
    commune: Commune
}

interface BingApiParams {
    key: string
    imagerySet: string
    format: string
    mapArea?: string
    ms: string
    dc?: string
    c?: string
    he?: number
    centrePoint?: string
    zoomLevel?: number
    pp?: string
}

export async function getImagery({ type, polygon, commune }: GetImageryParams): Promise<Buffer> {
    if (!process.env.BING_API_KEY) {
        throw Error('Missing BING API environment variable')
    }
    const baseUrl = 'https://dev.virtualearth.net/REST/v1/Imagery/Map'
    const commonParams = {
        key: process.env.BING_API_KEY,
        imagerySet: 'Aerial',
        format: 'png'
    }
    let params: BingApiParams, url
    if (type === 'overview') {
        const isMetropole = commune.departement.code.length < 3
        url = isMetropole ? `${baseUrl}/Road/France` : `${baseUrl}/Road`
        const centrePoint = turf.getCoord(turf.centerOfMass(polygon)).reverse().join()
        const locale = 'fr-FR'
        const zoomLevel = 4
        const pushpinStyle = '65'
        params = {
            ...commonParams,
            ...(isMetropole ? { he: 1 } : { centrePoint, zoomLevel }),
            c: locale,
            ms: '400,400',
            pp: `${centrePoint};${pushpinStyle}`
        }
    } else {
        url = `${baseUrl}/Aerial`
        const encodedPolygon = encodePolygon(polygon)
        const bbox = turf.bbox(polygon)
        const mapArea = [bbox[1], bbox[0], bbox[3], bbox[2]].join()
        const fillColor = '00000000'
        const outlineColor = 'FFFF0000'
        const outlineThickness = '3'
        params = {
            ...commonParams,
            mapArea,
            ms: '600,600',
            dc: `p,${fillColor},${outlineColor},${outlineThickness};enc:${encodedPolygon}`
        }
    }

    try {
        const result = await axios.get<Buffer>(url, {
            params,
            responseType: 'arraybuffer'
        })
        return result.data
    } catch (err) {
        console.log('Unable to retrieve data for commune', { type }, err)
        throw err
    }
}
