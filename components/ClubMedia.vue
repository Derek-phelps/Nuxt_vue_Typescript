<script lang="ts">
import { Vue, Component, PropSync, Prop } from 'nuxt-property-decorator'
import CMedia from '@includes/models/ClubMedia'

@Component
export default class ClubMedia extends CMedia.Mixin {
	@PropSync('media', { type: Object, default: CMedia.create() })
	club_media!: CMedia.Data

	@Prop({ type: String, default: 'full_size' })
	size!: string
}
</script>

<template>
	<img
		v-if="club_media && club_media.url"
		:src="club_media.url[size]"
		:alt="club_media.name"
		class="club-media"
	/>
</template>

<style lang="scss" scoped>
@import '@sassy';

.club-media {
	display: block;
}
</style>
