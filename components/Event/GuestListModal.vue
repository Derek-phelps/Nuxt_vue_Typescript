<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'

@Component
export default class EventGuestListModal extends Vue {
	@Prop({ type: Array, required: true }) guests!: any[]

	getGuestName(guest: any) {
		if (guest.name) return guest.name
		else if (guest.member && typeof guest.member === 'object') {
			const member = guest.member
			return `${member.first_name} ${member.last_name}`
		}

		return 'Anonymous Guest'
	}
}
</script>

<template>
	<modal class="event-guest-list-modal">
		<h3 class="modal-title">Event Guests</h3>

		<div class="guest-list">
			<template v-for="(guest, i) in guests">
				<div :key="i" class="guest">
					{{ getGuestName(guest) }}
				</div>
			</template>
		</div>
	</modal>
</template>

<style lang="scss" scoped>
@import '@sassy';

.event-guest-list-modal::v-deep {
	.modal-body {
		width: 300px;
	}
}

.event-guest-list-modal {
	.modal-title {
		color: $color-primary;
		border-bottom: 1px solid $color-primary;
	}

	.guest-list {
		overflow: hidden;
		overflow-y: auto;

		.guest {
			padding: 0.5em;
			border-radius: $border-radius;

			&:nth-child(odd) {
				background-color: rgba($color-primary, 0.1);
			}
		}
	}
}
</style>
