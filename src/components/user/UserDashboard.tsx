import React from 'react'
import UserHomePage from './userHomePage'
import Grocery from '@/models/grocey.model'
import connectDb from '@/config/db'
import { json } from 'stream/consumers'



const UserDashboard = async() => {
    await connectDb()
    const products =await Grocery.find({})
    const plainGrocery = JSON.parse(JSON.stringify(products))

  return (
    <>
      <UserHomePage products={plainGrocery}/>
    </>
  )
}

export default UserDashboard
