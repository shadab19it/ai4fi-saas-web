import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import teamService from "../services/teamService";
import authService from "../services/authService";
import { setUser } from "../store/userReducer";

const InviteAcceptPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!token) {
      setStatus({ type: "error", message: "Invite token missing" });
      return;
    }
    if (!password.trim()) {
      setStatus({ type: "error", message: "Password is required" });
      return;
    }
    try {
      setIsSubmitting(true);
      setStatus(null);
      await teamService.acceptInvite(token, password, username.trim() || undefined);
      try {
        const userInfo = await authService.getUserInfo();
        if (userInfo?.user) {
          dispatch(setUser(userInfo.user));
          setStatus({ type: "success", message: "Invite accepted. Redirecting to credits." });
          setTimeout(() => navigate("/credits"), 1200);
          return;
        }
      } catch (refreshError) {
        // ignore and fall back to login
      }
      setStatus({ type: "success", message: "Invite accepted. Please log in." });
      setTimeout(() => navigate("/login"), 1200);
    } catch (error) {
      setStatus({ type: "error", message: error instanceof Error ? error.message : "Failed to accept invite" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='min-h-screen bg-slate-950 text-white flex items-center justify-center px-6'>
      <div className='w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 p-6'>
        <h1 className='text-2xl font-bold'>Accept Team Invite</h1>
        <p className='mt-2 text-sm text-slate-400'>Set your password to join the team.</p>

        <form className='mt-6 space-y-4' onSubmit={handleSubmit}>
          <div>
            <label className='text-xs text-slate-400'>Name (optional)</label>
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className='mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none'
              placeholder='Your name'
            />
          </div>
          <div>
            <label className='text-xs text-slate-400'>Password</label>
            <input
              type='password'
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className='mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none'
              placeholder='Create a password'
            />
          </div>
          <button
            type='submit'
            disabled={isSubmitting}
            className='w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60'
          >
            {isSubmitting ? "Accepting..." : "Accept Invite"}
          </button>
        </form>

        {status && (
          <p className={status.type === "success" ? "mt-4 text-sm text-green-400" : "mt-4 text-sm text-red-400"}>
            {status.message}
          </p>
        )}
      </div>
    </div>
  );
};

export default InviteAcceptPage;
