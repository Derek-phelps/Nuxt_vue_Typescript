<script lang="ts">
import { Vue, Component, Emit } from 'nuxt-property-decorator'

@Component
export default class EventCalendar extends Vue {
	get today() {
		return this.$moment()
	}

	get todayDate() {
		return this.today.format('YYYY-MM-DD')
	}

	get startOfWeek() {
		const start_date = this.today.clone().weekday(1).format('YYYY-MM-DD')
		return start_date
	}

	get endOfWeek() {
		const end_date = this.today.clone().weekday(7).format('YYYY-MM-DD')
		return end_date
	}

	get startOfMonth() {
		const startOfMonth = this.today
			.clone()
			.startOf('month')
			.format('YYYY-MM-DD')
		return startOfMonth
	}

	get endOfMonth() {
		const endOfMonth = this.today.clone().endOf('month').format('YYYY-MM-DD')
		return endOfMonth
	}

	@Emit('range-click')
	dateRangeClicked(val: any, val1: any) {
		const date = {
			start: val,
			end: val === val1 ? false : val1,
		}
		return date
	}
}
</script>

<template>
	<div class="panel-body-btn">
		<form-button
			class="flat filter-btn"
			@click="dateRangeClicked(todayDate, todayDate)"
			><span>Today</span></form-button
		>
		<span>|</span>
		<form-button
			class="flat filter-btn"
			@click="dateRangeClicked(startOfWeek, endOfWeek)"
			><span>This week</span></form-button
		>
		<span>|</span>
		<form-button
			class="flat filter-btn"
			@click="dateRangeClicked(startOfMonth, endOfMonth)"
			><span>This Month</span></form-button
		>
	</div>
</template>

<style lang="scss" scoped>
@import '@sassy';
</style>
