<script lang="ts">
import ClubEvent from '@includes/models/ClubEvent'
import ClubReservation from '@includes/models/ClubReservation'
import { Context } from '@nuxt/types'
import { Component } from 'nuxt-property-decorator'

@Component
export default class PageEventsSingle extends ClubEvent.Mixin {
	club_reservation!: ClubReservation.Data

	get form_status() {
		return this.club_event.has_online_reservation && this.club_event_is_future
	}

	asyncData({ store, params }: Context) {
		const eventID = params.id
		return store
			.dispatch('events/fetch_single', eventID)
			.then((data) => {
				const club_event = ClubEvent.create(data)
				const club_reservation = ClubReservation.create({ event: club_event })

				return {
					club_event,
					club_reservation,
				}
			})
			.catch((err) => {
				console.error('Failed to get event', err)
			})
	}

	openFlyer() {
		this.$modal.open({
			is: 'event-flyer-modal',
			event: this.club_event,
		})
	}
}
</script>

<template>
	<page
		class="events-single"
		:class="{ 'no-flyer': !club_event.flyer, 'no-form': !form_status }"
	>
		<div v-if="club_event.id" class="page-inner">
			<nuxt-link class="back" to="/">
				<form-button class="flat no-border">
					<span>
						<i class="far fa-chevron-left"></i>
						Back to Calendar
					</span>
				</form-button>
			</nuxt-link>

			<panel class="event-details">
				<event-details :event="club_event" />

				<club-media
					v-if="club_event.flyer"
					class="mobile-event-banner"
					:media="club_event.flyer"
					@click="openFlyer"
				/>
			</panel>

			<div v-if="club_event.flyer" class="event-banner" @click="openFlyer">
				<club-media :media="club_event.flyer" />
			</div>
		</div>
		<template v-else>
			<div class="spinner">Loading...</div>
		</template>
	</page>
</template>

<style lang="scss" scoped>
@import '@sassy';

$tablet-width: 1100px;
$mobile-width: 876px;

.reservation-form::v-deep {
	.form-input {
		background-color: transparent;
		border: none;

		label {
			color: white;
		}

		.input-area {
			background-color: white;
		}
	}
}

.panel.event-details::v-deep {
	.event-details .event-image {
		width: 75px !important;
		height: 75px !important;
	}

	.panel-body {
		@include flex(column);

		overflow: hidden;
		height: 100%;

		@include tablet($tablet-width) {
			display: block;
			overflow: auto;
			padding-right: 14px;
			border-radius: $border-radius;

			@media screen and (max-width: $mobile-width) {
				padding-right: 0px;
			}
		}
	}
}

.page.events-single {
	@include flex(column, flex-start, center);

	// Default Styles
	.page-inner {
		display: grid;
		grid-template: auto auto/minmax(auto, 600px) minmax(auto, 510px);
		align-items: start;
		column-gap: 1em;

		// width: fit-content;
		// max-width: 1000px;
		height: 100%;

		overflow: hidden;

		.back {
			justify-self: end;
			flex-shrink: 0;

			margin-bottom: -$border-radius;

			.form-button {
				@include glass-it(rgba(#000, 0.1));
			}

			span {
				@include flex(row, center, center);
				color: white;
				text-decoration: none;

				i {
					@include flex(column, center, center);
					margin-right: 1em;
					color: white;
					font-size: 1.25em;

					border-radius: 100%;
				}
			}

			@include tablet($tablet-width) {
				align-self: flex-end;
			}
		}

		.panel.event-details {
			flex: 1;
			padding: 25px;

			.event-details {
				width: 100%;
				padding: 1em;
				padding-bottom: 0.5em;
				overflow: hidden;
			}

			.mobile-event-banner {
				display: none;
				width: 100%;

				margin-top: 1em;

				border-radius: $border-radius;

				@include tablet($tablet-width) {
					display: block;
				}
			}

			.reservation-form {
				min-height: 150px;
				margin-top: 1em;

				&.event-closed {
					@include flex(row, center, center);
				}
			}

			@include tablet($tablet-width) {
				padding: 14px 12px;
				max-height: none;
			}
		}

		.form-button.reserve {
			width: 100%;
		}

		.event-banner {
			width: fit-content;
			height: 100%;
			overflow: hidden;

			.club-media {
				max-width: 100%;
				max-height: 100%;
				border-radius: $border-radius;
				object-fit: contain;
				object-position: center;
			}

			@include tablet($tablet-width) {
				display: none;
			}
		}

		@include tablet($tablet-width) {
			@include flex(column);
			max-width: 100%;
			border-radius: $border-radius;
		}
	}

	// Positioning
	.back {
		grid-area: 1 / 1 / 1 / 1;
	}

	.panel.event-details {
		grid-area: 2 / 1 / 2 / 1;
	}

	.event-banner {
		grid-area: 2 / 2 / 2 / 2;
	}

	// Animations
	@keyframes flyup {
		from {
			top: 50%;
			opacity: 0;
		}
		to {
			top: 0px;
			opacity: 1;
		}
	}

	.back,
	.panel.event-details,
	.event-banner {
		position: relative;
		top: 50%;

		opacity: 0;
		animation: flyup 1s forwards;
		animation-delay: 0.25s;
		animation-fill-mode: forwards;
	}

	.event-banner {
		animation-delay: 0.75s;
		animation-duration: 2s;
	}

	// Alternate Styles
	&.no-flyer {
		.page-inner {
			grid-template: auto 1fr / auto;
			max-width: 666px;
		}

		@include tablet($tablet-width) {
			align-items: center;
		}
	}

	&.no-form {
		.panel.event-details {
			height: fit-content;

			.card.event-details {
				overflow: hidden;

				@media screen and (min-width: $tablet-width) {
					height: 100%;
				}
			}
		}

		.panel.event-details .card.event-details::v-deep {
			.event-description {
				max-height: none;
			}
		}
	}

	// Page Responsive Styles
	@include tablet($tablet-width) {
		@include flex(column);
		padding: 10px;
	}
}
</style>
