<template lang="pug">
#stats
	div.grid.grid-cols-1.gap-4.md_grid-cols-3.mb-8
		div.bg-white.p-6.rounded-lg.shadow
			h2.text-lg.font-semibold.text-gray-700.mb-2 Total Time
			p.text-3xl.font-bold.text-gray-900 {{ totalTime }}

		div.bg-white.p-6.rounded-lg.shadow
			h2.text-lg.font-semibold.text-gray-700.mb-2 Total Sessions
			p.text-3xl.font-bold.text-gray-900 {{ totalSessions }}

		div.bg-white.p-6.rounded-lg.shadow
			h2.text-lg.font-semibold.text-gray-700.mb-2 Time Span
			p.text-3xl.font-bold.text-gray-900 {{ timeSpan }}

		div.bg-white.p-6.rounded-lg.shadow.group
			h2.text-lg.font-semibold.text-gray-700.mb-2 Average Session Duration
			p.text-3xl.font-bold.text-gray-900 {{ averageDuration }}
			div.flex.flex-col.mt-2
				div.flex.items-center
					span.text-sm.text-gray-500.w-16 Longest
					span
						span.text-sm.font-medium {{ longestSession.duration }}
						span.hidden.group-hover_block.text-gray-500.text-xs ({{ longestSession.date }})
				div.flex.items-center
					span.text-sm.text-gray-500.w-16 Shortest
					span
						span.text-sm.font-medium {{ shortestSession.duration }}
						span.hidden.group-hover_block.text-gray-500.text-xs ({{ shortestSession.date }})


		div.bg-white.p-6.rounded-lg.shadow
			h2.text-lg.font-semibold.text-gray-700 Sessions over
			div.flex.flex-col.mt-2
				div.flex
					span.text-sm.text-gray-500.w-16 30 min
					span.text-sm.font-medium {{ sessionsOver30min }}
				div.flex
					span.text-sm.text-gray-500.w-16 45 min
					span.text-sm.font-medium {{ sessionsOver45min }}
				div.flex
					span.text-sm.text-gray-500.w-16 60 min
					span.text-sm.font-medium {{ sessionsOver60min }}
				div.flex
					span.text-sm.text-gray-500.w-16 90 min
					span.text-sm.font-medium {{ sessionsOver90min }}

	div.bg-white.p-6.rounded-lg.shadow
		div.flex.gap-1.justify-between
			div
				h2.text-lg.font-semibold.text-gray-700.mb-2 {{ periodLabel }}
				p.text-3xl.font-bold.text-gray-900.mb-2 {{ selectedPeriodTotalTime }}
				div.flex.flex-col.gap-1
					div.flex
						span.text-sm.text-gray-500.w-20 Sessions
						span.text-sm.font-medium {{ selectedPeriodSessions }}
					div.flex
						span.text-sm.text-gray-500.w-20 Average
						span.text-sm.font-medium {{ selectedPeriodAverage }}/{{ chartView === 'month' ? 'day' : 'month' }}
					div.flex(v-if="isCurrentPeriod")
						span.text-sm.text-gray-500.w-20 Projected
						span.text-sm.font-medium {{ selectedPeriodProjected }}
			div(v-if="chartView === 'month'")
				div.flex.gap-16
					div
						div.flex.items-center(v-for="session in firstHalfSessions" :key="session.date")
							span.text-sm.text-gray-500.w-12 {{ session.date }}
							span.text-sm.font-medium {{ session.duration }}
							span.text-xs.text-gray-500.ml-2 ({{ session.totalTime }})
					div
						div.flex.items-center(v-for="session in secondHalfSessions" :key="session.date")
							span.text-sm.text-gray-500.w-12 {{ session.date }}
							span.text-sm.font-medium {{ session.duration }}
							span.text-xs.text-gray-500.ml-2 ({{ session.totalTime }})
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

function formatTime(seconds) {
	const hours = Math.floor(seconds / 3600)
	const minutes = Math.floor((seconds % 3600) / 60)

	if (hours > 0) {
		return `${hours}h ${minutes}m`
	}
	return `${minutes}m`
}

function formatTimeWithDays(seconds) {
	const days = Math.floor(seconds / (3600 * 24))
	const hours = Math.floor((seconds % (3600 * 24)) / 3600)
	const minutes = Math.floor((seconds % 3600) / 60)

	const parts = []
	if (days > 0) parts.push(`${days}d`)
	if (hours > 0 || days > 0) parts.push(`${hours}h`)
	parts.push(`${minutes}m`)

	return parts.join(' ')
}

const totalTime = computed(() => {
	if (!props.activities?.length) return '0h 0m'
	const totalSeconds = props.activities.reduce((sum, activity) => sum + activity.elapsed_time, 0)
	return formatTimeWithDays(totalSeconds)
})

const totalSessions = computed(() => {
	return props.activities?.length || 0
})

const totalSessionsThisMonth = computed(() => {
	const now = new Date()
	const currentMonth = now.getMonth()
	const currentYear = now.getFullYear()

	return props.activities?.filter(activity => {
		const activityDate = new Date(activity.start_date)
		return activityDate.getMonth() === currentMonth && activityDate.getFullYear() === currentYear
	}).length || 0
})

