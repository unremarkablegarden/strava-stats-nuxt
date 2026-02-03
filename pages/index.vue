<template lang="pug">
.container.min-h-screen.py-8.mx-auto
	NavTabs
	.flex.justify-between.items-center.mb-8
		h1.text-3xl.font-bold.text-gray-900 Running

		.flex.items-center.gap-4
			.flex.rounded-lg.overflow-hidden.border.border-gray-300
				button(
					@click="timeFilter = 'all'"
					:class="timeFilter === 'all' ? 'bg-black text-white' : 'bg-white text-gray-700 hover:bg-gray-100'"
					class="px-3 py-1 text-sm transition-colors"
				) All Time
				button(
					@click="timeFilter = 'year'"
					:class="timeFilter === 'year' ? 'bg-black text-white' : 'bg-white text-gray-700 hover:bg-gray-100'"
					class="px-3 py-1 text-sm transition-colors border-l border-gray-300"
				) This Year

			button(
				@click="refreshData"
				:disabled="isRefreshing"
				class="px-3 py-1 bg-black text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
			)
				.flex.items-center.gap-2
					span {{ isRefreshing ? 'Refreshing...' : 'Refresh Data' }}
					LoadingSpinner(v-if="isRefreshing")
	
	ActivityStats(:activities="sortedActivities").mb-8
	
	ActivityChart(
		:activities="sortedActivities"
	).mb-8

	div.grid.grid-cols-1.gap-4.md_grid-cols-3.lg_grid-cols-4.xl_grid-cols-5
		Activity(
			v-for="(activity, index) in sortedActivities"
			:key="activity.id"
			:activity="activity"
			:count="totalActivities - index"
		)
</template>

<script setup lang="ts">
const { data: activities, refresh } = await useFetch('/api/strava')
const isRefreshing = ref(false)
const timeFilter = ref<'all' | 'year'>('all')

const runningActivities = computed(() => {
	if (!activities.value) return []
	return activities.value.filter(activity => activity.type === 'Run')
})

const filteredActivities = computed(() => {
	if (timeFilter.value === 'all') return runningActivities.value
	const currentYear = new Date().getFullYear()
	return runningActivities.value.filter(activity => {
		const activityYear = new Date(activity.start_date).getFullYear()
		return activityYear === currentYear
	})
})

const totalActivities = computed(() => filteredActivities.value.length)

const sortedActivities = computed(() => {
	return [...filteredActivities.value].sort((a, b) =>
		new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
	)
})

async function refreshData() {
	isRefreshing.value = true
	try {
		await $fetch('/api/strava/refresh')
		await refresh()
	} catch (error) {
		console.error('Failed to refresh data:', error)
	} finally {
		isRefreshing.value = false
	}
}
</script>
