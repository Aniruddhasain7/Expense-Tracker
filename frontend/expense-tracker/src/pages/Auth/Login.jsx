import React, { useContext, useState } from 'react'
import { useNavigate , Link} from "react-router-dom"
import AuthLayout from '../../components/layouts/AuthLayout'
import Input from '../../components/Inputs/Input'
import { validateEmail } from '../../utils/helper'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import { UserContext } from '../../context/UserContext'


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const{ updateUser }=useContext(UserContext);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if(!validateEmail(email)){
      setError("Please Enter a Valid Email Address.");
      return;
    }
    if(!password){
      setError("Please enter the password");
      return; 
    }
    setError("");

    try {
      const response=await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });
      const { token, user }=response.data;
      if (token) {
        localStorage.setItem("token", token);
        updateUser(user);
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  }

  return (
    <AuthLayout>
      <div className='lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center'>
        <h3 className='text-xl font-semibold text-black'>Welcome Back</h3>
        <p className='text-xs text-slate-700 mt-1.25 mb-6'>
          Please Enter Your details to login
        </p>

        <form onSubmit={handleLogin} className='space-y-4'>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label="Email Address"
            placeholder="john@example.com"
            type="text"
          />

          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            label="Password"
            placeholder="Min 8 Characters"
            type="password"
          />
          {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

          <button
            type="submit"
            className="w-full bg-green-400 text-white py-2 rounded-lg"
          >
            Login
          </button>
          <p className='text-[13px] text-slate-800 mt-3'>
            Don't have an account?{" "}
            <Link className="font-medium text-green-400 underline" to="/signup">SignUp</Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  )
}

export default Login
