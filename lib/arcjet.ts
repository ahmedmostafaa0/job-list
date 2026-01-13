import arcjet, {shield, detectBot, tokenBucket} from '@arcjet/next'

export {shield, detectBot, tokenBucket}

export default arcjet({
    key: process.env.ARCJET_KEY!,
    rules: []
})