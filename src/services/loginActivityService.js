import axiosInstance from '../api/axios';

const loginActivityService = {
    loginActivity: () => axiosInstance.get('/login-activities')
}

export default loginActivityService;