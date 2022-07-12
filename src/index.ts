require('dotenv').config()

import { ScheduledHandler } from 'aws-lambda'
import { getRandomCommune } from './modules/communes'
import { simplifyPolygon } from './modules/polygons'
import { getImagery } from './modules/imagery'
import { tweet } from './modules/twitter'

export const handler: ScheduledHandler = async function () {
    try {
        const commune = await getRandomCommune()

        const polygon = simplifyPolygon(commune.contour)

        const images = await Promise.all([
            getImagery({ type: 'contour', polygon, commune }),
            getImagery({ type: 'overview', polygon, commune })
        ])

        const tweetMessage: string =
            `Nom : ${commune.nom}\n` +
            `Population : ${commune.population}\n` +
            `Departement : ${commune.departement.nom}, Région : ${commune.region.nom}`

        await tweet(tweetMessage, images)
    } catch (err) {
        console.log('Error tweeting commune', err)
    }
    return
}
