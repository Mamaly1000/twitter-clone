import React from "react";
import { BsLink45Deg } from "react-icons/bs";
import { FaBirthdayCake } from "react-icons/fa";
import { GrLocation } from "react-icons/gr";
import { MdWorkHistory } from "react-icons/md";

const FieldIcon = ({
  type,
  size,
}: {
  size?: number;
  type: "LINK" | "LOCATION" | "BIRTHDAY" | "JOB";
}) => {
  return (
    <>
      {type === "BIRTHDAY" && <FaBirthdayCake size={size} />}
      {type === "LOCATION" && <GrLocation size={size} />}
      {type === "JOB" && <MdWorkHistory size={size} />}
      {type === "LINK" && <BsLink45Deg size={size} />}
    </>
  );
};

export default FieldIcon;
