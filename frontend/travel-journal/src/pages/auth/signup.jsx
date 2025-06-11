import React from 'react'
import { useNavigate } from "react-router-dom";
import PasswordInput from "../../components/inputs/PasswordInput";
import { validateEmail } from "../../utils/helper";
import axiosInstance from '../../utils/axiosInstance';
import signupBg from '../../assets/images/signup.jpg';



const SignUp = () => {

  const [email, setEmail] = React.useState("");
  const [name, setName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState(null);

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if(!name) {
      setError("Please enter your name");
      return;
    };

    if(!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    };

    if(!password) {
      setError("Please enter your password.");
      return;
    }

    setError("");

    //signup api

    try{
      const response = await axiosInstance.post("/create-account", {
        fullName: name,
        email: email,
        password: password, });

        if(response.data && response.data.accessToken){
          localStorage.setItem("token", response.data.accessToken);
          navigate("/dashboard");
        }
    }
    catch(error){
      if(error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      }else{
        setError("An error occurred while logging in. Please try again.");
      }
    }
  };


  return (
    <div className="h-screen bg-cyan-50 overflow-hidden relative">
      <div className="login-ui-box bg-cyan-200 -bottom-40 right-1/2" />
      <div className="login-ui-box right-10 -top-40" />
      <div className="container h-screen flex items-center justify-center px-auto mx-auto">
        <div className="w-2/4 h-[90vh] flex items-end bg-cover bg-center rounded-lg p-10 z-50"
        style={{ backgroundImage: `url(${signupBg})` }}>
          <div >
            <h4 className="text-5xl text-white font-semibold leading-[58px] ">
              Join the  <br /> Adventure
            </h4>
            <p className="text-white text-[15px] leading-6 pr-7 mt-4">
              Create an account to share your travel stories !
            </p>
          </div>
        </div>

        <div className="w-2/4 h-[75vh] bg-white rounded-r-lg relative p-16 shadow-lg shadow-cyan-200/20">
          <form onSubmit={handleSignUp}>
            <h4 className="text-2xl font-semibold mb-7">Sign Up</h4>
            <input type="text" placeholder="Full Name" className="input-box" 
            value={name}
            onChange={({target}) => {setName(target.value);}}
            /> 

            <input type="text" placeholder="Email" className="input-box" 
            value={email}
            onChange={({target}) => {setEmail(target.value);}}
            /> 

            <PasswordInput 
             value={password}
             onChange={({target}) => {setPassword(target.value);}}
            />

            {
              error && <p className="text-red-500 text-xs pb-1">{error}</p>
            }

            <button type="submit" className="btn-primary hover:text-primary">
              CREATE ACCOUNT
            </button>

            <p className="text-xs text-slate-500 text-center my-4"> Or </p>

            <button type="submit" className="btn-primary btn-light" onClick={()=>{
              navigate("/login"); }}>
              LOGIN
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
