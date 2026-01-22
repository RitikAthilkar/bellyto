import axios from 'axios'
import React from 'react'

const TrackOder = () => {
    const GetOrder = async()=>{
        const response = await axios.post('/api/order/get-user-order',{orderId:''})
        if(response.status==200){
            
        }
    }
  return (
    <div>
      
    </div>
  )
}

export default TrackOder
