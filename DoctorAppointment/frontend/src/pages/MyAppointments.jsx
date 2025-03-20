import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const MyAppointments = () => {
    const { backendUrl, token, user, getDoctorData } = useContext(AppContext);
    const [appointments, setAppointments] = useState([]);

    const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    const slotDateFormat = (slotDate) => {
        const dateArray = slotDate.split('_');
        return `${dateArray[0]} ${months[Number(dateArray[1])]} ${dateArray[2]}`;
    };

    const getUserAppointments = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/user/appointments`, {
                headers: { token },
            });
    
            console.log("API Response:", data); // Check actual response
    
            if (Array.isArray(data)) {  // ✅ Directly check if data is an array
                setAppointments(data.reverse());
            } else {
                toast.error(data?.message || "Failed to fetch appointments.");
            }
        } catch (error) {
            console.error("Error fetching appointments:", error);
            toast.error("An error occurred while fetching appointments.");
        }
    };
    
    

    const cancelAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/user/cancel-appointment`,
                { appointmentId, userId: user?._id },
                { headers: { token } }
            );
    
            if (data.success) {
                toast.success(data.message);
    
                // ✅ Update the state locally instead of refetching from API
                setAppointments((prevAppointments) =>
                    prevAppointments.map((appointment) =>
                        appointment._id === appointmentId
                            ? { ...appointment, cancelled: true }
                            : appointment
                    )
                );
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Error canceling appointment");
        }
    };
    

    useEffect(() => {
        if (token) {
            getUserAppointments();
        }
    }, [token]);

    return (
        <div>
            <p className="pb-3 mt-12 font-medium text-zinc-700 border-b border-gray-300">My Appointments</p>
            <div>
                {appointments.length > 0 ? (
                    appointments.map((item, index) => (
                        <div className="grid grid-cols-[1fr_3fr] gap-4 sm:flex sm:gap-2 py-2 border-b border-gray-300" key={index}>
                            {/* Doctor Image */}
                            <div>
                                <img 
                                    className="w-32 h-32 object-cover bg-indigo-50" 
                                    src={item.docId?.image || "/placeholder-doctor.png"} 
                                    alt="Doctor"
                                />
                            </div>

                            {/* Appointment Details */}
                            <div className="flex-1 text-sm text-zinc-600">
                                <p className="text-neutral-800 font-semibold">{item.docId?.name || "Unknown Doctor"}</p>
                                <p>{item.docId?.speciality || "Speciality Not Available"}</p>
                                <p className="text-zinc-700 font-medium mt-1">Address:</p>
                                <p className="text-xs">{item.docId?.address?.line1 || "N/A"}</p>
                                <p className="text-xs">{item.docId?.address?.line2 || ""}</p>
                                <p className="text-xs mt-1">
                                    <span className="text-sm text-neutral-700 font-medium">Date & Time: </span>
                                    {slotDateFormat(item.slotDate)} | {item.slotTime}
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col gap-2 justify-end">
                                
                                {!item.cancelled && !item.isCompleted && (
                                    <button 
                                        onClick={() => cancelAppointment(item._id)} 
                                        className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border hover:bg-red-600 hover:text-white transition-all duration-300"
                                    >
                                        Cancel Appointment
                                    </button>
                                )}
                                {item.cancelled && !item.isCompleted &&(
                                    <button className="sm:min-w-48 py-2 border border-red-500 rounded text-red-500">
                                        Appointment Cancelled
                                    </button>
                                )}
                                {item.isCompleted && <button className="sm:min-w-48 py-2 border border-green-500 rounded text-green-500 ">Completed</button>}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-center mt-6">No appointments found.</p>
                )}
            </div>
        </div>
    );
};

export default MyAppointments;
