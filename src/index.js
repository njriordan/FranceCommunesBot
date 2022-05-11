require('dotenv').config()

const { getRandomCommune } = require('./modules/communes')
const { simplifyPolygon } = require('./modules/polygons')
const { getImagery } = require('./modules/imagery')
const { tweet } = require('./modules/twitter')

exports.handler = async function() {
    try {
        const commune = await getRandomCommune()

        const polygon = simplifyPolygon(commune.contour)

        const images = await Promise.all([
            getImagery({ type: 'contour', polygon, commune }),
            getImagery({ type: 'overview', polygon, commune })
        ])

        const tweetMessage =
            `Nom : ${commune.nom}\n` +
            `Population : ${commune.population}\n` +
            `Departement : ${commune.departement.nom}, Région : ${commune.region.nom}`

        await tweet(tweetMessage, images)
    } catch (err) {
        console.log('Error tweeting commune', err)
    }
    return 'ok'
}

