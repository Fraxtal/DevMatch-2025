import React from 'react';

interface TopUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  iframeUrl: string;
}

export const TopUpModal: React.FC<TopUpModalProps> = ({ isOpen, onClose, iframeUrl }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-[95vw] h-[90vh] max-w-5xl rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-white">
        <div className="absolute top-3 right-3 z-20">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-gray-900 text-white text-sm hover:bg-gray-800"
          >
            Close
          </button>
        </div>
        <iframe
          src={iframeUrl}
          className="w-full h-full"
          title="Top Up PRED Tokens"
          allow="clipboard-write; encrypted-media;"
        />
      </div>
    </div>
  );
};

export default TopUpModal;



