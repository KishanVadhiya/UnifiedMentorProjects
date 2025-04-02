const {google} = require('googleapis');
require('dotenv').config();

const CLIENT_ID = process.env.DRIVE_CLIENT_ID;
const CLIENT_SECRET = process.env.DRIVE_CLIENT_SECRET;
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN= process.env.DRIVE_REFRESH_TOKEN;

const oauth2Client= new google.auth.OAuth2(CLIENT_ID,CLIENT_SECRET,REDIRECT_URI);

oauth2Client.setCredentials({refresh_token:REFRESH_TOKEN});

const drive=google.drive({
    version:'v3',
    auth: oauth2Client,
});

module.exports=drive;