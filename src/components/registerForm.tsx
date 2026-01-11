'use client'
import React, {useEffect, useState} from 'react'
import axios from 'axios'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { signIn, useSession } from 'next-auth/react'
import { motion } from "motion/react";
import { User, Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react'
import toast from "react-hot-toast";

import Google from '@/asset/image/element/google.png'
import registerbg from '@/asset/image/element/register-bg.png'
type propType={
  nextstep:(s:number)=>void 
}
const RegisterForm = ({nextstep}:propType) => {
type FormType = {
  name: string;
  email: string;
  password: string;
};
  const [form,setForm] = useState<FormType>({
    name:"",email:"",password:""
  })
  const [formValidaton,setValidation] = useState(false)
  const [showpassword,setShowPassword] = useState(false)
  const [loader,setLoader] = useState(false)

  const router = useRouter()
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

   const notify=(s:string)=>toast(s);
  const handleRegister = async(e:React.FormEvent)=>{
   e.preventDefault();
   setLoader(true)
   try {
        const response = await axios.post('/api/auth/register',form)
        // if(response=="")
        console.log("error " + response)
         setLoader(false);
        router.push('/login')
         
   } catch (error:any) {
          if (error.response.data.message){
             notify(error.response.data.message);
          } else{
            alert("Somthing went wrong")
          }
          setLoader(false);
    
   }
  }
  useEffect(()=>{
    if((form.name!=='' && form.email!=='' && form.password!=='') || loader){
      setValidation(true)
    }else{
      setValidation(false)
    }
  },[form])
  return (
    <>
      <div
        className="min-h-screen w-full bg-cover bg-no-repeat register-form-page"
        style={{ backgroundImage: `url(${registerbg.src})` }}>
        <button
          className="text-base text-white font-semibold m-3 "
          onClick={() => {
            nextstep(1);
          }}>
          <i className="bi bi-arrow-left"></i> Go Back
        </button>

        <div className=" w-full pt-10">
          <div className="grid grid-cols-12 gap-4 mx-5 sm:mx-30">
            <div className=" col-span-12 sm:col-span-12 md:col-span-6 lg:col-span-8 "></div>
            <div className=" col-span-12 sm:col-span-12 md:col-span-6 lg:col-span-4 ">
              <form className=" w-full" onSubmit={handleRegister}>
                <div className="text-center sm:hidden block">
                  <motion.h2
                    className="text-3xl sm:text-5xl font-bold text-white "
                    initial={{
                      y: -20,
                    }}
                    animate={{
                      y: 0,
                    }}
                    transition={{
                      duration: 1,
                    }}>
                    Welcome To <span className="text-yellow-400">Bellyto</span>{" "}
                  </motion.h2>
                  <h2 className="text-xs text-white">
                    Sign up now and get your first delivery in minutes
                  </h2>
                </div>
                <motion.div
                  className="p-2 py-6 flex flex-col items-center justify-center bg-white  shadow-2xl rounded-xl mt-3"
                  initial={{
                    scale: 0.8,
                  }}
                  animate={{
                    scale: 1,
                  }}
                  transition={{
                    duration: 0.5,
                  }}>
                  <h2 className="text-purple-600 text-2xl font-bold">
                    Create Account
                  </h2>
                  {/* {JSON.stringify(form)}
                  {JSON.stringify(formValidaton)} */}
                  <div className="relative flex items-center  w-full p-3">
                    <User className="absolute left-5 text-gray-500 h-5" />
                    <input
                      className="border pl-10 px-3 p-2 rounded-md text-base w-full border-gray-300 focus:ring-1 focus:ring-purple-600 focus:outline-none"
                      type="text"
                      placeholder="Your Name"
                      name="name"
                      required
                      onChange={handleChange}
                    />
                  </div>
                  <div className="relative flex items-center  w-full p-3 ">
                    <Mail className="absolute left-5 text-gray-500 h-5" />
                    <input
                      className="border pl-10 px-3 p-2 rounded-md text-base w-full border-gray-300 focus:ring-1 focus:ring-purple-600 focus:outline-none"
                      type="email"
                      placeholder="Your Email"
                      name="email"
                      required
                      onChange={handleChange}
                    />
                  </div>
                  <div className="relative flex items-center  w-full p-3">
                    <Lock className="absolute left-5 text-gray-500 h-5" />
                    {showpassword ? (
                      <EyeOff
                        className="absolute right-6 text-gray-500 h-5 cursor-pointer"
                        onClick={() => {
                          setShowPassword(false);
                        }}
                      />
                    ) : (
                      <Eye
                        className="absolute right-6 text-gray-500 h-5 cursor-pointer"
                        onClick={() => {
                          setShowPassword(true);
                        }}
                      />
                    )}

                    <input
                      className="border pl-10 px-3 p-2 rounded-md text-base w-full border-gray-300 focus:ring-1 focus:ring-purple-600 focus:outline-none"
                      type={showpassword ? "text" : "password"}
                      placeholder="Your Password"
                      name="password"
                      required
                      onChange={handleChange}
                    />
                  </div>
                  <div className="w-full p-3">
                    <button
                      className={`${
                        formValidaton == true || loader
                          ? "bg-yellow-500 cursor-pointer"
                          : "bg-gray-400 text-white cursor-default"
                      } rounded-lg w-full p-2 text-lg `}
                      disabled={formValidaton == true || loader ? false : true}
                      type="submit">
                      {loader ? (
                        <>
                          <Loader2 className="animate-spin w-full h-7 " />
                        </>
                      ) : (
                        "Register"
                      )}
                    </button>
                  </div>
                  <div className="flex items-center text-gray-400 w-full  text-sm mt-2 px-3 ">
                    <span className="flex-1 bg-gray-200 h-px "></span>
                    <h2 className="mx-4">OR</h2>
                    <span className="flex-1 bg-gray-200 h-px "></span>
                  </div>

                  <motion.button
                    className={`border hover:bg-gray-200 border-gray-300 rounded-lg  justify-center items-center flex mt-5 p-2 px-13 sm:px-25 sm:text-base text-sm `}
                    onClick={() => {
                      signIn("google", { callbackUrl: "/" });
                    }}
                    type="button"
                    whileTap={{scale:0.94}}
                    >
                    <Image
                      src={Google}
                      alt="Google Logo"
                      className="h-5 w-5 sm:h-5 sm:w-5 me-2"
                    />
                    Continue In With Google
                  </motion.button>

                  <p className="text-sm mt-5">
                    Already have account ?{" "}
                    <span
                      className="text-purple-600 font-bold cursor-pointer"
                      onClick={() => {
                        router.push("/login");
                      }}>
                      Sign In
                    </span>
                  </p>
                </motion.div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RegisterForm
