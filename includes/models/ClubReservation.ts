import { ReservationsCreateAction } from '@store/reservations'
import { Watch } from 'nuxt-property-decorator'
import Component from 'vue-class-component'
import { Action } from 'vuex-class'
import ClubEvent from './ClubEvent'

export module ClubReservation {
	export interface Data {
		event: ClubEvent.Data
		time_slot: ClubEvent.TimeSlot[]
		guests: any[]
		form_answers: any[]
		tickets: any[]
	}

	export const Default = {
		event: ClubEvent.create(),
		time_slot: null,
		guests: [],
		form_answers: [],
		tickets: [],
	}

	export function create(
		data?: Partial<ClubReservation.Data>
	): ClubReservation.Data {
		return Object.assign(ClubReservation.Default, data)
	}

	@Component
	export class Mixin extends ClubEvent.Mixin {
		@Action('reservations/create') $createReservation!: ReservationsCreateAction

		club_reservation!: ClubReservation.Data

		club_reservation_questions(t?: 'guests' | 'host'): any[] {
			const event = this.club_event
			if (!event || !event.form) return []
			const fields: any[] = (event.form as any).fields
			return fields.filter((f) =>
				t === 'guests' ? f.is_per_attendee : !f.is_per_attendee
			)
		}

		@Watch('club_reservation.event', { immediate: true })
		mapClubEvent(event: ClubEvent.Data) {
			this.club_event = event
		}
	}
}

export default ClubReservation
