import React, { useContext, useState } from "react";
import { MdEmail } from "react-icons/md";
import { IoMdLock } from "react-icons/io";
import { IoAlertOutline } from "react-icons/io5";
import { FiSend } from "react-icons/fi";
import { BsShieldLockFill } from "react-icons/bs";
import { FaRegCheckCircle } from "react-icons/fa";
import { FaShield } from "react-icons/fa6";
import { AiTwotoneMail } from "react-icons/ai";
import { StoreContext } from "../../Context/StoreContext";
import { toast } from "react-toastify";
import axios from "axios";

const ChangeEmail = () => {
  const{setActive,setEmail,userUrl,accessToken} = useContext(StoreContext);
  const [data,setData] = useState({
    newEmail:"",
    oldEmail:""
  })

  const onChangeHandler = (e)=>{
    const { name, value} = e.target;

    setData((prev)=>({
      ...prev,
      [name]:value,
    }))
  }

  const submitHandler = async(e)=>{
    e.preventDefault();
    try {
      if(data.newEmail == data.oldEmail){
      toast.error("Current Email must be different");
      return;
    }
    console.log("email accessToken :",accessToken);
    const response = await axios.post(`${userUrl}/change-email`,
      {
        newEmail:data.newEmail
      },
      {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    if(response?.data?.success){
      setEmail(data.newEmail);
      setActive("EmailVerify");
      setData({
        oldEmail:"",
        newEmail:""
      })
      toast.success(response?.data?.message);
    }else{
      return toast.error(response?.data?.message);
    }
    } catch (error) {
      console.log(error.message)
      console.log(error.response?.data?.message )
      toast.error(error.response?.data?.message || "Something went wrong")
    }
    
  }

  return (
    <div className="w-full px-4 py-5">
      <div className="h-full w-ull flex flex-col  gap-24">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-[#3D3219]">
            <MdEmail className="size-10 text-[#D4AF37]" />
          </div>
          <div>
            <h2 className="sm:text-lg md:text-2xl font-medium text-[#D4AF37]">
              Change Email
            </h2>
            <p className="sm:text-sm md:text-md text-gray-400">
              Update your email address. A verification OTP will be sent to your new email.
            </p>
          </div>
        </div>
        <div className="flex w-full p-6 rounded-2xl bg-[#141A27] border border-[#5B4722] items-center justify-between">
          <div className="flex flex-col gap-7">
            <div className="flex flex-col gap-1">
              <label htmlFor="email">Current Email</label>
              <input
                type="email"
                name="oldEmail"
                value={data.oldEmail}
                onChange={onChangeHandler}
                className="w-full bg-[#192132] border border-[#2A3448] text-white placeholder:text-[#7F8AA3] rounded-xl px-4 py-3 outline-none focus:border-[#4F46E5] transition-colors w-[720px]"
                placeholder="Enter your current email"
              />
            </div>
            <div className="flex flex-col gap-1 w-[700px]">
              <label htmlFor="email">New Email Address</label>
              <input
                type="email"
                name="newEmail"
                value={data.newEmail}
                onChange={onChangeHandler}
                className="w-full bg-[#192132] border border-[#2A3448] text-white placeholder:text-[#7F8AA3] rounded-xl px-4 py-3 outline-none focus:border-[#4F46E5] transition-colors w-[720px]"
                placeholder="Enter your new email address"
              />
            </div>
            <div className="flex justify-between items-center">
              <div className="flex justify-between items-center gap-4 text-sm p-2 bg-[#1A273E] rounded">
                <span className=" rounded-full border p-0.5 text-blue-600">
                  <IoAlertOutline />
                </span>
                <p className="text-gray-400 w-96 ">
                    We will send a 6-digit OTP to your new email address.
                    Please verify to update your email.
                </p>
              </div>
              <button
              onClick={submitHandler}
               className="flex gap-2 items-center  px-4 py-3 rounded cursor-pointer bg-gradient-to-r from-[#2563EB] to-[#3B82F6] ">
                <span>Send OTP</span>
                <FiSend/>
              </button>
            </div>
          </div>
          <div className="flex flex-col items-center w-sm gap-6">
            <div>
              <AiTwotoneMail className="size-24 text-[#D4AF37]" />
            </div>
            <div className="flex flex-col border-2 border-[#1E2640] w-sm p-3 gap-1 rounded bg-[#0e1322]">
              <h6 className="text-purple-400 flex gap-2 items-center"><FaShield className="text-sky-600"/>Important</h6>
              <p className="text-sm text-gray-400">Your will need to verify your new email address before changes take effect.</p>
            </div>
            <div className="flex flex-col border-2 border-[#1E2640] w-sm p-3 gap-1 rounded bg-[#0e1322]">
              <h6 className="text-purple-400">After verification : </h6>
              <p className="flex items-center gap-2 text-green-300">
                <FaRegCheckCircle className="text-green-500" />
                Your email will be updated
              </p>
              <p className="flex items-center gap-2 text-green-300">
                <FaRegCheckCircle className="text-green-500" />
                You can login with your new email
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeEmail;
