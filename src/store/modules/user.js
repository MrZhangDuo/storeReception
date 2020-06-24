import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // 用户登录
  login({ commit }, userInfo) {
    const { userAccount, userPass } = userInfo
    return new Promise((resolve, reject) => {
      // 请求 api/user里面的login方法去后台请求登录
      login({ userAccount: userAccount.trim(), userPass: userPass }).then(response => {
        const { data } = response
        // 设置 token，作为用户已登陆的前端标识，存在 cookie 中
        commit('SET_TOKEN', response.token)
        // setToken() 方法会把 token 保存到 cookie 里，很重要
        console.log('==============setCookie====================' + response.token)
        setToken(response.token)
        console.log('==============Getcookie====================' + getToken())
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 获取用户信息
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      // 请求获取权限
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) { // 由于mockjs 不支持自定义状态码只能这样hack
          reject('Verification failed, please Login again.')
        }

        const { roles, userName, userImg } = data
        // 验证返回的roles是否是一个非空数组 角色必须是非空数组
        if (!roles || roles.length <= 0) { // 如果是空数组就是普通用户
          commit('SET_ROLES', ['普通用户'])
        } else {
          commit('SET_ROLES', roles)
        }
        commit('SET_NAME', userName)
        commit('SET_AVATAR', userImg)
        // commit('SET_INTRODUCTION', introduction)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()

        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
