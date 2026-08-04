import React, { useContext } from 'react'
import LeftProfile from '../components/profile/LeftProfile'
import RightProfile from '../components/profile/RightProfile'
import { StoreContext } from '../Context/StoreContext'
import ChangePassword from '../components/Change/ChangePassword'
import ChangeEmail from '../components/Change/ChangeEmail';
import ChangeEmailOtp from '../components/Change/ChangeEmailOtp'
import UserManagement from '../components/Change/UserManagement'

const Profile = () => {
  const {active} = useContext(StoreContext);
  const profileList= {
      "Profile":<RightProfile/>,
      "ChangePassword":<ChangePassword/>,
      "ChangeEmail":<ChangeEmail/>,
      "EmailVerify":<ChangeEmailOtp/>,
      "UserMangement":<UserManagement/>
    }
   
  return (
    <div className='min-h-screen flex gap-1 px-3 py-2 bg-gradient-to-br from-[#081120] zvia-[#0D1633] to-[#141B3A]'>
      <LeftProfile/>
      {profileList[active]}
    </div>
  )
}

export default Profile
