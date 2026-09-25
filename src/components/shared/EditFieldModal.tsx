import React, { useState } from 'react';
import { X, Check } from 'lucide-react';

interface EditFieldModalProps {
  isOpen: boolean;
  title: string;
  fieldLabel: string;
  initialValue: string;
  multiline?: boolean;
  onSave: (val: string) => void;
  onClose: () => void;
}

export const EditFieldModal: React.FC<EditFieldModalProps> = ({
  isOpen,
  title,
  fieldLabel,
  initialValue,
  multiline = true,
  onSave,
  onClose,
}) => {
  const [value, setValue] = useState(initialValue);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div 
        className="w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-2xl text-neutral-100"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div>
            <h3 className="text-base font-semibold text-white tracking-tight">{title}</h3>
            <p className="text-xs text-neutral-400 mt-0.5">Refine human-in-the-loop strategy inputs</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-md hover:bg-neutral-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4">
          <label className="block text-xs font-medium text-neutral-300 mb-2">
            {fieldLabel}
          </label>
          {multiline ? (
            <textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              rows={5}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-sm text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-amber-500/80 transition-colors leading-relaxed"
            />
          ) : (
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-amber-500/80 transition-colors"
            />
          )}
        </div>

        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-neutral-800">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-medium text-neutral-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSave(value);
              onClose();
            }}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium bg-amber-500 hover:bg-amber-400 text-neutral-950 rounded-lg transition-colors font-semibold"
          >
            <Check className="w-3.5 h-3.5" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
