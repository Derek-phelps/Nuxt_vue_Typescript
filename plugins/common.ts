import '@nuxtjs/types'

declare module '@nuxt/types/app' {
	interface NuxtError {
		title?: string
	}
}
