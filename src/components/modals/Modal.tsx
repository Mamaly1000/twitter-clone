import React, { useCallback, useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import Button from "../inputs/Button";
import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";
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
  const [visible, setVisible] = useState(false);

  const handleClose = useCallback(() => {
    if (disabled) {
      return;
    }
    setVisible(false);
    setTimeout(() => {
      onClose();
    }, 150);
  }, [onClose, disabled, setVisible]);

  const handleSubmit = useCallback(() => {
    if (disabled) {
      return;
    }
    if (onSubmit) {
      onSubmit();
    }
  }, [onSubmit, disabled]);

  useEffect(() => {
    setVisible(!!isOpen);
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <motion.div
        className={twMerge(
          "justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-neutral-800 transition-all",
          visible ? "bg-opacity-70" : "bg-opacity-0"
        )}
      >
        <div className="absolute w-full lg:w-3/6 my-6 mx-auto lg:max-w-3xl h-full overflow-y-auto max-h-screen lg:h-auto">
          {/*content*/}
          <motion.div
            className={twMerge(
              "h-full max-h-screen lg:max-h-[90vh] lg:h-auto border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-black outline-none focus:outline-none "
            )}
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: visible ? 1 : 0,
            }}
            transition={{
              duration: 0.15,
              ease: "linear",
            }}
          >
            {/*header*/}
            <div className="flex items-center justify-between p-10 rounded-t">
              <h3 className="text-[20px] md:text-3xl font-semibold text-white capitalize">
                {title}
              </h3>
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
            <div className="relative  p-2 md:p-10 flex-auto md:max-h-[75vh] h-fit max-h-full overflow-y-auto ">
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
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default Modal;
