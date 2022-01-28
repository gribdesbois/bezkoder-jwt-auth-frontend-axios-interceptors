/* eslint-disable class-methods-use-this */
import api from './api'

class UserService {
  getPublicContent = () => api.get('/test/all')

  getUserBoard = () => api.get('/test/user')

  getModeratorBoard = () => api.get('/test/mod')

  getAdminBoard = () => api.get('/test/admin')
}

export default new UserService()
