'use client'
import axios from 'axios';
import React, {use, useEffect, useState} from 'react'
import mongoose from 'mongoose';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import LiveMap from '@/components/LiveMap';
import Nav from '@/components/nav';
import { getSocket } from '@/config/websocket';
interface Iorder{
    _id?:mongoose.Types.ObjectId,
    user:mongoose.Types.ObjectId,
    orderId:string,
    items:[
        {
                product:mongoose.Types.ObjectId,
                name:string,
                sku:string,
                description:string,
                category:string,
                subcategory:string,
                brand:string,
                price:string,
                mrp:string,
                unitquantity:string,
                unit:string,
                image:string,
                stockquantity:number,
                cartquantity:number,
                isavailable?:boolean,
                discountpercent?:string,
                tag:string
            
        }
    ],
    address:[
            name:string,
            mobile:string ,
            fulladdress:string,
            city:string,
            state:string,
            pincode:string,
            latitude:string,
            longitude:string,
    ]
    deliveryTime?:string
    totalAmount:string
    paymentMethod:"cod" | "online"
    paymentStatus:boolean,
    status:"pending" | "processing" | "ready to dispatch" | "in transit" |"assigned deliveryboy" | "out for delivery" | "delivered"
    assignment?:mongoose.Types.ObjectId,
    assignedDeliveryboy?:mongoose.Types.ObjectId,
    createdAt?:Date
    UpdatedAt?:Date
}
 interface ILocation {
   latitude: number;
   longitude: number;
 }
const page = ({params}:{params:Promise<{ orderId: string }>}) => {
  const { orderId } = use(params);
    const { userData } = useSelector((state: RootState) => state.user);
  const [order, setOrder] = useState<Iorder>()
  const [deliveryboyLocation, setdeliveryboyLocation] = useState<ILocation>({
    latitude: 0,
    longitude: 0,
  });
  const [userLocation, setUserLocaton] = useState<ILocation>({ latitude:0,longitude:0});
  const GetOrder = async () => {
        const response = await axios.post("/api/order/get-user-order", {
          orderId: orderId.toString(),
        });
        if (response.status == 200) {
          setUserLocaton({
            latitude: response.data.address[0].latitude,
            longitude: response.data.address[0].longitude,
          });
          setdeliveryboyLocation({
            latitude:
            response.data.assignedDeliveryboy.location.coordinates[1],
            longitude:
            response.data.assignedDeliveryboy.location.coordinates[0],
          });
          setOrder(response.data)

          console.log(response.data)
        }
      };
  
      useEffect(() => {
        GetOrder();
      }, [userData?._id]);

        useEffect(() => {
          const socket = getSocket();
          socket.on("update-deliverboy-loation", ({ userId, location }) => {
             if(userId.toString()==order?.assignedDeliveryboy?._id.toString()){
                 setdeliveryboyLocation({
                   latitude: location.coordinates[1],
                   longitude: location.coordinates[0],
                 });
             }
          })
            return () => {
              socket.off("update-deliverboy-loation");
            };
        }, [order]);
      
  return (
    <>
      {/* <Nav/> */}
      <div className="min-h-screen w-full px-5 flex flex-col justify-start items-center bg-gray-100">
        <div className="grid grid-cols-12 w-[70vw] py-15">
          <div className="col-span-6 p-2 ">
            <div className="shadow-lg border border-gray-200 rounded-2xl bg-white p-4">
              {/* {JSON.stringify(order)}
             userlocation {JSON.stringify(userLocation)}<br/>
             deliverylocation {JSON.stringify(deliveryboyLocation)} */}
              <LiveMap
                userLocation={userLocation}
                deliveryboylocation={deliveryboyLocation}
              />
              {/* 
              <div className="relative flex items-center  w-full p-2 px-3">
                <User className="absolute left-5 text-gray-500 h-5" />
                <input
                  className="border pl-10 px-3 p-2 rounded-md text-base w-full border-gray-300 focus:ring-1 focus:ring-purple-600 focus:outline-none"
                  type="text"
                  value={form.name ? form.name : ""}
                  placeholder="Your Name"
                  name="name"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="relative flex items-center  w-full p-2 px-3">
                <Phone className="absolute left-5 text-gray-500 h-5" />
                <input
                  className="border pl-10 px-3 p-2 rounded-md text-base w-full border-gray-300 focus:ring-1 focus:ring-purple-600 focus:outline-none"
                  type="text"
                  value={form ? form.mobile : ""}
                  placeholder="Mobile Number"
                  name="mobile"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="relative flex items-center  w-full p-2 px-3">
                <HomeIcon className="absolute top-5.5 left-5 text-gray-500 h-5" />
                <textarea
                  className="border pl-10 px-3 p-2 rounded-md text-base w-full border-gray-300 focus:ring-1 focus:ring-purple-600 focus:outline-none"
                  placeholder="Address"
                  name="address"
                  value={searchQuery !== "" ? searchQuery : form?.address || ""}
                  onChange={handleChange}
                  required></textarea>
              </div>

              <div className="grid grid-cols-12 p-2  w-full">
                <div className="col-span-4 p-1">
                  <div className="relative flex items-center  w-full  ">
                    <BuildingIcon className="absolute left-4 text-gray-500 h-5" />
                    <input
                      className="border pl-12 px-3 p-2 rounded-md text-base w-full border-gray-300 focus:ring-1 focus:ring-purple-600 focus:outline-none"
                      type="text"
                      placeholder="City"
                      name="city"
                      value={form ? form.city : ""}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="col-span-4 p-1">
                  <div className="relative flex items-center  w-full ">
                    <LocationEditIcon className="absolute left-4 text-gray-500 h-5" />
                    <input
                      className="border pl-12 px-3 p-2 rounded-md text-base w-full border-gray-300 focus:ring-1 focus:ring-purple-600 focus:outline-none"
                      type="text"
                      value={form ? form.state : ""}
                      placeholder="State"
                      name="state"
                      required
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="col-span-4 p-1">
                  <div className="relative flex items-center  w-full ">
                    <EarthIcon className="absolute left-4 text-gray-500 h-5" />
                    <input
                      className="border pl-12 px-3 p-2 rounded-md text-base w-full border-gray-300 focus:ring-1 focus:ring-purple-600 focus:outline-none"
                      type="text"
                      placeholder="Pincode"
                      name="pincode"
                      value={form ? form.pincode : ""}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default page
