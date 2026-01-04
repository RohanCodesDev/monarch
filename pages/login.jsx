import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import MonarchLogo from "../components/MonarchLogo";

export default function LoginPage() {
  const router = useRouter();
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  useEffect(() => {
    if (router.query.verified) {
      setVerificationSuccess(true);
      const timer = setTimeout(() => setVerificationSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [router.query.verified]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Store user info in localStorage
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("userEmail", data.email);
      localStorage.setItem("userName", data.name || "");
      localStorage.setItem("username", data.username || "");

      // Redirect to home page
      router.push("/homepg");

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <MonarchLogo size="lg" animated={false} />
        </div>
        <h1 style={styles.title}>Welcome Back</h1>
        <p style={styles.subtitle}>Historic Artifacts Explorer</p>

        {verificationSuccess && (
          <div style={styles.success}>
            ✓ Email verified! You can now login.
          </div>
        )}

        <form onSubmit={handleLogin}>
          <label style={styles.label}>Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            placeholder="you@example.com"
          />

          <label style={styles.label}>Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            placeholder="Enter your password"
          />

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p style={styles.footer}>
          Don&apos;t have an account?{" "}
          <Link href="/register" style={styles.link}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

/* ---------------- Styles ---------------- */

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #0a0a0a 0%, #1a1410 50%, #0a0a0a 100%)",
    padding: "16px",
    position: "relative",
    overflow: "hidden",
  },
  card: {
    width: "100%",
    maxWidth: "420px",
    background: "rgba(17, 17, 17, 0.95)",
    borderRadius: "16px",
    padding: "clamp(24px, 5vw, 32px)",
    boxShadow: "0 20px 40px rgba(0,0,0,0.6), 0 0 100px rgba(245, 158, 11, 0.1)",
    border: "1px solid rgba(245, 158, 11, 0.2)",
    backdropFilter: "blur(10px)",
  },
  title: {
    color: "#fbbf24",
    textAlign: "center",
    marginBottom: "4px",
    fontSize: "clamp(24px, 5vw, 28px)",
  },
  subtitle: {
    color: "#a8a29e",
    textAlign: "center",
    marginBottom: "24px",
    fontSize: "clamp(13px, 2.5vw, 14px)",
  },
  label: {
    display: "block",
    color: "#e7e5e4",
    marginBottom: "6px",
    marginTop: "16px",
    fontSize: "14px",
    fontWeight: "500",
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "8px",
    border: "1px solid #444",
    background: "#0a0a0a",
    color: "#fff",
    fontSize: "15px",
    transition: "border-color 0.2s",
    outline: "none",
  },
  button: {
    width: "100%",
    marginTop: "24px",
    padding: "14px",
    borderRadius: "8px",
    border: "none",
    background: "linear-gradient(135deg, #f59e0b, #d97706)",
    color: "#000",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "16px",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  error: {
    color: "#ef4444",
    marginTop: "12px",
    fontSize: "13px",
    padding: "8px 12px",
    background: "rgba(239, 68, 68, 0.1)",
    borderRadius: "6px",
    border: "1px solid rgba(239, 68, 68, 0.3)",
  },
  footer: {
    marginTop: "20px",
    textAlign: "center",
    color: "#a8a29e",
    fontSize: "clamp(13px, 2.5vw, 14px)",
  },
  link: {
    color: "#fbbf24",
    cursor: "pointer",
    textDecoration: "underline",
  },
  success: {
    background: "linear-gradient(135deg, #10b981, #059669)",
    color: "#fff",
    padding: "14px",
    borderRadius: "8px",
    marginBottom: "16px",
    fontSize: "14px",
    textAlign: "center",
    fontWeight: "500",
    border: "1px solid rgba(16, 185, 129, 0.3)",
  },
};
