module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[project]/app/services/apiClient.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "apiClient",
    ()=>apiClient
]);
const API_URL = ("TURBOPACK compile-time value", "http://localhost:5000");
let isRefreshing = false;
let failedQueue = [];
const processQueue = (error, token = null)=>{
    failedQueue.forEach((prom)=>{
        error ? prom.reject(error) : prom.resolve(token);
    });
    failedQueue = [];
};
const fetchWithRefresh = async (input, init)=>{
    const response = await fetch(`${API_URL}${input}`, {
        ...init,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...init?.headers || {}
        }
    });
    if (response.status === 401) {
        if (isRefreshing) {
            return new Promise((resolve, reject)=>{
                failedQueue.push({
                    resolve,
                    reject
                });
            }).then((token)=>{
                const newInit = {
                    ...init,
                    headers: {
                        ...init?.headers,
                        Authorization: `Bearer ${token}`
                    }
                };
                return fetch(`${API_URL}${input}`, newInit);
            }).catch((err)=>Promise.reject(err));
        }
        isRefreshing = true;
        try {
            const refreshResponse = await fetch(`${API_URL}/api/auth/refresh`, {
                method: 'POST',
                credentials: 'include'
            });
            if (!refreshResponse.ok) {
                throw new Error('Refresh failed');
            }
            const { accessToken } = await refreshResponse.json();
            processQueue(null, accessToken);
            const retryInit = {
                ...init,
                headers: {
                    ...init?.headers,
                    Authorization: `Bearer ${accessToken}`
                }
            };
            return fetch(`${API_URL}${input}`, retryInit);
        } catch (err) {
            processQueue(err, null);
            if (("TURBOPACK compile-time value", "undefined") !== 'undefined') {
            // window.location.href = '/auth?session=expired';
            }
            return Promise.reject(err);
        } finally{
            isRefreshing = false;
        }
    }
    return response;
};
const apiClient = {
    get: async (endpoint, options)=>{
        const res = await fetchWithRefresh(endpoint, {
            ...options,
            method: 'GET'
        });
        const data = await res.json();
        if (!res.ok) throw data;
        return data;
    },
    post: async (endpoint, body, options)=>{
        const res = await fetchWithRefresh(endpoint, {
            ...options,
            method: 'POST',
            body: body ? JSON.stringify(body) : undefined
        });
        const data = await res.json();
        if (!res.ok) throw data;
        return data;
    },
    put: async (endpoint, body, options)=>{
        const res = await fetchWithRefresh(endpoint, {
            ...options,
            method: 'PUT',
            body: body ? JSON.stringify(body) : undefined
        });
        const data = await res.json();
        if (!res.ok) throw data;
        return data;
    },
    delete: async (endpoint, options)=>{
        const res = await fetchWithRefresh(endpoint, {
            ...options,
            method: 'DELETE'
        });
        const data = await res.json();
        if (!res.ok) throw data;
        return data;
    }
};
}),
"[project]/app/services/authServices.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "authService",
    ()=>authService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$apiClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/services/apiClient.ts [app-ssr] (ecmascript)");
