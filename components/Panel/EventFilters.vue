<script lang="ts">
import {
	Vue,
	Component,
	Watch,
	Getter,
	VModel,
	Prop,
	PropSync,
	Action,
} from 'nuxt-property-decorator'
import _ from 'lodash'
import { CategoriesFetchAction } from '@store/categories'
import { LocationsFetchAction } from '@store/locations'

@Component
export default class PanelEventFilters extends Vue {
	@Getter('auth/user') user!: any

	@Action('locations/fetch') $fetchLocations!: LocationsFetchAction
	@Action('categories/fetch') $fetchCategories!: CategoriesFetchAction
	@Prop() tab?: string

	@Getter('locations/items') locations!: any[]
	@PropSync('location') locationValue!: number[] | false
	get locationOptions() {
		const mappedKeys = _.mapKeys(this.locations, 'title')
		return _.mapValues(mappedKeys, (v) => v.id)
	}

	@Watch('location')
	removeSpaceFilter() {
		if (this.locationValue && this.locationValue.length) {
			this.spaceValue = []
		}
	}

	@Getter('categories/spaces') spaces!: any[]
	@PropSync('space') spaceValue!: number[] | false
	get spaceOptions() {
		const mappedKeys = _.mapKeys(this.spaces, 'title')
		return _.mapValues(mappedKeys, (v) => v.id)
	}

	@Watch('space')
	removeLocationFilter() {
		if (this.spaceValue && this.spaceValue.length) {
			this.locationValue = []
		}
	}

	@Getter('categories/event_types') eventTypes!: any[]
	@PropSync('eventType') eventTypeValue!: number | false
	get eventTypeOptions() {
		const mappedKeys = _.mapKeys(this.eventTypes, 'title')
		return _.mapValues(mappedKeys, (v) => v.id)
	}

	get filters() {
		const { location, space, eventType } = this as any
		return { location, space, eventType }
	}

	set filters(v: any) {
		if (typeof v.location !== 'undefined') this.locationValue = v.location
		if (typeof v.space !== 'undefined') this.spaceValue = v.space
		if (typeof v.eventType !== 'undefined') this.eventTypeValue = v.eventType
	}

	beforeMount() {
		this.fetchCategories()
		this.fetchLocations()
	}

	getEventTypeColor(eventTypeID: number) {
		const eventType = this.eventTypes.find((e) => e.title === eventTypeID)
		if (!eventType) return
		return {
			'--input-radio-mark-color': eventType.color,
		}
	}

	locationPage = 1
	fetchLocations() {
		const { locationPage } = this
		this.$fetchLocations({ page: locationPage }).then((data) => {
			if (data.next) {
				this.locationPage += 1
				this.fetchLocations()
			}
		})
	}

	catPage = 1
	fetchCategories() {
		const { catPage } = this
		this.$fetchCategories({ page: catPage }).then((data) => {
			if (data.next) {
				this.catPage += 1
				this.fetchCategories()
			}
		})
	}

	toggleFavorites() {
		const favsFeed = this.$store.getters.favoritesFeed
		if (favsFeed) {
			// it's on, turning it off
			this.$root.$emit('clear-filters')

			if (this.user && this.user.location) {
				this.locationValue = [this.user.location.id]
			}
		} else {
			// it's off, turning it on
			// eslint-disable-next-line no-lonely-if
			if (this.user.app_data.favorite_events.length > 0) {
				this.$root.$emit('clear-filters')
			}
		}

		this.$store.commit('favoritesFeed', !favsFeed)

		this.$forceUpdate()
	}
}
</script>

<template>
	<panel class="panel-event-filters solid glass-header">
		<template #panel-header>
			<h3 class="panel-title">Calendar</h3>
		</template>

		<div class="panel-wrap">
			<user-saved-filters :filter.sync="filters" />

			<form-button
				class="favorite-events flat"
				:class="{ outline: $store.getters.favoritesFeed }"
				@click="toggleFavorites"
			>
				<i class="fas fa-star"></i>
				MY FAVORITES
			</form-button>

			<div
				v-if="tab !== 'Events'"
				class="no-filters"
				style="text-align: center"
			>
				Use calendar to filter news by date.
			</div>

			<div v-if="tab === 'Events'" class="event-filter event-filter-location">
				<h3 class="filter-title">Location</h3>
				<form-radio
					v-model="locationValue"
					class="filter-options column flat no-bg"
					name="location"
					:options="locationOptions"
				/>
			</div>

			<div v-if="tab === 'Events'" class="event-filter event-filter-space">
				<h3 class="filter-title">Space</h3>
				<form-radio
					v-model="spaceValue"
					class="filter-options column flat no-bg"
					name="space"
					:options="spaceOptions"
				/>
			</div>

			<div v-if="tab === 'Events'" class="event-filter event-filter-space">
				<h3 class="filter-title">Event Type</h3>
				<form-radio
					v-model="eventTypeValue"
					class="filter-options column flat no-bg"
					name="space"
					:options="eventTypeOptions"
				>
					<template #option="{ label, value, inputName }">
						<input type="radio" :value="value" :name="inputName" />
						<div class="radio-mark" :style="getEventTypeColor(label)" />
						<label :for="inputName" class="input-radio-label">{{
							label
						}}</label>
					</template>
				</form-radio>
			</div>
		</div>
	</panel>
</template>

<style lang="scss" scoped>
@import '@sassy';

.panel::v-deep {
	.panel-header {
		@include flex(row, center, center);
	}

	.panel-body {
		padding: 0.25em 0px;
		padding-right: 0.5em;
		overflow: hidden;

		--scrollbar-track-background: $color-primary;
		--scrollbar-thumb-background: white;
	}
}

.panel {
	width: 274px;

	.panel-title {
		font-size: 24px;
		line-height: 34.51px;
	}

	.panel-wrap {
		height: 100%;
		padding: 2em;
		padding-top: 0px;
		padding-right: 1em;
		overflow: hidden;
		overflow-y: auto;
	}

	.user-saved-filters {
		padding-top: 1em;
		padding-bottom: 1.5em;
		border-bottom: 1px solid white;
	}

	.favorite-events {
		width: 100%;
		margin-top: 1em;

		i {
			color: $that-yellow;
		}
	}

	.event-filter {
		@include vertical-list-item(1em);

		.filter-title {
			font-family: $lato-font;
			text-transform: uppercase;
			margin-bottom: 0.5em;
		}

		.filter-options {
			--input-radio-background: white;
			--input-radio-mark-color-background: white;
			--input-radio-mark-color: #616161;

			width: 100%;
			color: white;

			&::v-deep .input-radio {
				padding: 0.25em;

				&.selected {
					.radio-mark {
						border-color: var(--input-radio-mark-color);
					}
				}
			}
		}
	}
}
</style>
