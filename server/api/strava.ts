import { readActivitiesFromCache, saveActivitiesToCache, shouldUpdateCache } from '../utils/stravaCache'

async function fetchAllActivities(accessToken: string) {
	let allActivities: any[] = []
	let page = 1
	let hasMore = true

	while (hasMore) {
		const activities = await $fetch(
			"https://www.strava.com/api/v3/athlete/activities",
			{
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
				params: {
					per_page: 100,
					page: page,
					type: "Run"
				}
			}
		)

		if (Array.isArray(activities) && activities.length > 0) {
			allActivities = allActivities.concat(activities)
			page++
		} else {
			hasMore = false
		}
	}

	return allActivities
}

export async function updateCacheInBackground() {
	const STRAVA_CLIENT_ID = process.env.STRAVA_CLIENT_ID
	const STRAVA_CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET
	const STRAVA_REFRESH_TOKEN = process.env.STRAVA_REFRESH_TOKEN

	try {
		const tokenRes = await $fetch("https://www.strava.com/oauth/token", {
			method: "POST",
			body: {
				client_id: STRAVA_CLIENT_ID,
				client_secret: STRAVA_CLIENT_SECRET,
				refresh_token: STRAVA_REFRESH_TOKEN,
				grant_type: "refresh_token",
			},
		})

		const tokenRes_typed = tokenRes as { access_token: string }
		const activities = await fetchAllActivities(tokenRes_typed.access_token)
		await saveActivitiesToCache(activities)
	} catch (error) {
		console.error('Background cache update failed:', error)
	}
}

export default defineEventHandler(async (event) => {
	// First try to read from cache
	const cachedData = await readActivitiesFromCache()
	
	// If we have cached data, check if it needs updating in the background
	if (cachedData) {
		const needsUpdate = await shouldUpdateCache(cachedData.activities)
		if (needsUpdate) {
			// Start background update without awaiting it
			updateCacheInBackground()
		}
		return cachedData.activities
	}

	// If no cache exists, fetch fresh data
	const STRAVA_CLIENT_ID = process.env.STRAVA_CLIENT_ID
	const STRAVA_CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET
	const STRAVA_REFRESH_TOKEN = process.env.STRAVA_REFRESH_TOKEN

	const tokenRes = await $fetch("https://www.strava.com/oauth/token", {
		method: "POST",
		body: {
			client_id: STRAVA_CLIENT_ID,
			client_secret: STRAVA_CLIENT_SECRET,
			refresh_token: STRAVA_REFRESH_TOKEN,
			grant_type: "refresh_token",
		},
	})

	const tokenRes_typed = tokenRes as { access_token: string }
	const activities = await fetchAllActivities(tokenRes_typed.access_token)
	await saveActivitiesToCache(activities)

	return activities
})
