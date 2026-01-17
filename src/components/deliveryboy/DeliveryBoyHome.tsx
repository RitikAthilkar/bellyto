import React from "react";
import Grocery from "@/models/grocey.model";
import connectDb from "@/config/db";
import { json } from "stream/consumers";
import DeliveryBoyDashboard from "./DeliveryBoyDashboard";

const DeliveryBoyHome = async () => {
  await connectDb();
  const products = await Grocery.find({});
  const plainGrocery = JSON.parse(JSON.stringify(products));

  return (
    <>
      <DeliveryBoyDashboard  />
    </>
  );
};

export default DeliveryBoyHome;
