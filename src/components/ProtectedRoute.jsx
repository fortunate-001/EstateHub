import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { auth } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";

function ProtectedRoute({ children, adminOnly = false }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Or a spinner
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  const adminEmails = ["admin@example.com", "fortunateolawale7@gmail.com"];
  const isAdmin = adminEmails.includes(user.email);

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;
