const config = require('config');

const appConfig = {
    host: config.get('Settings.host'),
    port: config.get('Settings.port'),
    dbUri: config.get('Settings.dbUri'),
    siteUrl: config.get('Settings.site.url') ,
    smtp_host: config.get('Settings.smtp_host'),
    smtp_port: config.get('Settings.smtp_port'),
    smtp_user: config.get('Settings.smtp_user'),
    smtp_pass: config.get('Settings.smtp_pass'),
    from_email: config.get('Settings.from_email'),
}

module.exports = appConfig;