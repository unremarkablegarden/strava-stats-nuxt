<template lang="pug">
div.border.border-gray-300.rounded-md.py-2.px-4.text-sm.leading-5
	.font-bold.line-clamp-1.hover_line-clamp-none.mb-1
		div {{ activity.name }}
	.flex.gap-2.justify-between.leading-4.flex-wrap
		div 🏃 {{ (activity.distance / 1000).toFixed(2) }} km
		div 🔥 {{ calculatePace(activity.distance, activity.moving_time) }} min/km
		div ⏱️ {{ formatDuration(activity.moving_time) }}
		div(v-if="activity.elapsed_time - activity.moving_time > 30 && activity.elapsed_time - activity.moving_time < 3600") 🪑 {{ formatDurationPause(activity.elapsed_time - activity.moving_time) }}
		div(v-else) ✅
	.footer.mt-1
		.text-gray-400.float-right {{ formatDate(activity.start_date) }}
		.text-gray-400 \#{{ count }}
</template>

<script setup lang="ts">
const { formatDate } = useDateFormat()

function formatDuration(seconds: number) {
	const hours = Math.floor(seconds / 3600)
	const minutes = Math.floor((seconds % 3600) / 60)
	const remainingSeconds = seconds % 60
	
	if (hours > 0) {
		return `${hours}h ${minutes}m ${remainingSeconds}s`
	}
	return `${minutes}m ${remainingSeconds}s`
}

function formatDurationPause(seconds: number) {
	// Convert seconds to minutes and round to nearest minute
	const totalMinutes = Math.round(seconds / 60)
	
	// Just return the minutes value
	return `${totalMinutes}m`
}

function calculatePace(distance: number, seconds: number) {
	const distanceKm = distance / 1000
	const totalSecondsPerKm = seconds / distanceKm
	const minutes = Math.floor(totalSecondsPerKm / 60)
	const remainingSeconds = Math.round(totalSecondsPerKm % 60)
	return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

defineProps<{
	activity: {
		id: number
		name: string
		start_date: string
		distance: number
		moving_time: number
		elapsed_time: number
	}
	count: number
}>()
</script> 