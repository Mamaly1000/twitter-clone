import React from "react";
import { Toaster } from "react-hot-toast";

const ToastProvider = () => {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        className: "bg-slate-900 text-white",
      }}
    />
  );
};

export default ToastProvider;
