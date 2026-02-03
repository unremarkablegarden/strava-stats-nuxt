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
		div.flex.gap-1.justify-between
			div
				h2.text-lg.font-semibold.text-gray-700.mb-2 {{ periodLabel }}
				p.text-3xl.font-bold.text-gray-900.mb-2 {{ selectedPeriodTotal }} km
				div.flex.flex-col.gap-1
					div.flex
						span.text-sm.text-gray-500.w-20 Total runs
						span.text-sm.font-medium {{ selectedPeriodRuns }}
					div.flex
						span.text-sm.text-gray-500.w-20 Average
						span.text-sm.font-medium {{ selectedPeriodAverage }} km/{{ chartView === 'month' ? 'day' : 'month' }}
					div.flex(v-if="isCurrentPeriod")
						span.text-sm.text-gray-500.w-20 Projected
						span.text-sm.font-medium {{ selectedPeriodProjected }} km
			div(v-if="chartView === 'month'")
				div.flex.gap-16
					div
						div.flex.items-center(v-for="run in firstHalfRuns" :key="run.date")
							span.text-sm.text-gray-500.w-12 {{ run.date }}
							span.text-sm.font-medium {{ run.distance }} km
							span.text-xs.text-gray-500.ml-2 ({{ run.total }} km)
					div
						div.flex.items-center(v-for="run in secondHalfRuns" :key="run.date")
							span.text-sm.text-gray-500.w-12 {{ run.date }}
							span.text-sm.font-medium {{ run.distance }} km
							span.text-xs.text-gray-500.ml-2 ({{ run.total }} km)
				hr.mt-4
			
				
		div.flex.justify-between.items-center.mt-4
			.flex.items-center.gap-2
				button(
					@click="prevPeriod"
					class="px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded transition-colors"
				) ←
				span.text-sm.font-medium.w-20.text-center {{ periodLabel }}
				button(
					@click="nextPeriod"
					:disabled="isCurrentPeriod"
					:class="isCurrentPeriod ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'"
					class="px-2 py-1 text-sm rounded transition-colors"
				) →
			.flex.rounded-lg.overflow-hidden.border.border-gray-300
				button(
					@click="chartView = 'month'"
					:class="chartView === 'month' ? 'bg-black text-white' : 'bg-white text-gray-700 hover:bg-gray-100'"
					class="px-3 py-1 text-sm transition-colors"
				) Month
				button(
					@click="chartView = 'year'"
					:class="chartView === 'year' ? 'bg-black text-white' : 'bg-white text-gray-700 hover:bg-gray-100'"
					class="px-3 py-1 text-sm transition-colors border-l border-gray-300"
				) Year

		div.mt-4.h-64
			Line(
				:key="`${chartView}-${selectedMonth}-${selectedYear}`"
				:data="chartData"
				:options="chartOptions"
			)


</template>

<script setup>
import { computed, ref } from 'vue'
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler)

const props = defineProps({
	activities: Array
})

const chartView = ref('month')
const now = new Date()
const selectedMonth = ref(now.getMonth())
const selectedYear = ref(now.getFullYear())

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const periodLabel = computed(() => {
	if (chartView.value === 'month') {
		return `${monthNames[selectedMonth.value]} ${selectedYear.value}`
	}
	return `${selectedYear.value}`
})

const isCurrentPeriod = computed(() => {
	const now = new Date()
	if (chartView.value === 'month') {
		return selectedMonth.value === now.getMonth() && selectedYear.value === now.getFullYear()
	}
	return selectedYear.value === now.getFullYear()
})

function prevPeriod() {
	if (chartView.value === 'month') {
		if (selectedMonth.value === 0) {
			selectedMonth.value = 11
			selectedYear.value--
		} else {
			selectedMonth.value--
		}
	} else {
		selectedYear.value--
	}
}

function nextPeriod() {
	if (isCurrentPeriod.value) return
	if (chartView.value === 'month') {
		if (selectedMonth.value === 11) {
			selectedMonth.value = 0
			selectedYear.value++
		} else {
			selectedMonth.value++
		}
	} else {
		selectedYear.value++
	}
}

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

