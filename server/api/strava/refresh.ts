import { updateCacheInBackground } from '../strava'

export default defineEventHandler(async (event) => {
	await updateCacheInBackground()
	return { success: true }
}) 