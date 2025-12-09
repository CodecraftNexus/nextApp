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
  navam: any;
  predictions: any;
  mahadasha: any;
  anthardahsa: any;
  isAuthenticated: boolean | null;
  loading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: (id?: any) => Promise<void>;
  switchProfile: (profileId: string) => Promise<void>;
  addProfile: (name: string, nickname: string) => Promise<void>;
  GetPlanet: () => Promise<void>;
  Getnavam: () => Promise<void>;
  Getmahadasha: () => Promise<void>;
  getAntharDasha: () => Promise<void>;
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
  refreshAllData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [planet, setPlanet] = useState<any>(null);
  const [navam, setnavam] = useState<any>(null);
  const [predictions, setPredictions] = useState<any>({});
  const [mahadasha, setmahadaha] = useState<any>(null);
  const [anthardahsa, Setanthardahsa] = useState<any>(null);

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Prevent multiple simultaneous checks
  const isCheckingRef = useRef(false);
  const lastCheckTimeRef = useRef(0);
  const DEBOUNCE_TIME = 500;

  const clearErrors = () => setErrors({});

  // Function to fetch all data after authentication
  const fetchAllData = useCallback(async () => {
    try {
      // Fetch all data in parallel for better performance
      await Promise.allSettled([
        authService.getPlanet().then((result) => {
          if (result.success) {
            setPlanet(result.palentData);
          }
        }),
        authService.getNavam().then((result) => {
          if (result.success) {
            setnavam(result.navamData);
          }
        }),
        authService.getMahadaha().then((result) => {
          if (result.success) {
            setmahadaha(result.MahadashaData);
          }
        }),
        authService.getAnthardasha().then((result) => {
          if (result.success) {
            Setanthardahsa(result.AnthardashaData);
          }
        }),
      ]);
    } catch (error) {
      console.error("Error fetching all data:", error);
    }
  }, []);

  const checkAuth = useCallback(
    async (id?: any) => {
      const now = Date.now();

      // Prevent overlapping calls
      if (isCheckingRef.current) {
        console.log("Auth check already in progress, skipping...");
        return;
      }

      // Debounce: Don't check if recently checked
      if (now - lastCheckTimeRef.current < DEBOUNCE_TIME) {
        console.log("Auth check debounced");
        return;
      }

      isCheckingRef.current = true;
      lastCheckTimeRef.current = now;
      setLoading(true);

      try {
        const result = await authService.verifyAuth(id);
        if (result.success && result.user) {
          setUser(result.user);
          setIsAuthenticated(true);
          // Automatically fetch all data after successful authentication
          await fetchAllData();
        } else {
          setUser(null);
          setIsAuthenticated(false);
          // Clear all data when not authenticated
          setPlanet(null);
          setnavam(null);
          setmahadaha(null);
          Setanthardahsa(null);
          setPredictions({});
        }
      } catch (err) {
        console.error("Auth check error:", err);
        setUser(null);
        setIsAuthenticated(false);
        // Clear all data on error
        setPlanet(null);
        setnavam(null);
        setmahadaha(null);
        Setanthardahsa(null);
        setPredictions({});
      } finally {
        setLoading(false);
        isCheckingRef.current = false;
      }
    },
    [fetchAllData]
  );

  const switchProfile = useCallback(
    async (profileId: string) => {
      if (!profileId) {
        toast.error("Invalid profile ID");
        return;
      }

      setLoading(true);
      try {
        const result = await authService.switchProfile(profileId);

        if (result.success) {
          await checkAuth();
          toast.success("Profile switched successfully");
        } else {
          throw new Error(result.error || "Failed to switch profile");
        }
      } catch (error: any) {
        console.error("Profile switch error:", error);
        toast.error(error.message || "Failed to switch profile");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [checkAuth]
  );

  const addProfile = useCallback(
    async (name: string, nickname: string) => {
      if (!name || !nickname) {
        toast.error("Name and nickname are required");
        return;
      }

      setLoading(true);
      try {
        const result = await authService.addProfile(name, nickname);

        if (result.success) {
          await checkAuth();
          toast.success("Profile added successfully");
        } else {
          throw new Error(result.error || "Failed to add profile");
        }
      } catch (error: any) {
        console.error("Add profile error:", error);
        toast.error(error.message || "Failed to add profile");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [checkAuth]
  );

  // Manual refresh function if needed
  const refreshAllData = useCallback(async () => {
    if (isAuthenticated) {
      setLoading(true);
      try {
        await fetchAllData();
      } finally {
        setLoading(false);
      }
    }
  }, [isAuthenticated, fetchAllData]);

  // Initial auth check - only once on mount
  useEffect(() => {
    checkAuth();
    clearErrors();
  }, [checkAuth]);

  // Check auth on window focus (debounced)
  useEffect(() => {
    const handleFocus = () => {
      if (isAuthenticated && !isCheckingRef.current) {
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
      toast.success("Profile updated successfully");
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
      setnavam(null);
      setmahadaha(null);
      Setanthardahsa(null);
      setPredictions({});
      setIsAuthenticated(false);
      toast.info("Logged out successfully");
      router.push("/auth");
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

  const Getnavam = async () => {
    try {
      setLoading(true);
      setnavam(null);
      const result = await authService.getNavam();
      if (result.success) {
        setnavam(result.navamData);
      } else {
        setnavam(null);
      }
    } catch (error) {
      setnavam(null);
      throw error;
    } finally {
      setLoading(false);
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
        switchProfile,
        addProfile,
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
        preditions,
        predictions,
        getJobsOptions,
        getEducationOptions,
        Getnavam,
        navam,
        refreshAllData,
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