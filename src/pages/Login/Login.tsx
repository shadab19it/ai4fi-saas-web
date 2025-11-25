import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail } from "lucide-react";
import authService from "../../services/authService";
import { toast } from "sonner";
import appConstant from "../../services/appConstant";
import { useDispatch } from "react-redux";
import { setUserRefresh } from "../../store/userReducer";

interface LoginData {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const dispatch = useDispatch();
  const [loginData, setLoginData] = useState<LoginData>({ email: "", password: "" });
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authService.login({ ...loginData });
      localStorage.setItem(appConstant.JWT_AUTH_TOKEN, res.token);
      toast.success(res.message, { position: "bottom-right" });
      setLoading(false);
      dispatch(setUserRefresh());
      navigate("/features");
    } catch (error: any) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  const animationLeft = {
    hidden: { x: "-100vw", opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 1 } },
  };

  const animationRight = {
    hidden: { x: "100vw", opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 1 } },
  };

  useEffect(() => {
    if (authService.isAuthenticated()) {
      navigate("/");
    }
  }, []);

  return (
    <div className='flex flex-col h-auto justify-center items-center bg-gradient-to-br from-sky-950 to-gray-950 pb-16 pt-32'>
      <div className='max-w-7xl w-full flex flex-col md:flex-row justify-center items-center'>
        {/* Left Div with Animation */}
        <motion.div
          className='flex flex-col w-full md:w-1/2 justify-center items-center md:items-start text-center md:text-left px-4 py-8'
          initial='hidden'
          animate='visible'
          variants={animationLeft}>
          <h6 className='text-gray-100 text-[25px] font-semibold mb-6'>Welcome Back</h6>
          <h2 className='text-lg sm:text-3xl md:text-4xl lg:text-5xl mb-6 leading-10 text-cyan-400'>Please login to continue</h2>
          <div className='h-px w-3/4 bg-gray-800 mb-6'></div>
          <div className='flex justify-center md:justify-start items-center space-x-4'>
            <Mail className='text-3xl text-white' />
            <div>
              <p className='text-white'>query@apricityts.com</p>
            </div>
          </div>
        </motion.div>

        {/* Right Div with Login Form and Animation */}
        <motion.div
          className='flex flex-col w-full md:w-2/5 shadow-lg p-12 bg-white rounded-lg'
          initial='hidden'
          animate='visible'
          variants={animationRight}>
          <h4 className=' text-[30px] font-semibold mb-6 text-cyan-600'>Login to your account</h4>

          {error && <p className='text-red-500 mb-4'>{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className='space-y-4'>
              {/* Email */}
              <div>
                <p className='mb-2'>Email</p>
                <input
                  type='email'
                  name='email'
                  value={loginData.email}
                  onChange={handleChange}
                  placeholder='Enter your email address'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md text-black'
                  required
                />
              </div>

              {/* Password */}

              <div>
                <p className='mb-2'>
                  Password <span className='text-xs text-gray-500'>(Must be at least 6 characters)</span>
                </p>
                <div className='relative'>
                  <input
                    type={showPassword ? "text" : "password"}
                    name='password'
                    value={loginData.password}
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

              {/* Submit Button */}
              <button
                type='submit'
                disabled={loading}
                className={`w-full p-3 text-white rounded-md shadow-lg ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-cyan-600"}`}
                style={{ borderRadius: "40px", fontSize: 19 }}>
                {loading ? "Logging In..." : "Log In"}
              </button>
            </div>
          </form>

          <p className='mt-6 text-center text-sm text-gray-600'>
            Don&apos;t have an account?{" "}
            <Link to='/signup' className='text-cyan-600  transition font-semibold'>
              Signup
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
