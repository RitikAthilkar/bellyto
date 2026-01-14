
'use client'
import React, { useState } from 'react'
import Welcome from '@/components/Welcome'
import RegisterForm from '@/components/RegisterForm';

function Register() {
  const [step,setStep] = useState(1);


  return (
    <div>
       {step==1?<Welcome  nextstep={setStep}/> : <RegisterForm nextstep={setStep}/>}

    </div>
  )
}

export default Register
