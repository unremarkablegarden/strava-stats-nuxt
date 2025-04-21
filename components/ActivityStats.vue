<template lang="pug">
#stats
	div.grid.grid-cols-1.gap-4.md_grid-cols-3.mb-8
		div.bg-white.p-6.rounded-lg.shadow
			h2.text-lg.font-semibold.text-gray-700.mb-2 Total Distance
			p.text-3xl.font-bold.text-gray-900 {{ totalDistance }} km

		div.bg-white.p-6.rounded-lg.shadow
			h2.text-lg.font-semibold.text-gray-700.mb-2 Total Time
			p.text-3xl.font-bold.text-gray-900 {{ totalTime }}

		div.bg-white.p-6.rounded-lg.shadow
			h2.text-lg.font-semibold.text-gray-700.mb-2 Time Span
			p.text-3xl.font-bold.text-gray-900 {{ timeSpan }}

		div.bg-white.p-6.rounded-lg.shadow.group
			h2.text-lg.font-semibold.text-gray-700.mb-2 Average Distance
			p.text-3xl.font-bold.text-gray-900 {{ averageDistance }} km
			div.flex.flex-col.mt-2
				div.flex.items-center
					span.text-sm.text-gray-500.w-16 Longest
					span
						span.text-sm.font-medium {{ longestRun.distance }} km
						span.hidden.group-hover_block.text-gray-500.text-xs ({{ longestRun.date }})
				div.flex.items-center
					span.text-sm.text-gray-500.w-16 Fastest
					span
						span.text-sm.font-medium {{ fastestRun.pace }} min/km ({{ fastestRun.distance }} km)
						span.hidden.group-hover_block.text-gray-500.text-xs ({{ fastestRun.date }})


		div.bg-white.p-6.rounded-lg.shadow
			h2.text-lg.font-semibold.text-gray-700 Distances over
			//- p.text-sm.text-gray-500.mt-1 Runs over:
			div.flex.flex-col.mt-2
				div.flex
					span.text-sm.text-gray-500.w-12 5 km
					span.text-sm.font-medium {{ runsOver5km }}
				div.flex
					span.text-sm.text-gray-500.w-12 10 km
					span.text-sm.font-medium {{ runsOver10km }}
				div.flex
					span.text-sm.text-gray-500.w-12 15 km
					span.text-sm.font-medium {{ runsOver15km }}
				div.flex
					span.text-sm.text-gray-500.w-12 20 km
					span.text-sm.font-medium {{ runsOver20km }}

	div.bg-white.p-6.rounded-lg.shadow
		h2.text-lg.font-semibold.text-gray-700.mb-2 This Month
		p.text-3xl.font-bold.text-gray-900.mb-2 {{ monthlyTotal }} km
		div.flex.flex-col
			div.flex
				span.text-sm.text-gray-500.w-20 Total runs
				span.text-sm.font-medium {{ totalRunsThisMonth }}
			div.flex
				span.text-sm.text-gray-500.w-20 Average
				span.text-sm.font-medium {{ monthlyAveragePerDay }} km/day
			div.flex
				span.text-sm.text-gray-500.w-20 Projected
				span.text-sm.font-medium {{ projectedMonthlyTotal }} km
		div.mt-4.h-64
			Line(
				:data="chartData"
				:options="chartOptions"
			)

</template>

<script setup>
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler)

const props = defineProps({
	activities: Array
})

const totalDistance = computed(() => {
	if (!props.activities?.length) return '0'
	const total = props.activities.reduce((sum, activity) => sum + activity.distance, 0)
	return Math.round(total / 1000)
})

const totalRunsThisMonth = computed(() => {
	const now = new Date()
	const currentMonth = now.getMonth()
	const currentYear = now.getFullYear()
	
	return props.activities?.filter(activity => {
		const activityDate = new Date(activity.start_date)
		return activityDate.getMonth() === currentMonth && activityDate.getFullYear() === currentYear
	}).length || 0
})

const monthlyTotal = computed(() => {
	if (!props.activities?.length) return '0'
	const now = new Date()
	const currentMonth = now.getMonth()
	const currentYear = now.getFullYear()
	
	const monthlyActivities = props.activities.filter(activity => {
		const activityDate = new Date(activity.start_date)
		return activityDate.getMonth() === currentMonth && 
			   activityDate.getFullYear() === currentYear
	})
	
	const total = monthlyActivities.reduce((sum, activity) => sum + activity.distance, 0)
	return (total / 1000).toFixed(2)
})

