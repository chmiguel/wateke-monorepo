const express = require('express');
const dotenv = require('dotenv');
const request = require('request');
const youtubeScrapper = require('youtube-scrapper');

const port = 5001;

dotenv.config();

Date.prototype.addSeconds = function (s) {
  this.setTime(this.getTime() + s * 1000);
  return this;
};

var spotify_client_id = process.env.SPOTIFY_CLIENT_ID;
var spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET;
var API_URL = process.env.REACT_APP_API_URL;
var REACT_APP_URL = process.env.REACT_APP_URL;


var generateRandomString = function (length) {
  var text = '';
  var possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var app = express();

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

var appAccessToken;
var tokenExpirationDate;

function hasTokenExpired() {
  if (tokenExpirationDate)
    console.log(
      '*** has token exp',
      tokenExpirationDate.getTime() - new Date().getTime(),
    );
  return (
    !tokenExpirationDate ||
    new Date().getTime() >= tokenExpirationDate.getTime()
  );
}

var authenticate = () => {
  console.log(appAccessToken);
  if (appAccessToken && !hasTokenExpired())
    return Promise.resolve(appAccessToken);
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      Authorization:
        'Basic ' +
        new Buffer(spotify_client_id + ':' + spotify_client_secret).toString(
          'base64',
        ),
    },
    form: {
      grant_type: 'client_credentials',
    },
    json: true,
  };

  return new Promise((resolve, reject) => {
    request.post(authOptions, function (error, response, body) {
      console.log(body);
      if (!error && response.statusCode === 200) {
        tokenExpirationDate = new Date().addSeconds(3600);

        appAccessToken = body.access_token;
        resolve(appAccessToken);
      }
    });
  });
};

app.get('/youtube/search', async (req, res) => {
  if (req.query.text) {
    const result = await youtubeScrapper.search(req.query.text);
    res.send(result.videos);
  } else res.status(400).send({ error: 'Empty search text' });
});

app.get('/auth/login', (req, res) => {
  var scope =
    'streaming user-read-email user-read-private user-read-playback-state user-modify-playback-state';

  var state = generateRandomString(16);

  var auth_query_parameters = new URLSearchParams({
    response_type: 'code',
    client_id: spotify_client_id,
    scope: scope,
    redirect_uri: `${API_URL}/auth/callback`,
    state: state,
  });

  res.redirect(
    'https://accounts.spotify.com/authorize/?' +
    auth_query_parameters.toString(),
  );
});

app.get('/auth/refresh', (req, res) => {
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      Authorization:
        'Basic ' +
        new Buffer(spotify_client_id + ':' + spotify_client_secret).toString(
          'base64',
        ),
    },
    form: {
      grant_type: 'refresh_token',
      refresh_token: req.query.refresh_token,
    },
    json: true,
  };

  request.post(authOptions, function (error, response, body) {
    console.log('refresh', body);
    console.log('refresh error', error);
    if (!error && response.statusCode === 200) {
      res.send(body);
    }
  });
});

app.get('/spotify/search', async (req, res) => {
  console.log('Origin', req.get('Origin'), 'Referer', req.get('Referer'));
  const allowedDomains = ['localhost:3000', 'watekemusic.com', 'wateke.live'];
  const origin = req.get('origin');
  if (allowedDomains.includes(origin)) {
    res.set('Access-Control-Allow-Origin', origin);
  }
  try {
    const accessToken = await authenticate();
    console.log(
      `https://api.spotify.com/v1/search?q=${req.query.text}&type=track`,
    );
    request.get(
      `https://api.spotify.com/v1/search?q=${req.query.text}&type=track`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
      (error, response, body) => {
        if (error) {
          res.send({ error: true });
        } else {
          res.send(body);
        }
      },
    );
  } catch (error) {
    console.log(error);
    res.send({ error: true });
  }
});

app.get('/auth/callback', (req, res) => {
  var code = req.query.code;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri: `${API_URL}/auth/callback`,
      grant_type: 'authorization_code',
    },
    headers: {
      Authorization:
        'Basic ' +
        Buffer.from(spotify_client_id + ':' + spotify_client_secret).toString(
          'base64',
        ),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    json: true,
  };

  request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var params = new URLSearchParams({
        ...body,
        expires_at: new Date().addSeconds(3600).getTime(),
      });
      var access_token = body.access_token;
      res.redirect(`${REACT_APP_URL}/dashboard?${params.toString()}`);
    }
  });
});

app.listen(port, () => {
  console.log(`Listening at ${API_URL}`);
});
