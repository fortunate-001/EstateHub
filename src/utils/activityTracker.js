// src/utils/activityTracker.js
import { db } from "../firebase/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  increment,
} from "firebase/firestore";

// Track page views
export const trackPageView = async (pageName) => {
  try {
    await addDoc(collection(db, "analytics"), {
      type: "page_view",
      page: pageName,
      timestamp: serverTimestamp(),
      userAgent: navigator.userAgent,
      referrer: document.referrer,
    });
  } catch (error) {
    console.error("Error tracking page view:", error);
  }
};

// Track user login
export const trackUserLogin = async (userId, userEmail) => {
  try {
    await addDoc(collection(db, "userActivity"), {
      userId: userId,
      userEmail: userEmail,
      action: "login",
      timestamp: serverTimestamp(),
      ip: "collected",
    });

    // Update user's last login
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      lastLogin: serverTimestamp(),
      loginCount: increment(1),
    });
  } catch (error) {
    console.error("Error tracking login:", error);
  }
};

// Track user registration
export const trackUserRegistration = async (userId, userEmail, userName) => {
  try {
    await addDoc(collection(db, "userActivity"), {
      userId: userId,
      userEmail: userEmail,
      userName: userName,
      action: "register",
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error tracking registration:", error);
  }
};

// Track property view
export const trackPropertyView = async (propertyId, propertyTitle) => {
  try {
    await addDoc(collection(db, "analytics"), {
      type: "property_view",
      propertyId: propertyId,
      propertyTitle: propertyTitle,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error tracking property view:", error);
  }
};
