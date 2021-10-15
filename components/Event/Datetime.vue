<script lang="ts">
import ClubEvent from '@includes/models/ClubEvent'
import { Vue, Component, Prop } from 'nuxt-property-decorator'

@Component
export default class EventDatetime extends ClubEvent.Mixin {
	@Prop({ type: Object, required: true })
	club_event!: ClubEvent.Data

	get start_date() {
		return this.club_event_start_moment.format('MMMM D, YYYY')
	}

	get start_time() {
		return this.club_event_start_moment.format('h:mm a')
	}

	get end_date() {
		return this.club_event_end_moment.format('MMMM D, YYYY')
	}

	get end_time() {
		return this.club_event_end_moment.format('h:mm a')
	}
}
</script>

<template>
	<div class="event-datetime">
		<template v-if="!club_event.is_allday">
			<span class="date">{{ start_date }}</span>
			<div class="dot" />
			<span class="time">
				{{ start_time }}
				<template v-if="end_time && end_time !== start_time">
					- {{ end_time }}
				</template>
			</span>
		</template>
		<template v-else>
			<span class="date">{{ start_date }}</span>
			<div class="dot" />
			<span>All Day</span>
		</template>
	</div>
</template>

<style lang="scss" scoped>
@import '@sassy';

.event-datetime {
	@include flex(row, space-between);
	width: fit-content;

	.dot {
		@include flex(column, center, center);
		margin: 0px 0.5em;
		align-self: stretch;

		&:after {
			content: '';
			width: 5px;
			height: 5px;
			background-color: var(--event-datetime-dot-color, $color-primary);
			border-radius: 100%;
		}
	}
}
</style>
