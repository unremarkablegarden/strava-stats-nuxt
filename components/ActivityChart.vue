<script setup>
import {
	Chart as ChartJS,
	Title,
	Tooltip,
	Legend,
	LineElement,
	PointElement,
	LinearScale,
	TimeScale,
	CategoryScale,
} from 'chart.js'
import { Line } from 'vue-chartjs'
import { computed } from 'vue'

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, LinearScale, TimeScale, CategoryScale)

const props = defineProps({
	activities: Array,
})

function getDateRange() {
	if (!props.activities?.length) return { start: new Date(), end: new Date() }
	
	const dates = props.activities.map(a => new Date(a.start_date))
	return {
		start: new Date(Math.min(...dates.map(d => d.getTime()))),
		end: new Date(Math.max(...dates.map(d => d.getTime())))
	}
}

function getDatesInRange() {
	const { start, end } = getDateRange()
	const dates = []
	const current = new Date(start)
	
	while (current <= end) {
		dates.push(new Date(current))
		current.setDate(current.getDate() + 1)
	}
	
	return dates
}

const labels = computed(() => {
	return getDatesInRange().map(date => date.toISOString().split('T')[0])
})

const distances = computed(() => {
	const dateMap = new Map(
		props.activities.map(activity => {
			const date = new Date(activity.start_date)
			return [date.toISOString().split('T')[0], Number((activity.distance / 1000).toFixed(2))]
		})
	)
	
	return getDatesInRange().map(date => {
		const dateStr = date.toISOString().split('T')[0]
		return dateMap.get(dateStr) || 0
	})
})
</script>

<template>
	<div class="chart-container">
		<h2>Distances over time</h2>
		<Line
			:data="{
				labels,
				datasets: [
					{
						label: 'Distance (km)',
						data: distances,
						borderColor: '#fc5200',
						pointBackgroundColor: '#fff',
						pointRadius: (context) => context.raw === 0 ? 0 : 4,
						pointHoverRadius: (context) => context.raw === 0 ? 0 : 6,
						tension: 0.3,
					},
				],
			}"
			:options="{
				responsive: true,
				scales: {
					y: {
						beginAtZero: true,
					},
					x: {
						ticks: {
							maxRotation: 0,
							autoSkip: true,
							maxTicksLimit: 12,
						},
						grid: {
							display: false
						}
					}
				},
			}"
		/>
	</div>
</template>
