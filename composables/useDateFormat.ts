export function useDateFormat() {
	const formatDate = (date: string | Date) => {
		const d = new Date(date)
		return d.toLocaleDateString('en-GB', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric'
		})
	}

	return {
		formatDate
	}
} 