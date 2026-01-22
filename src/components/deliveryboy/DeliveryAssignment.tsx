'use client'
import { getSocket } from '@/config/websocket'
import axios from 'axios'
import mongoose, { mongo } from 'mongoose'
import React, { act, useEffect, useState } from 'react'

const DeliveryAssignment = () => {
  interface IOrder {
    _id?: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    orderId: string;
    items: [
      {
        product: mongoose.Types.ObjectId;
        name: string;
        sku: string;
        description: string;
        category: string;
        subcategory: string;
        brand: string;
        price: string;
        mrp: string;
        unitquantity: string;
        unit: string;
        image: string;
        stockquantity: number;
        cartquantity: number;
        isavailable?: boolean;
        discountpercent?: string;
        tag: string;
      },
    ];
    address: {
      name: string;
      mobile: string;
      fulladdress: string;
      city: string;
      state: string;
      pincode: string;
      latitude: string;
      longitude: string;
    }[];
    deliveryTime?: string;
    totalAmount: string;
    paymentMethod: "cod" | "online";
    paymentStatus: boolean;
    status:
      | "pending"
      | "processing"
      | "ready to dispatch"
      | "in transit"
      | "assigned deliveryboy"
      | "out for delivery"
      | "delivered";
    assignment?: mongoose.Types.ObjectId;
    assignedDeliveryboy?: mongoose.Types.ObjectId;
    createdAt?: Date;
    UpdatedAt?: Date;
  }

    interface Iassignment {
      _id?: mongoose.Types.ObjectId;
      order: IOrder;
      brodcastedTo: mongoose.Types.ObjectId[];
      assignedTo: mongoose.Types.ObjectId | null;
      status: "brodcasted" | "assigned" | "completed";
      acceptedAt: Date;
      createdAt?: Date;
      updatedAt?: Date;
    }
    const [assignment, setAssignment] = useState<Iassignment[]>([])
    const GetAssignment = async()=>{
        try {
            const response = await axios.get('/api/deliveryboy/assignment')
            if(response.status==200){
                setAssignment(response.data)
            }
        } catch (error) {
             console.log(error)
        }
    }
    const handleAction = async (assiId:any) => {
      try {
        const response = await axios.post(
          "/api/deliveryboy/assignment-action",
          { action: "accept", assignmentId: assiId },
        );
        if (response.status == 200) {
          setAssignment(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    useEffect(():any=>{
      
       const socket = getSocket()
       socket.on("new-assgnment", (deliveryAssignment) => {
         setAssignment((prev) => [...prev, deliveryAssignment]);

       })
       return () => socket.off("new-assgnment");
    },[])
    useEffect(()=>{
        GetAssignment();
    },[])
  return (
    <>
      {/* {JSON.stringify(assignment[0].order.address[0])} */}
      <div className='px-5 '>
          {assignment
            ? assignment.map((item, index) => {
                return (
                  <>
                    <div
                      key={index}
                      className="border rounded shadow  w-[20vw]">
                      <div>
                        <h2 className="text-black">#{item._id?.toString()}</h2>
                      </div>
                      <div>
                        <h2 className="text-black">
                          {item.order.address[0].fulladdress}
                        </h2>
                      </div>
                      <div>
                        <button className="border  p-1 mx-3 bg-red-500 text-white">
                          reject order
                        </button>
                        <button onClick={(e)=>{handleAction(item._id)}} className="border  p-1 mx-3 bg-green-500 text-white" >
                          Accept Order
                        </button>
                      </div>
                    </div>
                  </>
                );
              })
            : ""}
      </div>
    </>
  );
}

export default DeliveryAssignment
