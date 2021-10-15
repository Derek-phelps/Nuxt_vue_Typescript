import _ from 'lodash'
import Vue from 'vue'
import { GetterTree, ActionTree, MutationTree } from 'vuex'
import { Action, Component, Watch } from 'nuxt-property-decorator'
import ClubReservation from '@includes/models/ClubReservation'
import ClubEvent from '@includes/models/ClubEvent'
import { RootState } from './index'
export interface APIListResult {
	count: number
	next: string
	previous: string
	data?: any[]
	results?: any[]
}

export const state = () => ({
	items: [],
})

export type ReservationsState = {
	items: any[]
}

// getter
export const getters: GetterTree<ReservationsState, RootState> = {
	items(state) {
		return state.items
	},
}

export type ReservationSetMutation = (items: any | any[]) => void

// mutation
export const mutations: MutationTree<ReservationsState> = {
	set(state, reservations: any[]) {
		state.items = reservations
	},
	add(state, reservations: any | any[]) {
		const items = state.items

		const addItems = (e: any[]) =>
			e.forEach((e) => {
				if (!e.id) return
				const existing = items.findIndex((i) => i.id === e.id)

				if (existing > -1) {
					items[existing] = Object.assign(items[existing], e)
				} else items.push(e)
			})

		if (Array.isArray(reservations)) {
			addItems(reservations)
		} else if (typeof reservations === 'object') {
			addItems([reservations])
		}

		state.items = _.uniqBy(items, 'id')
	},
}

export type ReservationFetchPayload = {
	filters?: any
	replace?: boolean
}
export type ReservationsFetchAction = (
	fetchOptions?: ReservationFetchPayload
) => Promise<any>
export type ReservationsFetchSingleAction = (
	reservationId: number
) => Promise<any>
export type ReservationsCreateAction = (
	reservationData?: ClubReservation.Data
) => Promise<ClubReservation.Data>
export type ReservationCancelAction = (reservationId?: number) => Promise<any>

// action
export const actions: ActionTree<ReservationsState, RootState> = {
	fetch(ctx, payload: ReservationFetchPayload = { replace: true }) {
		const replace = payload.replace
		const params: any = {}
		Object.assign(params, payload.filters)

		let key: keyof any
		for (key in params) {
			if (!params[key]) delete params[key]
		}

		if (params.start_date) {
			const start_date = this.$moment(params.start_date).format('YYYY-MM-DD')

			params.start_date = start_date
			if (!params.end_date) params.end_date = start_date
		}

		params.ordering = 'start_date'
		return this.$api.get('reservations/', { params }).then((res) => {
			const data = res.data

			if (replace) ctx.commit('set', data.data)
			else ctx.commit('add', data.data)
			return data
		})
	},

	fetch_single(ctx, reservationsId: number) {
		const existing = ctx.state.items[reservationsId]
		return new Promise((resolve, reject) => {
			if (existing) resolve(ctx.state.items[reservationsId])

			this.$api
				.$get(`reservations/${reservationsId}/`)
				.then((data) => {
					ctx.commit('add', data)
					resolve(data)

					if (data.location) {
						ctx.commit('locations/add', data.location, { root: true })
					}
				})
				.catch(reject)
		})
	},

	create(ctx, reservationData: ClubReservation.Data) {
		return this.$api.$post('reservations/', reservationData).then((data) => {
			ctx.commit('add', data)
			return data
		})
	},

	delete_reservation(ctx, reservationId: number) {
		return new Promise((resolve, reject) => {
			this.$api
				.$delete(`reservations/${reservationId}/cancel/`)
				.then((data) => {
					ctx.commit('add', data)
					resolve(data)
				})
				.catch(reject)
		})
	},
}

/**
 * moved to @includes/models/ClubReservations
 * @deprecated v0.6
 */
@Component
export class ClubReservations extends ClubEvent.Mixin {
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
