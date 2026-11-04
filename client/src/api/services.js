import api from "./client";

export const booksApi = {
  list: () => api.get("/books").then(r => r.data),
  create: (data) => api.post("/books", data).then(r => r.data),
  update: (id, data) => api.put(`/books/${encodeURIComponent(id)}`, data).then(r => r.data),
  remove: (id) => api.delete(`/books/${encodeURIComponent(id)}`).then(r => r.data)
};

export const studentsApi = {
  list: () => api.get("/library/students").then(r => r.data),
  registrar: (params = {}) => api.get("/registrar/students", { params }).then(r => r.data)
};

export const facultyApi = {
  list: () => api.get("/library/faculty").then(r => r.data)
};

export const loansApi = {
  list: () => api.get("/loans").then(r => r.data),
  create: (data) => api.post("/loans", data).then(r => r.data),
  update: (id, data) => api.put(`/loans/${encodeURIComponent(id)}`, data).then(r => r.data),
  remove: (id) => api.delete(`/loans/${encodeURIComponent(id)}`).then(r => r.data)
};

export const reservationsApi = {
  list: () => api.get("/reservations").then(r => r.data),
  create: (data) => api.post("/reservations", data).then(r => r.data),
  remove: (id) => api.delete(`/reservations/${encodeURIComponent(id)}`).then(r => r.data)
};

export const finesApi = {
  list: (params = {}) => api.get("/fines", { params }).then(r => r.data),
  create: (data) => api.post("/fines", data).then(r => r.data),
  update: (id, data) => api.put(`/fines/${encodeURIComponent(id)}`, data).then(r => r.data)
};

export const paymentsApi = {
  list: () => api.get("/finance/payments").then(r => r.data),
  create: (data) => api.post("/finance/payments", data).then(r => r.data)
};

export const authApi = {
  register: (data) => api.post("/auth/register", data).then(r => r.data),
  login: (data) => api.post("/auth/login", data).then(r => r.data)
};