const monthlyAveragePerDay = computed(() => {
	if (!props.activities?.length) return '0'
	const now = new Date()
	const currentMonth = now.getMonth()
	const currentYear = now.getFullYear()
	
	const monthlyActivities = props.activities.filter(activity => {
		const activityDate = new Date(activity.start_date)
		return activityDate.getMonth() === currentMonth && 
			   activityDate.getFullYear() === currentYear
	})
	
	const total = monthlyActivities.reduce((sum, activity) => sum + activity.distance, 0)
	const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
	const currentDay = now.getDate()
	
	return (total / 1000 / currentDay).toFixed(2)
})

const projectedMonthlyTotal = computed(() => {
	if (!props.activities?.length) return '0'
	const now = new Date()
	const currentMonth = now.getMonth()
	const currentYear = now.getFullYear()
	
	const monthlyActivities = props.activities.filter(activity => {
		const activityDate = new Date(activity.start_date)
		return activityDate.getMonth() === currentMonth && 
			   activityDate.getFullYear() === currentYear
	})
	
	const total = monthlyActivities.reduce((sum, activity) => sum + activity.distance, 0)
	const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
	const currentDay = now.getDate()
	
	const projectedTotal = (total / currentDay) * daysInMonth
	return (projectedTotal / 1000).toFixed(2)
})

const averageDistance = computed(() => {
	if (!props.activities?.length) return '0'
	const total = props.activities.reduce((sum, activity) => sum + activity.distance, 0)
	return (total / props.activities.length / 1000).toFixed(2)
})

const totalTime = computed(() => {
	if (!props.activities?.length) return '0d 0h 0m'
	const totalSeconds = props.activities.reduce((sum, activity) => sum + activity.elapsed_time, 0)
	
	const days = Math.floor(totalSeconds / (3600 * 24))
	const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600)
	const minutes = Math.floor((totalSeconds % 3600) / 60)
	
	const parts = []
	if (days > 0) parts.push(`${days}d`)
	if (hours > 0 || days > 0) parts.push(`${hours}h`)
	parts.push(`${minutes}m`)
	
	return parts.join(' ')
})

const timeSpan = computed(() => {
	if (!props.activities?.length) return '0 days'
	
	const dates = props.activities.map(a => new Date(a.start_date))
	const start = new Date(Math.min(...dates.map(d => d.getTime())))
	const end = new Date(Math.max(...dates.map(d => d.getTime())))
	
	let years = end.getFullYear() - start.getFullYear()
	let months = end.getMonth() - start.getMonth()
	let days = end.getDate() - start.getDate()
	
	if (days < 0) {
		months--
		days += new Date(end.getFullYear(), end.getMonth(), 0).getDate()
	}
	
	if (months < 0) {
		years--
		months += 12
	}
	
	const parts = []
	if (years > 0) parts.push(`${years}y`)
	if (months > 0 || years > 0) parts.push(`${months}m`)
	parts.push(`${days}d`)
	
	return parts.join(' ')
})

const longestRun = computed(() => {
	if (!props.activities?.length) return { distance: '0', date: 'N/A' }
	const longest = props.activities.reduce((max, activity) => 
		activity.distance > max.distance ? activity : max
	)
	return {
		distance: (longest.distance / 1000).toFixed(1),
		date: new Date(longest.start_date).toLocaleDateString()
	}
})

const shortestRun = computed(() => {
	if (!props.activities?.length) return { distance: '0', date: 'N/A' }
	const shortest = props.activities.reduce((min, activity) => 
		activity.distance < min.distance ? activity : min
	)
	return {
		distance: (shortest.distance / 1000).toFixed(1),
		date: new Date(shortest.start_date).toLocaleDateString()
	}
})

const fastestRun = computed(() => {
	if (!props.activities?.length) return { pace: '0', distance: '0', date: 'N/A' }
	const runsOver2km = props.activities.filter(activity => activity.distance >= 2000)
	if (!runsOver2km.length) return { pace: 'N/A', distance: 'N/A', date: 'N/A' }
	
	const fastest = runsOver2km.reduce((min, activity) => {
		const pace = activity.elapsed_time / (activity.distance / 1000) / 60 // Convert to min/km
		const minPace = min.elapsed_time / (min.distance / 1000) / 60
		return pace < minPace ? activity : min
	})
	return {
		pace: (fastest.elapsed_time / (fastest.distance / 1000) / 60).toFixed(2),
		distance: (fastest.distance / 1000).toFixed(1),
		date: new Date(fastest.start_date).toLocaleDateString()
	}
})

