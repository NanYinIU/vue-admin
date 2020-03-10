import request from '@/utils/request'

export function fetchPermissionList(query) {
  return request({
    url: '/api/permissions',
    method: 'get',
    params: query
  })
}