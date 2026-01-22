import axios from "axios";
import React from "react";

const EmitEventHandler = async (event: string, data: any, socketId?: string) => {
  try {
    const response = await axios.post(`http://localhost:4000/notify`, {
      event,
      data,
      socketId,
    });

    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export default EmitEventHandler;
