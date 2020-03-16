import request from '@/utils/request'

export function fetchUnits(query) {
  return request({
    url: '/api/units',
    method: 'get',
    params: query
  })
}

export function fetchUnitList(query) {
  return request({
    url: '/api/unit/list',
    method: 'get',
    params: query
  })
}
