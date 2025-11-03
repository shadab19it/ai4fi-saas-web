import { useState } from "react";
import { motion } from "framer-motion";

import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail } from "lucide-react";
import authService from "../../services/authService";
import { toast } from "sonner";
import { LoadingSpinner } from "../../components/ModelGenerator/ModelConfigForm/ModelConfigForm";

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  otp: string;
}

const SignUpForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });
  const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
  const [isOtpVerified, setIsOtpVerified] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const handleSendOtp = async () => {
    const { username, email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      toast.info("Password and confirm-password doesn't matched");
      return;
    }
    setLoading(true);
    try {
      const res = await authService.signup({ username, email, password, confirmPassword });
      setIsOtpSent(true);
      toast.success("Opt sent please verify your email");
      setLoading(false);
    } catch (error: any) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const { email, otp } = formData;
    try {
      setLoading(true);
      const res = await authService.userVerifyOtp(otp, email);
      toast.success(res.message);
      setLoading(false);
      navigate("/login");
    } catch (error: any) {
      setLoading(false);
      toast.error(error.message);
    }
  };

  return (
    <div className='flex flex-col h-auto justify-center items-center bg-gradient-to-br from-sky-950 to-gray-950 pb-16 pt-36'>
      <div className='max-w-7xl w-full flex flex-col md:flex-row justify-center items-center'>
        {/* Left Div */}
        <motion.div
          className='flex flex-col w-full md:w-1/2 justify-center items-start md:items-start text-center md:text-left px-4 py-8'
          initial={{ x: "-100vw", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}>
          <h6 className='text-gray-100 text-[25px] font-semibold mb-6'>Join Us Today</h6>
          <h2 className='text-lg sm:text-3xl md:text-4xl lg:text-5xl mb-6 leading-10 text-cyan-400'>Create your account with us!</h2>
          <div className='h-px w-3/4 bg-gray-800 mb-6'></div>
          <div className='flex justify-center  md:justify-start items-center space-x-4'>
            <Mail className='text-3xl text-white' />
            <div>
              <p className='text-white'>support@yourwebsite.com</p>
            </div>
          </div>
        </motion.div>

        {/* Right Div */}
        <motion.div
          className='flex flex-col w-full md:w-2/5 shadow-lg p-12 bg-white rounded-lg'
          initial={{ x: "100vw", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}>
          <h4 className='text-cyan-600 text-[30px] font-semibold mb-6'>Create your account</h4>
          <form onSubmit={handleSubmit}>
            <div className='space-y-4'>
              {/* Email Input Section */}
              {!isOtpSent && (
                <>
                  <div>
                    <p className='mb-2'>Name</p>
                    <input
                      type='text'
                      name='username'
                      value={formData.username}
                      onChange={handleChange}
                      placeholder='Enter your name'
                      className='w-full px-3 py-2 border border-gray-300 rounded-md text-black'
                      required
                    />
                  </div>

                  <div>
                    <p className='mb-2'>Email</p>
                    <input
                      type='email'
                      name='email'
                      value={formData.email}
                      onChange={handleChange}
                      placeholder='Enter your email'
                      className='w-full px-3 py-2 border border-gray-300 rounded-md text-black'
                      required
                    />
                  </div>

                  <div>
                    <p className='mb-2'>
                      Password <span className='text-xs text-gray-500'>(Must be at least 6 characters)</span>
                    </p>
                    <div className='relative'>
                      <input
                        type={showPassword ? "text" : "password"}
                        name='password'
                        value={formData.password}
                        onChange={handleChange}
                        placeholder='Enter your password'
                        className='w-full px-3 py-2 border border-gray-300 rounded-md text-black pr-10'
                        required
                      />
                      <span
                        className='absolute cursor-pointer right-3 top-3 text-gray-500 hover:text-gray-700'
                        onClick={() => setShowPassword(!showPassword)}>
                        {!showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </span>
                    </div>
                  </div>
                  <div className='mt-4'>
                    <p className='mb-2'>
                      Confirm Password <span className='text-xs text-gray-500'>(Must be at least 6 characters)</span>
                    </p>
                    <div className='relative'>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name='confirmPassword'
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder='Confirm your password'
                        className='w-full p-3 border border-gray-300 rounded-md text-black pr-10'
                        required
                      />
                      <span
                        className='absolute cursor-pointer right-3 top-3 text-gray-500 hover:text-gray-700'
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                        {!showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </span>
                    </div>
                  </div>

                  <button
                    type='button'
                    disabled={loading}
                    onClick={handleSendOtp}
                    className={`w-full p-3 text-white rounded-md mt-4 ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-cyan-600"}`}
                    style={{ borderRadius: "40px", fontSize: 19 }}>
                    {loading ? "Sending OTP..." : "Send OTP"}
                  </button>
                </>
              )}

              {/* OTP Input Section */}
              {isOtpSent && !isOtpVerified && (
                <div>
                  <p className='mb-2'>OTP</p>
                  <input
                    type='text'
                    name='otp'
                    value={formData.otp}
                    onChange={handleChange}
                    placeholder='Enter OTP'
                    className='w-full p-3 border border-gray-300 rounded-md text-black'
                    required
                  />
                  <button
                    type='button'
                    onClick={handleVerifyOtp}
                    className='w-full p-3 flex items-center justify-center gap-1 bg-cyan-600 text-white rounded-md mt-4'>
                    <span>Verify OTP</span> {loading && <LoadingSpinner size={15} />}
                  </button>
                </div>
              )}

              {isOtpSent && isOtpVerified && (
                <>
                  <button
                    type='submit'
                    className='w-full p-3 bg-cyan-600 text-white rounded-md shadow-lg'
                    style={{ borderRadius: "40px", fontSize: 19 }}>
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </form>
          <p className='mt-6 text-center text-sm text-gray-600'>
            Already have an account?{" "}
            <Link to='/login' className='text-cyan-600  transition font-semibold'>
              Sign In
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUpForm;
