
'use client'
import React, { useState } from 'react'
import Welcome from '@/components/welcome'
import RegisterForm from '@/components/registerForm';

function Register() {
  const [step,setStep] = useState(1);


  return (
    <div>
       {step==1?<Welcome  nextstep={setStep}/> : <RegisterForm nextstep={setStep}/>}

    </div>
  )
}

export default Register
