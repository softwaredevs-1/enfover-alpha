import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "../redux/slices/authSlice";
import { generateInviteLink } from "../api/userApi"; // Import the new API function
import { FaEdit, FaArrowLeft, FaCheckCircle, FaLink } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Profile = () => {
  const dispatch = useDispatch();
  const { profile, loading, error } = useSelector((state) => state.auth);
  const [inviteLink, setInviteLink] = useState("");
  const [inviteLoading, setInviteLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  // Back handler
  const handleBack = () => {
    window.history.back();
  };

  // Generate Invite Link
  const handleGenerateLink = async () => {
    try {
      setInviteLoading(true);
      const link = await generateInviteLink(); // Fetch invite link
      setInviteLink(link); // Set the invite link
    } catch (error) {
      console.error("Failed to generate invite link:", error);
      alert("Error generating invite link");
    } finally {
      setInviteLoading(false);
    }
  };

  return (
    <div className="relative max-w-5xl mx-auto my-8 p-6 bg-gray-50 shadow-md rounded-md">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="absolute top-4 left-4 text-gray-500 hover:text-blue-500 transition"
      >
        <FaArrowLeft size={20} />
      </button>

      {/* Header Section */}
      {loading ? <SkeletonHeader /> : <Header profile={profile} />}
      {error && <div className="text-center mt-8 text-red-500">{error}</div>}

      {/* Profile Body */}
      <div className="mt-8">
        <Section title="User Profile">
          <EditableProfileField label="Name" value={profile?.name} loading={loading} editable />
          <ProfileField label="Role" value={profile?.role} loading={loading} />
          <EditableProfileField label="Gender" value={profile?.gender} loading={loading} editable />
          {profile?.role === "Student" && (
            <>
              <ProfileField label="Grade" value={profile?.grade} loading={loading} />
              <ProfileField label="Subscription Status" value={profile?.subscriptionStatus} loading={loading} />
            </>
          )}
        </Section>

        {/* Invite Link */}
        {profile?.role === "Student" && (
          <Section title="Invite Link">
            <div className="flex justify-between items-center">
              <p className="text-gray-600">Generate Invite Link</p>
              <button
                onClick={handleGenerateLink}
                className={`flex items-center gap-2 px-4 py-2 rounded text-white transition ${
                  inviteLoading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
                }`}
                disabled={inviteLoading}
              >
                <FaLink />
                {inviteLoading ? "Generating..." : "Generate Link"}
              </button>
            </div>
            {inviteLink && (
              <div className="mt-2 text-blue-600 break-all">
                <a href={inviteLink} target="_blank" rel="noopener noreferrer">
                  {inviteLink}
                </a>
              </div>
            )}
          </Section>
        )}

        <Section title="Security">
          <ProfileField label="Email" value={profile?.email || "N/A"} loading={loading} />
          <EditableProfileField label="Password" value="********" loading={loading} editable />
        </Section>
      </div>
    </div>
  );
};

// Other Components remain unchanged
const Header = ({ profile }) => (
  <div className="relative text-center">
    <div className="absolute top-2 right-2 flex items-center gap-1 text-red-500 font-semibold">
      <FaCheckCircle size={16} />
      <span>Unverified</span>
    </div>
    <img
      src={profile?.profileImage || "https://via.placeholder.com/150"}
      alt="Profile"
      className="w-28 h-28 rounded-full mx-auto border-2 border-gray-300"
    />
    <h1 className="text-3xl font-semibold mt-2">{profile?.name || "No Name"}</h1>
    <p className="text-gray-500">{profile?.role}</p>
  </div>
);

const Section = ({ title, children }) => (
  <div className="mt-8">
    <h2 className="text-lg font-semibold mb-2">{title}</h2>
    <div className="bg-white rounded-lg shadow-sm p-4">{children}</div>
  </div>
);

const ProfileField = ({ label, value, loading }) => (
  <div className="flex items-center justify-between border-b pb-2">
    <div>
      <p className="text-gray-600">{label}</p>
      {loading ? <Skeleton width={150} height={18} /> : <p>{value || "N/A"}</p>}
    </div>
  </div>
);

const EditableProfileField = ({ label, value, loading, editable }) => (
  <ProfileField label={label} value={value} loading={loading} />
);

const SkeletonHeader = () => (
  <div className="text-center">
    <Skeleton circle height={112} width={112} className="mx-auto" />
    <Skeleton height={28} width={180} className="mt-4 mx-auto" />
    <Skeleton height={18} width={100} className="mt-2 mx-auto" />
  </div>
);

export default Profile;
