import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { FaUserAlt } from "react-icons/fa";
import "./style.css";
import { RingLoader } from "react-spinners";
import { setLogout } from "../../components/redux/reducers/auth";
import { Link, useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const { token } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const history = useNavigate();

  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    userName: "",
    address: "",
    location: "",
    country: "",
    profilePicture: "",
    role: "",
    socialMedia: "",
    bio: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [passChange, setPassChange] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [deactivatingMsg, setDeactivatingMsg] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get("https://smartcart-xdki.onrender.com/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userDetails = res.data.user;

        const role =
          userDetails.role_id === 3
            ? "Customer"
            : userDetails.role_id === 2
            ? "Seller"
            : "Admin";

        setUserData({
          firstName: userDetails.first_name || "",
          lastName: userDetails.last_name || "",
          email: userDetails.email,
          userName: userDetails.username,
          address: userDetails.address || "",
          location: userDetails.location || "",
          country: userDetails.country || "",
          profilePicture: userDetails.profile_image || "",
          role,
          socialMedia: userDetails.social_media || "",
          bio: userDetails.bio || "",
        });
      } catch (err) {
        setMessage("Failed to load user data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [token]);

  const handleDeactivateAccount = async () => {
    if (!window.confirm("Are you sure you want to deactivate your account?")) {
      return;
    }

    setIsDeactivating(true);
    try {
      const response = await axios.put(
        "https://smartcart-xdki.onrender.com/users/deactivate-profile",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setDeactivatingMsg(
        response.data.message || "Account deactivated successfully"
      );
    } catch (error) {
      setDeactivatingMsg("Failed to deactivate account. Please try again.");
      console.error("Error deactivating account:", error);
    } finally {
      setIsDeactivating(false);
      dispatch(setLogout());
      history("/");
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!userData.firstName.trim()) errors.firstName = "First name is required";
    if (!userData.lastName.trim()) errors.lastName = "Last name is required";
    if (!userData.email.includes("@"))
      errors.email = "Enter a valid email address";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError("");

    if (!newPassword) {
      setPasswordError("New password is required.");
      return;
    }

    try {
      const response = await axios.put(
        "https://smartcart-xdki.onrender.com/users/change-password",
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(response.data.message);
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      setPasswordError(
        err.response ? err.response.data.message : "Error updating password"
      );
    }
  };

  const handleFileChange = async (e) => {
    setIsUploading(true);
    setUploadError("");

    console.log("isUploading :", isUploading);
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("profile_image", file);

      try {

        const res = await axios.put(
          "https://smartcart-xdki.onrender.com/users/profile",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const updatedProfilePicture = URL.createObjectURL(file);

        setUserData((prevState) => ({
          ...prevState,
          profilePicture: updatedProfilePicture,
        }));

        console.log("Profile updated:", res.data);
      } catch (error) {
        console.error("Error uploading profile image:", error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSaving(true);

    try {
      const {
        firstName,
        lastName,
        country,
        address,
        location,
        profilePicture,
        bio,
        socialMedia,
      } = userData;

      const response = await axios.put(
        "https://smartcart-xdki.onrender.com/users/profile",
        {
          firstName,
          lastName,
          country,
          address,
          location,
          profile_image: profilePicture,
          bio,
          social_media: socialMedia,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Profile updated successfully:", response);

      setIsEditing(false);
      setMessage("Profile updated successfully!");
    } catch (err) {
      console.log("Error updating profile:", err);
      setMessage("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setIsSaving(false);
    setUserData((prevState) => ({
      ...prevState,
      profilePicture: prevState.profilePicture || "",
    }));
    setFormErrors({});
  };

  return (
    <div className="profile-page">
      <div className="profile__header">
        <h2>Profile Page</h2>
        {message && <p className="profile__message">{message}</p>}
      </div>

      {isEditing ? (
        <div className="profile_Layout_Edit">
          <form onSubmit={handleProfileSubmit} className="profile__form">
            <div className="form-group">
              <label>First Name:</label>
              <input
                type="text"
                name="firstName"
                value={userData.firstName}
                onChange={handleChange}
                aria-required="true"
              />
              {formErrors.firstName && (
                <small className="error">{formErrors.firstName}</small>
              )}
            </div>
            <div className="form-group">
              <label>Last Name:</label>
              <input
                type="text"
                name="lastName"
                value={userData.lastName}
                onChange={handleChange}
                aria-required="true"
              />
              {formErrors.lastName && (
                <small className="error">{formErrors.lastName}</small>
              )}
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input type="text" name="email" value={userData.email} disabled />
            </div>
            <div className="form-group">
              <label>User Name:</label>
              <input
                type="text"
                name="userName"
                value={userData.userName}
                disabled
              />
            </div>
            <div className="form-group">
              <label>Country:</label>
              <input
                type="text"
                name="country"
                value={userData.country}
                onChange={handleChange}
                aria-required="true"
              />
            </div>
            <div className="form-group">
              <label>Address:</label>
              <input
                type="text"
                name="address"
                value={userData.address}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Location:</label>
              <input
                type="text"
                name="location"
                value={userData.location}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Social Media:</label>
              <input
                type="text"
                name="socialMedia"
                value={userData.socialMedia}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Bio:</label>
              <input
                type="text"
                name="bio"
                value={userData.bio}
                onChange={handleChange}
              />
            </div>
            {passChange ? (
              <>
                <div className="buttons">
                  <button
                    type="button"
                    onClick={() => {
                      setPassChange(false);
                    }}
                    className="btn btn-save"
                  >
                    Close Change Password
                  </button>
                </div>
              </>
            ) : (
              <div className="buttons">
                <button
                  type="button"
                  onClick={() => {
                    setPassChange(true);
                  }}
                  className="btn btn-save"
                >
                  Change Password
                </button>
              </div>
            )}
            {passChange && (
              <>
                <div className="pass_container">
                  <div className="form-group">
                    <label>Old Password:</label>
                    <input
                      type="password"
                      name="oldPassword"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>New Password:</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    {passwordError ? (
                      <small className="error">{passwordError}</small>
                    ) : (
                      <small className="pass_msg">{message}</small>
                    )}
                  </div>
                  <div className="buttons">
                    <button
                      type="button"
                      onClick={handlePasswordChange}
                      className="btn btn-save"
                    >
                      Change Password
                    </button>
                  </div>
                </div>
              </>
            )}
            <div className="form-group">
              <label>Profile Picture:</label>
              <input type="file" onChange={handleFileChange} />
              {uploadError && <small className="error">{uploadError}</small>}
              <div className="profile__picture-container">
                {userData.profilePicture ? (
                  <img
                    src={userData.profilePicture}
                    alt="Profile Picture"
                    className="profile__picture"
                  />
                ) : (
                  <div className="profile__picture-icon">
                    <FaUserAlt size={50} />
                  </div>
                )}
                {isUploading && (
                  <div className="profile__spinner">
                    <RingLoader color="#36d7b7" size={100} />
                  </div>
                )}
              </div>
            </div>
            <div className="buttons">
              <button type="submit" className="btn btn-save">
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                className="btn btn-cancel"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="profile_Layout">
          <div className="profile__picture-container">
            {userData.profilePicture ? (
              <div className="profile__picture" id="profilePicture">
                <img
                  src={userData.profilePicture}
                  alt="Profile Picture"
                  className="profile__picture"
                />
              </div>
            ) : (
              <div className="profile__picture-icon">
                <FaUserAlt size={50} />
              </div>
            )}
          </div>
          <div className="profile__details">
            <div className="details__titles">
              <p>First Name:</p>
              <p>Last Name:</p>
              <p>Email:</p>
              <p>User Name:</p>
              <p>Country:</p>
              <p>Address:</p>
              <p>Location:</p>
              <p>Social Media:</p>
              <p>Bio:</p>
              <p>Role:</p>
            </div>
            <div className="details__info">
              <p>{userData.firstName}</p>
              <p>{userData.lastName}</p>
              <p>{userData.email}</p>
              <p>{userData.userName}</p>
              <p>{userData.country}</p>
              <p>{userData.address}</p>
              <p>{userData.location}</p>
              <p>
                <a
                  href={userData.socialMedia}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {userData.socialMedia}
                </a>
              </p>
              <p>{userData.bio}</p>
              <p>{userData.role}</p>
            </div>
          </div>
          <div className="buttons_Profile">
            <button className="btn btn-edit" onClick={() => setIsEditing(true)}>
              Edit Profile
            </button>
            <button
              className="btn btn-danger"
              onClick={handleDeactivateAccount}
              disabled={isDeactivating}
            >
              {isDeactivating ? "Deactivating..." : "Deactivate Account"}
            </button>
          </div>
          <small className="error">{deactivatingMsg}</small>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
