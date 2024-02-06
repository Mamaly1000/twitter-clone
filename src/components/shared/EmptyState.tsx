import React from "react";
import Button from "../inputs/Button";
import { useRouter } from "next/router";
import { GrPowerReset } from "react-icons/gr";

const EmptyState = ({ resetUrl }: { resetUrl?: string }) => {
  const router = useRouter();
  return (
    <div className="min-w-full flex items-center justify-center mt-3">
      {resetUrl && (
        <Button
          secondary
          outline
          className="capitalize flex items-center justify-center gap-2"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/${resetUrl}`);
          }}
        >
          <GrPowerReset size={20} />
          reset filter
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
