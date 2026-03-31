"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, Eye, EyeOff } from "lucide-react";
import { API_BASE_URL } from "../lib/config";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const handleAdminLogin = async () => {
    if (!username || !password) {
      setError("Please enter username and password");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          username: username.trim(), 
          password 
        }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        // Save token
        localStorage.setItem("adminToken", data.token);

        if (data.admin) {
          localStorage.setItem("adminInfo", JSON.stringify(data.admin));
        }

        setError("");
        router.push("/admindash");        // ← Correct route as per your requirement
      } else {
        setError(data.error || data.message || "Invalid admin credentials");
      }
    } catch (err) {
      setError("Unable to connect to server. Please make sure backend is running on port 8080.");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAdminLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex items-center justify-center p-6 relative overflow-hidden transition-colors duration-300">
      <div className="absolute inset-0 bg-[radial-gradient(at_center,#1a1a2e_0%,transparent_70%)] dark:opacity-100 opacity-30" />

      <div className="relative w-full max-w-md">
        <div className="bg-white dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200 dark:border-gray-800 rounded-3xl p-10 shadow-2xl shadow-black/10 dark:shadow-black/50 transition-all">
          <div className="text-center mb-10">
            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-600/10 rounded-2xl flex items-center justify-center mb-4 border border-green-200 dark:border-green-500/20">
              <Lock className="w-8 h-8 text-green-600 dark:text-green-500" />
            </div>
            <h1 className="text-4xl font-semibold text-gray-900 dark:text-white tracking-tight">
              Admin Login
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Access the administrator panel
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
                  onKeyDown={handleKeyDown}
                  className="w-full bg-gray-100 dark:bg-gray-950 border border-gray-300 dark:border-gray-700 focus:border-green-500 focus:ring-1 focus:ring-green-500 rounded-2xl py-3.5 pl-11 pr-4 text-gray-900 dark:text-white placeholder-gray-500 transition-all"
                  placeholder="Enter admin username"
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
                  onKeyDown={handleKeyDown}
                  className="w-full bg-gray-100 dark:bg-gray-950 border border-gray-300 dark:border-gray-700 focus:border-green-500 focus:ring-1 focus:ring-green-500 rounded-2xl py-3.5 pl-11 pr-12 text-gray-900 dark:text-white placeholder-gray-500 transition-all"
                  placeholder="Enter admin password"
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

            <button
              onClick={handleAdminLogin}
              disabled={isLoading}
              className="w-full bg-green-700 hover:bg-green-800 disabled:bg-green-900 transition-all duration-200 text-white font-medium py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-green-500/20 disabled:shadow-none"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in as Admin...
                </>
              ) : (
                "Login as Administrator"
              )}
            </button>
          </div>
        </div>

        <p className="text-center text-gray-600 dark:text-gray-500 text-sm mt-8">
          Dont have an admin account?{" "}
          <a
            href="/adminsignup"
            className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 hover:underline transition-colors"
          >
            Create one here
          </a>
        </p>
      </div>
    </div>
  );
}