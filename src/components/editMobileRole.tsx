'use client'
import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react';
import { motion } from "motion/react";
import admin from '@/asset/image/element/admin.png'
import { Eye,EyeOff, Loader2 } from 'lucide-react';
import deliveryboy from '@/asset/image/element/deliverboy.png'
import user from '@/asset/image/element/user.png'
import Image from 'next/image';
import toast from "react-hot-toast";
import axios from 'axios';
import { redirect, useRouter } from 'next/navigation';


const EditMobileRole = ({ passwordProp }: { passwordProp :boolean}) => {
  const session = useSession();
   const { update } = useSession();
  const router = useRouter();
  const [selectedrole, setSelectedRole] = useState("");
  const [showpassword, setShowPassword] = useState(false);
  const [loader, setLoader] = useState(false);

  const notify = (msg: string) => toast(msg);
  type formtype = {
    role: string;
    mobile: number;
    password: string;
  };
  const [form, setForm] = useState<formtype>({
    role: "",
    mobile: 0,
    password: "",
  });
  const roletype = [
    { id: "1", lable: "Admin", value: "admin", image: admin },
    { id: "2", lable: "User", value: "user", image: user },
    {
      id: "3",
      lable: "Deliver Boy",
      value: "deliveryBoy",
      image: deliveryboy,
    },
  ];

  const handleSetRole = async () => {
    const userRole = roletype.find((i) => i.id == selectedrole);
    setForm((prev) => ({
      ...prev,
      role: userRole?.value || "",
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoader(true)
    if (form.role == "") {
      notify("Select Account Type");
      setLoader(false);
      return;
    }
    if (passwordProp&&form.password.length < 6) {
      notify(`Password Min 6 characters required`);
       setLoader(false);
      return;
    }

    try {
      const response = await axios.post("/api/user/edit-mobile-role", form);
      if (response.status == 200) {
        await update({role:form?.role})
         setLoader(false);
        router.push("/");
      }
    } catch (error) {
       setLoader(false);
      console.log(`update mobile and role error ${error}`);
    }
  };
  useEffect(() => {
    handleSetRole();
  }, [selectedrole]);

  return (
    <div className="min-h-screen w-full  bg-linear-to-t from-purple-800 to-purple-500 flex flex-col items-center ">
      <h2 className="text-white text-lg sm:text-2xl font-bold mt-20">
        Hello {session.data?.user?.name}!
      </h2>

      <h2 className="text-white text-2xl sm:text-3xl font-bold mt-2">
        Please Select Account Type
        {/* {JSON.stringify(form)} */}
      </h2>
      <form
        className=" grid grid-cols-6 gap-4 w-full sm:w-[40vw]  px-3 mt-2"
        onSubmit={handleSubmit}>
        {roletype.map((item, index) => {
          const isSelected = selectedrole == item?.id;
          return (
            <motion.div
              key={index}
              className={`bg-white hover:bg-yellow-100 col-span-2 sm:row-span-8 row-span-6 rounded-xl shadow-2xl flex flex-col items-center justify-center  border cursor-pointer 
                 ${
                   isSelected ? "border-none bg-yellow-400" : "border-gray-400"
                 }`}
              onClick={() => {
                setSelectedRole(item.id);
              }}
              whileTap={{ scale: 0.9 }}
              initial={{
                scale: 0.95,
              }}
              animate={{
                scale: 1,
              }}
              transition={{
                duration: 1,
              }}>
              <Image
                alt="admin image"
                src={item.image}
                className="sm:h-15 sm:w-15 h-10 w-10"
              />
              <h2 className="sm:text-lg text-sm font-bold mt-1">
                {item.lable}
              </h2>
            </motion.div>
          );
        })}
        <motion.div
          className={`bg-white ${
            passwordProp
              ? "col-span-6 sm:col-span-3"
              : "col-span-6 "
          } rounded-xl shadow-2xl flex flex-col items-center justify-center py-2`}
          initial={{
            y: 5,
          }}
          animate={{
            y: 0,
          }}
          transition={{
            duration: 1,
          }}>
          <h2 className="sm:text-lg text-base font-bold mt-1">Mobile Number</h2>
          <div className="relative flex items-center  w-full p-3 ">
            <i className="bi bi-telephone absolute left-7 text-gray-500 text-lg"></i>
            <input
              className="border pl-12  p-2 rounded-md text-base w-full border-gray-300 focus:ring-1 focus:ring-purple-600 focus:outline-none"
              type="tel"
              placeholder="Your Mobile Number"
              name="mobile"
              maxLength={10}
              onChange={handleChange}
              required
            />
          </div>
        </motion.div>
        {passwordProp && (
          <motion.div
            className="bg-white col-span-6 sm:col-span-3 rounded-xl shadow-2xl flex flex-col items-center justify-center py-2"
            initial={{
              y: 5,
            }}
            animate={{
              y: 0,
            }}
            transition={{
              duration: 1,
            }}>
            <h2 className="sm:text-lg text-base font-bold mt-1">
              Set Password
            </h2>
            <div className="relative flex items-center  w-full p-3 ">
              <i className="bi bi-key absolute left-7 text-gray-500 text-xl"></i>
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
                className="border pl-12  p-2 rounded-md text-base w-full border-gray-300 focus:ring-1 focus:ring-purple-600 focus:outline-none"
                type={showpassword ? "text" : "password"}
                placeholder="Set New Password"
                name="password"
                maxLength={10}
                onChange={handleChange}
                required
              />
            </div>
          </motion.div>
        )}

        <div className=" col-span-6 flex items-center justify-center py-2">
          <button
            className="bg-yellow-500 hover:bg-yellow-600 text-dark font-bold p-3 rounded-lg w-50 shadow-2xl"
            type="submit">
            {loader ? (
              <>
                <Loader2 className="animate-spin w-full h-7 " />
              </>
            ) : (
              "Save"
            )}
          </button>
        </div>
        <div className=" col-span-6 flex items-center justify-center py-2">
          <h2 className="text-white">Need Help ?</h2>
        </div>
      </form>
    </div>
  );
};

export default EditMobileRole
