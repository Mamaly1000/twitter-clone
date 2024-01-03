import React from "react";
import { ClipLoader } from "react-spinners";

const Loader = ({
  message,
  size = 80,
}: {
  size?: number;
  message?: string;
}) => {
  return (
    <div className="flex justify-center items-center flex-col gap-3 min-h-[400px] ">
      <ClipLoader color="lightblue" size={size} />
      {message && (
        <p className="capitalize font-semibold text-center text-white">
          {message}
        </p>
      )}
    </div>
  );
};

export default Loader;
