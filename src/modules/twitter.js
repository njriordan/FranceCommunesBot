const { TwitterClient } = require('twitter-api-client')

exports.tweet = async (message, images) => {
    const twitterClient = new TwitterClient({
        apiKey: process.env.TWITTER_API_KEY,
        apiSecret: process.env.TWITTER_API_SECRET,
        accessToken: process.env.TWITTER_ACCESS_TOKEN,
        accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET
    })

    const mediaResult = await Promise.all(images.map(image => twitterClient.media.mediaUpload({ media: image.toString('base64') })))

    return twitterClient.tweets.statusesUpdate({
        media_ids: mediaResult.map(media => media.media_id_string).join(),
        status: message
    })
}
