import axios from "axios";
import { useState } from "react";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import { twMerge } from "tailwind-merge";
import useNotif from "./useNotif";

const DeleteNotifButton = ({
  notifId,
  className,
  size = 15,
  onDeleteEnd,
}: {
  onDeleteEnd?: () => void;
  size?: number;
  className?: string;
  notifId: string;
}) => {
  const [isLoading, setLoading] = useState(false);
  const { mutate } = useNotif();
  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/notifications/delete/${notifId}`).then((res) => {
        onDeleteEnd!();
        mutate();
        toast.success(res.data.message);
      });
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onDelete();
      }}
      disabled={isLoading}
      className={twMerge(
        "disabled:animate-pulse disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
    >
      <MdDelete size={size} />
    </button>
  );
};

export default DeleteNotifButton;
