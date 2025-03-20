// Frontend: AllAppointment.js
import { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";
import {assets} from "../../assets/assets_admin/assets"
const AllAppointment = () => {
    const { aToken, appointments, getAllAppointments,cancelAppointment } = useContext(AdminContext);

   const {calculateAge,slotDateFormat}=useContext(AppContext)

    useEffect(() => {
        if (aToken && aToken !== "null" && aToken !== "undefined") {
            getAllAppointments();
        }
    }, [aToken]);

    return (
        <div className="w-full max-w-7xl m-5">
            <p className="mb-3 text-lg font-medium">All Appointments</p>
            <div className="bg-white border border-gray-200 rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll">
                <div className="hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b border-gray-200">
                    <p>#</p>
                    <p>Patient</p>
                    <p>Age</p>
                    <p>Date & Time</p>
                    <p>Doctor</p>
                    <p>Fees</p>
                    <p>Actions</p>
                </div>
                
                {/* ✅ Corrected map function */}
                {
    appointments.map((item, index) => {
     
        return (
            <div key={index} className="grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] py-3 px-6 border-b border-gray-200">
                <p>{index + 1}</p>
                <div className="flex items-center gap-2">
                    {item?.userId?.image && <img src={item?.userId?.image} className="w-8 h-8 rounded-full" />}
                    <p>{item.userId?.name || "Unknown"}</p>
                </div>
                <p className="max-sm:hidden">{calculateAge(item.userId.dob) || 'N/A'}</p>
                <p>{slotDateFormat(item.slotDate)} | {item.slotTime}</p>
                <div className="flex items-center gap-1">

                <img className="w-10 rounded-full bg-gray-200" src={item.docData?.image} alt="" />
                <p>{item.docData?.name || "N/A"}</p>
                </div>
                <p>₹{item.docData?.fees || 0}</p>
                {item.cancelled?
                <p className="text-red-400 text-xs font-medium">Cancelled</p>: item.isCompleted?
                <p className="text-green-500 text-xs font-medium">Completed</p>:
                <img onClick={()=>cancelAppointment(item._id)} className="w-10 cursor-pointer " src={assets.cancel_icon} alt="" />
                }
            </div>
        );
    })
}

            </div>
        </div>
    );
}

export default AllAppointment;
