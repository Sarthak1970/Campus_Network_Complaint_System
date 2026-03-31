"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { API_BASE_URL } from "../lib/config";   // Correct path

export default function AdminRegister() {
  const [username, setUsername] = useState("");
  const [userID, setUserID] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const router = useRouter();

  const handleAdminRegister = async () => {
    if (!username || !userID || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/register`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({ 
          username: username.trim(),
          user_id: userID.trim(),     
          password: password 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Admin account created successfully!");
        setTimeout(() => {
          router.push("/adminlogin");
        }, 1500);
      } else {
        setError(data.error || data.message || data.detail || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please make sure the backend server is running.");
      console.error("Registration error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex items-center justify-center p-6 relative overflow-hidden transition-colors duration-300">
      <div className="absolute inset-0 bg-[radial-gradient(at_center,#1a1a2e_0%,transparent_70%)] dark:opacity-100 opacity-30" />

      <div className="relative w-full max-w-md">
        <div className="bg-white dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200 dark:border-gray-800 rounded-3xl p-10 shadow-2xl shadow-black/10 dark:shadow-black/50 transition-all">
          <div className="text-center mb-10">
            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-600/10 rounded-2xl flex items-center justify-center mb-4 border border-green-200 dark:border-green-500/20">
              <User className="w-8 h-8 text-green-600 dark:text-green-500" />
            </div>
            <h1 className="text-4xl font-semibold text-gray-900 dark:text-white tracking-tight">
              Create Admin Account
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Setup a new administrator
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-400 block mb-1.5">
                Admin Username
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-gray-100 dark:bg-gray-950 border border-gray-300 dark:border-gray-700 focus:border-green-500 focus:ring-1 focus:ring-green-500 rounded-2xl py-3.5 pl-11 pr-4 text-gray-900 dark:text-white placeholder-gray-500 transition-all"
                  placeholder="Choose admin username"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-400 block mb-1.5">
                Admin ID
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                <input
                  type="text"
                  inputMode="numeric"
                  value={userID}
                  onChange={(e) => {
                    const onlyNums = e.target.value.replace(/\D/g, "");
                    setUserID(onlyNums);
                  }}
                  className="w-full bg-gray-100 dark:bg-gray-950 border border-gray-300 dark:border-gray-700 focus:border-green-500 focus:ring-1 focus:ring-green-500 rounded-2xl py-3.5 pl-11 pr-4 text-gray-900 dark:text-white placeholder-gray-500 transition-all"
                  placeholder="Enter admin ID (numbers only)"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-400 block mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-100 dark:bg-gray-950 border border-gray-300 dark:border-gray-700 focus:border-green-500 focus:ring-1 focus:ring-green-500 rounded-2xl py-3.5 pl-11 pr-12 text-gray-900 dark:text-white placeholder-gray-500 transition-all"
                  placeholder="Create strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-400 block mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-gray-100 dark:bg-gray-950 border border-gray-300 dark:border-gray-700 focus:border-green-500 focus:ring-1 focus:ring-green-500 rounded-2xl py-3.5 pl-11 pr-4 text-gray-900 dark:text-white placeholder-gray-500 transition-all"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-red-600 dark:text-red-500 text-sm text-center font-medium">
                {error}
              </p>
            )}

            {success && (
              <p className="text-green-600 dark:text-green-500 text-sm text-center font-medium">
                {success}
              </p>
            )}

            <button
              onClick={handleAdminRegister}
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-800 transition-all duration-200 text-white font-medium py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-green-500/20 disabled:shadow-none"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating Admin Account...
                </>
              ) : (
                <>
                  Create Admin Account
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>

        <p className="text-center text-gray-600 dark:text-gray-500 text-sm mt-8">
          Already have an admin account?{" "}
          <a
            href="/adminlogin"
            className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 hover:underline transition-colors"
          >
            Login here
          </a>
        </p>
      </div>
    </div>
  );
}