const qs=require('query-string')
const axios=require('axios')
const dotenv =require('dotenv')
dotenv.config();

const stringifiedParams = qs.stringify({
    client_id: process.env.CLIENTID,
    redirect_uri: process.env.REDIRECT_URI,
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ].join(' '), // space seperated string
    response_type: 'code',
    access_type: 'offline',
    prompt: 'consent',
  });
  
  const googleLoginUrl = `https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`;

 async function getAccessTokenFromCode(code) {
    const { data } =await axios({
      url: 'https://oauth2.googleapis.com/token',
      method: 'post',
      data: {
        client_id: process.env.CLIENTID,
        client_secret: process.env.CLIENT_SECRET,
        redirect_uri: process.env.REDIRECT_URI,
        grant_type: 'authorization_code',
        code:code
      },
    });
    return data.access_token;
  };
 async function getGoogleUserInfo(access_token) {
    const { data } =await axios({
      url: 'https://www.googleapis.com/oauth2/v2/userinfo',
      method: 'get',
      headers: {
        Authorization: `Bearer ${access_token}`
      },
    });
    
    return data;
  };

exports.googleLoginUrl=googleLoginUrl
exports.getAccessTokenFromCode=getAccessTokenFromCode
exports.getGoogleUserInfo=getGoogleUserInfo