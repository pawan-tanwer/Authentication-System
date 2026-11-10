import { createContext, useState } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props)=>{
    // register login check ke liye
    const [type,setType] = useState("Login");
    const authUrl = "https://auth-backend-00je.onrender.com/api/auth";
    const userUrl = "https://auth-backend-00je.onrender.com/api/user";
    // ye verification me kaam aayegi like email, password
    const [email,setEmail] = useState("");
    const [accessToken,setAccessToken] = useState();
    //User se profile dekhane ke liye agar user ke pass access token hai to
    const [isAuthentication,setIsAuthentication] = useState(false);

    //user ka data : esme only name or avatar hai
    const [user ,setUser] = useState();

    //profile right section
    const [active,setActive] =useState("Profile");

    // ye decide karega ke profile photo change karne wala section open hoga ya nhi
    const [uploadProfile,setUploadProfile] = useState(false);

    // admin ke liye esme all User ka data hoga
    const [allUsers,setAllUsers] = useState();
    
    //user ke profile image
    const [profileImage,setProfileImage] = useState(""||"https://auth-backend-00je.onrender.com/profile.png");

    // forget password ke liye reset token store karne ke liye
    const [resetToken,setResetToken] = useState();

    //url protection
    const [verifyResetPassword,setVerifyResetPassword] = useState(false);
    const [isForgetPassword,setIsForgetPassword] = useState(false);

    const [stats, setStats] = useState({
  totalUsers: 0,
  activeUsers: 0,
  blockedUsers: 0,
  totalAdmins: 0,
});

    const contextValue = {
        type,
        setType,
        authUrl,
        userUrl,
        setEmail,
        email,
        accessToken,setAccessToken,
        isAuthentication,setIsAuthentication,
        user,setUser,
        active,setActive,
        uploadProfile,setUploadProfile,
        allUsers,setAllUsers,
        profileImage,setProfileImage,
        stats, setStats,
        resetToken,setResetToken,
        verifyResetPassword,setVerifyResetPassword,
        isForgetPassword,setIsForgetPassword
    }

    return(
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider;