<script lang="ts">
import ClubReservation from '@includes/models/ClubReservation'
import { Vue, Component, InjectReactive, Getter } from 'nuxt-property-decorator'

@Component
export default class ReservationStepConfirm extends ClubReservation.Mixin {
	@Getter('auth/user') user!: any

	@InjectReactive({
		from: 'reservation',
		default: () => ClubReservation.create(),
	})
	club_reservation!: ClubReservation.Data

	get host_answers() {
		return this.club_reservation.form_answers.filter(
			(f: any) => f.is_per_attendee
		)
	}

	get reservation_answers() {
		return this.club_reservation.form_answers.filter(
			(f: any) => !f.is_per_attendee
		)
	}

	mounted() {
		console.log(this.club_event)
	}
}
</script>

<template>
	<div class="step-page step-confirm">
		<h2 class="question">Please confirm your reservation details ...</h2>

		<div class="divider" />

		<div class="answers">
			<div class="reservation-details">
				<section class="event-details">
					<div class="event-title">{{ club_reservation.event.title }}</div>

					<event-datetime :club_event="club_event" />

					<div class="reservation-party-size">
						Party of {{ club_reservation.guests.length + 1 }}
					</div>
				</section>

				<section v-if="reservation_answers.length">
					<divider-title>Reservation</divider-title>
					<dynamic-form
						v-model="reservation_answers"
						:questions="club_reservation_questions('host')"
						readonly
					/>
				</section>

				<section v-if="club_reservation.guests.length || host_answers.length">
					<divider-title>Guests</divider-title>
					<div class="reservation-guest-list">
						<div v-if="host_answers.length" class="reservation-guest">
							<reservation-guest-name :guest="user" />
							<dynamic-form
								v-model="host_answers"
								:questions="club_reservation_questions('guests')"
								readonly
							/>
						</div>

						<template v-for="(guest, i) in club_reservation.guests">
							<div :key="i" class="reservation-guest">
								<reservation-guest-name :guest="guest" />
								<dynamic-form
									v-if="guest.form_answers.length"
									v-model="guest.form_answers"
									:questions="club_reservation_questions('guests')"
									readonly
								/>
							</div>
						</template>
					</div>
				</section>
			</div>

			<form-button class="ghost confirm" @click="$emit('next')">
				Confirm Reservation
			</form-button>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@import '@sassy';

.step-page.step-confirm {
	.question {
		@include below-desktop {
			font-size: 1em;
		}
	}

	.answers {
		@include flex(column);
		text-align: center;

		.reservation-details {
			@include flex(column, flex-start, center);

			--event-datetime-dot-color: white;
			font-weight: bolder;

			& > section {
				width: 100%;
				@include vertical-list-item;
			}

			.divider-title {
				margin-bottom: 1em;
			}

			section.event-details {
				@include flex(column, flex-start, center);

				.event-title,
				.event-datetime,
				.reservation-party-size {
					font-size: 1.25em;

					@include below-desktop {
						font-size: 1em;
					}
				}
			}

			.reservation-guest-list {
				.reservation-guest {
					@include vertical-list-item;

					.reservation-guest-name {
						font-size: 1.25em;
						margin-bottom: 0.5em;
					}
				}
			}

			@include above-tablet {
				padding-right: 1em;
				max-height: 400px;
				overflow: hidden;
				overflow-y: auto;
			}
		}

		.form-button.confirm {
			width: 100%;
			margin-top: 2em;
			flex-shrink: 0;
		}

		@include below-tablet {
			overflow: hidden;
			overflow-y: auto;
		}
	}
} // step 1 page
</style>
