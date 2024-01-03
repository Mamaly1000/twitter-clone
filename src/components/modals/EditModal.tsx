import { useEditModal } from "@/hooks/useEditModal";
import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { objectGenerator } from "@/libs/objectGenerator";
import useCurrentUser from "@/hooks/useCurrentUser";
import { User } from "@prisma/client";
import axios from "axios";
import toast from "react-hot-toast";
import Input from "../inputs/Input";
import useUser from "@/hooks/useUser";
import ImageUpload from "../inputs/ImageUpload";

const editSchema = z.object({
  name: z
    .string({
      required_error: "name cannot be empty",
    })
    .min(1, "minimum character must be 1"),
  username: z
    .string({
      required_error: "username cannot be empty",
    })
    .min(1, "minimum character must be 1"),
  bio: z.string().default("").nullable(),
  profileImage: z.string().default("").nullable(),
  coverImage: z.string().default("").nullable(),
});

const EditModal = () => {
  const { data } = useCurrentUser();
  const { mutate } = useUser(data?.id);
  const [isLoading, setLoading] = useState(false);
  const { isOpen, onClose } = useEditModal();
  const form = useForm({
    resolver: zodResolver(editSchema),
    defaultValues: {
      name: "",
      username: "",
      bio: "",
      profileImage: "",
      coverImage: "",
    },
  });

  useEffect(() => {
    if (data) {
      const user = objectGenerator<
        User,
        "name" | "username" | "bio" | "profileImage" | "coverImage",
        z.infer<typeof editSchema>
      >(data, ["name", "username", "bio", "profileImage", "coverImage"]);
      form.reset({
        bio: user.bio || "",
        coverImage: user.coverImage || "",
        profileImage: user.profileImage || "",
        name: user.name,
        username: user.username,
      });
    }
  }, [data]);

  const onSubmit = form.handleSubmit(
    async (values: z.infer<typeof editSchema>) => {
      try {
        setLoading(true);
        await axios
          .patch("/api/edit", {
            ...values,
            bio: !!values.bio ? values.bio : null,
            coverImage: !!values.coverImage ? values.coverImage : null,
            profileImage: !!values.profileImage ? values.profileImage : null,
          })
          .then((res) => {
            mutate();
            toast.success(res.data.message);
            form.reset();
            onClose();
          });
      } catch (error) {
        console.log(error);
        toast.error("something went wrong!");
      } finally {
        setLoading(false);
      }
    }
  );

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <ImageUpload
        value={form.watch("profileImage")}
        disabled={isLoading}
        onChange={(image) => form.setValue("profileImage", image)}
        label="Upload profile image"
      />
      <ImageUpload
        value={form.watch("coverImage")}
        disabled={isLoading}
        onChange={(image) => form.setValue("coverImage", image)}
        label="Upload cover image"
      />
      <Input
        register={form.register("name")}
        name="name"
        onChange={(e) => form.setValue("name", e.target.value)}
        value={form.watch("name")}
        placeholder="Name"
        disabled={isLoading}
      />
      <Input
        register={form.register("username")}
        name="username"
        onChange={(e) => form.setValue("username", e.target.value)}
        value={form.watch("username")}
        placeholder="Username"
        disabled={isLoading}
      />
      <Input
        register={form.register("bio")}
        name="bio"
        onChange={(e) => form.setValue("bio", e.target.value)}
        value={form.watch("bio")}
        placeholder="Bio"
        disabled={isLoading}
      />
    </div>
  );
  return (
    <Modal
      actionLabel="Update"
      isOpen={isOpen}
      title="Update your profile"
      onClose={onClose}
      onSubmit={onSubmit}
      body={bodyContent}
    />
  );
};

export default EditModal;
