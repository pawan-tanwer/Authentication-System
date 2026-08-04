import React from 'react'
import RightProfileUpper from './RightProfileUpper'
import RightProfileLower from './RightProfileLower'

const RightProfile = () => {
  return (
    <div className='w-full p-3 flex flex-col gap-6'>
        <RightProfileUpper/>
        <RightProfileLower/>
    </div>
  )
}

export default RightProfile
