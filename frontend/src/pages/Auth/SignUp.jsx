import React, { useContext, useState } from 'react'
import { useNavigate, Link } from "react-router-dom"
import AuthLayout from '../../components/layouts/AuthLayout'
import Input from '../../components/Inputs/Input'
import { validateEmail } from '../../utils/helper'
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import { UserContext } from '../../context/UserContext'
import uploadImage from '../../utils/uploadImage'

const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    let profileImageUrl = "";

    if (!fullName) {
      setError("Please enter your Name");
      return;
    }
    if (!validateEmail(cleanEmail)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Please enter the password");
      return;
    }
    setError("");
    setLoading(true);

    try {
      if (profilePic) {
        try {
          const imgUploadRes = await uploadImage(profilePic);
          profileImageUrl = imgUploadRes.imageUrl || "";
        } catch (imgErr) {
          console.warn("Image upload failed, proceeding with registration", imgErr);
        }
      }
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        fullName,
        email: cleanEmail,
        password,
        profileImageUrl,
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
      <div className='lg:w-full h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center'>
        <h3 className='text-xl font-semibold text-black dark:text-white'>Create an Account</h3>
        <p className='text-xs text-slate-700 dark:text-gray-400 mt-1.25 mb-6'>
          Join us today by entering your details below.
        </p>
        <form onSubmit={handleSignUp}>
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} disabled={loading} />
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Input
              value={fullName}
              onChange={({target}) => {
                setFullName(target.value);
                if (error) setError("");
              }}
              label="Full Name"
              placeholder="John"
              type="text"
              disabled={loading}
            />
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
            <div className='md:col-span-2'>
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
            </div>
          </div>
          {error && <p className='text-red-500 text-xs pb-2.5 mt-2'>{error}</p>}
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-green-400 hover:bg-green-500 text-white py-2 rounded-lg transition-colors cursor-pointer mt-4 ${
              loading ? "opacity-75 cursor-wait" : ""
            }`}
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>
          <p className='text-[13px] text-slate-800 dark:text-gray-300 mt-3'>
            Already have an account?{" "}
            <Link className="font-medium text-green-400 underline" to="/login">Login</Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default SignUp;