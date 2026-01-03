"use client";
import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState } from "react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulation dyal login
    console.log("Login attempt with:", { email, password });
    // Set cookie for simulation
    document.cookie = "isLoggedIn=true; path=/; max-age=86400"; // 1 day
    // Redirect to projects page (assuming French locale)
    window.location.href = "/fr/projects";
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-xl shadow-blue-50/50 border border-slate-100 p-10">
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-100">
            <Lock className="text-white" size={28} />
          </div>
          <h1 className="text-2xl font-black text-slate-800 mb-2">
            Bon retour
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Connectez-vous pour gérer vos projets
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email Input */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
              Email
            </label>
            <div className="relative group">
              <Mail
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
                size={18}
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nom@exemple.com"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">
                Mot de passe
              </label>
              <button
                type="button"
                className="text-[10px] font-bold text-blue-600 hover:underline"
              >
                Oublié ?
              </button>
            </div>
            <div className="relative group">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
                size={18}
              />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-12 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white rounded-2xl py-4 font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-100 transition-all group"
          >
            Se connecter
            <ArrowRight
              size={18}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center mt-8 text-xs text-slate-500 font-medium">
          Vous n'avez pas de compte ?{" "}
          <button className="text-blue-600 font-bold hover:underline">
            Contactez l'administration
          </button>
        </p>
      </div>
    </div>
  );
}
