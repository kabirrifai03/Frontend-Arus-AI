import { ReactNode } from "react";

function Modal({
  visible,
  onClose,
  children,
}: {
  visible: boolean;
  onClose: VoidFunction;
  children: ReactNode;
}) {
  const handleOnClose = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    // Pastikan event.currentTarget ada dan merupakan elemen HTML
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!visible) return null;
  return (
        <div
          onClick={handleOnClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 min-h-screen backdrop-blur-sm"
        >
          <div className="w-full max-w-xl rounded-xl bg-white shadow-2xl max-h-[85vh] overflow-y-auto p-6">
            {children}
          </div>
        </div>
  );
}

export default Modal;
