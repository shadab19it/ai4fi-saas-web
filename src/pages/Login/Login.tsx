import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail } from "lucide-react";
import authService from "../../services/authService";
import { toast } from "sonner";
import appConstant from "../../services/appConstant";
import { useDispatch } from "react-redux";
import { setUserRefresh } from "../../store/userReducer";
import AuthLayout from "../../components/Login/AuthLayout";

interface LoginData {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const dispatch = useDispatch();
  const [loginData, setLoginData] = useState<LoginData>({ email: "", password: "" });
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
    <AuthLayout 
      mode='login' 
      customForm={
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-foreground">Email Address</label>
            <div className="relative">
              <input
                type='email'
                name='email'
                value={loginData.email}
                onChange={handleChange}
                placeholder='Enter your email address'
                className='w-full px-4 py-3 rounded-xl   transition-all'
                required
              />
              <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-foreground">
              Password <span className='text-xs text-muted-foreground font-normal'>(Must be at least 6 characters)</span>
            </label>
            <div className='relative'>
              <input
                type={showPassword ? "text" : "password"}
                name='password'
                value={loginData.password}
                onChange={handleChange}
                placeholder='Enter your password'
                className='w-full px-4 py-3 rounded-xl transition-all pr-12'
                required
              />
              <button
                type="button"
                className='absolute right-4 top-1/2 -translate-y-1/2  text-muted-foreground transition-colors'
                onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <Eye size={20}  /> : <EyeOff size={20}  />}
              </button>
            </div>
          </div>

          <button
            type='submit'
            disabled={loading}
            className={`w-full py-4 bg-brand-color text-white font-bold rounded-xl shadow-lg transition-all active:scale-[0.98] ${loading ? "opacity-50 cursor-not-allowed" : "hover:shadow-brand/20 hover:shadow-xl"}`}>
            {loading ? "Logging In..." : "Log In"}
          </button>
        </form>
      } 
    />
  );
};

export default LoginPage;
