import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { FaUserAlt } from "react-icons/fa";
import "./style.css";
import { useNavigate, useParams } from "react-router-dom";

const UserProfile = () => {
  const { token } = useSelector((state) => state.auth);
  const history = useNavigate();
  const { userId } = useParams();

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
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/users/${userId}`, {
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
  }, [token, userId]);

  if (isLoading) return <div className="loading-spinner">Loading...</div>;

  return (
    <div className="profile-page">
      <div className="profile__header">
        <h2>Profile Page</h2>
        {message && <p className="profile__message">{message}</p>}
      </div>
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
      </div>
    </div>
  );
};

export default UserProfile;
