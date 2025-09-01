import axiosInstance from '../api/axios';

const passwordResetService = {
    sendPasswordResetToken: async ($email) => {
        const response = await axiosInstance.post('/send-password-reset-token',$email);
        return response;
    },
    verifyPasswordResetToken: async ($token) => {
        const response = await axiosInstance.post('/verify-password-reset-token',$token);
        return response.data;
    },
    resetPassword: async ($data) => {
        const response = await axiosInstance.post('/reset-password',$data);
        return response.data;
    },
}

export default passwordResetService;