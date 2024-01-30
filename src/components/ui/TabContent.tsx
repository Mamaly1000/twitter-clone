import React, { ReactNode } from "react";

const TabContent = ({
  children,
  display,
}: {
  display?: boolean;
  children: ReactNode;
}) => {
  return (
    !!display && (
      <section className="min-w-full  animate-slideIn">{children}</section>
    )
  );
};

export default TabContent;
