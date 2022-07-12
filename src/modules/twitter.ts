import { TwitterClient } from 'twitter-api-client'

export async function tweet(message: string, images: Buffer[]): Promise<void> {
    const { TWITTER_ACCESS_TOKEN, TWITTER_API_KEY, TWITTER_API_SECRET, TWITTER_ACCESS_TOKEN_SECRET } = process.env
    if (TWITTER_ACCESS_TOKEN && TWITTER_API_KEY && TWITTER_API_SECRET && TWITTER_ACCESS_TOKEN_SECRET) {
        const twitterClient = new TwitterClient({
            apiKey: TWITTER_API_KEY,
            apiSecret: TWITTER_API_SECRET,
            accessToken: TWITTER_ACCESS_TOKEN,
            accessTokenSecret: TWITTER_ACCESS_TOKEN_SECRET
        })
        const mediaResult = await Promise.all(images.map(image => twitterClient.media.mediaUpload({ media: image.toString('base64') })))
        await twitterClient.tweets.statusesUpdate({
            media_ids: mediaResult.map(media => media.media_id_string).join(),
            status: message
        })
    }
}
