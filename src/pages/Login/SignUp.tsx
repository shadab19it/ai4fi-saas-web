import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail } from "lucide-react";
import authService from "../../services/authService";
import { toast } from "sonner";
import { LoadingSpinner } from "../../components/ModelGenerator/ModelConfigForm/ModelConfigForm";
import AuthLayout from "../../components/Login/AuthLayout";

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
      await authService.signup({ username, email, password, confirmPassword });
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
    <AuthLayout
      mode='signup'
      customForm={<form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {/* Email Input Section */}
          {!isOtpSent && (
            <>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-white">Name</label>
                <input
                  type='text'
                  name='username'
                  value={formData.username}
                  onChange={handleChange}
                  placeholder='Enter your name'
                  className='w-full px-4 py-3 rounded-lg auth-input transition-all'
                  required />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-white">Email Address</label>
                <div className="relative">
                  <input
                    type='email'
                    name='email'
                    value={formData.email}
                    onChange={handleChange}
                    placeholder='Enter your email'
                    className='w-full px-4 py-3 rounded-lg auth-input transition-all'
                    required />
                  <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-white">
                  Password <span className='text-xs text-muted-foreground font-normal'>(Must be at least 6 characters)</span>
                </label>
                <div className='relative'>
                  <input
                    type={showPassword ? "text" : "password"}
                    name='password'
                    value={formData.password}
                    onChange={handleChange}
                    placeholder='Enter your password'
                    className='w-full px-4 py-3 rounded-lg auth-input transition-all pr-12'
                    required />
                  <button
                    type="button"
                    className='absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors'
                    onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-white">
                  Confirm Password
                </label>
                <div className='relative'>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name='confirmPassword'
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder='Confirm your password'
                    className='w-full px-4 py-3 rounded-lg auth-input transition-all pr-12'
                    required />
                  <button
                    type="button"
                    className='absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors'
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                  </button>
                </div>
              </div>

              <button
                type='button'
                disabled={loading}
                onClick={handleSendOtp}
                className={`w-full py-4 bg-brand text-white font-bold rounded-xl shadow-lg transition-all active:scale-[0.98] mt-4 ${loading ? "opacity-50 cursor-not-allowed" : "hover:shadow-brand/20 hover:shadow-xl"}`}>
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </>
          )}

          {/* OTP Input Section */}
          {isOtpSent && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-white">OTP Code</label>
                <input
                  type='text'
                  name='otp'
                  value={formData.otp}
                  onChange={handleChange}
                  placeholder='Enter OTP'
                  className='w-full px-4 py-3 rounded-lg auth-input transition-all'
                  required />
              </div>
              <button
                type='button'
                onClick={handleVerifyOtp}
                disabled={loading}
                className='w-full py-4 flex items-center justify-center gap-2 bg-brand-color text-white font-bold rounded-xl shadow-lg transition-all active:scale-[0.98]'>
                <span>Verify OTP</span> {loading && <LoadingSpinner size={20} />}
              </button>
            </div>
          )}

          {isOtpSent && (
            <button
              type='submit'
              className='w-full py-4 bg-brand-color text-white font-bold rounded-xl shadow-lg transition-all active:scale-[0.98]'>
              Complete Sign Up
            </button>
          )}
        </div>
      </form>} />
  );
};

export default SignUpForm;
