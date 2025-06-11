import React, { useState } from 'react'
import {FaRegEye, FaRegEyeSlash} from "react-icons/fa6";

const PasswordInput = ({value, onChange, placeholder}) => {

    const[isShowpass, setisshowpass] = useState(false);
    const togglePasswordVisibility = () => {
        setisshowpass(!isShowpass);
    };
  return (
    <div className="flex items-center bg-cyan-600/5 px-5 rounded mb-3">

        <input
            value={value}
            onChange={onChange}
            placeholder={placeholder || "Password"}
            type={isShowpass ? "text" : "password"}
            className="w-full text-sm py-3 mr-3 bg-transparent outline-none rounded"
            //style={!isShowpass ? { WebkitTextSecurity: 'disc', fontSize: '2rem' } : {}}
        />

            {isShowpass ? (
            <FaRegEye 
            size={22}
            className="text-[#05B6D3] cursor-pointer"
            onClick={()=> togglePasswordVisibility()}
            />) : (
                <FaRegEyeSlash
            size={22}
            className="text-slate-400 cursor-pointer"
            onClick={()=> togglePasswordVisibility()}
            /> 
            )
        
        
        
        }

    </div>
  )
}

export default PasswordInput