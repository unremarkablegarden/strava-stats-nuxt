// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: "2024-11-01",
	devtools: { enabled: true },
	modules: ["@nuxtjs/tailwindcss"],
	app: {
		head: {
			title: "Strava Stats",
			meta: [
				{ charset: "utf-8" },
				{
					name: "viewport",
					content: "width=device-width, initial-scale=1",
				},
			],
		},
	},
	css: ["@/assets/styles/main.sass"],
	runtimeConfig: {
		STRAVA_CLIENT_ID: process.env.STRAVA_CLIENT_ID,
		STRAVA_CLIENT_SECRET: process.env.STRAVA_CLIENT_SECRET,
		STRAVA_REFRESH_TOKEN: process.env.STRAVA_REFRESH_TOKEN,
	},
})
