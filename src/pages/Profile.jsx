import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import "../styles/Profile.css";

function Profile() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const currentUser = auth.currentUser;
    setUser(currentUser);
    setName(currentUser?.displayName || "");

    fetchUserData(currentUser?.uid);
  }, []);

  const fetchUserData = async (uid) => {
    if (uid) {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserData(docSnap.data());
      }
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await updateProfile(user, { displayName: name });
      setMessage("Profile updated successfully!");
      setEditing(false);
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage("Error updating profile");
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <i className="bx bxs-user-circle"></i>
          <h1>My Profile</h1>
        </div>

        {message && <div className="success-message">{message}</div>}

        <div className="profile-info">
          <div className="info-group">
            <label>Email:</label>
            <p>{user?.email}</p>
          </div>

          <div className="info-group">
            <label>Name:</label>
            {editing ? (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            ) : (
              <p>{user?.displayName || "Not set"}</p>
            )}
          </div>

          <div className="info-group">
            <label>Member Since:</label>
            <p>
              {userData?.createdAt?.toDate().toLocaleDateString() || "Recently"}
            </p>
          </div>

          <div className="profile-actions">
            {editing ? (
              <>
                <button className="save-btn" onClick={handleUpdateProfile}>
                  Save
                </button>
                <button
                  className="cancel-btn"
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button className="edit-btn" onClick={() => setEditing(true)}>
                Edit Profile
              </button>
            )}
          </div>
        </div>

        <div className="profile-stats">
          <h3>My Activity</h3>
          <div className="stats">
            <div className="stat">
              <span>Properties Viewed</span>
              <strong>0</strong>
            </div>
            <div className="stat">
              <span>Saved Properties</span>
              <strong>0</strong>
            </div>
            <div className="stat">
              <span>Inquiries Made</span>
              <strong>0</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
