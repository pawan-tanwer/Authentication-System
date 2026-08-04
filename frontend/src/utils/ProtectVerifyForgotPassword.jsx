import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';
import { StoreContext } from '../Context/StoreContext';
import { useContext } from 'react';

const ProtectVerifyForgotPassword = () => {
    const {verifyResetPassword} = useContext(StoreContext);
  return verifyResetPassword ? <Outlet /> : <Navigate to={'/'} />
}

export default ProtectVerifyForgotPassword
