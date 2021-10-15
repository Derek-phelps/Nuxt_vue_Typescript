<script lang="ts">
import ClubEvent from '@includes/models/ClubEvent'
import ClubReservation from '@includes/models/ClubReservation'
import {
	Component,
	Action,
	Getter,
	PropSync,
	Watch,
} from 'nuxt-property-decorator'

@Component
export default class EventDetailsHeader extends ClubEvent.Mixin {
	@PropSync('event', { type: Object, required: true })
	club_event!: ClubEvent.Data

	@Getter('auth/favorite_events') favEvents!: number[]
	@Action('auth/favorite_event') favEvent!: (
		event: number[] | number
	) => Promise<any>

	@Action('events/fetch_guests') $fetchGuests!: (
		eventID: number
	) => Promise<any[]>

	guests: any[] = []
	club_reservation = ClubReservation.create()

	get start_date() {
		return this.club_event_start_moment.format('MMMM D, YYYY')
	}

	get start_time() {
		return this.club_event_start_moment.format('h:mm a')
	}

	get endTime() {
		const time = this.$moment(this.club_event.end_date)
		if (!time.isValid()) return false
		return time.format('h:mm a')
	}

	get isFavorite() {
		return this.favEvents.includes(this.club_event.id)
	}

	get favHelperText() {
		if (this.isFavorite) {
			return 'remove from my favorite events'
		} else {
			return 'add to my favorite events'
		}
	}

	get firstFiveGuests() {
		return this.guests.slice(0, 4)
	}

	get show_reserve_btn() {
		const club_event = this.club_event
		return (
			club_event.has_online_reservation &&
			this.club_event_is_future &&
			(club_event.available_spaces > 0 ||
				club_event.available_spaces === null ||
				club_event.has_waitlist)
		)
	}

	get firstGiveGuestNames() {
		let names = this.firstFiveGuests
			.map((guest) => {
				if (guest.name) return guest.name
				else if (guest.member && typeof guest.member === 'object') {
					const member = guest.member
					return `${member.first_name} ${member.last_name}`
				}

				return 'Anonymous Guest'
			})
			.join('\n')

		if (this.guests.length > 5) {
			names += `\nAnd ${this.guests.length - 5} more`
		}

		return names
	}

	beforeMount() {
		if (this.club_event.has_public_list) {
			this.$fetchGuests(this.club_event.id).then((data) => {
				this.guests = data
			})
		}
	}

	@Watch('club_event', { immediate: true })
	mapEventToReservation(event: ClubEvent.Data) {
		this.club_reservation.event = event
	}
}
</script>

<template>
	<card class="event-details">
		<div class="details-header">
			<club-media
				v-if="club_event.media && club_event.media.url"
				:media="club_event.media"
				size="small"
				class="event-image"
			/>

			<div class="header-wrap">
				<aside class="left">
					<div v-if="club_event.locations.length" class="details-location">
						<i class="fas fa-map-marker-alt"></i>
						<span>{{ club_event.locations[0].title }}</span>
					</div>

					<h3 class="details-title">{{ club_event.title }}</h3>

					<div v-if="!club_event.is_allday" class="details-datetime">
						<span class="date">{{ start_date }}</span>
						<div class="dot" />
						<span class="time">
							{{ start_time }}

							<template v-if="endTime && endTime !== start_time">
								- {{ endTime }}
							</template>
						</span>
					</div>
					<div v-else class="details-datetime">
						<span>All Day</span>
					</div>
				</aside>
			</div>
		</div>

		<div class="event-description" v-html="club_event.description" />

		<div class="details-actions">
			<aside class="left">
				<div v-if="club_event.has_public_list" class="event-guests">
					<form-button
						class="guests flat outline icon no-border"
						:title="firstGiveGuestNames"
						@click="$modal.open({ is: 'event-guest-list-modal', guests })"
					>
						<i class="guests-icon fad fa-users"></i>
					</form-button>
				</div>

				<div
					v-if="club_event.available_spaces !== null && club_event_is_future"
					class="event-spaces"
				>
					<template v-if="club_event.available_spaces >= 0">
						{{ club_event.available_spaces }}
					</template>
					<template v-else>0</template>
					seats left
				</div>
				<div
					v-else-if="
						club_event.has_online_reservation &&
						club_event.available_spaces < 1 &&
						club_event.has_waitlist &&
						club_event_is_future
					"
					class="event-spaces has-waitlist"
				>
					<span>Join waitlist below</span>
				</div>
			</aside>

			<form-button
				v-if="show_reserve_btn"
				class="reserve flat compact"
				@click="
					$modal.open({
						is: 'reservation-form-modal',
						club_reservation,
					})
				"
			>
				Reserve
			</form-button>

			<form-button
				class="action favorite-event icon flat outline"
				:title="favHelperText"
				@click="favEvent(event.id)"
			>
				<i v-if="!isFavorite" class="far fa-star"></i>
				<i v-else class="fas fa-star"></i>
			</form-button>
		</div>

		<slot />
	</card>
