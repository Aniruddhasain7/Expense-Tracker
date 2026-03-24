export const Modal = ({ children, isOpen, onClose, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
      <div className="relative w-full max-w-2xl p-4 max-h-full">
        <div className="bg-white rounded-lg shadow-lg">
          
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-900 text-sm"
            >
              ✕
            </button>
          </div>

          <div className="p-4 md:p-5 space-y-4">
            {children}
          </div>

        </div>
      </div>
    </div>
  );
};
