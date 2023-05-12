export default {
    JWT_SECRET : process.env.JWT_SECRET,
    ATLAS_URI: process.env.ATLAS_URI,
    port: process.env.PORT || 8080,
    smtpHost: process.env.SMTP_HOST,
    smtpPort: process.env.SMTP_PORT ,
    smtpUser: process.env.SMTP_USER ,
    smtpPassword: process.env.SMTP_PASSWORD 
}