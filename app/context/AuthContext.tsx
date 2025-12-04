"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
  useRef,
} from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { authService } from "../services/authServices";

interface AuthContextType {
  user: any;
  planet: any;
  predictions: any;
  mahadasha: any;
  anthardahsa: any;
  isAuthenticated: boolean | null;
  loading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  GetPlanet: () => Promise<void>;
  Getmahadasha: () => Promise<void>;
  getAntharDasha: () => Promise<void>;
  handleSetUsername: (
    username: string
  ) => Promise<{ success: boolean; user: any }>;
  handleGoogleLogin: (
    idToken: string
  ) => Promise<{ success: boolean; requiresUsername: boolean; user: any }>;
  preditions: (planetName: string) => Promise<any>;
  updateProfile: (formData: {
    gender: string;
    dateOfBirth: string;
    birthTime: string;
    whatsappNumber: string;
    birthLocation: string;
    latitude: string;
    longitude: string;
  }) => Promise<void>;
  signUp: (formdata: any) => Promise<void>;
  errors: any;
  clearErrors: () => void;
  getJobsOptions: () => Promise<{ [key: string]: string[] }> | any;
  getEducationOptions: () => Promise<{ [key: string]: string[] }> | any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [planet, setPlanet] = useState<any>(null);
  const [predictions, setPredictions] = useState<any>({});
  const [mahadasha, setmahadaha] = useState<any>(null);
  const [anthardahsa, Setanthardahsa] = useState<any>(null);

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Prevent multiple simultaneous checks
  const isCheckingRef = useRef(false);
  const lastCheckTimeRef = useRef(0);
  const DEBOUNCE_TIME = 1000; // 1 second minimum between checks

  const clearErrors = () => setErrors({});

  const checkAuth = useCallback(async () => {
    const now = Date.now();
    
    // Prevent overlapping calls
    if (isCheckingRef.current) {
      return;
    }
    
    // Debounce: Don't check if recently checked
    if (now - lastCheckTimeRef.current < DEBOUNCE_TIME) {
      return;
    }

    isCheckingRef.current = true;
    lastCheckTimeRef.current = now;
    setLoading(true);

    try {
      const result = await authService.verifyAuth();
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
    } finally {
      setLoading(false);
      isCheckingRef.current = false;
    }
  }, []);

  // Initial auth check - only once on mount
  useEffect(() => {
    checkAuth();
    clearErrors();
  }, []); // Empty dependency array - run only once

  // Optional: Check auth on window focus (but debounced)
  useEffect(() => {
    const handleFocus = () => {
      // Only check if user is already authenticated
      // and hasn't been checked recently
      if (isAuthenticated) {
        checkAuth();
      }
    };
    
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [isAuthenticated, checkAuth]);

  const login = async (credentials: { email: string; password: string }) => {
    clearErrors();
    setLoading(true);
    try {
      await authService.login(credentials);
      await checkAuth();
      toast.success("Login Successful!");
      router.push("/");
    } catch (err: any) {
      const message = err.message || "Login failed. Please try again.";
      setErrors({ general: message });
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (formData: {
    gender: string;
    dateOfBirth: string;
    birthTime: string;
    whatsappNumber: string;
    birthLocation: string;
    latitude: string;
    longitude: string;
  }) => {
    clearErrors();
    setLoading(true);
    try {
      await authService.update(formData);
      await checkAuth();
    } catch (error: any) {
      if (error.errors && typeof error.errors === "object") {
        setErrors(error.errors);
      } else {
        const message = error.message || "Profile update failed";
        setErrors({ general: message });
        toast.error(message);
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (formdata: any) => {
    clearErrors();
    setLoading(true);
    try {
      await authService.register(formdata);
      toast.success("Account Created Successfully!");
    } catch (error: any) {
      if (error.errors && typeof error.errors === "object") {
        setErrors(error.errors);
      } else {
        const message = error.message || "Registration failed";
        setErrors({ general: message });
        toast.error(message);
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setPlanet(null);
      setIsAuthenticated(false);
      toast.info("Logged out successfully");
      router.push("/auth");
      router.refresh();
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  const GetPlanet = async () => {
    try {
      setLoading(true);
      setPlanet(null);
      const result = await authService.getPlanet();
      if (result.success) {
        setPlanet(result.palentData);
      } else {
        setPlanet(null);
      }
    } catch (error) {
      setPlanet(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const Getmahadasha = async () => {
    try {
      setLoading(true);
      setmahadaha(null);
      const result = await authService.getMahadaha();
      if (result.success) {
        setmahadaha(result.MahadashaData);
      } else {
        setmahadaha(null);
      }
    } catch (error) {
      setmahadaha(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getAntharDasha = async () => {
    try {
      setLoading(true);
      Setanthardahsa(null);
      const result = await authService.getAnthardasha();
      if (result.success) {
        Setanthardahsa(result.AnthardashaData);
      } else {
        Setanthardahsa(null);
      }
    } catch (error) {
      Setanthardahsa(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (idToken: string) => {
    setLoading(true);
    setErrors({});

    try {
      const response = await authService.googleLogin(idToken);

      if (response.requiresUsername) {
        return {
          success: true,
          requiresUsername: true,
          user: response.user,
        };
      }

      setUser(response?.user);
      await checkAuth();
      return {
        success: true,
        requiresUsername: false,
        user: response.user,
      };
    } catch (error: any) {
      const errorMessage = error?.message || "Google login failed";
      setErrors({ general: errorMessage });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleSetUsername = async (username: string) => {
    setLoading(true);
    setErrors({});

    try {
      const response = await authService.setUsername(username);

      if (!response?.user) {
        setErrors({ general: response.error });
        throw response.error;
      }

      setUser(response.user);
      await checkAuth();
      return { success: true, user: response.user };
    } catch (error: any) {
      const errorMessage = error?.message || "Failed to set username";
      setErrors({ general: errorMessage });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const preditions = async (planetName: string) => {
    try {
      setLoading(true);
      const response = await authService.getPredictions(planetName);
      setPredictions((prev: any) => ({
        ...prev,
        [planetName]: response.predictions,
      }));
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const getJobsOptions = async () => {
    try {
      const result = await authService.getJobsOptions();
      if (result.success) {
        return result.options;
      }
      throw new Error(result.error);
    } catch (error) {
      throw error;
    }
  };

  const getEducationOptions = async () => {
    try {
      const result = await authService.getEducationOptions();
      if (result.success) {
        return result.options;
      }
      throw new Error(result.error);
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
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
        handleSetUsername,
        preditions,
        predictions,
        getJobsOptions,
        getEducationOptions,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};