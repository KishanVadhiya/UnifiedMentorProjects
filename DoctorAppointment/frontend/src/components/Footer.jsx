import { assets } from "../assets/assets_frontend/assets";

const Footer = () => {
  return (
    <div className="md:mx-10">
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
        {/* left */}
        <div>
          <img className='mb-5 w-40' src={assets.logo} alt="" />
          <p className="w-full md:w-2/3 text-gray-600 leading-6">
           Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellat in nostrum tempora recusandae! Nemo consequatur ex aut sit suscipit hic atque. Sapiente quo quis iure aliquam rem nobis ad deserunt!
          </p>
        </div>
    

      <div>
        {/* center */}
        <p className="text-xl font-medium mb-5">Company</p>
        <ul className="flex flex-col gap-2 text-gray-600">
          <li>Home</li>
          <li>About</li>
          <li>Contact Us</li>
          <li>Privacy policy</li>
        </ul>
      </div>
      <div>
        {/* right */}
        <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
        <ul className="flex flex-col gap-2 text-gray-600">
          <li>+91 999xxx99xx</li>
          <li>xyz@gmail.com</li>
        </ul>
      </div>
    </div>
        <div>
            {/* CopyRight Text */}
            <hr className="border-gray-300 dark:border-gray"/>
            <p className="py-5 text-sm text-center">Copyright 2025@ HealthHub- All Right Reserved.</p>
        </div>
    </div>

  );
};

export default Footer;
