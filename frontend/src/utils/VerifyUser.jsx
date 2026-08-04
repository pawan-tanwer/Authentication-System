import React from 'react'
import { useContext } from 'react'

import { Navigate, Outlet } from 'react-router-dom';
import { StoreContext } from '../Context/StoreContext';

const VerifyUser = () => {
const {isAuthentication} = useContext(StoreContext);

 return isAuthentication? <Outlet/> : <Navigate to={'/'}/>
}

export default VerifyUser
