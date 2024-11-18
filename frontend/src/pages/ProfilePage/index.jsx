import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import "./style.css";

const ProfilePage = () => {
  const { token } = useSelector((state) => state.auth);
  const [userData, setUserData] = useState({
    userName: "",
    email: "",
    address: "",
    location: "",
    role: "",
    accountStatus: "",
    profilePicture: "",
    socialMedia: "",
    bio: "",
    firstName: "",
    lastName: "",
    country: "",
    isVerified: false,
    isBlocked: false,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/users/profile", {
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
          userName: userDetails.username,
          email: userDetails.email,
          address: userDetails.address || "Not provided",
          location: userDetails.location || "Not provided",
          role,
          accountStatus: userDetails.is_active ? "Active" : "Inactive",
          profilePicture: userDetails.profile_image || "/default-profile.png",
          socialMedia: userDetails.social_media || "Not provided",
          bio: userDetails.bio || "Not provided",
          firstName: userDetails.first_name,
          lastName: userDetails.last_name,
          country: userDetails.country || "Not provided",
          isVerified: userDetails.is_verified,
          isBlocked: userDetails.is_blocked,
        });
      } catch (err) {
        setError("Failed to load user data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [token]);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const { firstName, lastName, country, location, profilePicture } =
        userData;
      await axios.put(
        "http://localhost:5000/users/profile",
        {
          firstName,
          lastName,
          country,
          location,
          profile_image: profilePicture,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsEditing(false);
    } catch (err) {
      setError("Failed to update profile");
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="profile">
      <div className="profile__header">
        <h2>Profile Page</h2>
      </div>

      {isEditing ? (
        <form onSubmit={handleProfileSubmit} className="profile__form">
          <div>
            <p>
              <strong>First Name:</strong>
            </p>
            <input
              type="text"
              name="firstName"
              value={
                userData.firstName === "Not provided" ? "" : userData.firstName
              }
              onChange={handleChange}
            />
          </div>
          <div>
            <p>
              <strong>Last Name:</strong>
            </p>
            <input
              type="text"
              name="lastName"
              value={
                userData.lastName === "Not provided" ? "" : userData.lastName
              }
              onChange={handleChange}
            />
          </div>
          <div>
            <p>
              <strong>Username:</strong>
            </p>
            <input
              type="text"
              name="Username"
              value={userData.userName}
              disabled
            />
          </div>
          <div>
            <p>
              <strong>Email:</strong>
            </p>
            <input type="text" name="Email" value={userData.email} disabled />
          </div>
          <div>
            <p>
              <strong>Country:</strong>
            </p>
            <input
              type="text"
              name="country"
              value={
                userData.country === "Not provided" ? "" : userData.country
              }
              onChange={handleChange}
            />
          </div>
          <div>
            <p>
              <strong>Adress:</strong>
            </p>
            <input
              type="text"
              name="Adress"
              value={
                userData.address === "Not provided" ? "" : userData.address
              }
              onChange={handleChange}
            />
          </div>
          <div>
            <p>
              <strong>Location:</strong>
            </p>
            <input
              type="text"
              name="location"
              value={
                userData.location === "Not provided" ? "" : userData.location
              }
              onChange={handleChange}
            />
          </div>
          <div>
            <p>
              <strong>Role:</strong>
            </p>
            <input type="text" name="Role" value={userData.role} disabled />
          </div>
          <div>
            <p>
              <strong>Account Status:</strong>
            </p>
            <input
              type="text"
              name="Account Status"
              value={userData.accountStatus}
              disabled
            />
          </div>
          <div>
            <p>
              <strong>Social Media:</strong>
            </p>
            <input
              type="text"
              name="Social Media"
              value={
                userData.socialMedia === "Not provided"
                  ? ""
                  : userData.socialMedia
              }
              onChange={handleChange}
            />
          </div>
          <div>
            <p>
              <strong>Bio:</strong>
            </p>
            <input
              type="text"
              name="Bio"
              value={userData.bio === "Not provided" ? "" : userData.bio}
              onChange={handleChange}
            />
          </div>
          <div>
            <p>
              <strong>Profile Picture:</strong>
            </p>
            <input
              type="text"
              name="profilePicture"
              value={userData.profilePicture}
              onChange={handleChange}
            />
          </div>
          <button type="submit">Save Changes</button>
        </form>
      ) : (
        <div className="profile__details">
          <div>
            <p>
              <strong>First Name:</strong> {userData.firstName}
            </p>
          </div>
          <div>
            <p>
              <strong>Last Name:</strong> {userData.lastName}
            </p>
          </div>
          <div>
            <p>
              <strong>Username:</strong> {userData.userName}
            </p>
          </div>
          <div>
            <p>
              <strong>Email:</strong> {userData.email}
            </p>
          </div>
          <div>
            <p>
              <strong>Country:</strong> {userData.country}
            </p>
          </div>
          <div>
            <p>
              <strong>Address:</strong> {userData.address}
            </p>
          </div>
          <div>
            <p>
              <strong>Location:</strong> {userData.location}
            </p>
          </div>
          <div>
            <p>
              <strong>Role:</strong> {userData.role}
            </p>
          </div>
          <div>
            <p>
              <strong>Account Status:</strong> {userData.accountStatus}
            </p>
          </div>
          <div>
            <p>
              <strong>Social Media:</strong> {userData.socialMedia}
            </p>
          </div>
          <div>
            <p>
              <strong>Bio:</strong> {userData.bio}
            </p>
          </div>
          <div>
            <p>
              <strong>Profile Picture:</strong>
            </p>
            <img
              src={userData.profilePicture}
              alt="Profile"
              className="profile__picture"
            />
          </div>
          <button
            className="profile__edit-btn"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
