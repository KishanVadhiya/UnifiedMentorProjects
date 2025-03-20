import { assets } from "../assets/assets_frontend/assets";

const About = () => {
    return (
        <div>
            <div className="text-center text-2xl pt-10 text-gray-500">
                <p>ABOUT <span className="text-gray-700 font-medium">US</span></p>
            </div>
            <div className="my-10 flex flex-col md:flex-row gap-12 ">
                <img className="w-full md:max-w-[400px]" src={assets.about_image} alt="" />
                <div className="flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600">
                    <p>Welcome To HealthHub, Your Trusted Partner in Managing Your Healthcare Needs Conveniently And Efficiently. At HealthHub, We Understand The Challenges Individuals Face When It Cornes To Scheduling Doctor Appointments And Managing Their Health Records.
                    </p>
                    <p>HealthHub Is Committed To Excellence In Healthcare Technology. We Continuously Strive To Enhance Our Platform. Integrating The Latest Advancements To Improve User Experience And Deliver Superior Service Whether You&apos;re Booking Your First Appointment Or Managing Ongoing Care. HealthHub Is Here To Support You Every Step Of The Way.</p>
                    <b className="text-gray-800">Our Vision
                    </b>
                    <p>Our Vision At HealthHub Is To Create A Seamless Healthcare Experience For Every User. We Aim To Bridge The Gap Between Patients And Healthcare Providers, Making It Easier For You To Access The Care You Need, When You Need It.</p>
                </div>
            </div>

            <div className="text-xl my-4">
                <p>WHY <span className="text-gray-700 font-semibold">CHOOSE US</span></p>
            </div>
            <div className="flex flex-col gap-1 md:flex-row  mb-20 ">
                <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-[#5f6FFF] hover:text-white transition-all duration-300 text-gray-600 cursor-pointer" >
                    <b>Efficiency</b>
                    <p>Streamlined appointment scheduling that fits into your busy lifestyle.</p>
                </div>
                <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-[#5f6FFF] hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
                    <b>Convenience</b>
                    <p>Access to network of trusted healthcare professionals in your area.</p>
                </div>
                <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-[#5f6FFF] hover:text-white transition-all duration-300 text-gray-600 cursor-pointer"> 
                    <b>Personalization</b>
                    <p>Tailored recommendations and reminders to help you stay on top of your health.</p>
                </div>
            </div>
        </div>
    );
}

export default About;
