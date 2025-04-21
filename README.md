# Strava stats in Nuxt.js

You need to run this locally. You need to have Node.js installed.

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup
- https://www.strava.com/settings/api
- Create an API application
- Note the Client ID, Client secret and Refresh token.

Create a .env file and put them in these variables:

```bash
STRAVA_CLIENT_ID=xxx
STRAVA_CLIENT_SECRET=xxx
STRAVA_REFRESH_TOKEN=xxx
```

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