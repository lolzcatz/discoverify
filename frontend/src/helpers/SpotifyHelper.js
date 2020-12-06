/* eslint-disable no-restricted-syntax */
require('dotenv').config();

const CLIENT_ID = process.env.REACT_APP_DISCOVER_DAILY_API_CLIENT_ID;
const CLIENT_SECRET = process.env.REACT_APP_DISCOVER_DAILY_API_CLIENT_SECRET;

class SpotifyHelper {
  static generateRandomString(length) {
    let text = '';
    const possible =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i += 1) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  static getOAuthCodeUrl(redirectUri) {
    const scope =
      'user-top-read user-library-read playlist-modify-private playlist-modify-public playlist-read-private';

    let url = 'https://accounts.spotify.com/authorize';
    url += '?response_type=code';
    url += `&client_id=${encodeURIComponent(CLIENT_ID)}`;
    url += `&scope=${encodeURIComponent(scope)}`;
    url += `&state=${encodeURIComponent(this.generateRandomString(16))}`;
    url += `&redirect_uri=${encodeURIComponent(redirectUri)}`;

    return url;
  }

  static async getRefreshToken(code, redirectUri) {
    const details = {
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    };

    let formBody = [];
    // eslint-disable-next-line guard-for-in
    for (const property in details) {
      const encodedKey = encodeURIComponent(property);
      const encodedValue = encodeURIComponent(details[property]);
      formBody.push(`${encodedKey}=${encodedValue}`);
    }
    formBody = formBody.join('&');

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formBody,
    });

    return response.json();
  }

  static async getUserInfo(accessToken) {
    const response = await fetch('https://api.spotify.com/v1/me', {
      Accepts: 'application/json',
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.json();
  }

  static async getAccessToken(refreshToken) {
    const details = {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    };

    let formBody = [];
    // eslint-disable-next-line guard-for-in
    for (const property in details) {
      const encodedKey = encodeURIComponent(property);
      const encodedValue = encodeURIComponent(details[property]);
      formBody.push(`${encodedKey}=${encodedValue}`);
    }
    formBody = formBody.join('&');

    const result = await fetch(`https://accounts.spotify.com/api/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formBody,
    });

    return (await result.json()).access_token;
  }
}
export default SpotifyHelper;
