import { writeFile, readFile, mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { existsSync } from 'node:fs'

const CACHE_DIR = join(process.cwd(), 'data')
const CACHE_FILE = join(CACHE_DIR, 'strava-activities.json')

interface StravaActivity {
	id: number
	name: string
	distance: number
	moving_time: number
	elapsed_time: number
	total_elevation_gain: number
	type: string
	sport_type: string
	start_date: string
	start_date_local: string
	timezone: string
	utc_offset: number
	map: {
		id: string
		summary_polyline: string
		resource_state: number
	}
	average_speed: number
	max_speed: number
	start_latlng: number[]
	end_latlng: number[]
	achievement_count: number
	kudos_count: number
	athlete_count: number
}

export async function saveActivitiesToCache(activities: StravaActivity[]) {
	// Ensure data directory exists
	if (!existsSync(CACHE_DIR)) {
		await mkdir(CACHE_DIR, { recursive: true })
	}
	
	await writeFile(CACHE_FILE, JSON.stringify({
		lastUpdated: new Date().toISOString(),
		activities
	}, null, 2))
}

export async function readActivitiesFromCache(): Promise<{ lastUpdated: string, activities: StravaActivity[] } | null> {
	try {
		const data = await readFile(CACHE_FILE, 'utf-8')
		return JSON.parse(data)
	} catch (error) {
		return null
	}
}

export async function shouldUpdateCache(cachedActivities: StravaActivity[] | null): Promise<boolean> {
	if (!cachedActivities) return true

	// Get the most recent activity from cache
	const mostRecentCached = cachedActivities.reduce((latest, current) => {
		const currentDate = new Date(current.start_date)
		const latestDate = new Date(latest.start_date)
		return currentDate > latestDate ? current : latest
	})

	// Check if the most recent activity is older than 1 hour
	const oneHourAgo = new Date()
	oneHourAgo.setHours(oneHourAgo.getHours() - 1)

	return new Date(mostRecentCached.start_date) < oneHourAgo
} 