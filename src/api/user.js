import request from '@/utils/request'

export function login(data) {
  return request({
    url: 'http://localhost:8080/login/toLogin',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: 'http://localhost:8080/login/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}
