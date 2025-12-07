"use client";
import React from "react";
import SignInForm from "../components/auth/signInFrom";
import { useRouter } from "next/navigation";
import useFormData from "../hooks/UseFormData";
import Alert from "../components/auth/Alert";
import SignUpForm from "../components/auth/signUpFrom";
import { useAuth } from "../context/AuthContext";
import GoogleLoginButton from "../components/auth/GoogleLoginButton";
import { toast } from "react-toastify";

export default function AuthForms() {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState("signin");

  const {
    loading,
    login,
    errors,
    signUp,
    handleGoogleLogin,
  } = useAuth();

  const SignInFormValue = useFormData({
    email: "",
    password: "",
    rememberMe: false,
  });

  const SignUpFromValue = useFormData({
    fullName: "",
    username: "",
    email: "",
    password: "",
    Terms: false,
  });

  const handleSignUp = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      await signUp(SignUpFromValue.formData);
      setActiveTab("signin");
    } catch (error) {
      throw error;
    }
  };

  const handleSignIn = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      await login(SignInFormValue.formData);
    } catch (error) {
      throw error;
    }
  };

  const handleGoogleSuccess = async (idToken: string) => {
    try {
      const result = await handleGoogleLogin(idToken);

        router.push("/");
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  const handleGoogleError = (error: any) => {
    console.error("Google Sign-In Error:", error);
  };



  React.useEffect(() => {
    if (activeTab == "signin") {
      SignUpFromValue.resetForm();
    } else {
      SignInFormValue.resetForm();
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("signin")}
            className={`flex-1 py-4 text-center font-semibold transition-all ${
              activeTab === "signin"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 hover:text-gray-900"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setActiveTab("signup")}
            className={`flex-1 py-4 text-center font-semibold transition-all ${
              activeTab === "signup"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 hover:text-gray-900"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form Content */}
        <div className="p-8">
          {(errors as any)?.general && (
            <Alert Error={(errors as any)?.general} />
          )}

          {activeTab === "signin" ? (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-600 mb-6 text-sm">
                Sign in to continue to your account
              </p>

              <SignInForm
                formData={SignInFormValue.formData}
                onsubmit={handleSignIn}
                UpdateField={SignInFormValue.updateField}
                loading={loading}
              />
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Create Account
              </h2>
              <p className="text-gray-600 mb-6 text-sm">
                Sign up to get started
              </p>
              <SignUpForm
                formData={SignUpFromValue.formData}
                onSubmit={handleSignUp}
                errors={errors}
                UpdateField={SignUpFromValue.updateField}
              />
            </div>
          )}

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <GoogleLoginButton
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            text={activeTab === "signin" ? "signin_with" : "signup_with"}
          />
        </div>
      </div>
    </div>
  );
}
