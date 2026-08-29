import { useState, useEffect, useRef } from "react";
import { X, ShieldCheck, Eye, EyeOff, Lock, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ADMIN_ID = "Tejashvi@123";
const ADMIN_PASSWORD = "0987654321";

const AdminLoginModal = ({ isOpen, onClose }) => {
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isShaking, setIsShaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const idRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setAdminId("");
      setPassword("");
      setError("");
      setShowPassword(false);
      setTimeout(() => idRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!adminId.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      triggerShake();
      return;
    }
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    if (adminId === ADMIN_ID && password === ADMIN_PASSWORD) {
      setIsLoading(false);
      onClose();
      scrollTo(0, 0);
      navigate("/admin");
    } else {
      setIsLoading(false);
      setError("Invalid Admin ID or Password. Please try again.");
      setPassword("");
      triggerShake();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="fixed inset-0 z-[101] flex items-center justify-center px-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-modal-title"
      >
        <div
          className={`relative w-full max-w-md rounded-2xl border border-white/10 bg-gradient-to-br from-[#0f1020] via-[#13162a] to-[#0b0d1a] shadow-2xl shadow-black/60 p-8 transition-all duration-300 ${isShaking ? "admin-shake" : ""}`}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            id="admin-modal-close"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/15 text-gray-400 hover:text-white transition-colors duration-200"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex flex-col items-center mb-7">
            <div className="relative mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/30 to-purple-600/30 border border-primary/30 flex items-center justify-center shadow-lg shadow-primary/20">
                <ShieldCheck className="w-8 h-8 text-primary" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                <Lock className="w-2.5 h-2.5 text-white" />
              </div>
            </div>
            <h2 id="admin-modal-title" className="text-2xl font-bold text-white tracking-tight">
              Admin Access
            </h2>
            <p className="text-sm text-gray-400 mt-1 text-center">
              Enter your credentials to access the dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="admin-id-input" className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                Admin ID
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="admin-id-input"
                  ref={idRef}
                  type="text"
                  value={adminId}
                  onChange={(e) => { setAdminId(e.target.value); setError(""); }}
                  placeholder="Enter Admin ID"
                  autoComplete="off"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all duration-200"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="admin-password-input" className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="admin-password-input"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  placeholder="Enter Password"
                  autoComplete="current-password"
                  className="w-full pl-10 pr-11 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                <X className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              id="admin-login-submit"
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-primary to-purple-600 hover:from-primary-dull hover:to-purple-500 text-white font-semibold text-sm shadow-lg shadow-primary/30 transition-all duration-300 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Verifying...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  Access Dashboard
                </>
              )}
            </button>
          </form>

          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-purple-600/10 blur-3xl pointer-events-none" />
        </div>
      </div>

      <style>{`
        @keyframes admin-shake {
          0%, 100% { transform: translateX(0); }
          20%       { transform: translateX(-8px); }
          40%       { transform: translateX(8px); }
          60%       { transform: translateX(-6px); }
          80%       { transform: translateX(6px); }
        }
        .admin-shake { animation: admin-shake 0.45s ease; }
      `}</style>
    </>
  );
};

export default AdminLoginModal;
