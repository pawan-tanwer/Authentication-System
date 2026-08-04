import React, { useContext, useState } from 'react'
import Login from "../../Pages/Login"
import Register from '../../Pages/Register'
import { StoreContext } from '../../Context/StoreContext'
import WelcomePanel from './WelcomePanel'
const Right = () => {
 // reister ,login check ke liye
  const {type ,setType,isAuthentication} = useContext(StoreContext)

  return (
    <div className="w-full flex justify-center items-start">
      <div className="w-full max-w-md">

        {isAuthentication ? (
          <WelcomePanel />
        ) : type === "Login" ? (
          <Login />
        ) : (
          <Register />
        )}

      </div>
    </div>
  );

}

export default Right
