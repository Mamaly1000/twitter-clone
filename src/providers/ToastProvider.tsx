import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const ToastProvider = () => {
  return <ToastContainer position="bottom-left" theme="dark" />;
};

export default ToastProvider;
