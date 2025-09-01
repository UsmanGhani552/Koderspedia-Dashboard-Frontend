// src/services/packagesService.js
import axiosInstance from '../api/axios';

const ClientService = {
    getAll: () => axiosInstance.get('/clients'),

    create: (formData) => {
        const data = new FormData();

        data.append('name', formData.name);
        data.append('username', formData.username);
        data.append('email', formData.email);
        data.append('phone', formData.phone);
        data.append('address', formData.address);
        data.append('password', formData.password);
        if (formData.image) {
            data.append('image', formData.image);
        }

        return axiosInstance.post('/clients/store', data);
    },

    update: (id, formData) => {
        console.log(formData);
        const data = new FormData();
        if (formData.name !== null && formData.name !== undefined) {
            data.append('name', formData.name);
        }
        if (formData.email !== null && formData.email !== undefined) {
            data.append('email', formData.email);
        }
        if (formData.phone !== null && formData.phone !== undefined) {
            data.append('phone', formData.phone);
        }
        if (formData.address !== null && formData.address !== undefined) {
            data.append('address', formData.address);
        }
        if (formData.password !== null && formData.password !== undefined) {
            data.append('password', formData.password);
        }
        if (formData.package_id !== null && formData.package_id !== undefined) {
            data.append('package_id', formData.package_id);
        }
        if (formData.image) {
            data.append('image', formData.image); // Only if image is selected
        }
        return axiosInstance.post(`/clients/update/${id}`, data); // POST if Laravel doesn't accept PUT with multipart
    },

    delete: (id) => axiosInstance.delete(`/clients/delete/${id}`),

    assignedPackages: (id) => axiosInstance.get(`/clients/assigned-packages/${id}`)
};

export default ClientService;
