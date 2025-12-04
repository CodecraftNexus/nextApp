import { apiClient } from './apiClient';




export const authService = {

    verifyAuth: async () => {
        try {

            const user = await apiClient.get('/api/profile');
            return { success: true, user };
        } catch (error: any) {
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
        } finally {

        }
    },

    getPlanet: async () => {
        try {

            const palentData = await apiClient.post("/api/planethouse")
            return { success: true, palentData };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    },

    getMahadaha: async () => {
        try {

            const MahadashaData = await apiClient.post("/api/mahadasha")
            return { success: true, MahadashaData };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    },

    getAnthardasha: async () => {
        try {

            const AnthardashaData = await apiClient.post("/api/AntharDasha");
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

    setUsername: async (username: string) => {
        try {
            const user = await apiClient.post('/api/auth/set-username', { username });
            return { success: true, user };
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
    }
};