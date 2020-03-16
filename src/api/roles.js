import request from '@/utils/request'

export function fetchRoleList(query) {
  return request({
    url: '/api/roles',
    method: 'get',
    params: query
  })
}

export function createRole(data) {
  return request({
    url: '/api/role',
    method: 'post',
    data
  })
}

export function updateRole(data, id) {
  return request({
    url: `/api/role/${id}`,
    method: 'put',
    data
  })
}

export function deleteRole(id) {
  return request({
    url: `/api/role/${id}`,
    method: 'delete'
  })
}

export function fetchRoleUsers(params) {
  return request({
    url: '/api/role/users',
    method: 'get',
    params: params
  })
}

export function updateRoleUser(data) {
  return request({
    url: '/api/role/users',
    method: 'post',
    data
  })
}

export function fetchRolePermissions(params) {
  return request({
    url: '/api/role/permissions',
    method: 'get',
    params: params
  })
}

export function updateRolePermissions(data) {
  return request({
    url: '/api/role/permissions',
    method: 'post',
    data
  })
}
