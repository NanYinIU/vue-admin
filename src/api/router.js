import request from '@/utils/request'

export function getRouter(params) {
  return request({
    url: '/api/routes',
    method: 'get',
    params: params
  })
}
