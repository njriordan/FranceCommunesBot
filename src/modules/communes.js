const axios = require('axios')
const departements = require('../data/departement.json')

const randomElementFromArray = array => {
    return array[Math.floor(Math.random() * array.length)]
}

exports.getRandomCommune = async () => {
    const departement = randomElementFromArray(departements)
    const { data: communes } = await axios.get(`https://geo.api.gouv.fr/departements/${departement.code}/communes`)
    const commune = randomElementFromArray(communes)

    const { data } = await axios.get(`https://geo.api.gouv.fr/communes/${commune.code}`, {
        params: {
            fields: 'code,nom,population,departement,region,contour'
        }
    })

    return data
}
