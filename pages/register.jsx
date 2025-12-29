import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

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

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          fullName, 
          username, 
          email, 
          password 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
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
        <h1 style={styles.title}>Create Account</h1>
        <p style={styles.subtitle}>Join the Cave Art Analyzer</p>

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
            {loading ? "Creating account..." : "Register"}
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
    background: "linear-gradient(135deg, #0f0f0f, #1c1917)",
    padding: "20px",
  },
  card: {
    width: "100%",
    maxWidth: "420px",
    background: "#111",
    borderRadius: "12px",
    padding: "32px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
  },
  title: {
    color: "#fbbf24",
    textAlign: "center",
    marginBottom: "4px",
  },
  subtitle: {
    color: "#a8a29e",
    textAlign: "center",
    marginBottom: "24px",
  },
  label: {
    display: "block",
    color: "#e7e5e4",
    marginBottom: "6px",
    marginTop: "16px",
  },
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #444",
    background: "#0a0a0a",
    color: "#fff",
  },
  button: {
    width: "100%",
    marginTop: "24px",
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    background: "#f59e0b",
    color: "#000",
    fontWeight: "bold",
    cursor: "pointer",
  },
  error: {
    color: "#ef4444",
    marginTop: "12px",
    fontSize: "14px",
  },
  footer: {
    marginTop: "20px",
    textAlign: "center",
    color: "#a8a29e",
    fontSize: "14px",
  },
  link: {
    color: "#fbbf24",
    cursor: "pointer",
    textDecoration: "underline",
  },
};