const runsOver5km = computed(() => {
	if (!props.activities?.length) return 0
	return props.activities.filter(activity => activity.distance >= 5000).length
})

const runsOver10km = computed(() => {
	if (!props.activities?.length) return 0
	return props.activities.filter(activity => activity.distance >= 10000).length
})

const runsOver15km = computed(() => {
	if (!props.activities?.length) return 0
	return props.activities.filter(activity => activity.distance >= 15000).length
})

const runsOver20km = computed(() => {
	if (!props.activities?.length) return 0
	return props.activities.filter(activity => activity.distance >= 20000).length
})

const currentDay = computed(() => {
	return new Date().getDate()
})

const daysInMonth = computed(() => {
	const now = new Date()
	return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
})

const monthlyProgress = computed(() => {
	if (!props.activities?.length) return 0
	const now = new Date()
	const currentMonth = now.getMonth()
	const currentYear = now.getFullYear()
	
	const monthlyActivities = props.activities.filter(activity => {
		const activityDate = new Date(activity.start_date)
		return activityDate.getMonth() === currentMonth && 
			   activityDate.getFullYear() === currentYear
	})
	
	const total = monthlyActivities.reduce((sum, activity) => sum + activity.distance, 0)
	const projectedTotal = (total / currentDay.value) * daysInMonth.value
	
	return (total / projectedTotal * 100).toFixed(1)
})

const chartData = computed(() => {
	if (!props.activities?.length) return { labels: [], datasets: [] }
	
	const now = new Date()
	const currentMonth = now.getMonth()
	const currentYear = now.getFullYear()
	const currentDay = now.getDate()
	const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
	
	const monthlyActivities = props.activities.filter(activity => {
		const activityDate = new Date(activity.start_date)
		return activityDate.getMonth() === currentMonth && 
			   activityDate.getFullYear() === currentYear
	}).sort((a, b) => new Date(a.start_date) - new Date(b.start_date))
	
	let cumulativeDistance = 0
	const labels = []
	const data = []
	const projectedLabels = []
	const projectedData = []
	
	// Actual data points
	monthlyActivities.forEach(activity => {
		cumulativeDistance += Number(activity.distance)
		const day = new Date(activity.start_date).getDate()
		labels.push(day)
		data.push(Number((cumulativeDistance / 1000).toFixed(2)))
	})
	
	// Calculate daily average
	const dailyAverage = cumulativeDistance / currentDay / 1000
	
	// Add today's actual value to both datasets to ensure connection
	const todayValue = Number((cumulativeDistance / 1000).toFixed(2))
	
	// Projected points - start from today
	const projectedStartValue = todayValue  // Start from the same point
	for (let day = currentDay + 2; day <= daysInMonth; day += 2) {
		projectedLabels.push(day)
		projectedData.push(Number((cumulativeDistance / 1000 + (dailyAverage * (day - currentDay))).toFixed(2)))
	}
	
	// Combine labels but don't duplicate today's date
	const allLabels = [...new Set([...labels, ...projectedLabels])]
	
	return {
		labels: allLabels,
		datasets: [
			{
				label: 'Cumulative Distance',
				data,
				fill: true,
				backgroundColor: 'rgba(251, 146, 60, 0.2)',
				borderColor: '#fc5200',
				tension: 0.4,
				pointRadius: 3,
				pointBackgroundColor: '#fc5200'
			},
			{
				label: 'Projected',
				data: [...Array(labels.length - 1).fill(null), todayValue, ...projectedData],
				fill: false,
				borderColor: 'rgba(59, 130, 246, 0.5)',
				borderDash: [5, 5],
				tension: 0.4,
				pointRadius: 0,
				pointBackgroundColor: 'rgb(59, 130, 246)'
			}
		]
	}
})

const chartOptions = {
	responsive: true,
	maintainAspectRatio: false,
	plugins: {
		legend: {
			display: false
		},
		tooltip: {
			callbacks: {
				label: (context) => `${context.parsed.y.toFixed(1)} km`
			}
		}
	},
	scales: {
		x: {
			min: 1,
			// max: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() + 7,
			grid: {
				display: false
			},
			ticks: {
				maxRotation: 0,
				stepSize: 1
			}
		},
		y: {
			beginAtZero: true,
			max: 100,
			ticks: {
				stepSize: 25
			},
			grid: {
				display: true,
				color: 'rgba(0, 0, 0, 0.1)'
			}
		}
	}
}
</script> 