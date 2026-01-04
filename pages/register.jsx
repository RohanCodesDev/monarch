import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import MonarchLogo from "../components/MonarchLogo";

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate passwords match
      if (password !== confirmPassword) {
        throw new Error("Passwords do not match");
      }

      // Validate password length
      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }

      // Validate username
      if (username.length < 3) {
        throw new Error("Username must be at least 3 characters");
      }

      // Send OTP to email first (include name and password for session storage)
      const otpResponse = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email, 
          username,
          name: fullName,
          password,
        }),
      });

      const otpData = await otpResponse.json();

      if (!otpResponse.ok) {
        throw new Error(otpData.error || "Failed to send OTP");
      }

      // Redirect to OTP verification page (registration data stored server-side in cookie)
      router.push("/verify-otp");

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
        <h1 style={styles.title}>Create Account</h1>
        <p style={styles.subtitle}>Join Monarch</p>

        <form onSubmit={handleRegister}>
          <label style={styles.label}>Full Name</label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            style={styles.input}
            placeholder="John Doe"
          />

          <label style={styles.label}>Username</label>
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
            placeholder="johndoe"
            minLength="3"
          />

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
            placeholder="Minimum 6 characters"
            minLength="6"
          />

          <label style={styles.label}>Confirm Password</label>
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={styles.input}
            placeholder="Re-enter your password"
            minLength="6"
          />

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "Sending OTP..." : "Create Account"}
          </button>
        </form>

        <p style={styles.footer}>
          Already registered?{" "}
          <Link href="/login" style={styles.link}>
            Login
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
};
