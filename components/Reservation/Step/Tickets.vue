<script lang="ts">
import { Vue, Component, InjectReactive } from 'nuxt-property-decorator'

@Component
export default class ReservationStepTickets extends Vue {
	@InjectReactive({ from: 'reservation', default: () => ({}) })
	reservation!: any

	get tickets() {
		if (!this.reservation || !this.reservation.event) return []
		const tickets: any[] = this.reservation.event.event_tickets
		return !tickets ? [] : tickets
	}

	created() {
		if (!this.reservation.tickets.length) {
			this.reservation.tickets = this.tickets.map((t) => ({
				event_ticket: t.id,
				quantity: '',
			}))
		}
	}
}
</script>

<template>
	<div class="step-page step-5">
		<div class="question">
			<h2>Choose from the following ...</h2>
		</div>

		<div class="divider" />

		<div class="answers">
			<div class="reservation-tickets">
				<div
					v-for="(ticket, i) in tickets"
					:key="ticket.id"
					class="reservation-ticket"
				>
					<span class="ticket-title">{{ ticket.ticket.title }}</span>

					<form-input
						v-model="reservation.tickets[i].quantity"
						:label="ticket.ticket.subtitle"
						placeholder="How many?"
						class="expanded flat"
						type="number"
						:min="0"
						:max="ticket.maximum_purchase"
					/>

					<img
						v-if="ticket.ticket.media"
						class="ticket-media"
						:src="ticket.ticket.media.url"
					/>
				</div>
			</div>

			<div class="step-actions">
				<form-button class="ghost" @click="$emit('next')">
					<span>Next</span>
				</form-button>

				<form-button class="ghost no-border skip" @click="$emit('next')">
					<span>Skip</span>
				</form-button>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@import '@sassy';

.step-page.step-5 {
	.answers {
		@include flex(column, flex-start, center);
		// min-width: 400px;

		.reservation-tickets {
			@include flex(column);
			// width: 100%;

			.reservation-ticket {
				display: grid;
				width: 100%;

				column-gap: 1em;
				row-gap: 0.25em;
				grid-template-columns: auto auto;
				grid-template-rows: auto auto;
				grid-template-areas:
					'media title'
					'media input';

				@include vertical-list-item;

				.ticket-media {
					width: 75px;
					height: 75px;

					grid-area: media;

					object-fit: fill;
					object-position: center;
					border-radius: $border-radius;
					opacity: 0.5;
					transition: opacity 0.25s;
				}

				.ticket-title {
					grid-area: title;
					font-size: 1.25em;
				}

				.form-input {
					padding: 0px;
					grid-area: input;
					&::v-deep .input-label {
						font-weight: normal;
					}
				}

				.form-input:focus-within + .ticket-media,
				.form-input.has-value + .ticket-media {
					opacity: 1;
				}
			}
		}
	}
} // step 1 page
</style>
