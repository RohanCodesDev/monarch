import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { CheckCircle, AlertCircle, Loader } from "lucide-react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function VerifyOTP() {
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const inputRefs = useRef([]);

  const [maskedEmail, setMaskedEmail] = useState(null);

  useEffect(() => {
    // Fetch masked email from OTP session cookie
    async function fetchSession() {
      try {
        const r = await fetch('/api/auth/otp-session');
        if (!r.ok) return;
        const d = await r.json();
        setMaskedEmail(d.email);
      } catch (err) {
        console.error('Failed to fetch OTP session', err);
      }
    }
    fetchSession();
  }, []);

  useEffect(() => {
    let interval;
    if (resendCountdown > 0) {
      interval = setInterval(() => {
        setResendCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendCountdown]);

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError("");

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const digits = pastedData.replace(/\D/g, "").split("").slice(0, 4);

    if (digits.length > 0) {
      const newOtp = [...otp];
      digits.forEach((digit, index) => {
        if (index < 4) newOtp[index] = digit;
      });
      setOtp(newOtp);

      if (digits.length === 4) {
        inputRefs.current[3]?.focus();
      }
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join("");

    if (otpCode.length !== 4) {
      setError("Please enter a 4-digit OTP");
      return;
    }

    setLoading(true);
    setError("");

      try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp: otpCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Verification failed");
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/login?verified=true");
      }, 2000);
    } catch (err) {
      setError("An error occurred during verification");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    setError("");

      try {
      const response = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to resend OTP");
        return;
      }

      setOtp(["", "", "", ""]);
      setResendCountdown(60);
      setSuccess(false);
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError("Failed to resend OTP");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleVerify();
    }
  };

  if (!router.isReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100 flex items-center justify-center p-4">
        <Loader className="w-8 h-8 animate-spin text-amber-700" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="inline-block mb-4"
            >
              {success ? (
                <CheckCircle className="w-12 h-12 text-green-600" />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-orange-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg font-bold">✓</span>
                </div>
              )}
            </motion.div>
            <h1 className="text-2xl font-bold text-stone-900 mb-2">
              {success ? "Email Verified!" : "Verify Your Email"}
            </h1>
            <p className="text-stone-600 text-sm">
              {success
                ? "Your account has been created successfully"
                : `We've sent a 4-digit code to ${maskedEmail || 'your email'}`}
            </p>
          </div>

          {success ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-green-50 border border-green-200 rounded-lg p-4 text-center"
            >
              <p className="text-green-700 text-sm font-medium">
                Redirecting to login...
              </p>
            </motion.div>
          ) : (
            <>
              <div className="mb-8">
                <label className="block text-stone-700 text-sm font-semibold mb-4">
                  Enter OTP Code
                </label>
                <div className="flex gap-3 justify-center">
                  {otp.map((digit, index) => (
                    <motion.input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                      onKeyPress={handleKeyPress}
                      maxLength={1}
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="w-16 h-16 text-center text-2xl font-bold border-2 border-stone-300 rounded-lg focus:border-amber-600 focus:outline-none transition-colors bg-stone-50 hover:bg-white"
                      disabled={loading || success}
                    />
                  ))}
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg p-3 mb-6"
                >
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <p className="text-red-700 text-sm">{error}</p>
                </motion.div>
              )}

              <motion.button
                onClick={handleVerify}
                disabled={loading || otp.some((digit) => !digit)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify OTP"
                )}
              </motion.button>

              <div className="mt-6 text-center">
                <p className="text-stone-600 text-sm mb-3">
                  Didn't receive the code?
                </p>
                <button
                  onClick={handleResendOTP}
                  disabled={resendCountdown > 0 || loading}
                  className="text-amber-600 hover:text-amber-700 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {resendCountdown > 0
                    ? `Resend OTP in ${resendCountdown}s`
                    : "Resend OTP"}
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-stone-200 text-center">
                <p className="text-stone-600 text-sm">
                  Changed your mind?{" "}
                  <Link
                    href="/register"
                    className="text-amber-600 hover:text-amber-700 font-semibold"
                  >
                    Go back to register
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>

        <p className="text-center text-stone-500 text-xs mt-6">
          OTP is valid for 10 minutes. Do not share your OTP with anyone.
        </p>
      </motion.div>
    </div>
  );
}
