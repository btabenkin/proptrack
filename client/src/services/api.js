import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

export const propertiesApi = {
  getAll: () => api.get('/properties'),
  create: (data) => api.post('/properties', data),
  update: (id, data) => api.put(`/properties/${id}`, data),
  remove: (id) => api.delete(`/properties/${id}`),
  getRentEstimate: (id) => api.get(`/properties/${id}/rent-estimate`),
};

export const tenantsApi = {
  getAll: () => api.get('/tenants'),
  create: (data) => api.post('/tenants', data),
  update: (id, data) => api.put(`/tenants/${id}`, data),
  remove: (id) => api.delete(`/tenants/${id}`),
};

export const rentPaymentsApi = {
  getAll: () => api.get('/rent-payments'),
  create: (data) => api.post('/rent-payments', data),
  update: (id, data) => api.put(`/rent-payments/${id}`, data),
  remove: (id) => api.delete(`/rent-payments/${id}`),
};

export const expensesApi = {
  getAll: () => api.get('/expenses'),
  create: (data) => api.post('/expenses', data),
  update: (id, data) => api.put(`/expenses/${id}`, data),
  remove: (id) => api.delete(`/expenses/${id}`),
};

export const maintenanceApi = {
  getAll: () => api.get('/maintenance'),
  create: (data) => api.post('/maintenance', data),
  update: (id, data) => api.put(`/maintenance/${id}`, data),
  remove: (id) => api.delete(`/maintenance/${id}`),
};
