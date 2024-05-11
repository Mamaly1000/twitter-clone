import { useTheme } from "next-themes";
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const ToastProvider = () => {
  const { resolvedTheme } = useTheme();
  return <ToastContainer position="bottom-left" theme={resolvedTheme} />;
};

export default ToastProvider;
