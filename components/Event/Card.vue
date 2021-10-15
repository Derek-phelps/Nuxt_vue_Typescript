<script lang="ts">
import ClubEvent from '@includes/models/ClubEvent'
import { EventsFetchSingleAction } from '@store/events'
import {
	Vue,
	Component,
	Prop,
	Action,
	Getter,
	PropSync,
} from 'nuxt-property-decorator'

@Component
export default class EventCard extends ClubEvent.Mixin {
	@PropSync('event', { type: Object, required: true }) club_event!: any
	@Action('events/fetch_single') fetchSingle!: EventsFetchSingleAction

	@Getter('auth/favorite_events') favEvents!: number[]

	extra: any = false
	snippet: string = ''

	// fetch() {
	// 	if (!this.event) return
	// 	this.fetchSingle(this.event.id).then((d) => {
	// 		this.extra = d
	// 		this.snippet = d.snippet
	// 	})
	// }

	get isFavorite() {
		return this.favEvents.includes(this.club_event.id)
	}

	get start_date() {
		return this.club_event_start_moment.format('MMMM D, YYYY')
	}

	get start_time() {
		return this.club_event_start_moment.format('h:mm a')
	}

	get end_time() {
		if (!this.club_event_end_moment.isValid()) return false
		return this.club_event_end_moment.format('h:mm a')
	}

	get event_types(): any[] | false {
		if (
			!this.club_event ||
			!this.club_event.categories ||
			!this.club_event.categories.length
		)
			return false

		return this.club_event.categories.filter(
			(c: any) => c.category_type === 'event'
		)
	}

	get bar_color() {
		if (!this.event_types || !this.event_types.length) return '#c5d0a6'
		return this.event_types[0].color
	}

	get bar_colors() {
		if (!this.event_types || !this.event_types.length) return []
		return this.event_types.map((cat: any) => cat.color).slice(0, 3)
	}

	get has_media() {
		const event = this.club_event
		if (event.media) return true
		else return false
	}
}
</script>

<template>
	<card-colored-bar
		v-if="club_event.status === 'active'"
		class="event card-event"
		:class="{ 'has-media': has_media }"
		:color="bar_colors"
		@click.native="$router.push(`/events/${club_event.id}`)"
	>
		<club-media
			v-if="club_event.media && club_event.media.url"
			:media="club_event.media"
			size="medium"
			class="event-image"
		/>

		<div class="event-details">
			<div class="details-header">
				<div class="details-title-datetime">
					<div v-if="club_event.locations.length" class="details-location">
						<i class="fas fa-map-marker-alt"></i>
						<span>{{ club_event.locations[0].title }}</span>
					</div>

					<h3 class="details-title">{{ club_event.title }}</h3>
				</div>

				<div class="details-actions">
					<nuxt-link
						class="action more-details"
						:to="`/events/${club_event.id}`"
					>
						<form-button class="flat outline">
							Details
							<i class="fas fa-chevron-right"></i>
						</form-button>
					</nuxt-link>
				</div>
			</div>

			<div v-if="!club_event.is_allday" class="details-datetime">
				<span class="date">{{ start_date }}</span>
				<div class="dot" />
				<span class="time">
					{{ start_time }}
					<template v-if="end_time && end_time !== start_time">
						- {{ end_time }}
					</template>
				</span>
			</div>
			<div v-else class="details-datetime">
				<span class="date">{{ start_date }}</span>
				<div class="dot" />
				<span>All Day</span>
			</div>

			<div class="details-description" v-html="club_event.snippet" />

			<div class="details-actions">
				<nuxt-link class="action more-details" :to="`/events/${club_event.id}`">
					<form-button class="flat outline">
						Details
						<i class="fas fa-chevron-right"></i>
					</form-button>
				</nuxt-link>
			</div>
		</div>
	</card-colored-bar>
</template>

<style lang="scss" scoped>
@import '@sassy';

.card.event::v-deep {
	.card-content {
		@include flex(row, flex-start, stretch);

		& > .details-description {
			display: none;
			width: 100%;
		}

		@media screen and (max-width: 550px) and (min-width: 450px) {
			// flex-wrap: wrap;

			.event-details {
				width: calc(100% - 110px);
			}

			// & > .details-description {
			// 	display: inherit;
			// 	width: 100%;
			// }
		}
	}
}

.card.event {
	z-index: 1;
	cursor: pointer;

	@media screen and (min-width: 1024px) {
		transform: scale(0.95);
		transition: transform 0.25s;

		&:hover {
			transform: scale(0.99);
			z-index: 99999;
			position: relative;

			&:active {
				transform: scale(0.85);
			}
		}
	}

	.event-image {
		width: 125px;
		height: 125px;
		object-fit: cover;
		margin-right: 20px;
		border-radius: $border-radius;

		@media screen and (max-width: 750px) {
			width: 100px;
			height: 100%;

			@media screen and (max-width: 450px) {
				width: 100%;
				height: 100px;

				margin: 0px;
				margin-bottom: 0.25em;
				&::v-deep img {
					object-fit: cover;
				}
			}
		}
	}

	.event-details {
		flex: 1;
		.details-title {
			font-size: 1em;
		}

		.details-datetime {
			white-space: nowrap;

			@media screen and (max-width: 1024px) and (min-width: 876px) {
				font-size: 0.68em;

				@media screen and (max-width: 955px) {
					font-size: 0.7em;
				}
			}
		}

		& > .details-actions {
			display: none;
		}
	}

	.details-description {
		font-size: 0.9em;
		flex: 1;
	}

	.details-actions {
		flex-shrink: 0;

		.more-details {
			display: block;
			margin-left: 0.5em;

			.flat.outline {
				border: none;
				padding: 0.5em;

				span {
					@include flex(row, flex-end, center);

					i {
						margin-left: 0.5em;
					}
				}
			}
		}
	}
}

.card.event {
	@media screen and (max-width: 450px) {
		&::v-deep .card-content {
			@include flex(column);
		}

		.event-details {
			width: 100%;
		}
	}

	@media screen and (max-width: 475px) {
		&.has-media {
			padding: 0px;
			overflow: hidden;

			&::before {
				width: 8px;
				border-radius: $border-radius;
				// box-shadow: 0px 0px 3px 1px rgba(#000, 0.33);
			}

			&::v-deep .card-content {
				padding: 10px;
				padding-left: 0px;
			}
		}

		@media screen and (max-width: 350px) {
			&.has-media {
				.details-header {
					.details-actions {
						display: none;
					}
				}

				.event-details {
					& > .details-actions {
						@include flex(row, flex-end, center);
						width: 100%;
					}
				}
			}
		}
	}
}
</style>
