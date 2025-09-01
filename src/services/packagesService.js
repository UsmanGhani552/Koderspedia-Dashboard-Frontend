// src/services/packagesService.js
import axiosInstance from '../api/axios';

const PackagesService = {
  getAll: () => axiosInstance.get('/packages'),

  create: (formData) => {
    const data = new FormData();

    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('category_id', formData.category_id);
    data.append('client_id', formData.client_id);
    data.append('price', formData.price);
    data.append('additional_notes', formData.additional_notes);
    if (formData.document) {
      data.append('document', formData.document);
      
    }

    // Append deliverables as deliverables[0][name], etc.
    formData.deliverables.forEach((item, index) => {
      data.append(`deliverables[${index}][name]`, item.value);
    });

    return axiosInstance.post('/packages/store', data);
  },

  update: (id, formData) => {
    const data = new FormData();

    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('category_id', formData.category_id);
    data.append('price', formData.price);
    data.append('additional_notes', formData.additional_notes);
    if (formData.document) {
      data.append('document', formData.document);
    }

    // formData.deliverables.forEach((item, index) => {
    //   data.append(`deliverables[${index}][name]`, item.value);
    // });

    return axiosInstance.post(`/packages/update/${id}`, data); // POST if Laravel doesn't accept PUT with multipart
  },

  delete: (id) => axiosInstance.delete(`/packages/delete/${id}`),

  getCategories: () => axiosInstance.get('/categories'),

  getAssignedPackages: (clientId) => axiosInstance.get(`/clients/assigned-packages/${clientId}`),

  assignPackage: (packageId) => axiosInstance.post(`/packages/assign-package/${packageId}`)
};

export default PackagesService;
