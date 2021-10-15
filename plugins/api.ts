import { Plugin } from '@nuxt/types'
import { NuxtAxiosInstance } from '@nuxtjs/axios'

declare module 'vue/types/vue' {
	interface Vue {
		$api: NuxtAxiosInstance
	}
}

declare module '@nuxt/types' {
	interface NuxtAppOptions {
		$api: NuxtAxiosInstance
	}

	interface Context {
		$api: NuxtAxiosInstance
	}
}

declare module 'vuex/types/index' {
	interface Store<S> {
		$api: NuxtAxiosInstance
	}
}

const SSO_DEV_CREDS = {
	time: '1617902271323',
	vendor: '201309190795',
	user_id: 'D00594B',
	target_page: '',
	value:
		'AOKvlGBTo29HmAmVpEf/IR/rZwsqSlEPtM3VxAjBFkUis/PTZ2755/HyIgzJKd91RXDw0ub4olb7d8tCynsBOE2Dmkfvw3tMSOXQk0v7UzQHSjUZQhbuQCtKU+b+Iv7OHTNSCmURvozh2ww0zCoaQjfZWrMmOwIksCDATWnrdwc=',
}

const API: Plugin = (context, inject) => {
	const api = context.$axios.create({
		baseURL: 'https://clublisi-stg.herokuapp.com/api/v1',
	})

	// await api
	// 	.$post('/members/auth/', SSO_DEV_CREDS)
	// 	.then((user) => {
	// 		localStorage.setItem('access', user.token.access)
	// 		localStorage.setItem('refresh', user.token.refresh)

	// 		api.defaults.headers.common.Authorization = `Bearer ${user.token.access}`
	// 	})
	// 	.catch(console.error)

	inject('api', api)
}

export default API
