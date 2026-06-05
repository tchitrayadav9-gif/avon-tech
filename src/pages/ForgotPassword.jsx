import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../context/AuthContext';
import { Shield, Mail, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return setError('Email is required');

    setError('');
    setSuccessMsg('');
    setSubmitting(true);

    try {
      const res = await axios.post(`${API_URL}/auth/forgot-password`, { email });
      setSubmitting(false);
      if (res.data.success) {
        setSuccessMsg(res.data.message);
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setSubmitting(false);
      setError(err.response?.data?.message || 'An error occurred. Check email address.');
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-6">
      <div className="w-full max-w-md bg-white dark:bg-enterprise-900 border border-slate-200 dark:border-enterprise-800 p-8 rounded-2xl shadow-xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-brand-100 dark:bg-brand-950 text-brand-600 dark:text-brand-400 rounded-xl flex items-center justify-center mb-2">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Reset Account Password</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Enter your registered email and we will simulate password reset instructions.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30 text-rose-700 dark:text-rose-400 rounded-lg flex items-center space-x-2 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg space-y-2 text-xs">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="font-bold">Instructions Sent</span>
            </div>
            <p className="leading-relaxed">{successMsg}</p>
          </div>
        )}

        {/* Form */}
        {!successMsg && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="contact@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-enterprise-950 border border-slate-200 dark:border-enterprise-850 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 font-bold bg-brand-600 hover:bg-brand-700 disabled:bg-brand-500 text-white rounded-lg flex items-center justify-center space-x-2 transition"
            >
              <span>{submitting ? 'Sending Request...' : 'Send Reset Link'}</span>
            </button>
          </form>
        )}

        <div className="text-center pt-2 border-t border-slate-100 dark:border-enterprise-850">
          <Link to="/login" className="inline-flex items-center space-x-2 text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
