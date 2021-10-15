import { Vue, Component } from 'nuxt-property-decorator'

export module ClubMedia {
	export interface Data {
		ext: string
		id: string | number
		name: string
		url: null | {
			full_size: string
			big: string
			medium: string
			small: string
		}
	}

	export const Default = {
		ext: '',
		id: 0,
		name: '',
		url: null,
	}

	export function create(data?: Partial<ClubMedia.Data>): ClubMedia.Data {
		return Object.assign(ClubMedia.Default, data)
	}

	@Component
	export class Mixin extends Vue {
		club_media?: ClubMedia.Data

		getClubMediaSrcSet(media: ClubMedia.Data) {
			if (!media.url) return ''
			const urls = media.url
			return [
				urls.small + ' 100w',
				urls.medium + ' 400w',
				urls.big + ' 700w',
			].join(', ')
		}
	}
}

export default ClubMedia
