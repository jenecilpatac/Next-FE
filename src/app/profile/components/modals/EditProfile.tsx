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
  const [dateOfBirth, setDateOfBirth] = useState<string | any>("");
  const [address, setAddress] = useState<string | any>("");
  const [phoneNumber, setPhoneNumber] = useState<string | any>("");
  const [jobTitle, setJobTitle] = useState<string | any>("");
  const [gender, setGender] = useState<string | any>("");
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-[50]">
      <div
        ref={editModalRef}
        className="p-6 bg-white dark:bg-gray-700 shadow-md w-full rounded-lg m-3 md:w-1/2 relative max-h-screen overflow-y-auto"
      >
        <button
          type="button"
          onClick={onClose}
          className="px-2 text-white py-0.5 rounded-full bg-gray-400 bg-opacity-75 hover:scale-95 transition-all duration-300 ease-in-out hover:bg-gray-500 hover:bg-opacity-75 absolute top-2 right-2"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
        <h2 className="text-xl text-center font-bold mb-4">Edit Profile</h2>
        <hr className="border-gray-500" />
        <div>
          <div className="my-2">
            <div>
              <h2 className="text-xl font-bold">Update profile picture</h2>
            </div>

            <div className="flex justify-center items-center">
              <button
                type="button"
                className="my-3 font-bold px-2 py-1 bg-blue-500 bg-opacity-65 hover:translate-x-1 hover:scale-95 text-white rounded-md hover:bg-opacity-75 transition-all duration-300 ease-in-out"
                onClick={openAddProfileModal}
              >
                {isSetProfile?.length === 0 || isSetProfile === undefined ? (
                  <>
                    <i className="fa-solid fa-plus"></i> Upload profile picture
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-image"></i> Update Picture
                  </>
                )}
              </button>
            </div>
          </div>
          <div className="my-2 justify-between flex">
            <div>
              <h2 className="text-xl font-bold">Bio</h2>
            </div>
            <button type="button" onClick={toggleUpdateBio}>
              {!isUpdateBio ? (
                <>
                  {user?.bio === null ? (
                    <>
                      <i className="fa-solid fa-plus"></i> Add
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-pen"></i> Edit
                    </>
                  )}
                </>
              ) : (
                <>
                  <i className="fa-solid fa-xmark"></i> Cancel
                </>
              )}
            </button>
          </div>
          <div className="mb-4">
            {isUpdateBio ? (
              <div className="flex flex-col justify-center items-center">
                <div className="flex flex-col w-full justify-center items-center">
                  <textarea
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full md:w-1/2 p-2 rounded-md text-center dark:bg-gray-600 shadow-md border border-gray-200 bg-gray-50 dark:border-gray-500 active:ring-1 active:ring-blue-300 focus:outline-none focus:border-blue-300 focus:ring-blue-300 focus:ring-1"
                    placeholder="Describe yourself in a few words so that others can get to
                    know you"
                    maxLength={101}
                  ></textarea>

                  {error?.bio && (
                    <small className="text-red-500">{error?.bio.message}</small>
                  )}
                </div>
                {maxLength - bio.length !== 0 ? (
                  <p className="text-gray-500 text-sm">
                    {maxLength - bio.length} characters remaining
                  </p>
                ) : (
                  <p className="text-gray-500 text-sm">
                    You have reached the maximum character limit.
                  </p>
                )}
                <div className="flex gap-2 mt-2">
                  <button
                    type="button"
                    onClick={toggleUpdateBio}
                    className="bg-gray-500 bg-opacity-75 hover:bg-gray-600 hover:scale-95 px-2 py-2 text-white rounded-lg text-sm"
                  >
                    <i className="fa-solid fa-xmark"></i> Cancel
                  </button>
                  <button
                    disabled={!bio || isBioLoading}
                    onClick={handleUpdateBio}
                    className={`bg-blue-600 hover:bg-blue-700 hover:scale-95 px-2 py-2 text-white rounded-lg text-sm ${
                      !bio ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {isBioLoading ? (
                      <>
                        <i className="fa-solid fa-spinner animate-spin"></i>{" "}
                        Saving...
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-save"></i> Save
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400">
                {user?.bio ? (
                  user?.bio
                ) : (
                  <>
                    Describe yourself in a few words so that others can get to
                    know you
                  </>
                )}
              </p>
            )}
          </div>
        </div>
        <div className="mb-4">
          <div className="my-2 justify-between flex">
            <div>
              <h2 className="text-xl font-bold">Personal Details</h2>
            </div>
            <button type="button" onClick={toggleUpdatePersonalDetails}>
              {!isUpdatePersonalDetails ? (
                <>
                  {user?.phoneNumber ||
                  user?.address ||
                  user?.dateOfBirth ||
                  user?.jobTitle ||
                  user?.gender ? (
                    <>
                      <i className="fa-solid fa-pen"></i> Edit
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-plus"></i> Add
                    </>
                  )}
                </>
              ) : (
                <>
                  <i className="fa-solid fa-xmark"></i> Cancel
                </>
              )}
            </button>
          </div>
          {isUpdatePersonalDetails ? (
            <form onSubmit={handleUpdatePersonalDetails}>
              <div className="w-full flex justify-center">
                <div className="flex-col flex -space-y-3 w-full md:w-2/3">
                  <div className="p-2">
                    <label htmlFor="date_of_birth" className="block mb-1">
                      Date of birth
                    </label>
                    <input
                      type="date"
                      value={dateOfBirth}
                      className="w-full rounded-md p-2 dark:bg-gray-600 shadow-md border border-gray-200 bg-gray-50 dark:border-gray-500 active:ring-1 active:ring-blue-300 focus:outline-none focus:border-blue-300 focus:ring-blue-300 focus:ring-1"
                      onChange={(e) => setDateOfBirth(e.target.value)}
                    />
                    {error?.dateOfBirth && (
                      <small className="text-red-500">
                        {error?.dateOfBirth.message}
                      </small>
                    )}
                  </div>
                  <div className="p-2">
                    <label htmlFor="address" className="block mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      value={address}
                      placeholder="Enter your address"
                      className="w-full rounded-md p-2 dark:bg-gray-600 shadow-md border border-gray-200 bg-gray-50 dark:border-gray-500 active:ring-1 active:ring-blue-300 focus:outline-none focus:border-blue-300 focus:ring-blue-300 focus:ring-1"
                      onChange={(e) => setAddress(e.target.value)}
                    />
                    {error?.address && (
                      <small className="text-red-500">
                        {error?.address.message}
                      </small>
                    )}
                  </div>
                  <div className="p-2">
                    <label htmlFor="phoneNumber" className="block mb-1">
                      Phone Number
                    </label>
                    <input
                      value={phoneNumber}
                      type="text"
                      placeholder="Enter your phone number"
                      className="w-full rounded-md p-2 dark:bg-gray-600 shadow-md border border-gray-200 bg-gray-50 dark:border-gray-500 active:ring-1 active:ring-blue-300 focus:outline-none focus:border-blue-300 focus:ring-blue-300 focus:ring-1"
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                    {error?.phoneNumber && (
                      <small className="text-red-500">
                        {error?.phoneNumber.message}
                      </small>
                    )}
                  </div>
                  <div className="p-2">
                    <label htmlFor="jobtitle" className="block mb-1">
                      Job Title
                    </label>
                    <input
                      type="text"
                      value={jobTitle}
                      placeholder="Enter your job title"
                      className="w-full rounded-md p-2 dark:bg-gray-600 shadow-md border border-gray-200 bg-gray-50 dark:border-gray-500 active:ring-1 active:ring-blue-300 focus:outline-none focus:border-blue-300 focus:ring-blue-300 focus:ring-1"
                      onChange={(e) => setJobTitle(e.target.value)}
                    />
                    {error?.jobTitle && (
                      <small className="text-red-500">
                        {error?.jobTitle.message}
                      </small>
                    )}
                  </div>
                  <div className="p-2">
                    <label htmlFor="gender" className="block mb-1">
                      Select Gender
                    </label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full rounded-md p-2 dark:bg-gray-600 shadow-md border border-gray-200 bg-gray-50 dark:border-gray-500 active:ring-1 active:ring-blue-300 focus:outline-none focus:border-blue-300 focus:ring-blue-300 focus:ring-1"
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
                  <div className="p-4 justify-center flex gap-2">
                    <button
                      onClick={toggleUpdatePersonalDetails}
                      type="button"
                      className="bg-gray-500 bg-opacity-75 hover:bg-gray-600 hover:scale-95 px-2 py-2 text-white rounded-lg text-sm"
                    >
                      <i className="fa-solid fa-xmark"></i> Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isPersonalDetailsLoading}
                      className="bg-blue-600 hover:bg-blue-700 hover:scale-95 px-2 py-2 text-white rounded-lg text-sm"
                    >
                      {isPersonalDetailsLoading ? (
                        <>
                          <i className="fa-solid fa-spinner animate-spin"></i>{" "}
                          Saving...
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-save"></i> Save
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <div className="flex justify-center">
              <ul
                role="list"
                className="marker:text-blue-300 list-disc pl-5 space-y-2 text-gray-500 dark:text-gray-400"
              >
                <li>{user?.address || "Add your address"}</li>
                <li>{user?.phoneNumber || "Add your phone number"}</li>
                <li>{user?.dateOfBirth || "Add your date of birth"}</li>
                <li>{user?.jobTitle || "Add your job title"}</li>
                <li>{user?.gender || "Add your gender"}</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
