import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets_frontend/assets";
import axios from "axios";
import { toast } from "react-toastify";

const MyProfile = () => {
  const { userData, setUserData, token, backendUrl, loadUserProfileData } = useContext(AppContext);
  const [edit, setEdit] = useState(false);
  const [image, setImage] = useState(null);

  const updateUserProfileData = async () => {
    try {
      const formData = new FormData();
      formData.append('name',userData.name)
      formData.append('phone',userData.phone)
      formData.append('address',JSON.stringify(userData.address))
      formData.append('gender',userData.gender);
      formData.append('dob',userData.dob);
      image && formData.append('image',image);
      const {data}=await axios.post(backendUrl + '/api/user/update-profile',formData,{headers:{token}})
      if(data.success){
        toast.success(data.message)
        loadUserProfileData();
        setEdit(false);
        setImage(false)
      }
      else{
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message);
    }
  };

  // Ensure userData and address are always defined
  const defaultUserData = {
    image: "",
    name: "",
    email: "",
    phone: "",
    address: { line1: "", line2: "" },
    gender: "",
    dob: ""
  };

  const profileData = userData || defaultUserData;

  return (
    <div className="max-w-lg flex flex-col gap-2 text-sm">
      {edit ? (
        <label htmlFor="image">
          <div className="inline-block relative cursor-pointer">
            <img className="w-36 rounded opacity-75" src={image ? URL.createObjectURL(image) : profileData.image} alt="Profile" />
            <img className="w-10 absolute bottom-12 right-12" src={image ? "" : assets.upload_icon} alt="Upload" />
          </div>
          <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden />
        </label>
      ) : (
        <img className="w-36 rounded" src={profileData.image} alt="Profile" />
      )}
      {edit ? (
        <input
          className="bg-gray-50 text-3xl font-medium max-w-60 mt-4"
          type="text"
          value={profileData.name}
          onChange={(e) => setUserData((prev) => ({ ...prev, name: e.target.value }))}
        />
      ) : (
        <p className="font-medium text-3xl text-neutral-800 mt-4">
          {profileData.name || "No Name"}
        </p>
      )}
      <hr className="bg-zinc-400 h-[1px] border-none" />
      <div>
        <p className="text-neutral-500 underline mt-3">CONTACT INFORMATION</p>
        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
          <p className="font-medium">Email:</p>
          <p className="text-blue-500">{profileData.email || "Not Provided"}</p>
          <p className="font-medium">Phone:</p>
          {edit ? (
            <input
              className="bg-gray-100 max-w-52"
              type="text"
              value={profileData.phone}
              onChange={(e) => setUserData((prev) => ({ ...prev, phone: e.target.value }))}
            />
          ) : (
            <p className="text-blue-400">{profileData.phone || "Not Provided"}</p>
          )}
          <p className="font-medium">Address:</p>
          {edit ? (
            <div>
              <input
                className="bg-gray-50"
                type="text"
                onChange={(e) =>
                  setUserData((prev) => ({
                    ...prev,
                    address: { ...prev.address, line1: e.target.value },
                  }))
                }
                value={profileData.address?.line1 || ""}
              />
              <br />
              <input
                className="bg-gray-50"
                type="text"
                onChange={(e) =>
                  setUserData((prev) => ({
                    ...prev,
                    address: { ...prev.address, line2: e.target.value },
                  }))
                }
                value={profileData.address?.line2 || ""}
              />
            </div>
          ) : (
            <p className="text-gray-500">
              {profileData.address?.line1 || "No Address Provided"}
              <br />
              {profileData.address?.line2 || ""}
            </p>
          )}
        </div>
      </div>
      <div>
        <p className="text-neutral-500 underline mt-3">BASIC INFORMATION</p>
        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
          <p className="font-medium">Gender:</p>
          {edit ? (
            <select
              className="max-w-20 bg-gray-100"
              onChange={(e) => setUserData((prev) => ({ ...prev, gender: e.target.value }))}
              value={profileData.gender || ""}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          ) : (
            <p className="text-gray-400">{profileData.gender || "Not Provided"}</p>
          )}
          <p className="font-medium">Birthday:</p>
          {edit ? (
            <input
              className="max-w-28 bg-gray-100"
              type="date"
              onChange={(e) => setUserData((prev) => ({ ...prev, dob: e.target.value }))}
              value={profileData.dob || ""}
            />
          ) : (
            <p className="text-gray-400">{profileData.dob || "Not Provided"}</p>
          )}
        </div>
      </div>
      <div className="mt-10">
        {edit ? (
          <button
            className="border border-[#5f6FFF] px-8 py-2 rounded-full hover:bg-[#5f6FFF] hover:text-white transition-all"
            onClick={updateUserProfileData}
          >
            Save Information
          </button>
        ) : (
          <button
            className="border border-[#5f6FFF] px-8 py-2 rounded-full hover:bg-[#5f6FFF] hover:text-white transition-all"
            onClick={() => setEdit(true)}
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
