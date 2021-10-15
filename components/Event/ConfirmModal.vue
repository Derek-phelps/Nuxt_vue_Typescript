<script lang="ts">
import { Vue, Component, Prop, Action } from 'nuxt-property-decorator'
import { ReservationCancelAction } from '@store/reservations'

@Component
export default class ReservationConfirmModal extends Vue {
	status = false
	@Prop({ type: Object, required: true }) reservation!: any
	@Action('reservations/delete_reservation')
	$cancelReservation!: ReservationCancelAction

	cancelReservation() {
		return this.$cancelReservation(this.reservation.id)
			.then((res) => {
				this.$store.commit('reservations/add', {
					...this.reservation,
					status: 'cancelled',
				})

				this.$notify.show({
					title: 'Cancellation complete.',
					type: 'success',
				})
			})
			.catch(() =>
				this.$notify.show({
					title: 'Failed Canceling Reservation',
					content:
						'We were not able to cancel your reservation. Please try again later or contact support.',
					type: 'alert',
				})
			)
			.finally(() => this.$modal.close())
	}
}
</script>

<template>
	<modal class="confirm-modal">
		<div class="confirm-content">
			<h3 class="confirm-text question">
				<span>Confirm cancellation?</span>
			</h3>
			<div class="confirm-button-set">
				<form-button class="flat" @click="cancelReservation">
					<span>Yes</span>
				</form-button>
				<form-button class="flat" @click="$modal.close()">
					<span>No</span>
				</form-button>
			</div>
		</div>
	</modal>
</template>

<style lang="scss" scoped>
@import '@sassy';

.modal::v-deep {
	.modal-body {
		width: 200px;
		height: auto;
	}
}

.confirm-content {
	text-align: center;
	padding: 15px;
	.confirm-body {
		min-height: 60px;
		display: flex;
		justify-content: center;
		align-items: center;
		.confirm-text {
			font-weight: 800;
		}
		.question {
			color: $that-peach-darker;
		}
		.succeed {
			color: #4bb543;
		}
	}
	.confirm-button-set {
		.form-button {
			padding: 0.5em 1em;
			@include horizontal-list-item(0.25em);
		}
		&:hover {
			transform: scale(0.99);
			z-index: 99999;
			position: relative;
		}
	}
}
</style>
