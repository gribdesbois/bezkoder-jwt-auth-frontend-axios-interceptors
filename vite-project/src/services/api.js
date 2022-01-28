/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import axios from 'axios'
import TokenService from './token.service'

const instance = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

instance.interceptors.request.use(
  (config) => {
    const token = TokenService.getLocalAccessToken()
    if (token) {
      config.headers['x-access-token'] = token
    }
    return config;
  },
  (error) => Promise.reject(error),
)

instance.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalConfig = err.config
    if (originalConfig.url !== '/auth/signin' && err.response) {
      // Access Token was expired
      if (err.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true
        try {
          const rs = await instance.post('/auth/refreshToken', {
            refreshToken: TokenService.getLocalAccessToken(),
          })

          const { accessToken } = rs.data
          TokenService.updateLocalAccessToken(accessToken)

          return instance(originalConfig)
        } catch (_error) {
          return Promise.reject(_error)
        }
      }
    }
    return Promise.reject(err)
  },
)

export default instance