// Selected period stats (based on chart selection)
const selectedPeriodActivities = computed(() => {
	if (!props.activities?.length) return []
	if (chartView.value === 'month') {
		return props.activities.filter(activity => {
			const d = new Date(activity.start_date)
			return d.getMonth() === selectedMonth.value && d.getFullYear() === selectedYear.value
		})
	} else {
		return props.activities.filter(activity => {
			const d = new Date(activity.start_date)
			return d.getFullYear() === selectedYear.value
		})
	}
})

const selectedPeriodTotal = computed(() => {
	const total = selectedPeriodActivities.value.reduce((sum, a) => sum + a.distance, 0)
	return (total / 1000).toFixed(2)
})

const selectedPeriodRuns = computed(() => {
	return selectedPeriodActivities.value.length
})

const selectedPeriodAverage = computed(() => {
	if (!selectedPeriodActivities.value.length) return '0'
	const total = selectedPeriodActivities.value.reduce((sum, a) => sum + a.distance, 0)
	const now = new Date()

	if (chartView.value === 'month') {
		const isCurrentMonth = selectedMonth.value === now.getMonth() && selectedYear.value === now.getFullYear()
		const daysInMonth = new Date(selectedYear.value, selectedMonth.value + 1, 0).getDate()
		const days = isCurrentMonth ? now.getDate() : daysInMonth
		return (total / 1000 / days).toFixed(2)
	} else {
		const isCurrentYear = selectedYear.value === now.getFullYear()
		const months = isCurrentYear ? now.getMonth() + 1 : 12
		return (total / 1000 / months).toFixed(2)
	}
})

