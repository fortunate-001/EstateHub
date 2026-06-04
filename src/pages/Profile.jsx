import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import "../styles/Profile.css";

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("info");
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    location: "",
    occupation: "",
    bio: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        navigate("/login");
        return;
      }

      setUser(currentUser);
      setFormData({
        name: currentUser.displayName || "",
        phone: "",
        location: "",
        occupation: "",
        bio: "",
      });

      try {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData(data);
          setFormData({
            name: data.name || currentUser.displayName || "",
            phone: data.phone || "",
            location: data.location || "",
            occupation: data.occupation || "",
            bio: data.bio || "",
          });
        } else {
          // Create user document if it doesn't exist
          await setDoc(userDocRef, {
            uid: currentUser.uid,
            name: currentUser.displayName || "",
            email: currentUser.email,
            phone: "",
            location: "",
            occupation: "",
            bio: "",
            role: "user",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    setMessage({ type: "", text: "" });
    
    try {
      const currentUser = auth.currentUser;
      
      // Update Firebase Auth profile
      if (formData.name !== user?.displayName) {
        await updateProfile(currentUser, { displayName: formData.name });
      }
      
      // Update Firestore
      const userDocRef = doc(db, "users", currentUser.uid);
      await updateDoc(userDocRef, {
        name: formData.name,
        phone: formData.phone,
        location: formData.location,
        occupation: formData.occupation,
        bio: formData.bio,
        updatedAt: new Date().toISOString(),
      });
      
      setMessage({ type: "success", text: "Profile updated successfully!" });
      setIsEditing(false);
      
      // Refresh user data
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({ type: "error", text: "Error updating profile. Please try again." });
    }
  };

  const handlePasswordUpdate = async () => {
    setMessage({ type: "", text: "" });
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" });
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters" });
      return;
    }
    
    try {
      const currentUser = auth.currentUser;
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        passwordData.currentPassword
      );
      
      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, passwordData.newPassword);
      
      setMessage({ type: "success", text: "Password updated successfully!" });
      setShowPasswordModal(false);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      
      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 3000);
    } catch (error) {
      console.error("Error updating password:", error);
      if (error.code === "auth/wrong-password") {
        setMessage({ type: "error", text: "Current password is incorrect" });
      } else {
        setMessage({ type: "error", text: "Error updating password. Please try again." });
      }
    }
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="profile-loader"></div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-page-new">
      <div className="profile-container-new">
        {/* Cover Image */}
        <div className="profile-cover">
          <div className="cover-image"></div>
          <div className="avatar-container">
            <div className="avatar-new">
              <img 
                src={user?.photoURL || `https://ui-avatars.com/api/?background=007bff&color=fff&name=${formData.name || "User"}&size=128`} 
                alt="Profile"
              />
              <button className="change-photo-btn">
                <i className="bx bx-camera"></i>
              </button>
            </div>
            <div className="profile-name-section">
              <h2>{formData.name || "User Name"}</h2>
              <p>{user?.email}</p>
              <span className="member-badge">
                <i className="bx bx-check-circle"></i> Verified Member
              </span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="profile-main-new">
          {/* Sidebar */}
          <div className="profile-sidebar">
            <div className="sidebar-menu">
              <button 
                className={`menu-item ${activeTab === "info" ? "active" : ""}`}
                onClick={() => setActiveTab("info")}
              >
                <i className="bx bx-user"></i>
                <span>Personal Info</span>
              </button>
              <button 
                className={`menu-item ${activeTab === "security" ? "active" : ""}`}
                onClick={() => setActiveTab("security")}
              >
                <i className="bx bx-lock-alt"></i>
                <span>Security</span>
              </button>
              <button 
                className={`menu-item ${activeTab === "properties" ? "active" : ""}`}
                onClick={() => setActiveTab("properties")}
              >
                <i className="bx bx-home"></i>
                <span>My Properties</span>
              </button>
              <button 
                className={`menu-item ${activeTab === "saved" ? "active" : ""}`}
                onClick={() => setActiveTab("saved")}
              >
                <i className="bx bx-heart"></i>
                <span>Saved Properties</span>
              </button>
              <button 
                className={`menu-item ${activeTab === "inquiries" ? "active" : ""}`}
                onClick={() => setActiveTab("inquiries")}
              >
                <i className="bx bx-message"></i>
                <span>My Inquiries</span>
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="profile-content-new">
            {/* Message Display */}
            {message.text && (
              <div className={`message-alert ${message.type}`}>
                <i className={message.type === "success" ? "bx bx-check-circle" : "bx bx-error"}></i>
                {message.text}
              </div>
            )}

            {/* Personal Info Tab */}
            {activeTab === "info" && (
              <div className="tab-content">
                <div className="content-header">
                  <h3><i className="bx bx-user-circle"></i> Personal Information</h3>
                  {!isEditing && (
                    <button className="edit-btn-new" onClick={() => setIsEditing(true)}>
                      <i className="bx bx-edit"></i> Edit Profile
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <div className="edit-form-new">
                    <div className="form-row">
                      <div className="form-group">
                        <label>Full Name</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div className="form-group">
                        <label>Email Address</label>
                        <input
                          type="email"
                          value={user?.email}
                          disabled
                          className="disabled-input"
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Phone Number</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Enter your phone number"
                        />
                      </div>
                      <div className="form-group">
                        <label>Location</label>
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          placeholder="Enter your location"
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Occupation</label>
                        <input
                          type="text"
                          name="occupation"
                          value={formData.occupation}
                          onChange={handleInputChange}
                          placeholder="Enter your occupation"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Bio / About Me</label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        rows="4"
                        placeholder="Tell us a little about yourself..."
                      ></textarea>
                    </div>

                    <div className="form-actions-new">
                      <button className="cancel-btn-new" onClick={() => setIsEditing(false)}>Cancel</button>
                      <button className="save-btn-new" onClick={handleSave}>Save Changes</button>
                    </div>
                  </div>
                ) : (
                  <div className="info-grid-new">
                    <div className="info-row">
                      <div className="info-label">Full Name</div>
                      <div className="info-value">{formData.name || "Not provided"}</div>
                    </div>
                    <div className="info-row">
                      <div className="info-label">Email Address</div>
                      <div className="info-value">{user?.email}</div>
                    </div>
                    <div className="info-row">
                      <div className="info-label">Phone Number</div>
                      <div className="info-value">{formData.phone || "Not provided"}</div>
                    </div>
                    <div className="info-row">
                      <div className="info-label">Location</div>
                      <div className="info-value">{formData.location || "Not provided"}</div>
                    </div>
                    <div className="info-row">
                      <div className="info-label">Occupation</div>
                      <div className="info-value">{formData.occupation || "Not provided"}</div>
                    </div>
                    <div className="info-row">
                      <div className="info-label">Member Since</div>
                      <div className="info-value">
                        {user?.metadata?.creationTime 
                          ? new Date(user.metadata.creationTime).toLocaleDateString() 
                          : "N/A"}
                      </div>
                    </div>
                    {formData.bio && (
                      <div className="info-row bio-row">
                        <div className="info-label">About Me</div>
                        <div className="info-value">{formData.bio}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div className="tab-content">
                <div className="content-header">
                  <h3><i className="bx bx-shield"></i> Security Settings</h3>
                </div>

                <div className="security-card">
                  <div className="security-info">
                    <div className="security-icon">
                      <i className="bx bx-key"></i>
                    </div>
                    <div className="security-details">
                      <h4>Password</h4>
                      <p>Last changed: {userData?.passwordLastChanged || "Never"}</p>
                    </div>
                    <button className="change-password-btn" onClick={() => setShowPasswordModal(true)}>
                      Change Password
                    </button>
                  </div>
                </div>

                <div className="security-card">
                  <div className="security-info">
                    <div className="security-icon">
                      <i className="bx bx-envelope"></i>
                    </div>
                    <div className="security-details">
                      <h4>Email Address</h4>
                      <p>{user?.email}</p>
                    </div>
                    <button className="change-password-btn disabled" disabled>
                      Change Email
                    </button>
                  </div>
                </div>

                <div className="security-card">
                  <div className="security-info">
                    <div className="security-icon">
                      <i className="bx bx-log-out"></i>
                    </div>
                    <div className="security-details">
                      <h4>Session Management</h4>
                      <p>Manage your active sessions</p>
                    </div>
                    <button className="logout-sessions-btn" onClick={() => auth.signOut()}>
                      Sign Out All
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* My Properties Tab */}
            {activeTab === "properties" && (
              <div className="tab-content">
                <div className="content-header">
                  <h3><i className="bx bx-home"></i> My Properties</h3>
                  <button className="add-property-btn" onClick={() => navigate("/add-property")}>
                    <i className="bx bx-plus"></i> Add Property
                  </button>
                </div>

                <div className="empty-state">
                  <i className="bx bx-building-house"></i>
                  <h4>No Properties Yet</h4>
                  <p>You haven't listed any properties. Click "Add Property" to get started.</p>
                </div>
              </div>
            )}

            {/* Saved Properties Tab */}
            {activeTab === "saved" && (
              <div className="tab-content">
                <div className="content-header">
                  <h3><i className="bx bx-heart"></i> Saved Properties</h3>
                </div>

                <div className="empty-state">
                  <i className="bx bx-heart"></i>
                  <h4>No Saved Properties</h4>
                  <p>Start saving properties you like by clicking the heart icon.</p>
                </div>
              </div>
            )}

            {/* Inquiries Tab */}
            {activeTab === "inquiries" && (
              <div className="tab-content">
                <div className="content-header">
                  <h3><i className="bx bx-message"></i> My Inquiries</h3>
                </div>

                <div className="empty-state">
                  <i className="bx bx-chat"></i>
                  <h4>No Inquiries Yet</h4>
                  <p>When you inquire about properties, they will appear here.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Change Password</h3>
              <button className="modal-close" onClick={() => setShowPasswordModal(false)}>
                <i className="bx bx-x"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter current password"
                />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter new password"
                />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirm new password"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-modal-btn" onClick={() => setShowPasswordModal(false)}>Cancel</button>
              <button className="save-modal-btn" onClick={handlePasswordUpdate}>Update Password</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;