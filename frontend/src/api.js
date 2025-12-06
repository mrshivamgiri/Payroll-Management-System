import axios from 'axios'

const API_URL = 'http://localhost:8000'

const api = axios.create({
  baseURL: API_URL,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const authAPI = {
  signup: (email, password, role) =>
    api.post('/auth/signup', { email, password, role }),
  login: (email, password) =>
    api.post('/auth/login', new URLSearchParams({ username: email, password }), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    }),
  me: () => api.get('/auth/me'),
}

export const salaryAPI = {
  create: (user_id, month, base_salary, bonus, deductions) =>
    api.post('/salary-slip', { user_id, month, base_salary, bonus, deductions }),
  update: (id, data) => api.put(`/salary-slip/${id}`, data),
  list: () => api.get('/salary-slip'),
}

export const expenseAPI = {
  create: (amount, description) =>
    api.post('/expense', { amount, description }),
  list: () => api.get('/expense'),
}

export default api
