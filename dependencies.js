const config = require('config');

const appConfig = {
    host: config.get('Settings.host'),
    port: config.get('Settings.port'),
    dbUri: config.get('Settings.dbUri'),
    siteUrl: config.get('Settings.site.url') 
}

module.exports = appConfig;