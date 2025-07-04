const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return(
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl relative p-6">
            <button onClick={onClose} className="absolute top-3 right-4 text-xl font-bold">x</button>
            {children}
        </div>
      </div>  
    )
}

export default Modal