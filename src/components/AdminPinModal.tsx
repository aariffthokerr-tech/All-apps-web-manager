import React, { useState } from 'react';
import { KeyRound, Lock, X } from 'lucide-react';
import { verifyAdminPin } from '../utils/storeLogic';

interface AdminPinModalProps {
  isOpen: boolean;
  expectedPin: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminPinModal: React.FC<AdminPinModalProps> = ({
  isOpen,
  expectedPin,
  onClose,
  onSuccess,
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyAdminPin(pin, expectedPin)) {
      setPin('');
      setError('');
      onSuccess();
    } else {
      setError('Invalid Creator PIN. Default demo PIN is 2026.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-pin-title"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="glass-surface-elevated w-full max-w-md rounded-3xl p-6 sm:p-8 space-y-6 border border-white/15 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#7C3AED]/20 border border-[#7C3AED]/40 flex items-center justify-center text-[#06B6D4]">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2
                id="admin-pin-title"
                className="text-lg font-extrabold text-[#F8FAFC]"
              >
                PocketBawal Creator Studio
              </h2>
              <p className="text-xs text-[#94A3B8]">
                Owner-only No-Code Publishing Access
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close PIN modal"
            className="min-h-[40px] min-w-[40px] inline-flex items-center justify-center rounded-xl text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/[0.06] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="creator-pin-input"
              className="block text-xs font-semibold text-[#94A3B8]"
            >
              Enter Creator Security PIN
            </label>
            <div className="relative flex items-center">
              <KeyRound className="w-4 h-4 text-[#94A3B8] absolute left-3.5 pointer-events-none" />
              <input
                id="creator-pin-input"
                type="password"
                inputMode="numeric"
                autoFocus
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Enter PIN (default: 2026)"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#090B12] border border-white/15 text-[#F8FAFC] font-mono text-base tracking-widest focus:border-[#06B6D4] focus:outline-none"
              />
            </div>
            {error && (
              <p role="alert" className="text-xs font-medium text-rose-400">
                {error}
              </p>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] px-4 py-2 rounded-xl text-xs font-semibold text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/[0.05] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="min-h-[44px] px-6 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-white hover:opacity-95 shadow-lg shadow-[#7C3AED]/20 cursor-pointer"
            >
              Unlock Creator Studio
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
