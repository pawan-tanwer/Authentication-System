import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';
import { StoreContext } from '../Context/StoreContext';
import { useContext } from 'react';

const ProtectResetPassword = () => {
    const {isForgetPassword} = useContext(StoreContext);
  return isForgetPassword ? <Outlet /> : <Navigate to={'/'} />
}

export default ProtectResetPassword;
