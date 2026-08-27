import React, { useContext, useState } from 'react'
import { useNavigate, Link } from "react-router-dom"
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
  const [loading, setLoading] = useState(false);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();

    if (!validateEmail(cleanEmail)) {
      setError("Please Enter a Valid Email Address.");
      return;
    }
    if (!password) {
      setError("Please enter the password");
      return; 
    }
    setError("");
    setLoading(true);

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email: cleanEmail,
        password,
      });
      const { token, user } = response.data;
      if (token) {
        localStorage.setItem("token", token);
        updateUser(user);
        navigate("/dashboard");
      }
    } catch (err) {
      if (err.customMessage) {
        setError(err.customMessage);
      } else if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className='lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center'>
        <h3 className='text-xl font-semibold text-black dark:text-white'>Welcome Back</h3>
        <p className='text-xs text-slate-700 dark:text-gray-400 mt-1.25 mb-6'>
          Please Enter Your details to login
        </p>

        <form onSubmit={handleLogin} className='space-y-4'>
          <Input
            value={email}
            onChange={(e) => {
              setEmail(e.target.value.toLowerCase());
              if (error) setError("");
            }}
            label="Email Address"
            placeholder="john@example.com"
            type="email"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            inputMode="email"
            disabled={loading}
          />

          <Input
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError("");
            }}
            label="Password"
            placeholder="Min 8 Characters"
            type="password"
            disabled={loading}
          />
          {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-green-400 hover:bg-green-500 text-white py-2 rounded-lg transition-colors cursor-pointer ${
              loading ? "opacity-75 cursor-wait" : ""
            }`}
          >
            {loading ? "Authenticating..." : "Login"}
          </button>
          <p className='text-[13px] text-slate-800 dark:text-gray-300 mt-3'>
            Don't have an account?{" "}
            <Link className="font-medium text-green-400 underline" to="/signup">SignUp</Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;
