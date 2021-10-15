<script lang="ts">
import { Vue, Component, Getter } from 'nuxt-property-decorator'

@Component({
	middleware: ['auth'],
})
export default class LayoutDefault extends Vue {
	@Getter('auth/user') user!: any

	modal: any = false

	get location_name() {
		if (!this.user || !this.user.location) return false
		const location_name: string = this.user.location.title
		return 'location-' + location_name.toLowerCase().replaceAll(' ', '-')
	}

	mounted() {
		this.$modal.$on('open', () => {
			this.modal = this.$modal.current
		})

		this.$modal.$on('closed', () => {
			this.modal = false
		})
	}
}
</script>

<template>
	<layout class="layout-default" :class="location_name">
		<loading-screen />

		<template v-if="typeof modal === 'string'">
			<component :is="modal" class="show" />
		</template>
		<template v-else-if="typeof modal === 'object' && modal.is">
			<component :is="modal.is" v-bind="modal" class="show" />
		</template>

		<div class="notifications-container">
			<template v-for="item in $notify.items">
				<notification v-if="!item.is" :key="item.id" :item="item" />
				<component :is="item.is" v-else :key="item.id" :item="item" />
			</template>
		</div>

		<header class="layout-header">
			<NavigationMain />
		</header>

		<div class="layout-body">
			<Nuxt />
		</div>
	</layout>
</template>

<style lang="scss" scoped>
@import '@sassy';

.layout-default {
	@include flex(column);

	position: relative;
	z-index: 1;

	background-image: url('/assets/images/background3.jpg');
	background-size: cover;

	&.location-glassy {
		background-image: url('/assets/images/location-background-glassy');
	}

	&.location-keowee-falls {
		background-image: url('/assets/images/location-background-keowee-falls');
	}

	&.location-keowee-springs {
		background-image: url('/assets/images/location-background-keowee-springs');
	}

	&.location-keowee-vineyards {
		background-image: url('/assets/images/location-background-keowee-vineyards');
	}

	&.location-mountian-park {
		background-image: url('/assets/images/location-background-mountian-park');
	}

	&.location-valley {
		background-image: url('/assets/images/location-background-valley');
	}

	&.location-walnut-cove {
		background-image: url('/assets/images/location-background-walnut-cove');
	}

	&::after {
		content: '';
		width: 100%;
		height: 100%;

		position: absolute;
		left: 0px;
		top: 0px;
		z-index: 0;

		pointer-events: none;

		@include glass-it(rgba(#7b98ac, 0.25), 2px);
	}

	.notifications-container {
		display: grid;
		grid-auto-flow: row;
		row-gap: 0.5em;
		align-content: start;

		height: 0%;
		// width: 0%;

		position: fixed;
		right: 1em;
		top: 1em;
		z-index: 50;

		overflow: visible;
	}

	.layout-header,
	.layout-body {
		width: 100%;
	}

	.layout-header {
		z-index: 2;
	}

	.layout-body {
		flex: 1;
		overflow: hidden;
		z-index: 1;
	}

	@media screen and (max-width: 750px) {
		// font-size: small;
	}
}

@include mobile {
	* {
		--scrollbar-size: 0px;
	}
}
</style>
