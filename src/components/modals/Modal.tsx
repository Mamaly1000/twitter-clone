import React, { useCallback } from "react";
import { AiOutlineClose } from "react-icons/ai";
import Button from "../inputs/Button";
interface ModalProps {
  isOpen?: boolean;
  onClose: () => void;
  onSubmit?: () => void;
  title?: string;
  body?: React.ReactElement;
  footer?: React.ReactElement;
  actionLabel?: string;
  disabled?: boolean;
}
const Modal = ({
  actionLabel,
  onClose,
  onSubmit,
  body,
  disabled,
  footer,
  isOpen,
  title,
}: ModalProps) => {
  const handleClose = useCallback(() => {
    if (disabled) {
      return;
    }

    onClose();
  }, [onClose, disabled]);

  const handleSubmit = useCallback(() => {
    if (disabled) {
      return;
    }
    if (onSubmit) {
      onSubmit();
    }
  }, [onSubmit, disabled]);

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div
        className="
      justify-center 
      items-center 
      flex 
      overflow-x-hidden 
      overflow-y-auto 
      fixed 
      inset-0 
      z-50 
      outline-none 
      focus:outline-none
      bg-neutral-800
      bg-opacity-70
    "
      >
        <div className="absolute w-full lg:w-3/6 my-6 mx-auto lg:max-w-3xl h-full overflow-y-auto max-h-screen lg:h-auto">
          {/*content*/}
          <div
            className="
      h-fit max-h-screen md:max-h-[90vh]
        lg:h-auto
        border-0 
        rounded-lg 
        shadow-lg 
        relative 
        flex 
        flex-col 
        w-full 
        bg-black 
        outline-none 
        focus:outline-none  
        "
          >
            {/*header*/}
            <div
              className="
          flex 
          items-center 
          justify-between 
          p-10 
          rounded-t
          "
            >
              <h3 className="text-3xl font-semibold text-white">{title}</h3>
              <button
                className="
              p-1 
              ml-auto
              border-0 
              text-white 
              hover:opacity-70
              transition
            "
                onClick={handleClose}
              >
                <AiOutlineClose size={20} />
              </button>
            </div>
            {/*body*/}
            <div className="relative p-10 flex-auto md:max-h-[75vh] h-fit max-h-full overflow-y-auto ">
              {body}
            </div>
            {/*footer*/}
            <div className="flex flex-col gap-2 p-10">
              {!!actionLabel && (
                <Button
                  disabled={disabled}
                  secondary
                  fullWidth
                  large
                  onClick={handleSubmit}
                >
                  {actionLabel}
                </Button>
              )}
              {footer}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