const monthlyTotalTime = computed(() => {
	if (!props.activities?.length) return '0h 0m'
	const now = new Date()
	const currentMonth = now.getMonth()
	const currentYear = now.getFullYear()

	const monthlyActivities = props.activities.filter(activity => {
		const activityDate = new Date(activity.start_date)
		return activityDate.getMonth() === currentMonth &&
			   activityDate.getFullYear() === currentYear
	})

	const totalSeconds = monthlyActivities.reduce((sum, activity) => sum + activity.elapsed_time, 0)
	return formatTime(totalSeconds)
})

const monthlyAveragePerDay = computed(() => {
	if (!props.activities?.length) return '0m'
	const now = new Date()
	const currentMonth = now.getMonth()
	const currentYear = now.getFullYear()

	const monthlyActivities = props.activities.filter(activity => {
		const activityDate = new Date(activity.start_date)
		return activityDate.getMonth() === currentMonth &&
			   activityDate.getFullYear() === currentYear
	})

	const totalSeconds = monthlyActivities.reduce((sum, activity) => sum + activity.elapsed_time, 0)
	const currentDay = now.getDate()

	const avgSecondsPerDay = totalSeconds / currentDay
	return formatTime(Math.round(avgSecondsPerDay))
})

const projectedMonthlyTotal = computed(() => {
	if (!props.activities?.length) return '0h 0m'
	const now = new Date()
	const currentMonth = now.getMonth()
	const currentYear = now.getFullYear()

	const monthlyActivities = props.activities.filter(activity => {
		const activityDate = new Date(activity.start_date)
		return activityDate.getMonth() === currentMonth &&
			   activityDate.getFullYear() === currentYear
	})

	const totalSeconds = monthlyActivities.reduce((sum, activity) => sum + activity.elapsed_time, 0)
	const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
	const currentDay = now.getDate()

	const projectedSeconds = (totalSeconds / currentDay) * daysInMonth
	return formatTime(Math.round(projectedSeconds))
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

const selectedPeriodTotalTime = computed(() => {
	const totalSeconds = selectedPeriodActivities.value.reduce((sum, a) => sum + a.elapsed_time, 0)
	return formatTime(totalSeconds)
})

const selectedPeriodSessions = computed(() => {
	return selectedPeriodActivities.value.length
})

const selectedPeriodAverage = computed(() => {
	if (!selectedPeriodActivities.value.length) return '0m'
	const totalSeconds = selectedPeriodActivities.value.reduce((sum, a) => sum + a.elapsed_time, 0)
	const now = new Date()

	if (chartView.value === 'month') {
		const isCurrentMonth = selectedMonth.value === now.getMonth() && selectedYear.value === now.getFullYear()
		const daysInMonth = new Date(selectedYear.value, selectedMonth.value + 1, 0).getDate()
		const days = isCurrentMonth ? now.getDate() : daysInMonth
		return formatTime(Math.round(totalSeconds / days))
	} else {
		const isCurrentYear = selectedYear.value === now.getFullYear()
		const months = isCurrentYear ? now.getMonth() + 1 : 12
		return formatTime(Math.round(totalSeconds / months))
	}
})

const selectedPeriodProjected = computed(() => {
	if (!selectedPeriodActivities.value.length) return '0h 0m'
	const totalSeconds = selectedPeriodActivities.value.reduce((sum, a) => sum + a.elapsed_time, 0)
	const now = new Date()

	if (chartView.value === 'month') {
		const daysInMonth = new Date(selectedYear.value, selectedMonth.value + 1, 0).getDate()
		const currentDay = now.getDate()
		return formatTime(Math.round((totalSeconds / currentDay) * daysInMonth))
	} else {
		const currentMonth = now.getMonth() + 1
		return formatTime(Math.round((totalSeconds / currentMonth) * 12))
	}
})

const averageDuration = computed(() => {
	if (!props.activities?.length) return '0m'
	const totalSeconds = props.activities.reduce((sum, activity) => sum + activity.elapsed_time, 0)
	const avgSeconds = totalSeconds / props.activities.length
	return formatTime(Math.round(avgSeconds))
})

const timeSpan = computed(() => {
	if (!props.activities?.length) return '0 days'

	const dates = props.activities.map(a => new Date(a.start_date))
	const start = new Date(Math.min(...dates.map(d => d.getTime())))
	const end = new Date() // Calculate to today

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

const longestSession = computed(() => {
	if (!props.activities?.length) return { duration: '0m', date: 'N/A' }
	const longest = props.activities.reduce((max, activity) =>
		activity.elapsed_time > max.elapsed_time ? activity : max
	)
	return {
		duration: formatTime(longest.elapsed_time),
		date: new Date(longest.start_date).toLocaleDateString()
	}
})

const shortestSession = computed(() => {
	if (!props.activities?.length) return { duration: '0m', date: 'N/A' }
	const shortest = props.activities.reduce((min, activity) =>
		activity.elapsed_time < min.elapsed_time ? activity : min
	)
	return {
		duration: formatTime(shortest.elapsed_time),
		date: new Date(shortest.start_date).toLocaleDateString()
	}
})

const sessionsOver30min = computed(() => {
	if (!props.activities?.length) return 0
	return props.activities.filter(activity => activity.elapsed_time >= 30 * 60).length
})

const sessionsOver45min = computed(() => {
	if (!props.activities?.length) return 0
	return props.activities.filter(activity => activity.elapsed_time >= 45 * 60).length
})

const sessionsOver60min = computed(() => {
	if (!props.activities?.length) return 0
	return props.activities.filter(activity => activity.elapsed_time >= 60 * 60).length
})

const sessionsOver90min = computed(() => {
	if (!props.activities?.length) return 0
	return props.activities.filter(activity => activity.elapsed_time >= 90 * 60).length
})

const currentDay = computed(() => {
	return new Date().getDate()
})

const daysInMonth = computed(() => {
	const now = new Date()
	return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
})

const monthlySessions = computed(() => {
	if (!props.activities?.length) return []

	const getOrdinalSuffix = (n) => {
		const s = ['th', 'st', 'nd', 'rd']
		const v = n % 100
		return n + (s[(v - 20) % 10] || s[v] || s[0])
	}

	let runningTotalSeconds = 0
	return props.activities
		.filter(activity => {
			const activityDate = new Date(activity.start_date)
			return activityDate.getMonth() === selectedMonth.value &&
				   activityDate.getFullYear() === selectedYear.value
		})
		.sort((a, b) => new Date(a.start_date) - new Date(b.start_date))
		.map(activity => {
			const date = new Date(activity.start_date)
			runningTotalSeconds += activity.elapsed_time
			return {
				date: getOrdinalSuffix(date.getDate()),
				duration: formatTime(activity.elapsed_time),
				totalTime: formatTime(runningTotalSeconds),
				elapsedTime: activity.elapsed_time
			}
		})
})

const firstHalfSessions = computed(() => {
	if (!monthlySessions.value?.length) return []
	const midPoint = Math.ceil(monthlySessions.value.length / 2)
	return monthlySessions.value.slice(0, midPoint)
})

const secondHalfSessions = computed(() => {
	if (!monthlySessions.value?.length) return []
	const midPoint = Math.ceil(monthlySessions.value.length / 2)
	return monthlySessions.value.slice(midPoint)
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
	let cumulativeTime = 0

	monthlyActivities.forEach(activity => {
		cumulativeTime += Number(activity.elapsed_time)
		const day = new Date(activity.start_date).getDate()
		data.push({ x: day, y: Number((cumulativeTime / 3600).toFixed(2)) })
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
	const todayValue = Number((cumulativeTime / 3600).toFixed(2))

	if (isCurrentMonth && lastDay < daysInMonth) {
		const dailyAverage = cumulativeTime / lastDay / 3600
		for (let day = lastDay + 5; day <= daysInMonth; day += 5) {
			projectedData.push({ x: day, y: Number((cumulativeTime / 3600 + (dailyAverage * (day - lastDay))).toFixed(2)) })
		}
		// Always end at last day of month
		if (projectedData.length === 0 || projectedData[projectedData.length - 1].x !== daysInMonth) {
			projectedData.push({ x: daysInMonth, y: Number((cumulativeTime / 3600 + (dailyAverage * (daysInMonth - lastDay))).toFixed(2)) })
		}
	}

	const projectedDataWithConnection = (isCurrentMonth && projectedData.length > 0)
		? [{ x: data[data.length - 1].x, y: todayValue }, ...projectedData]
		: []

	return {
		datasets: [
			{
				label: 'Cumulative Time',
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
		cumulative += activity.elapsed_time
		const date = new Date(activity.start_date)
		const dayOfYear = getDayOfYear(date)
		data.push({ x: dayOfYear, y: Number((cumulative / 3600).toFixed(2)) })
	})

	// Projection data
	const projectedData = []
	const todayValue = Number((cumulative / 3600).toFixed(2))

	if (isCurrentYear && yearlyActivities.length > 0) {
		const todayDayOfYear = getDayOfYear(now)
		const dailyAverage = cumulative / todayDayOfYear / 3600

		// Add projection points quarterly
		for (let day = todayDayOfYear + 30; day <= 365; day += 30) {
			projectedData.push({ x: day, y: Number((cumulative / 3600 + (dailyAverage * (day - todayDayOfYear))).toFixed(2)) })
		}
		// Always end at day 365
		if (projectedData.length === 0 || projectedData[projectedData.length - 1].x !== 365) {
			projectedData.push({ x: 365, y: Number((cumulative / 3600 + (dailyAverage * (365 - todayDayOfYear))).toFixed(2)) })
		}
	}

	// For non-current years, extend to end of year
	if (!isCurrentYear && data.length > 0) {
		// No projection needed, data is complete
	}

	const projectedDataWithConnection = (isCurrentYear && projectedData.length > 0)
		? [{ x: data[data.length - 1].x, y: todayValue }, ...projectedData]
		: []

	return {
		datasets: [
			{
				label: 'Cumulative Time',
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
				label: (context) => `${context.parsed.y.toFixed(1)} hours`,
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
