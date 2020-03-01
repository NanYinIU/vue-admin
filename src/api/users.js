import request from '@/utils/request'

export function fetchUserList(query) {
  return request({
    url: '/api/users',
    method: 'get',
    params: query
  })
}

export function fetchStandardSexItem(query) {
  return request({
    url: '/api/user/sex',
    method: 'get',
    params: query
  })
}
export function fetchStandardStatusItem(query) {
  return request({
    url: '/api/user/status',
    method: 'get',
    params: query
  })
}

export function createUser(data) {
  return request({
    url: '/api/user/',
    method: 'post',
    data
  })
}

export function updateUser(data, id) {
  return request({
    url: `/api/user/${id}`,
    method: 'put',
    data
  })
}

export function deleteUser(id) {
  return request({
    url: `/api/user/${id}`,
    method: 'delete'
  })
}

export function fetchUsername(name) {
  return request({
    url: '/api/user/name',
    method: 'get',
    params: name
  })
}

export function fetchArticle(id) {
  return request({
    url: '/vue-element-admin/article/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/vue-element-admin/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function createArticle(data) {
  return request({
    url: '/vue-element-admin/article/create',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: '/vue-element-admin/article/update',
    method: 'post',
    data
  })
}

