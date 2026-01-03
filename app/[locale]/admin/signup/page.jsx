"use client";

import { Eye, EyeOff, Lock, Mail, Shield, User } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

const _supabase = createClient();

export default function AdminSignupPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("secret");

  const [isValid, setIsValid] = useState(null);
  const [_invitation, setInvitation] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setIsValid(false);
      return;
    }

    // Validate token
    fetch(`/api/admin-signup?token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setIsValid(false);
          setError(data.error);
        } else {
          setIsValid(true);
          setInvitation(data);
          setFormData((prev) => ({
            ...prev,
            name: data.name || "",
            email: data.email || "",
          }));
        }
      })
      .catch((_err) => {
        setIsValid(false);
        setError("Invalid invitation");
      });
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          ...formData,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to login or panel
        router.push("/login?message=Account created successfully");
      } else {
        setError(data.error);
      }
    } catch (_err) {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (isValid === null) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-xl shadow-blue-50/50 border border-slate-100 p-10">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-100">
              <Shield className="text-white" size={28} />
            </div>
            <h1 className="text-2xl font-black text-slate-800 mb-2">
              Loading...
            </h1>
          </div>
        </div>
      </div>
    );
  }

  if (!isValid) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-xl shadow-blue-50/50 border border-slate-100 p-10">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-100">
              <Shield className="text-white" size={28} />
            </div>
            <h1 className="text-2xl font-black text-slate-800 mb-2">
              Invalid Invitation
            </h1>
            <p className="text-sm text-slate-500 font-medium">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-xl shadow-blue-50/50 border border-slate-100 p-10">
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-100">
            <Shield className="text-white" size={28} />
          </div>
          <h1 className="text-2xl font-black text-slate-800 mb-2">
            Admin Signup
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Create your admin account
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1"
            >
              Email
            </label>
            <div className="relative group">
              <Mail
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
                size={18}
              />
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="admin@exemple.com"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all"
                disabled={loading}
              />
            </div>
          </div>

          {/* Name Input */}
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1"
            >
              Full Name
            </label>
            <div className="relative group">
              <User
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
                size={18}
              />
              <input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="John Doe"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all"
                disabled={loading}
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1"
            >
              Password
            </label>
            <div className="relative group">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
                size={18}
              />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, password: e.target.value }))
                }
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-12 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                disabled={loading}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password Input */}
          <div className="space-y-2">
            <label
              htmlFor="confirmPassword"
              className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1"
            >
              Confirm Password
            </label>
            <div className="relative group">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
                size={18}
              />
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-12 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                disabled={loading}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white rounded-2xl py-4 font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {loading ? (
              "Creating Account..."
            ) : (
              <>
                Create Account
                <Shield
                  size={18}
                  className="group-hover:scale-110 transition-transform"
                />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
