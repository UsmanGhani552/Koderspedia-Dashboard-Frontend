// src/services/packagesService.js
import axiosInstance from '../api/axios';

const UserService = {
    getAll: () => axiosInstance.get('/users'),

    create: (formData) => {
        const data = new FormData();

        data.append('name', formData.name);
        data.append('email', formData.email);
        data.append('password', formData.password);
        data.append('password_confirmation', formData.confirmPassword);
        if (formData.image) {
            data.append('image', formData.image);
        }

        return axiosInstance.post('/users/store', data);
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
        if (formData.password !== null && formData.password !== undefined) {
            data.append('password', formData.password);
        }
        if (formData.confirmPassword !== null && formData.confirmPassword !== undefined) {
            data.append('password_confirmation', formData.confirmPassword);
        }
        if (formData.image) {
            data.append('image', formData.image); // Only if image is selected
        }
        return axiosInstance.post(`/users/update/${id}`, data); // POST if Laravel doesn't accept PUT with multipart
    },

    delete: (id) => axiosInstance.delete(`/users/delete/${id}`),
};

export default UserService;
