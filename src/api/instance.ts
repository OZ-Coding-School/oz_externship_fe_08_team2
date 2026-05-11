import axios from 'axios'
import { setupInterceptors } from './interceptors'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzc4NTc3NzM0LCJpYXQiOjE3Nzg0OTEzMzQsImp0aSI6IjQxYTFiYzQwNWMzZjQ0NjA4YzdlZGJiNzRhNDVkZDUxIiwidXNlcl9pZCI6Mn0.8i9cFLhXxv0_h0QyxCxsB5hv-b7sCxlKUhaC4EGsHYw`,
  },
  withCredentials: true,
})

setupInterceptors(api)

export default api
