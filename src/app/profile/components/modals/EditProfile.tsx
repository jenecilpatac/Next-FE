import api from "@/app/lib/axiosCall";
import { useState } from "react";
import useToastr from "../../hooks/Toastr";
import { formatDate } from "date-fns";

export default function EditProfile({
  isOpen,
  onClose,
  editModalRef,
  user,
  setIsRefresh,
  openAddProfileModal,
  isSetProfile,
}: any) {
  const { showSuccess }: any = useToastr();
  const [isUpdateBio, setIsUpdateBio] = useState(false);
  const [isUpdatePersonalDetails, setIsUpdatePersonalDetails] = useState(false);
  const [error, setError] = useState<string | any>("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [gender, setGender] = useState("");
  const maxLength = 101;
  const [bio, setBio] = useState("");
  const [isBioLoading, setIsBioLoading] = useState(false);
  const [isPersonalDetailsLoading, setIsPersonalDetailsLoading] =
    useState(false);

  if (!isOpen) return null;

  const toggleUpdateBio = () => {
    setIsUpdateBio(!isUpdateBio);
    setBio(user?.bio || "");
    setError("");
  };

  const toggleUpdatePersonalDetails = () => {
    setIsUpdatePersonalDetails(!isUpdatePersonalDetails);
    setError("");
    setDateOfBirth(formatDate(user?.dateOfBirth || new Date(), "yyyy-MM-dd"));
    setAddress(user?.address || "");
    setPhoneNumber(user?.phoneNumber || "");
    setJobTitle(user?.jobTitle || "");
    setGender(user?.gender || "");
  };

  const handleUpdateBio = async (e: any) => {
    e.preventDefault();
    setIsRefresh(true);
    setIsBioLoading(true);
    try {
      const response = await api.patch("/profile/update-bio", { bio });
      if (response.status === 200) {
        setIsUpdateBio(false);
        setBio("");
        showSuccess(response.data.message, "Bio Updated");
        setError("");
      }
    } catch (error: any) {
      console.error(error);
      setError(error.response.data);
    } finally {
      setIsRefresh(false);
      setIsBioLoading(false);
    }
  };

  const handleUpdatePersonalDetails = async (e: any) => {
    e.preventDefault();
    setIsRefresh(true);
    setIsPersonalDetailsLoading(true);
    try {
      const response = await api.patch("/profile/update-personal-details", {
        dateOfBirth,
        address,
        phoneNumber,
        jobTitle,
        gender,
      });
      if (response.status === 200) {
        setError("");
        showSuccess(response.data.message, "Profile Updated");
        setAddress("");
        setPhoneNumber("");
        setJobTitle("");
        setGender("");
        setIsUpdatePersonalDetails(false);
      }
    } catch (error: any) {
      console.error(error);
      setError(error.response.data);
    } finally {
      setIsRefresh(false);
      setIsPersonalDetailsLoading(false);
    }
  };

  const fieldClass =
    "block w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-[50] p-4">
      <div
        ref={editModalRef}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
              <i className="fa-solid fa-user-pen text-blue-600 dark:text-blue-400 text-sm" />
            </div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
              Edit Profile
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <i className="fa-solid fa-xmark text-sm" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 p-5 space-y-4">
          {/* Profile picture */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Profile Picture
            </p>
            <button
              type="button"
              onClick={openAddProfileModal}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            >
              <i
                className={`fa-solid ${isSetProfile?.length === 0 || isSetProfile === undefined ? "fa-plus" : "fa-image"}`}
              />
              {isSetProfile?.length === 0 || isSetProfile === undefined
                ? "Upload Picture"
                : "Update Picture"}
            </button>
          </div>

          {/* Bio */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Bio
              </p>
              <button
                type="button"
                onClick={toggleUpdateBio}
                className="inline-flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                <i
                  className={`fa-solid ${isUpdateBio ? "fa-xmark" : user?.bio ? "fa-pen" : "fa-plus"}`}
                />
                {isUpdateBio ? "Cancel" : user?.bio ? "Edit" : "Add"}
              </button>
            </div>
            {isUpdateBio ? (
              <div className="space-y-2">
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  maxLength={101}
                  placeholder="Describe yourself in a few words..."
                  className={`${fieldClass} resize-none`}
                />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    {maxLength - bio.length} characters remaining
                  </span>
                  <button
                    disabled={!bio || isBioLoading}
                    onClick={handleUpdateBio}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isBioLoading ? (
                      <>
                        <i className="fa-solid fa-spinner animate-spin" />{" "}
                        Saving...
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-floppy-disk" /> Save
                      </>
                    )}
                  </button>
                </div>
                {error?.bio && (
                  <small className="text-red-500">{error?.bio.message}</small>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                {user?.bio || "No bio yet. Add one to let others know you."}
              </p>
            )}
          </div>

          {/* Personal Details */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Personal Details
              </p>
              <button
                type="button"
                onClick={toggleUpdatePersonalDetails}
                className="inline-flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                <i
                  className={`fa-solid ${isUpdatePersonalDetails ? "fa-xmark" : user?.phoneNumber || user?.address ? "fa-pen" : "fa-plus"}`}
                />
                {isUpdatePersonalDetails
                  ? "Cancel"
                  : user?.phoneNumber || user?.address
                    ? "Edit"
                    : "Add"}
              </button>
            </div>
            {isUpdatePersonalDetails ? (
              <form
                onSubmit={handleUpdatePersonalDetails}
                className="space-y-3"
              >
                {[
                  {
                    label: "Date of Birth",
                    type: "date",
                    value: dateOfBirth,
                    onChange: setDateOfBirth,
                    error: error?.dateOfBirth,
                  },
                  {
                    label: "Address",
                    type: "text",
                    value: address,
                    onChange: setAddress,
                    placeholder: "Enter your address",
                    error: error?.address,
                  },
                  {
                    label: "Phone Number",
                    type: "text",
                    value: phoneNumber,
                    onChange: setPhoneNumber,
                    placeholder: "Enter your phone number",
                    error: error?.phoneNumber,
                  },
                  {
                    label: "Job Title",
                    type: "text",
                    value: jobTitle,
                    onChange: setJobTitle,
                    placeholder: "Enter your job title",
                    error: error?.jobTitle,
                  },
                ].map(
                  ({
                    label,
                    type,
                    value,
                    onChange,
                    placeholder,
                    error: fieldError,
                  }: any) => (
                    <div key={label}>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        {label}
                      </label>
                      <input
                        type={type}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={placeholder}
                        className={fieldClass}
                      />
                      {fieldError && (
                        <small className="text-red-500">
                          {fieldError.message}
                        </small>
                      )}
                    </div>
                  ),
                )}
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className={fieldClass}
                  >
                    <option value="" hidden>
                      Select gender
                    </option>
                    <option value="" disabled>
                      Select gender
                    </option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="NonBinary">Non binary</option>
                    <option value="Other">Other</option>
                    <option value="PreferNotToSay">Prefer not to say</option>
                  </select>
                  {error?.gender && (
                    <small className="text-red-500">
                      {error?.gender.message}
                    </small>
                  )}
                </div>
                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    disabled={isPersonalDetailsLoading}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isPersonalDetailsLoading ? (
                      <>
                        <i className="fa-solid fa-spinner animate-spin" />{" "}
                        Saving...
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-floppy-disk" /> Save
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex flex-wrap gap-2">
                {[
                  {
                    icon: "fa-location-dot",
                    value: user?.address,
                    fallback: "No address",
                  },
                  {
                    icon: "fa-phone",
                    value: user?.phoneNumber,
                    fallback: "No phone",
                  },
                  {
                    icon: "fa-cake-candles",
                    value: user?.dateOfBirth,
                    fallback: "No birthday",
                  },
                  {
                    icon: "fa-briefcase",
                    value: user?.jobTitle,
                    fallback: "No job title",
                  },
                  {
                    icon: "fa-venus-mars",
                    value: user?.gender,
                    fallback: "No gender",
                  },
                ].map(({ icon, value, fallback }) => (
                  <span
                    key={fallback}
                    className={`inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full ${value ? "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700" : "text-gray-400 dark:text-gray-600 italic"}`}
                  >
                    <i className={`fa-solid ${icon} text-gray-400`} />
                    {value || fallback}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
