import { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import axios from "axios";
import { toast } from "react-toastify";

const DoctorProfile = () => {
  const { dToken, profileData, setProfileData, getProfileData,backendUrl } =
    useContext(DoctorContext);
    console.log("Backend URL:", backendUrl);

  const [isEdit, setIsEdit] = useState(false);
  const updateProfile = async () => {
    try {
        const updateData = {
            address: profileData.address,
            fees: profileData.fees,
            about: profileData.about,
            available: profileData.available,
        };

        const { data } = await axios.post(
            `${backendUrl}/api/doctor/update-profile`,
            updateData,
            { 
                headers: { 
                    Authorization: `Bearer ${dToken}` // Ensure token is passed as Authorization header
                }
            }
        );

        if (data.success) {
            toast.success(data.message);
            setIsEdit(false);
            getProfileData(); // Update profile data after successful update
        } else {
            toast.error(data.message);
        }
    } catch (error) {
        toast.error(error.message);
        console.log(error);
    }
};

  useEffect(() => {
    if (dToken) {
      getProfileData();
    }
  }, [dToken]);

  return (
    profileData && (
      <div>
        <div className="flex flex-col gap-4 m-5">
          <div>
            <img
              className="bg-[#5f6FFF] w-full sm:max-w-64 rounded-lg"
              src={profileData.image}
              alt=""
            />
          </div>
          <div className="flex-1 border border-stone-100 rounded-lg p-8 py-7 bg-white">
            <p className="flex items-center gap-2 text-3xl font-medium text-gray-700">
              {profileData.name}
            </p>
            <div className="flex items-center gap-2 mt-1 text-gray-600 ">
              <p>
                {profileData.degree} - {profileData.speciality}
              </p>
              <button className="py-0.5 px-2 border text-xs rounded-full">
                {profileData.experience}
              </button>
            </div>
            <div>
              <p className="flex items-center gap-1 text-sm font-medium text-neutral-800 mt-3">
                About:
              </p>
              <p className="text-sm text-gray-600 max-w-[700px] mt-1">
                {isEdit ? (
                  <input className="w-2xl p-3 h-15 border border-gray-400 "
                    type="textarea"
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        about: Number(e.target.value),
                      }))
                    }
                    value={profileData.about || ""}
                  />
                ) : (
                  profileData.about
                )}
                
             
              </p>
            </div>
            <p className="text-gray-600 font-medium mt-4 mb-2">
              Appointment fee:
              <span className="text-gray-800">
                ₹{" "}
                {isEdit ? (
                  <input  className=" px-2 border border-gray-400 "
                    type="number"
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        fees: Number(e.target.value),
                      }))
                    }
                    value={profileData.fees || ""}
                  />
                ) : (
                  profileData.fees
                )}
              </span>
            </p>

            <div className="flex gap-2 py-2">
              <p>Address:</p>
              <p className="text-sm">
                {isEdit ? <input className="px-2 border border-gray-400" type="text" onChange={(e)=>setProfileData(prev=>({...prev,address:{...prev.address,line1:e.target.value}}))} value={profileData.address.line1}/>: profileData.address.line1}
                <br />
                {isEdit ? <input className="px-2 border border-gray-400" type="text" onChange={(e)=>setProfileData(prev=>({...prev,address:{...prev.address,line2: e.target.value}}))} value={profileData.address.line2}/>: profileData.address.line2}
              </p>
            </div>
            <div className="flex gap-1 pt-2">
              <input
                checked={profileData.available}
                type="checkbox"
                onChange={() => isEdit && 
                  setProfileData((prev) => ({
                    ...prev,
                    available:!prev.available,
                  }))
                }
              />
              <label htmlFor="">Available</label>
            </div>
{
    isEdit? 
    <button
              onClick={updateProfile}
              className="px-4 py-1 border border-[#5f6FFF] text-sm rounded-full mt-5 hover:bg-[#5f6FFF] hover:text-white transition-all"
            >
              Save
            </button>
            :<button
            onClick={() => setIsEdit(true)}
            className="px-4 py-1 border border-[#5f6FFF] text-sm rounded-full mt-5 hover:bg-[#5f6FFF] hover:text-white transition-all"
          >
            Edit
          </button>

}

            
            
          </div>
        </div>
      </div>
    )
  );
};

export default DoctorProfile;