</template>

<style lang="scss" scoped>
@import '@sassy';

.card.event-details {
	@include flex(column);
	z-index: 1;

	.details-header {
		@include flex(row, flex-start, stretch);
		margin-bottom: 1em;

		.event-image {
			width: 125px;
			height: 125px;
			object-fit: cover;
			margin-right: 20px;
			border-radius: $border-radius;
		}

		.header-wrap {
			@include flex(row, space-between);
			flex: 1;

			aside.left {
				display: grid;
				grid-auto-flow: row;
				row-gap: 0.5em;

				.details-datetime {
					// font-size: 0.75em;
					white-space: nowrap;

					@media screen and (max-width: 365px) {
						font-size: 0.7em;

						@media screen and (max-width: 325px) {
							font-size: 0.65em;
						}
					}
				}
			}
		}
	}

	.event-description {
		width: 100%;
		// max-height: 90px;
		overflow: hidden;
		overflow-y: auto;
		--scrollbar-size: 4px;
	}

	.details-actions {
		@include grid(1fr auto auto, auto);
		width: 100%;
		margin-top: 1em;

		aside.left {
			@include flex(row, flex-start, center);
		}

		.event-spaces {
			margin-right: 1em;
			font-weight: bold;
			font-style: italic;

			@media screen and (max-width: 365px) {
				display: none;
			}
		}

		.event-guests {
			@include flex(row, flex-end, center);

			margin-right: 1em;

			.form-button.guests {
				--button-icon-size: 25px;
				transition: background-color 0.25s, color 0.25s;

				.guests-icon {
					font-size: 1.5em;
				}

				&:hover {
					background-color: $color-primary;
					color: $color-primary-text;
				}
			}
		}

		.favorite-event {
			--button-icon-size: 25px;
			border: none;
			font-size: 1.25em;

			i.fas {
				color: #ebca9e;
			}

			i.far {
				color: $that-gray;
			}
		}
	}

	&.noform {
		overflow: hidden;

		.event-description {
			height: unset;
		}
	}
}

.event-description::v-deep {
	p {
		padding: 0.25em 0px;
	}
}

@media only screen and (max-width: 576px) {
	.card.event-details {
		position: relative;
		.details-header {
			.header-wrap {
				display: block;

				.details-actions {
					bottom: 14px;
					left: 13px;
					position: absolute;
				}
			}
		}

		.event-description {
			height: auto;
			font-size: 13px;
		}
	}
}

@media only screen and (min-width: 576px) and (max-width: 1023px) {
	.card.event-details {
		position: relative;
		.details-header {
			.header-wrap {
				display: block;

				.details-actions {
					bottom: 14px;
					left: 13px;
					position: absolute;
				}
			}
		}

		.event-description {
			height: auto;
			font-size: 13px;
		}
	}
}
</style>
