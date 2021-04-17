import VuexPersistence from 'vuex-persist'
import * as types from './types'
import services from '@services'
import { Message } from 'element-ui'

const vuexLocal = new VuexPersistence({
  storage: window.localStorage
})

export default new Vuex.Store({
  state: {
    global: {
      user: null,
      permissionList: [],
      production: {
        sizeUnitList: []
      },
      breadList: []
    }
  },
  getters: {
    productionUnitListGetter(state) {
      return state.global.production.sizeUnitList
    },
    userGetter(state) {
      return state.global.user
    },
    permissionListGetter(state) {
      return state.global.permissionList
    },
    breadListGetter(state) {
      return state.global.breadList
    }
  },
  mutations: {
    [types.PRODUCTION_SIZE_UNIT](state, payload) {
      state.global.production.sizeUnitList = [...payload || []]
    },
    [types.SET_USER](state, payload) {
      state.global.user = payload
    },
    [types.USER_PERMISSION](state, payload) {
      state.global.permissionList = [...payload]
    },
    [types.SET_BREAD](state, payload) {
      state.global.breadList = [...payload]
    }
  },
  actions: {
    async fetchProductionSizeUnitList({ commit }) {
      try {
        const list = await services.productionService.getUnitList()
        commit(types.PRODUCTION_SIZE_UNIT, list)
      }catch(error) {
        console.log(error)
      }
    },
    async fetchUserPermissionList({ state, commit }) {
      try {
        const username = state.global.user.username
        const list = await services.userService.getPermissionList(username)
        commit(types.USER_PERMISSION, list)
      }catch(error) {
        console.log(error)
      }
    },
    fetchGlobalData({ dispatch }) {
      dispatch('fetchProductionSizeUnitList')
    },
    async login({ commit }, payload) {
      try {
        const result = await services.userService.login(payload)
        if(result) {
          commit(types.SET_USER, result)
          return Promise.resolve(result)
        }
      }catch(error) {
        Message.error(error.toString())
        return Promise.reject('')
      }
    },
    // eslint-disable-next-line
    logout({ commit }, payload) {
      commit(types.SET_USER, null)
      commit(types.USER_PERMISSION, [])
    },
    getUser({ state }) {
      const userId = state.global.user.objectId
      return services.userService.getUser(userId)
    },
    async updateUser({ dispatch, commit }, payload) {
      try {
        const result = await services.userService.updateUser(payload)
        if(result) {
          const result = await dispatch('getUser')
          commit(types.SET_USER, result)
        }
      }catch(error) {
        Message.warning(error)
      }
    },
    setBread({ commit }, payload) {
      commit(types.SET_BREAD, payload)
    }
  },
  plugins: [vuexLocal.plugin]
})
