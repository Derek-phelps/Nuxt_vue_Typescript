import { GetterTree, ActionTree, MutationTree } from 'vuex'

export const state = () => ({
	modal: '',
	initalLoad: true,
	favoritesFeed: false,
	calendar_filters: false,
})

export type RootState = {
	modal: any
	initalLoad: boolean
	favoritesFeed: boolean
	calendar_filters: any
}

export const getters: GetterTree<RootState, RootState> = {
	modal(state) {
		return state.modal
	},
	initalLoad(state) {
		return state.initalLoad
	},
	favoritesFeed(state) {
		return state.favoritesFeed
	},
	calendar_filters(state) {
		return state.calendar_filters
	},
}

export const mutations: MutationTree<RootState> = {
	initalLoad(state, v: boolean) {
		state.initalLoad = v
	},
	modal(state, payload: any) {
		state.modal = payload
	},
	favoritesFeed(state, payload: boolean) {
		state.favoritesFeed = payload
	},
	calendar_filters(state, payload: any) {
		state.calendar_filters = payload
	},
}

export const actions: ActionTree<RootState, RootState> = {}
