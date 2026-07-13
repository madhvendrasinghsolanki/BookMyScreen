import axios from 'axios'
import { API_BASE_URL } from '../utils/constants'

const client = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
})

// Attach the JWT (stored by AuthContext) to every outgoing request.
client.interceptors.request.use((requestConfig) => {
  const token = window.localStorage.getItem('bms-token')
  if (token) {
    requestConfig.headers = requestConfig.headers || {}
    requestConfig.headers.Authorization = `Bearer ${token}`
  }
  return requestConfig
})

// If the token is missing/expired/invalid, the backend now returns 401.
// Clear the stale session so the UI falls back to a logged-out state
// instead of silently failing every subsequent request.
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.localStorage.removeItem('bms-token')
      window.localStorage.removeItem('bms-user')
    }
    return Promise.reject(error)
  }
)

export const api = {
  getMovies: () => client.get('/movies'),
  getTheaters: () => client.get('/theaters'),
  getShows: (params = {}) => client.get('/shows', { params }),
  searchMoviesLive: (query) => client.get('/movies/search/live', { params: { query } }),
  getLiveMovieDetails: (imdbId) => client.get(`/movies/search/live/${imdbId}`),
  login: (payload) => client.post('/auth/login', payload),
  register: (payload) => client.post('/auth/register', payload),
  updateProfile: (userId, payload) => client.patch(`/users/${userId}`, payload),
  createBooking: (payload) => client.post('/bookings', payload),
  getBookings: (userId) => client.get('/bookings', { params: { userId } }),
  getWishlist: (userId) => client.get('/wishlist', { params: { userId } }),
  addWishlist: (payload) => client.post('/wishlist', payload),
  removeWishlist: (id) => client.delete(`/wishlist/${id}`),
  getAdminStats: () => client.get('/admin/stats'),
  getAdminUsers: () => client.get('/admin/users'),
  getAdminBookings: () => client.get('/admin/bookings'),
  createMovie: (payload) => client.post('/movies', payload),
  createTheater: (payload) => client.post('/theaters', payload),
  createShow: (payload) => client.post('/shows', payload),
}
