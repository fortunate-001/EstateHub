import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { auth, db } from "../firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, updateDoc, serverTimestamp, increment } from "firebase/firestore";
import "../styles/Auth.css";

function Login() {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setError("");
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          values.email,
          values.password,
        );

        // Update user's last login in Firestore
        const userRef = doc(db, "users", userCredential.user.uid);
        await updateDoc(userRef, {
          lastLogin: serverTimestamp(),
          loginCount: increment(1),
        });

        navigate("/");
      } catch (err) {
        console.error("Login error:", err);
        if (err.code === "auth/user-not-found") {
          setError("No account found with this email. Please register first.");
        } else if (err.code === "auth/wrong-password") {
          setError("Incorrect password. Please try again.");
        } else {
          setError("Failed to login. Please check your credentials.");
        }
      }
    },
  });

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Welcome Back</h1>
        <p>Login to your account</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={formik.handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={
                formik.touched.email && formik.errors.email ? "error-input" : ""
              }
            />
            {formik.touched.email && formik.errors.email && (
              <div className="field-error">{formik.errors.email}</div>
            )}
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={
                formik.touched.password && formik.errors.password
                  ? "error-input"
                  : ""
              }
            />
            {formik.touched.password && formik.errors.password && (
              <div className="field-error">{formik.errors.password}</div>
            )}
          </div>

          <button
            type="submit"
            className="auth-btn"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
