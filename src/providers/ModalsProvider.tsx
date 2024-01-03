import EditModal from "@/components/modals/EditModal";
import LoginModal from "@/components/modals/LoginModal";
import RegisterModal from "@/components/modals/RegisterModal";
import React, { useEffect, useState } from "react";

const ModalsProvider = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return null;
  }
  return (
    <>
      <LoginModal />
      <RegisterModal />
      <EditModal />
    </>
  );
};

export default ModalsProvider;
