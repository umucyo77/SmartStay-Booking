import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import toast from 'react-hot-toast';
import { useAuthStore } from '../store/useAuthStore';

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    if (isSignUp && !name) {
      toast.error('Please enter your name');
      return;
    }
    const user = {
      id: `user_${Date.now()}`,
      name: isSignUp ? name : email.split('@')[0],
      email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
    };
    login(user);
    toast.success(`Welcome${isSignUp ? '' : ' back'}, ${user.name}!`);
    navigate('/');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-br from-rose-500 to-rose-600 px-8 py-10 text-center">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-rose-500 font-bold text-2xl">S</span>
            </div>
            <h1 className="text-white text-2xl font-bold">StayFinder</h1>
            <p className="text-rose-100 text-sm mt-1">Find your perfect stay</p>
          </div>
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => setIsSignUp(false)}
              className={`flex-1 py-4 text-sm font-semibold transition-colors ${
                !isSignUp ? 'text-rose-500 border-b-2 border-rose-500' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsSignUp(true)}
              className={`flex-1 py-4 text-sm font-semibold transition-colors ${
                isSignUp ? 'text-rose-500 border-b-2 border-rose-500' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Sign up
            </button>
          </div>
          <div className="px-8 py-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Full name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-rose-400 transition-colors" />
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-rose-400 transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-rose-400 transition-colors" />
              </div>
              <button type="submit"
                className="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold py-3.5 rounded-xl transition-colors text-sm mt-2">
                {isSignUp ? 'Create account' : 'Login'}
              </button>
            </form>
            <p className="text-center text-xs text-gray-400 mt-6">
              By continuing, you agree to our{' '}
              <Link to="/" className="text-rose-500 hover:underline">Terms of Service</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}