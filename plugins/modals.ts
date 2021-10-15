import Vue from 'vue'
import { NuxtAppOptions, Plugin } from '@nuxt/types'
import Component from 'vue-class-component'

const debug = require('debug')('app:plugin:modal')

@Component
export class ModalEvents extends Vue {
	current: any = false

	set(modal: any) {
		this.current = modal
		return this
	}

	open(modal: any) {
		this.set(modal)
		this.$emit('open', modal)
	}

	close() {
		this.$emit('close')
		return new Promise((resolve) => {
			const closedTimer = setTimeout(() => {
				this.$emit('closed')
				resolve(this.set(false))
			}, 5000)

			this.$once('closed', () => {
				clearTimeout(closedTimer)
				resolve(this.set(false))
			})
		})
	}
}

declare module 'vue/types/vue' {
	interface Vue {
		$modal: ModalEvents
	}
}

declare module 'vuex/types/index' {
	interface Store<S> {
		$modal: ModalEvents
	}
}

const ModalPlugin: Plugin = (ctx, inject) => {
	inject('modal', new ModalEvents(ctx.app))
}

export default ModalPlugin