;
const authService = {
    verifyAuth: async ()=>{
        try {
            const user = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$apiClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].get('/api/profile');
            return {
                success: true,
                user
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    },
    login: async (credentials)=>{
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$apiClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].post('/api/auth/login', credentials);
        return response;
    },
    register: async (userData)=>{
        return await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$apiClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].post('/api/auth/register', userData);
    },
    update: async (userData)=>{
        return await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$apiClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].put("/api/profile", userData);
    },
    logout: async ()=>{
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$apiClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].post('/api/auth/logout');
        } finally{}
    },
    getPlanet: async ()=>{
        try {
            const palentData = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$apiClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].post("/api/planethouse");
            return {
                success: true,
                palentData
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    },
    getMahadaha: async ()=>{
        try {
            const MahadashaData = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$apiClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].post("/api/mahadasha");
            return {
                success: true,
                MahadashaData
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    },
    getAnthardasha: async ()=>{
        try {
            const AnthardashaData = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$apiClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].post("/api/AntharDasha");
            return {
                success: true,
                AnthardashaData
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    },
    googleLogin: async (idToken)=>{
        try {
            const user = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$apiClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].post('/api/auth/google-login', {
                idToken
            });
            const requiresUsername = user?.requiresUsername;
            return {
                success: true,
                user,
                requiresUsername
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    },
    setUsername: async (username)=>{
        try {
            const user = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$apiClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].post('/api/auth/set-username', {
                username
            });
            return {
                success: true,
                user
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    },
    forgotPassword: async (email)=>{
        return await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$apiClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].post('/api/users/forgot-password', {
            email
        });
    }
};
}),
"[project]/app/context/AuthContext.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-toastify/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$authServices$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/services/authServices.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
const AuthProvider = ({ children })=>{
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [planet, setPlanet] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [mahadasha, setmahadaha] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [anthardahsa, Setanthardahsa] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isAuthenticated, setIsAuthenticated] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [errors, setErrors] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    const [isChecking, setIsChecking] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const clearErrors = ()=>setErrors({});
    const checkAuth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        if (isChecking) return;
        setIsChecking(true);
        setLoading(true);
        try {
            const result = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$authServices$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authService"].verifyAuth();
            if (result.success) {
                setUser(result.user);
                setIsAuthenticated(true);
            } else {
                setUser(null);
                setIsAuthenticated(false);
            }
        } catch (err) {
            setUser(null);
            setIsAuthenticated(false);
        } finally{
            setLoading(false);
            setIsChecking(false);
        }
    }, [
        isChecking
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        checkAuth();
        clearErrors();
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const handleFocus = ()=>checkAuth();
        window.addEventListener("focus", handleFocus);
        return ()=>window.removeEventListener("focus", handleFocus);
    }, [
        checkAuth
    ]);
    const login = async (credentials)=>{
        clearErrors();
        setLoading(true);
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$authServices$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authService"].login(credentials);
            await checkAuth();
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success("Login Successful!");
            router.push("/");
        } catch (err) {
            const message = err.message || "Login failed. Please try again.";
            setErrors({
                general: message
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error(message);
            throw err;
        } finally{
            setLoading(false);
        }
    };
    const updateProfile = async (formData)=>{
        clearErrors();
        setLoading(true);
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$authServices$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authService"].update(formData);
            await checkAuth();
        } catch (error) {
            if (error.errors && typeof error.errors === "object") {
                setErrors(error.errors);
            } else {
                const message = error.message || "Profile update failed";
                setErrors({
                    general: message
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error(message);
            }
            throw error;
        } finally{
            setLoading(false);
        }
    };
    const signUp = async (formdata)=>{
        clearErrors();
        setLoading(true);
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$authServices$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authService"].register(formdata);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success("Account Created Successfully!");
        } catch (error) {
            if (error.errors && typeof error.errors === "object") {
                setErrors(error.errors);
            } else {
                const message = error.message || "Registration failed";
                setErrors({
                    general: message
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error(message);
            }
            throw error;
        } finally{
            setLoading(false);
        }
    };
    const logout = async ()=>{
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$authServices$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authService"].logout();
            setUser(null);
            setPlanet(null);
            setIsAuthenticated(false);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].info("Logged out successfully");
            router.push("/auth");
            router.refresh();
        } catch (err) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error("Logout failed");
        }
    };
    const GetPlanet = async ()=>{
        try {
            setLoading(true);
            setPlanet(null);
            const result = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$authServices$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authService"].getPlanet();
            if (result.success) {
                setPlanet(result.palentData);
            } else {
                setPlanet(null);
            }
        } catch (error) {
            setPlanet(null);
            throw error;
        } finally{
            setLoading(false);
        }
    };
    const Getmahadasha = async ()=>{
        try {
            setLoading(true);
            setmahadaha(null);
            const result = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$authServices$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authService"].getMahadaha();
            if (result.success) {
                setmahadaha(result.MahadashaData);
            } else {
                setmahadaha(null);
            }
        } catch (error) {
            setmahadaha(null);
            throw error;
        } finally{
            setLoading(false);
        }
    };
    const getAntharDasha = async ()=>{
        try {
            setLoading(true);
            Setanthardahsa(null);
            const result = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$authServices$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authService"].getAnthardasha();
            if (result.success) {
                Setanthardahsa(result.AnthardashaData);
            } else {
                Setanthardahsa(null);
            }
        } catch (error) {
            Setanthardahsa(null);
            throw error;
        } finally{
            setLoading(false);
        }
    };
    const handleGoogleLogin = async (idToken)=>{
        setLoading(true);
        setErrors({});
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$authServices$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authService"].googleLogin(idToken);
            if (response.requiresUsername) {
                return {
                    success: true,
                    requiresUsername: true,
                    user: response.user
                };
            }
            setUser(response?.user);
            await checkAuth();
            return {
                success: true,
                requiresUsername: false,
                user: response.user
            };
        } catch (error) {
            const errorMessage = error?.message || "Google login failed";
            setErrors({
                general: errorMessage
            });
            throw error;
        } finally{
            setLoading(false);
        }
    };
    const handleSetUsername = async (username)=>{
        setLoading(true);
        setErrors({});
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$authServices$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authService"].setUsername(username);
            if (!response?.user) {
                setErrors({
                    general: response.error
                });
                throw response.error;
            }
            setUser(response.user);
            await checkAuth();
            return {
                success: true,
                user: response.user
            };
        } catch (error) {
            const errorMessage = error?.message || "Failed to set username";
            setErrors({
                general: errorMessage
            });
            throw error;
        } finally{
            setLoading(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: {
            user,
            planet,
            isAuthenticated,
            loading,
            login,
            logout,
            checkAuth,
            GetPlanet,
            updateProfile,
            signUp,
            errors,
            clearErrors,
            mahadasha,
            Getmahadasha,
            anthardahsa,
            getAntharDasha,
            handleGoogleLogin,
            handleSetUsername
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/app/context/AuthContext.tsx",
        lineNumber: 292,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const useAuth = ()=>{
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
};
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__5a8fe718._.js.map