import axiosInstance from '../api/axios';

const AuthService = {
  login: async (credentials) => {
    const response = await axiosInstance.post('/login', credentials);
    return response.data;
  },
  register: async (credentials) => {
    const response = await axiosInstance.post('/register', credentials);
    return response.data;
  },
  logout: async () => {
    await axiosInstance.get('/logout');
  },
  editProfile: (formData) => {
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
    console.log(formData.emails);
    if (formData.emails !== null && formData.emails !== undefined) {
      formData.emails.forEach((email, index) => {
        data.append(`emails[${index}]`, email);
      });
    }
    if (formData.image) {
      data.append('image', formData.image);
    }
    return axiosInstance.post('/clients/edit-profile', data);
  },
  getUser: async () => {
    const response = await axiosInstance.get('/get-user');
    return response.data;
  }
};

export default AuthService;