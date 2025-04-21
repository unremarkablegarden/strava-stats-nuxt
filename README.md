# Strava stats in Nuxt.js

![Screenshot 1](https://github.com/unremarkablegarden/strava-stats-nuxt/blob/main/screenshots/1.png?raw=true)

![Screenshot 2](https://github.com/unremarkablegarden/strava-stats-nuxt/blob/main/screenshots/2.png?raw=true)

You need to run this locally. You need to have Node.js installed.

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup
- https://www.strava.com/settings/api
- Create an API application
- Note the `Client ID`, `Client secret` and `Refresh token`.

Create a `.env` file and put them in these variables:

```bash
STRAVA_CLIENT_ID=xxx
STRAVA_CLIENT_SECRET=xxx
STRAVA_REFRESH_TOKEN=xxx
```

If it gives you trouble about needing an `ACCESS TOKEN` or complains about the `REFRESH TOKEN`:

- Open in web brower: `https://www.strava.com/oauth/authorize?client_id=YOUR_CLIENT_ID&response_type=code&redirect_uri=http://localhost:3000&approval_prompt=force&scope=activity:read_all`

- Approve the app, you’ll be redirected with ?code=... in the URL

- Take that code and do a POST request in the terminal: 

```bash
curl -X POST https://www.strava.com/oauth/token \
  -d client_id=YOUR_CLIENT_ID \
  -d client_secret=YOUR_CLIENT_SECRET \
  -d code=THE_CODE_YOU_JUST_GOT \
  -d grant_type=authorization_code
```

- It returns a `refresh_token` and an `access_token`


## Development Server

Make sure to install dependencies, in the terminal from this dir:

```bash
# npm
npm install
```

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev
```