import EditModal from "@/components/modals/EditModal";
import ImageDescription from "@/components/modals/ImageDescription";
import LoginModal from "@/components/modals/LoginModal";
import RegisterModal from "@/components/modals/RegisterModal";
import StatusContainer from "@/components/status/StatusContainer";
import MobileSideBar from "@/containers/MobileSideBar";
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
      <MobileSideBar />
      <ImageDescription />
      <StatusContainer />
    </>
  );
};

export default ModalsProvider;
