import Component from 'vue-class-component'
import Vue from 'vue'
import ClubMedia from './ClubMedia'

export module ClubEvent {
	export interface TimeSlot {
		available_seats: number
		capacity: number
		end_date: string
		id: number
		start_date: string
		title: string
	}

	export interface Data {
		available_spaces: number
		categories: any
		description: string
		end_date: string
		event_tickets: any[]
		flyer: ClubMedia.Data | null
		form: any
		has_online_reservation: boolean
		has_public_list: boolean
		has_waitlist: boolean
		id: number
		is_allday: boolean
		is_allowed_guests: boolean
		locations: any[]
		max_capacity: number
		max_per_reservation: number
		media: ClubMedia.Data | null
		min_per_reservation: number
		price: number
		purchase_cutoff_datetime: string
		snippet: string
		start_date: string
		status: string
		time_slots: ClubEvent.TimeSlot[]
		title: string
		total_reservations: number
	}

	export const Default = {
		available_spaces: 0,
		categories: [],
		description: '',
		end_date: new Date().toUTCString(),
		event_tickets: [],
		flyer: false,
		form: false,
		has_online_reservation: false,
		has_public_list: false,
		has_waitlist: false,
		id: 0,
		is_allday: false,
		is_allowed_guests: false,
		locations: [],
		max_capacity: 0,
		max_per_reservation: 0,
		media: false,
		min_per_reservation: 0,
		price: 0,
		purchase_cutoff_datetime: new Date().toUTCString(),
		snippet: '',
		start_date: new Date().toUTCString(),
		status: '',
		time_slots: [],
		title: '',
		total_reservations: 0,
	}

	export function create(data?: Partial<ClubEvent.Data>): ClubEvent.Data {
		return Object.assign(ClubEvent.Default, data)
	}

	@Component
	export class Mixin extends Vue {
		club_event!: ClubEvent.Data

		get club_event_start_moment() {
			return this.$moment(this.club_event.start_date)
		}

		get club_event_end_moment() {
			return this.$moment(this.club_event.end_date)
		}

		get club_event_is_future() {
			return this.$moment().isBefore(this.club_event.start_date)
		}
	}
}

export default ClubEvent
