import axios from 'axios'
const departements: Departement[] = require('../data/departement.json')
import { Geometry } from '@turf/turf'

interface Departement {
    code: string
    nom: string
    codeRegion: string
}

interface Region {
    nom: string
}

interface BaseCommune {
    code: string
    nom: string
}

export interface Commune extends BaseCommune {
    population: number
    contour: Geometry
    departement: Departement
    region: Region
}

function randomElementFromArray(array: Departement[]): Departement;

function randomElementFromArray(array: BaseCommune[]): BaseCommune;

function randomElementFromArray(array: BaseCommune[] | Departement[]): Departement | BaseCommune {
    return array[Math.floor(Math.random() * array.length)]
}

export const getRandomCommune = async () => {
    const departement = randomElementFromArray(departements)
    const { data: communes } = await axios.get<BaseCommune[]>(`https://geo.api.gouv.fr/departements/${departement.code}/communes`)
    const commune = randomElementFromArray(communes)

    const { data } = await axios.get<Commune>(`https://geo.api.gouv.fr/communes/${commune.code}`, {
        params: {
            fields: 'code,nom,population,departement,region,contour'
        }
    })

    return data
}
