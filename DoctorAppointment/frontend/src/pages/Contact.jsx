import { assets } from "../assets/assets_frontend/assets";
import { FaInstagram, FaFacebook, FaWhatsapp } from 'react-icons/fa';
const Contact = () => {
  return (
    <div>
      <div className="text-center text-2xl pt-10 text-gray-500">
        <p>
          CONTACT <span className="text-gray-700 font-semibold">US</span>
        </p>
      </div>

      <div className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 text-sm">
        <img className="w-full md:max-w-[360px] rounded-lg" src={assets.contact_image} />
        <div className="flex flex-col  items-start gap-6">
          <h2 className="text-3xl text-gray-600">Reach on my Social accounts</h2>
          <div className="socialIcons">
        <li><a href="#"><FaInstagram className="insta" /></a></li>
        <li><a href="#"><FaFacebook className="facebook"/></a></li>
        <li><a href="#"><FaWhatsapp className="whatsapp"/></a></li>
      </div>
          <div className="flex flex-col gap-4">
            <h3 className="font-medium text-2xl">Contact No : <span className="font-normal text-2xl">+91 999xxx99xx</span></h3>
            <h3 className="font-medium text-2xl">Email:  <span className="font-normal text-2xl">abc@gmail.com</span> </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
