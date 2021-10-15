<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'

@Component
export default class EventRegisterModal extends Vue {}
</script>

<template>
	<modal class="event-register-modal">
		<h5>TEST</h5>
	</modal>
</template>

<style lang="scss" scoped>
@import '@sassy';

.modal::v-deep {
	.modal-body {
		min-width: 400px;
		min-height: 400px;
	}
}
</style>
