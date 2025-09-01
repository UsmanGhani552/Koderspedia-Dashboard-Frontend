// src/services/invoicesService.js
import axiosInstance from '../api/axios';

const InvoiceService = {
  getAll: () => axiosInstance.get('/invoices'),

  create: async (formData) => {
    const response = await axiosInstance.post('/invoices/store', formData)
    return response;
  },
  update: async (id, formData) => {
    const response = await axiosInstance.post(`/invoices/update/${id}`, formData);
    return response; 
  },

  delete: (id) => axiosInstance.delete(`/invoices/delete/${id}`),

  getPaymentTypes: () => axiosInstance.get('invoices/get-payment-types'),

  getPaymentHistory: () => axiosInstance.get(`/invoices/get-payment-history`),

  getInvoiceByAssignment: (assignmentId) => axiosInstance.get(`/invoices/get-invoice-by-assignment/${assignmentId}`),

  getInvoice: (id) => axiosInstance.get(`/get-invoice/${id}`)
};

export default InvoiceService;
