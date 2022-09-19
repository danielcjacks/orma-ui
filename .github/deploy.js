const npmPublish = require('@jsdevtools/npm-publish')

module.exports.deploy = async () => {
    try {
        await npmPublish({
            package: './package.json',
            token: process.env.NPM_TOKEN
        })
    } catch (error) {
        process.exit(1)
    }
}
