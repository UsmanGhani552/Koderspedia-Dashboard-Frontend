// src/services/packagesService.js
import axiosInstance from '../api/axios';

const BrandService = {
    getAll: () => axiosInstance.get('/brands'),

    create: (formData) => {
        const data = new FormData();

        data.append('name', formData.name);
        data.append('email', formData.email);
        data.append('address', formData.address);
        if (formData.logo) {
            data.append('logo', formData.logo);
        }
        if (formData.logo_mini) {
            data.append('logo_mini', formData.logo_mini);
        }

        return axiosInstance.post('/brands/store', data);
    },

    update: (id, formData) => {
        const data = new FormData();
        if (formData.name !== null && formData.name !== undefined) {
            data.append('name', formData.name);
        }
        if (formData.email !== null && formData.email !== undefined) {
            data.append('email', formData.email);
        }
        if (formData.address !== null && formData.address !== undefined) {
            data.append('address', formData.address);
        }
        if (formData.logo) {
            data.append('logo', formData.logo); // Only if logo is selected
        }
        if (formData.logo_mini) {
            data.append('logo_mini', formData.logo_mini); // Only if logo_mini is selected
        }
        return axiosInstance.post(`/brands/update/${id}`, data); // POST if Laravel doesn't accept PUT with multipart
    },

    delete: (id) => axiosInstance.delete(`/brands/delete/${id}`),

};

export default BrandService;