const selectedPeriodProjected = computed(() => {
	if (!selectedPeriodActivities.value.length) return '0'
	const total = selectedPeriodActivities.value.reduce((sum, a) => sum + a.distance, 0)
	const now = new Date()

	if (chartView.value === 'month') {
		const daysInMonth = new Date(selectedYear.value, selectedMonth.value + 1, 0).getDate()
		const currentDay = now.getDate()
		return ((total / currentDay) * daysInMonth / 1000).toFixed(2)
	} else {
		const currentMonth = now.getMonth() + 1
		return ((total / currentMonth) * 12 / 1000).toFixed(2)
	}
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

const monthlyRuns = computed(() => {
	if (!props.activities?.length) return []

	const getOrdinalSuffix = (n) => {
		const s = ['th', 'st', 'nd', 'rd']
		const v = n % 100
		return n + (s[(v - 20) % 10] || s[v] || s[0])
	}

	let runningTotal = 0
	return props.activities
		.filter(activity => {
			const activityDate = new Date(activity.start_date)
			return activityDate.getMonth() === selectedMonth.value &&
				   activityDate.getFullYear() === selectedYear.value
		})
		.sort((a, b) => new Date(a.start_date) - new Date(b.start_date))
		.map(activity => {
			const date = new Date(activity.start_date)
			runningTotal += activity.distance
			return {
				date: getOrdinalSuffix(date.getDate()),
				distance: (activity.distance / 1000).toFixed(1),
				total: (runningTotal / 1000).toFixed(1),
				elapsedTime: activity.elapsed_time
			}
		})
})

const firstHalfRuns = computed(() => {
	if (!monthlyRuns.value?.length) return []
	const midPoint = Math.ceil(monthlyRuns.value.length / 2)
	return monthlyRuns.value.slice(0, midPoint)
})

const secondHalfRuns = computed(() => {
	if (!monthlyRuns.value?.length) return []
	const midPoint = Math.ceil(monthlyRuns.value.length / 2)
	return monthlyRuns.value.slice(midPoint)
})

const monthlyChartData = computed(() => {
	if (!props.activities?.length) return { datasets: [{ data: [] }, { data: [] }] }

	const now = new Date()
	const isCurrentMonth = selectedMonth.value === now.getMonth() && selectedYear.value === now.getFullYear()
	const daysInMonth = new Date(selectedYear.value, selectedMonth.value + 1, 0).getDate()
	const lastDay = isCurrentMonth ? now.getDate() : daysInMonth

	const monthlyActivities = props.activities.filter(activity => {
		const activityDate = new Date(activity.start_date)
		return activityDate.getMonth() === selectedMonth.value &&
			   activityDate.getFullYear() === selectedYear.value
	}).sort((a, b) => new Date(a.start_date) - new Date(b.start_date))

	// Use {x, y} format - start at day 1 with 0
	const data = [{ x: 1, y: 0 }]
	let cumulativeDistance = 0

	monthlyActivities.forEach(activity => {
		cumulativeDistance += Number(activity.distance)
		const day = new Date(activity.start_date).getDate()
		data.push({ x: day, y: Number((cumulativeDistance / 1000).toFixed(2)) })
	})

	// For past months, extend line to end of month
	if (!isCurrentMonth && data.length > 1) {
		const lastDataPoint = data[data.length - 1]
		if (lastDataPoint.x < daysInMonth) {
			data.push({ x: daysInMonth, y: lastDataPoint.y })
		}
	}

	// Projection data
	const projectedData = []
	const todayValue = Number((cumulativeDistance / 1000).toFixed(2))

	if (isCurrentMonth && lastDay < daysInMonth) {
		const dailyAverage = cumulativeDistance / lastDay / 1000
		for (let day = lastDay + 5; day <= daysInMonth; day += 5) {
			projectedData.push({ x: day, y: Number((cumulativeDistance / 1000 + (dailyAverage * (day - lastDay))).toFixed(2)) })
		}
		// Always end at last day of month
		if (projectedData.length === 0 || projectedData[projectedData.length - 1].x !== daysInMonth) {
			projectedData.push({ x: daysInMonth, y: Number((cumulativeDistance / 1000 + (dailyAverage * (daysInMonth - lastDay))).toFixed(2)) })
		}
	}

	const projectedDataWithConnection = (isCurrentMonth && projectedData.length > 0)
		? [{ x: data[data.length - 1].x, y: todayValue }, ...projectedData]
		: []

	return {
		datasets: [
			{
				label: 'Cumulative Distance',
				data,
				fill: true,
				backgroundColor: 'rgba(251, 146, 60, 0.2)',
				borderColor: '#fc5200',
				tension: 0,
				pointRadius: 3,
				pointBackgroundColor: '#fc5200'
			},
			{
				label: 'Projected',
				data: projectedDataWithConnection,
				fill: false,
				borderColor: 'rgba(59, 130, 246, 0.5)',
				borderDash: [5, 5],
				tension: 0,
				pointRadius: 0,
				pointBackgroundColor: 'rgb(59, 130, 246)'
			}
		]
	}
})

function getDayOfYear(date) {
	const start = new Date(date.getFullYear(), 0, 0)
	const diff = date - start
	return Math.floor(diff / (1000 * 60 * 60 * 24))
}

const yearlyChartData = computed(() => {
	if (!props.activities?.length) return { labels: [], datasets: [{ data: [] }, { data: [] }] }

	const now = new Date()
	const isCurrentYear = selectedYear.value === now.getFullYear()

	const yearlyActivities = props.activities.filter(activity => {
		const activityDate = new Date(activity.start_date)
		return activityDate.getFullYear() === selectedYear.value
	}).sort((a, b) => new Date(a.start_date) - new Date(b.start_date))

	// Use {x, y} format for proper time positioning
	const data = [{ x: 1, y: 0 }] // Start at day 1 with 0
	let cumulative = 0

	yearlyActivities.forEach(activity => {
		cumulative += activity.distance
		const date = new Date(activity.start_date)
		const dayOfYear = getDayOfYear(date)
		data.push({ x: dayOfYear, y: Number((cumulative / 1000).toFixed(2)) })
	})

	// Projection data
	const projectedData = []
	const todayValue = Number((cumulative / 1000).toFixed(2))

	if (isCurrentYear && yearlyActivities.length > 0) {
		const todayDayOfYear = getDayOfYear(now)
		const dailyAverage = cumulative / todayDayOfYear / 1000

		// Add projection points monthly
		for (let day = todayDayOfYear + 30; day <= 365; day += 30) {
			projectedData.push({ x: day, y: Number((cumulative / 1000 + (dailyAverage * (day - todayDayOfYear))).toFixed(2)) })
		}
		// Always end at day 365
		if (projectedData.length === 0 || projectedData[projectedData.length - 1].x !== 365) {
			projectedData.push({ x: 365, y: Number((cumulative / 1000 + (dailyAverage * (365 - todayDayOfYear))).toFixed(2)) })
		}
	}

	const projectedDataWithConnection = (isCurrentYear && projectedData.length > 0)
		? [{ x: data[data.length - 1].x, y: todayValue }, ...projectedData]
		: []

	return {
		datasets: [
			{
				label: 'Cumulative Distance',
				data,
				fill: true,
				backgroundColor: 'rgba(251, 146, 60, 0.2)',
				borderColor: '#fc5200',
				tension: 0,
				pointRadius: 3,
				pointBackgroundColor: '#fc5200'
			},
			{
				label: 'Projected',
				data: projectedDataWithConnection,
				fill: false,
				borderColor: 'rgba(59, 130, 246, 0.5)',
				borderDash: [5, 5],
				tension: 0,
				pointRadius: 0,
				pointBackgroundColor: 'rgb(59, 130, 246)'
			}
		]
	}
})

const chartData = computed(() => {
	return chartView.value === 'month' ? monthlyChartData.value : yearlyChartData.value
})

const yearlyXAxisOptions = {
	type: 'linear',
	min: 1,
	max: 365,
	grid: { display: false },
	ticks: {
		maxRotation: 0,
		callback: function(value) {
			const monthStarts = [1, 32, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335]
			const idx = monthStarts.indexOf(value)
			if (idx !== -1) return monthNames[idx]
			return ''
		},
		stepSize: 1,
		autoSkip: false,
		includeBounds: false
	},
	afterBuildTicks: function(axis) {
		axis.ticks = [1, 32, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335].map(v => ({ value: v }))
	}
}

const monthlyActivityDays = computed(() => {
	if (!props.activities?.length) return []
	return props.activities
		.filter(activity => {
			const d = new Date(activity.start_date)
			return d.getMonth() === selectedMonth.value && d.getFullYear() === selectedYear.value
		})
		.map(activity => new Date(activity.start_date).getDate())
		.filter((v, i, a) => a.indexOf(v) === i) // unique
		.sort((a, b) => a - b)
})

const monthlyXAxisOptions = computed(() => {
	const days = monthlyActivityDays.value
	return {
		type: 'linear',
		min: 1,
		max: new Date(selectedYear.value, selectedMonth.value + 1, 0).getDate(),
		grid: {
			display: true,
			color: 'rgba(0, 0, 0, 0.1)'
		},
		ticks: {
			maxRotation: 0,
			autoSkip: false
		},
		afterBuildTicks: (axis) => {
			axis.ticks = days.map(d => ({ value: d }))
		}
	}
})

const chartOptions = computed(() => ({
	responsive: true,
	maintainAspectRatio: false,
	plugins: {
		legend: {
			display: false
		},
		tooltip: {
			callbacks: {
				label: (context) => `${context.parsed.y.toFixed(1)} km`,
				title: (context) => {
					if (chartView.value === 'year') {
						const dayOfYear = context[0].parsed.x
						const date = new Date(selectedYear.value, 0, dayOfYear)
						return `${monthNames[date.getMonth()]} ${date.getDate()}`
					}
					return context[0].label
				}
			}
		}
	},
	scales: {
		x: chartView.value === 'year' ? yearlyXAxisOptions : monthlyXAxisOptions.value,
		y: {
			min: 0,
			beginAtZero: true,
			grid: {
				display: true,
				color: 'rgba(0, 0, 0, 0.1)'
			}
		}
	}
}))
</script> 