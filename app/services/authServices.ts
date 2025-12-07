import { apiClient } from './apiClient';

export const authService = {
    verifyAuth: async (id?: any) => {
        try {
            const endpoint = id ? `/api/profile?id=${id}` : '/api/profile';
            const user = await apiClient.get(endpoint);
            return { success: true, user };
        } catch (error: any) {
            console.error('Auth verification failed:', error);
            return { success: false, error: error.message };
        }
    },

    login: async (credentials: { email: string; password: string }) => {
        const response = await apiClient.post('/api/auth/login', credentials);
        return response;
    },

    register: async (userData: any) => {
        return await apiClient.post('/api/auth/register', userData);
    },

    update: async (userData: any) => {
        return await apiClient.put("/api/profile", userData);
    },

    logout: async () => {
        try {
            await apiClient.post('/api/auth/logout');
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    },

    getPlanet: async () => {
        try {
            const palentData = await apiClient.post("/api/planethouse");
            return { success: true, palentData };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    },

    getMahadaha: async () => {
        try {
            const MahadashaData = await apiClient.post("/api/mahadasha");
            return { success: true, MahadashaData };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    },

    getAnthardasha: async () => {
        try {
            const AnthardashaData = await apiClient.post("/api/anthardasha");
            return { success: true, AnthardashaData };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    },

    googleLogin: async (idToken: string) => {
        try {
            const user = await apiClient.post<any>('/api/auth/google-login', { idToken });
            const requiresUsername = user?.requiresUsername;
            return { success: true, user, requiresUsername };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    },

    forgotPassword: async (email: string) => {
        return await apiClient.post('/api/users/forgot-password', { email });
    },

    getPredictions: async (planet: string) => {
        try {
            const predictions = await apiClient.post(`/api/prediction/${planet}`);
            return { success: true, predictions };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    },

    getJobsOptions: async () => {
        try {
            const options = await apiClient.get('/api/jobs/options');
            return { success: true, options };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    },

    getEducationOptions: async () => {
        try {
            const options = await apiClient.get('/api/education/options');
            return { success: true, options };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    },

    // Profile switching with token update
    switchProfile: async (profileId: string) => {
        try {
            const response: any = await apiClient.post('/api/profile/switch', { profileId });

            // If token is returned (dev mode), update authorization header
            if (response.token) {
                // Store token in localStorage for dev mode
                localStorage.setItem('auth_token', response.token);
            }

            return { success: true, data: response };
        } catch (error: any) {
            console.error('Profile switch failed:', error);
            return { success: false, error: error.message };
        }
    },

    // Add new profile
    addProfile: async (name: string, nikname: string) => {
        try {
            const response = await apiClient.post('/api/addProfile', { name, nikname });
            return { success: true, data: response };
        } catch (error: any) {
            console.error('Add profile failed:', error);
            return { success: false, error: error.message };
        }
    },

    getNavam: async () => {
        try {
            const navamData = await apiClient.post("/api/navam");
            return { success: true, navamData };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    },


};