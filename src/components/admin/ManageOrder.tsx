import React, { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from 'axios';
import Image from 'next/image';
import { getSocket } from '@/config/websocket';
const ManageOrder = () => {
    const [orderData, setOrderData] = useState<any[]>([])
   const [showAll, setShowAll] = useState(false);
   const [expandedNames, setExpandedNames] = useState<{
     [key: number]: boolean;
   }>({});

       const GetOrderData = async () => {
         try {
           const response = await axios.get("/api/order");
           if (response.status === 200) {
             setOrderData(response.data);
           }
         } catch (error) {}
       };
    useEffect(()=>{
    GetOrderData();
    },[])

const toggleName = (index: number) => {
  setExpandedNames((prev) => ({
    ...prev,
    [index]: !prev[index],
  }));
};

const UpdateStatus = async(orderId:string,status:string)=>{
          try {
             const response = await axios.post(
               `/api/order/update-order-status`,
               { orderId,status },
             );
             if(response.status==200){
               GetOrderData();
             }
          } catch (error) {
            console.log(error);
          }
}

    useEffect(():any=>{
       const socket = getSocket()
       socket.on("new-order", (orders) => {
         setOrderData((prev) => [...prev, orders]);
       })
       return () => socket.off("new-order");
    },[])
  return (
    <>
      <div className="flex w-full  flex-col gap-6  ">
        <Tabs defaultValue="neworder" className="px-5">
          <TabsList className="bg-gray-200 w-full">
            <TabsTrigger className="text-base me-2" value="neworder">
              New Order
            </TabsTrigger>
            <TabsTrigger className="text-base me-2" value="processing">
              Processing / Picking
            </TabsTrigger>
            <TabsTrigger className="text-base me-2" value="dispatch">
              Ready for Dispatch
            </TabsTrigger>

            <TabsTrigger className="text-base me-2" value="outfordelivery">
              Out for Delivery
            </TabsTrigger>
            <TabsTrigger className="text-base me-2" value="delivered">
              Delivered Orders
            </TabsTrigger>
            <TabsTrigger className="text-base me-2" value="refund">
              Refund Requests
            </TabsTrigger>
            <TabsTrigger className="text-base me-2" value="failed">
              Failed Deliveries
            </TabsTrigger>
          </TabsList>
          <TabsContent value="neworder">
            <div className="grid grid-cols-12 w-full">
              {orderData ? (
                orderData
                  ?.slice()
                  .reverse()
                  .filter((i: any) => i.status === "pending")
                  .map((item: any, index) => (
                    <>
                      <div key={item._id || index} className="col-span-6 p-3 ">
                        <div className="rounded-xl shadow-md  p-3">
                          <div className="bg-white ">
                            <div className="flex justify-between items-center ">
                              <div className="bg-amber-200 p-1 text-sm rounded-sm">
                                Order Request
                              </div>
                              <div className=" p-1 text-gray-600 text-sm font-semibold">
                                #{item.orderId}
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-center items-center my-1">
                            <div className="flex-grow border-t border-gray-300"></div>
                            <span className="text-gray-400 text-xs ms-2">
                              placed 5min ago
                            </span>
                          </div>
                          <div className="flex justify-between mt-3 border-b border-gray-200 py-1">
                            <div>
                              <h2 className="text-lg capitalize font-semibold">
                                <i className="bi bi-person-fill text-gray-400 text-lg me-1"></i>{" "}
                                {item.address[0].name}
                              </h2>
                              <h2 className="text-lg capitalize font-semibold">
                                <i className="bi bi-telephone-fill text-gray-400 me-1"></i>{" "}
                                +91 {item.address[0].mobile}
                              </h2>
                              {/* <i className="bi bi-three-dots text-gray-400 "></i> */}
                            </div>
                            <div>
                              <div className="bg-green-600 rounded-md text-white font-semibold p-2 text-sm capitalize ">
                                {item.status}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col justify-between mt-3">
                            <h2 className="text-base font-semibold">
                              Ordered Items
                            </h2>
                            <div className="grid grid-cols-12 w-full ">
                              {(showAll
                                ? item.items
                                : item.items.slice(0, 3)
                              ).map((i: any, index2: number) => (
                                <div
                                  key={index2}
                                  className="col-span-4 p-2 transition-all duration-300 ease-in-out">
                                  <div className="p-2 flex flex-col justify-center items-center rounded-lg border border-gray-200 shadow-sm">
                                    <div className="relative h-30 w-30 ">
                                      <Image
                                        src={i.image}
                                        alt="product image"
                                        fill
                                      />
                                    </div>

                                    <div className="p-1 bg-gray-50 w-full">
                                      <h2 className="text-sm">
                                        {expandedNames[index2]
                                          ? i.name
                                          : i.name.slice(0, 25)}

                                        {i.name.length > 25 && (
                                          <button
                                            onClick={() => toggleName(index2)}
                                            className="text-green-600 ml-1 text-xs font-medium">
                                            {expandedNames[index2]
                                              ? "less"
                                              : "more"}
                                          </button>
                                        )}
                                      </h2>
                                      <div>
                                        <h2 className="text-xs text-gray-600 font-semibold ">
                                          {i.cartquantity < i.stockquantity ? (
                                            <>
                                              <span className="text-green-600">
                                                In Stock
                                              </span>
                                            </>
                                          ) : (
                                            <>
                                              <span className="text-red-600">
                                                Out Of Stock
                                              </span>
                                            </>
                                          )}
                                        </h2>
                                      </div>
                                      <div className="flex justify-between items-center">
                                        <h2 className="text-sm text-gray-600 font-semibold my-1">
                                          {i.unitquantity}
                                          {i.unit} × {i.cartquantity}
                                        </h2>

                                        <h2 className="text-base text-gray-900 font-semibold my-1">
                                          ₹
                                          {Number(i.price) *
                                            Number(i.cartquantity)}
                                        </h2>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}

                              <div className="col-span-12 mb-3">
                                <div className="flex justify-center items-center">
                                  <div className="flex-grow border-t border-gray-300"></div>

                                  {item.items.length > 2 && (
                                    <button
                                      onClick={() => setShowAll(!showAll)}
                                      className="text-green-600 text-sm font-medium mx-2">
                                      {showAll
                                        ? "Show Less"
                                        : `+${
                                            item.items.length - 3
                                          } more items`}
                                    </button>
                                  )}
                                  <div className="flex-grow border-t border-gray-300"></div>
                                </div>
                              </div>
                              <div className="col-span-6 bg-gray-50 p-2 border border-gray-200">
                                <h2 className="text-md font-semibold capitalize">
                                  Payment Method : {item.paymentMethod}
                                </h2>
                              </div>
                              <div className="col-span-6 bg-gray-50  p-2 border border-gray-200">
                                <h2 className="text-md font-semibold capitalize">
                                  Payment Status :{" "}
                                  {item.paymentSatus ? (
                                    <>
                                      <span className="text-green-600">
                                        Paid
                                      </span>
                                    </>
                                  ) : (
                                    <>
                                      <span className="text-red-600">
                                        Pending
                                      </span>
                                    </>
                                  )}
                                </h2>
                              </div>
                              <div className="col-span-6 bg-gray-50  p-2 border border-gray-200">
                                <h2 className="text-md font-semibold capitalize">
                                  Total Items :{" "}
                                  <span className="text-lg">
                                    {item.items.length}
                                  </span>
                                </h2>
                              </div>
                              <div className="col-span-6 bg-gray-50  p-2 border border-gray-200">
                                <h2 className="text-md font-semibold capitalize">
                                  Total Amount :{" "}
                                  <span className="text-lg">
                                    ₹{item.totalAmount}
                                  </span>
                                </h2>
                              </div>
                              <div className="col-span-12 bg-gray-50  p-2 border border-gray-200">
                                <h2 className="text-md font-semibold capitalize">
                                  Delivery Address :
                                </h2>
                                <h2 className="text-md font-semibold capitalize">
                                  {item.address[0].fulladdress}
                                </h2>
                              </div>

                              <div className="col-span-12 flex justify-end   p-2 ">
                                <button className="bg-red-200 p-2 rounded-lg text-red-600 font-semibold">
                                  Cancel Order
                                </button>
                                <button
                                  className="bg-green-600 p-2 rounded-lg text-white font-semibold ms-3"
                                  onClick={() => {
                                    UpdateStatus(item._id, "processing");
                                  }}>
                                  Accept Order
                                </button>
                              </div>
                            </div>

                            <div></div>
                          </div>
                        </div>
                      </div>
                    </>
                  ))
              ) : (
                <>orders Not Found</>
              )}
            </div>
          </TabsContent>
          <TabsContent value="processing">
            <div className="grid grid-cols-12 w-full">
              {orderData ? (
                orderData
                  ?.slice()
                  .reverse()
                  .filter((i: any) => i.status === "processing")
                  .map((item: any, index) => (
                    <>
                      <div key={item._id || index} className="col-span-6 p-3 ">
                        <div className="rounded-xl shadow-md  p-3">
                          <div className="bg-white ">
                            <div className="flex justify-between items-center ">
                              <div className="bg-amber-200 p-1 text-sm rounded-sm">
                                Order Request
                              </div>
                              <div className=" p-1 text-gray-600 text-sm font-semibold">
                                #{item.orderId}
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-center items-center my-1">
                            <div className="flex-grow border-t border-gray-300"></div>
                            <span className="text-gray-400 text-xs ms-2">
                              placed 5min ago
                            </span>
                          </div>
                          <div className="flex justify-between mt-3 border-b border-gray-200 py-1">
                            <div>
                              <h2 className="text-lg capitalize font-semibold">
                                <i className="bi bi-person-fill text-gray-400 text-lg me-1"></i>{" "}
                                {item.address[0].name}
                              </h2>
                              <h2 className="text-lg capitalize font-semibold">
                                <i className="bi bi-telephone-fill text-gray-400 me-1"></i>{" "}
                                +91 {item.address[0].mobile}
                              </h2>
                              {/* <i className="bi bi-three-dots text-gray-400 "></i> */}
                            </div>
                            <div>
                              <div className="bg-green-600 rounded-md text-white font-semibold p-2 text-sm capitalize ">
                                {item.status}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col justify-between mt-3">
                            <h2 className="text-base font-semibold">
                              Ordered Items
                            </h2>
                            <div className="grid grid-cols-12 w-full ">
                              {(showAll
                                ? item.items
                                : item.items.slice(0, 3)
                              ).map((i: any, index2: number) => (
                                <div
                                  key={index2}
                                  className="col-span-4 p-2 transition-all duration-300 ease-in-out">
                                  <div className="p-2 flex flex-col justify-center items-center rounded-lg border border-gray-200 shadow-sm">
                                    <div className="relative h-30 w-30 ">
                                      <Image
                                        src={i.image}
                                        alt="product image"
                                        fill
                                      />
                                    </div>

                                    <div className="p-1 bg-gray-50 w-full">
                                      <h2 className="text-sm">
                                        {expandedNames[index2]
                                          ? i.name
                                          : i.name.slice(0, 25)}

                                        {i.name.length > 25 && (
                                          <button
                                            onClick={() => toggleName(index2)}
                                            className="text-green-600 ml-1 text-xs font-medium">
                                            {expandedNames[index2]
                                              ? "less"
                                              : "more"}
                                          </button>
                                        )}
                                      </h2>
                                      <div>
                                        <h2 className="text-xs text-gray-600 font-semibold ">
                                          {i.cartquantity < i.stockquantity ? (
                                            <>
                                              <span className="text-green-600">
                                                In Stock
                                              </span>
                                            </>
                                          ) : (
                                            <>
                                              <span className="text-red-600">
                                                Out Of Stock
                                              </span>
                                            </>
                                          )}
                                        </h2>
                                      </div>
                                      <div className="flex justify-between items-center">
                                        <h2 className="text-sm text-gray-600 font-semibold my-1">
                                          {i.unitquantity}
                                          {i.unit} × {i.cartquantity}
                                        </h2>

                                        <h2 className="text-base text-gray-900 font-semibold my-1">
                                          ₹
                                          {Number(i.price) *
                                            Number(i.cartquantity)}
                                        </h2>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}

                              <div className="col-span-12 mb-3">
                                <div className="flex justify-center items-center">
                                  <div className="flex-grow border-t border-gray-300"></div>

                                  {item.items.length > 2 && (
                                    <button
                                      onClick={() => setShowAll(!showAll)}
                                      className="text-green-600 text-sm font-medium mx-2">
                                      {showAll
                                        ? "Show Less"
                                        : `+${
                                            item.items.length - 3
                                          } more items`}
                                    </button>
                                  )}
                                  <div className="flex-grow border-t border-gray-300"></div>
                                </div>
                              </div>
                              <div className="col-span-6 bg-gray-50 p-2 border border-gray-200">
                                <h2 className="text-md font-semibold capitalize">
                                  Payment Method : {item.paymentMethod}
                                </h2>
                              </div>
                              <div className="col-span-6 bg-gray-50  p-2 border border-gray-200">
                                <h2 className="text-md font-semibold capitalize">
                                  Payment Status :{" "}
                                  {item.paymentSatus ? (
                                    <>
                                      <span className="text-green-600">
                                        Paid
                                      </span>
                                    </>
                                  ) : (
                                    <>
                                      <span className="text-red-600">
                                        Pending
                                      </span>
                                    </>
                                  )}
                                </h2>
                              </div>
                              <div className="col-span-6 bg-gray-50  p-2 border border-gray-200">
                                <h2 className="text-md font-semibold capitalize">
                                  Total Items :{" "}
                                  <span className="text-lg">
                                    {item.items.length}
                                  </span>
                                </h2>
                              </div>
                              <div className="col-span-6 bg-gray-50  p-2 border border-gray-200">
                                <h2 className="text-md font-semibold capitalize">
                                  Total Amount :{" "}
                                  <span className="text-lg">
                                    ₹{item.totalAmount}
                                  </span>
                                </h2>
                              </div>
                              <div className="col-span-12 bg-gray-50  p-2 border border-gray-200">
                                <h2 className="text-md font-semibold capitalize">
                                  Delivery Address :
                                </h2>
                                <h2 className="text-md font-semibold capitalize">
                                  {item.address[0].fulladdress}
                                </h2>
                              </div>

                              <div className="col-span-12 flex justify-end   p-2 ">
                                <button className="bg-red-200 p-2 rounded-lg text-red-600 font-semibold">
                                  Cancel Order
                                </button>
                                <button
                                  className="bg-green-600 p-2 rounded-lg text-white font-semibold ms-3"
                                  onClick={() => {
                                    UpdateStatus(item._id, "ready to dispatch");
                                  }}>
                                  Accept Order
                                </button>
                              </div>
                            </div>

                            <div></div>
                          </div>
                        </div>
                      </div>
                    </>
                  ))
              ) : (
                <>orders Not Found</>
              )}
            </div>
          </TabsContent>
          <TabsContent value="dispatch">
            <div className="grid grid-cols-12 w-full">
              {orderData ? (
                orderData
                  ?.slice()
                  .reverse()
                  .filter((i: any) => i.status === "ready to dispatch")
                  .map((item: any, index) => (
                    <>
                      <div key={item._id || index} className="col-span-6 p-3 ">
                        <div className="rounded-xl shadow-md  p-3">
                          <div className="bg-white ">
                            <div className="flex justify-between items-center ">
                              <div className="bg-amber-200 p-1 text-sm rounded-sm">
                                Order Request
                              </div>
                              <div className=" p-1 text-gray-600 text-sm font-semibold">
                                #{item.orderId}
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-center items-center my-1">
                            <div className="flex-grow border-t border-gray-300"></div>
                            <span className="text-gray-400 text-xs ms-2">
                              placed 5min ago
                            </span>
                          </div>
                          <div className="flex justify-between mt-3 border-b border-gray-200 py-1">
                            <div>
                              <h2 className="text-lg capitalize font-semibold">
                                <i className="bi bi-person-fill text-gray-400 text-lg me-1"></i>{" "}
                                {item.address[0].name}
                              </h2>
                              <h2 className="text-lg capitalize font-semibold">
                                <i className="bi bi-telephone-fill text-gray-400 me-1"></i>{" "}
                                +91 {item.address[0].mobile}
                              </h2>
                              {/* <i className="bi bi-three-dots text-gray-400 "></i> */}
                            </div>
                            <div>
                              <div className="bg-green-600 rounded-md text-white font-semibold p-2 text-sm capitalize ">
                                {item.status}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col justify-between mt-3">
                            <h2 className="text-base font-semibold">
                              Ordered Items
                            </h2>
                            <div className="grid grid-cols-12 w-full ">
                              {(showAll
                                ? item.items
                                : item.items.slice(0, 3)
                              ).map((i: any, index2: number) => (
                                <div
                                  key={index2}
                                  className="col-span-4 p-2 transition-all duration-300 ease-in-out">
                                  <div className="p-2 flex flex-col justify-center items-center rounded-lg border border-gray-200 shadow-sm">
                                    <div className="relative h-30 w-30 ">
                                      <Image
                                        src={i.image}
                                        alt="product image"
                                        fill
                                      />
                                    </div>

                                    <div className="p-1 bg-gray-50 w-full">
                                      <h2 className="text-sm">
                                        {expandedNames[index2]
                                          ? i.name
                                          : i.name.slice(0, 25)}

                                        {i.name.length > 25 && (
                                          <button
                                            onClick={() => toggleName(index2)}
                                            className="text-green-600 ml-1 text-xs font-medium">
                                            {expandedNames[index2]
                                              ? "less"
                                              : "more"}
                                          </button>
                                        )}
                                      </h2>
                                      <div>
                                        <h2 className="text-xs text-gray-600 font-semibold ">
                                          {i.cartquantity < i.stockquantity ? (
                                            <>
                                              <span className="text-green-600">
                                                In Stock
                                              </span>
                                            </>
                                          ) : (
                                            <>
                                              <span className="text-red-600">
                                                Out Of Stock
                                              </span>
                                            </>
                                          )}
                                        </h2>
                                      </div>
                                      <div className="flex justify-between items-center">
                                        <h2 className="text-sm text-gray-600 font-semibold my-1">
                                          {i.unitquantity}
                                          {i.unit} × {i.cartquantity}
                                        </h2>

                                        <h2 className="text-base text-gray-900 font-semibold my-1">
                                          ₹
                                          {Number(i.price) *
                                            Number(i.cartquantity)}
                                        </h2>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}

                              <div className="col-span-12 mb-3">
                                <div className="flex justify-center items-center">
                                  <div className="flex-grow border-t border-gray-300"></div>

                                  {item.items.length > 2 && (
                                    <button
                                      onClick={() => setShowAll(!showAll)}
                                      className="text-green-600 text-sm font-medium mx-2">
                                      {showAll
                                        ? "Show Less"
                                        : `+${
                                            item.items.length - 3
                                          } more items`}
                                    </button>
                                  )}
                                  <div className="flex-grow border-t border-gray-300"></div>
                                </div>
                              </div>
                              <div className="col-span-6 bg-gray-50 p-2 border border-gray-200">
                                <h2 className="text-md font-semibold capitalize">
                                  Payment Method : {item.paymentMethod}
                                </h2>
                              </div>
                              <div className="col-span-6 bg-gray-50  p-2 border border-gray-200">
                                <h2 className="text-md font-semibold capitalize">
                                  Payment Status :{" "}
                                  {item.paymentSatus ? (
                                    <>
                                      <span className="text-green-600">
                                        Paid
                                      </span>
                                    </>
                                  ) : (
                                    <>
                                      <span className="text-red-600">
                                        Pending
                                      </span>
                                    </>
                                  )}
                                </h2>
                              </div>
                              <div className="col-span-6 bg-gray-50  p-2 border border-gray-200">
                                <h2 className="text-md font-semibold capitalize">
                                  Total Items :{" "}
                                  <span className="text-lg">
                                    {item.items.length}
                                  </span>
                                </h2>
                              </div>
                              <div className="col-span-6 bg-gray-50  p-2 border border-gray-200">
                                <h2 className="text-md font-semibold capitalize">
                                  Total Amount :{" "}
                                  <span className="text-lg">
                                    ₹{item.totalAmount}
                                  </span>
                                </h2>
                              </div>
                              <div className="col-span-12 bg-gray-50  p-2 border border-gray-200">
                                <h2 className="text-md font-semibold capitalize">
                                  Delivery Address :
                                </h2>
                                <h2 className="text-md font-semibold capitalize">
                                  {item.address[0].fulladdress}
                                </h2>
                              </div>

                              <div className="col-span-12 flex justify-end   p-2 ">
                                <button className="bg-red-200 p-2 rounded-lg text-red-600 font-semibold">
                                  Cancel Order
                                </button>
                                <button
                                  className="bg-green-600 p-2 rounded-lg text-white font-semibold ms-3"
                                  onClick={() => {
                                    UpdateStatus(item._id, "ready to dispatch");
                                  }}>
                                  Accept Order
                                </button>
                              </div>
                            </div>

                            <div></div>
                          </div>
                        </div>
                      </div>
                    </>
                  ))
              ) : (
                <>orders Not Found</>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

export default ManageOrder
