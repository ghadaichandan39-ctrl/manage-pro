
import React, { useState, useEffect } from 'react';

interface LoginProps {
  onLogin: (name: string, mobile: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [step, setStep] = useState<'DETAILS' | 'OTP'>('DETAILS');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpTimer, setOtpTimer] = useState(0);

  const handleGetOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) {
      alert("Please enter a valid name");
      return;
    }
    if (mobile.length !== 10) {
      alert("Please enter a valid 10-digit mobile number");
      return;
    }
    
    // Simulate sending OTP
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(code);
    setStep('OTP');
    setOtpTimer(60);
    alert(`Demo OTP Sent: ${code}`); // In a real app, this would be an SMS
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpInput === generatedOtp) {
      onLogin(name, mobile);
    } else {
      alert("Invalid OTP! Try again.");
    }
  };

  useEffect(() => {
    if (otpTimer > 0) {
      const t = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [otpTimer]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-600 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0012 3m0 0a10.003 10.003 0 0110 10c0 2.49-.913 4.766-2.427 6.51M12 3v18M12 11l5.243 5.243" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">MessManager Pro</h1>
          <p className="text-slate-500 mt-2">
            {step === 'DETAILS' ? 'Register or Sign In' : 'Verify your Mobile'}
          </p>
        </div>

        {step === 'DETAILS' ? (
          <form onSubmit={handleGetOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Mobile Number</label>
              <input
                type="tel"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="10 digit mobile number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg transition-all"
            >
              Get OTP
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-6">
            <div className="text-center">
              <p className="text-sm text-slate-500 mb-4">OTP sent to <b>+91 {mobile}</b></p>
              <input
                type="text"
                required
                autoFocus
                className="w-full text-center tracking-[1em] text-2xl font-bold px-4 py-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="0000"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, '').slice(0, 4))}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg transition-all"
            >
              Verify & Login
            </button>
            <div className="text-center">
              <button 
                type="button"
                onClick={() => setStep('DETAILS')}
                className="text-indigo-600 text-sm font-medium hover:underline"
              >
                Change Number?
              </button>
              {otpTimer > 0 ? (
                <p className="text-xs text-slate-400 mt-2">Resend OTP in {otpTimer}s</p>
              ) : (
                <button 
                  type="button"
                  onClick={handleGetOtp}
                  className="block mx-auto text-xs text-indigo-600 font-bold mt-2"
                >
                  Resend OTP
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
