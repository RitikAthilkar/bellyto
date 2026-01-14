'use client'
import { AppDispatch } from '@/redux/store'
import { setUserData } from '@/redux/userSlice'
import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const useGetLoginUser = () => {
   const dispatch = useDispatch<AppDispatch>()
    const GetLoginUserData = async()=>{
        try {
            const response = await axios.get('/api/loginuser')
            dispatch(setUserData(response.data))
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(()=>{
      GetLoginUserData()
    },[])
}

export default useGetLoginUser
