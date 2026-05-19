<template lang="pug">
div.border.border-gray-300.rounded-md.py-2.px-4.text-sm.leading-5
	.font-bold.line-clamp-1.hover_line-clamp-none.mb-1
		div {{ activity.name }}
	.flex.gap-2.justify-between.leading-4.flex-wrap
		div 🏋️ {{ formatDuration(activity.moving_time) }}
	.footer.mt-1
		.text-gray-400.float-right {{ formatDate(activity.start_date) }}
		.text-gray-400 \#{{ count }}
</template>

<script setup lang="ts">
const { formatDate } = useDateFormat()

function formatDuration(seconds: number) {
	const hours = Math.floor(seconds / 3600)
	const minutes = Math.floor((seconds % 3600) / 60)

	if (hours > 0) {
		return `${hours}h ${minutes}m`
	}
	return `${minutes}m`
}

defineProps<{
	activity: {
		id: number
		name: string
		start_date: string
		moving_time: number
		elapsed_time: number
	}
	count: number
}>()
</script>
