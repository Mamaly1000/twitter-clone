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
import { toast } from "react-toastify";
import Input from "../inputs/Input";
import useUser from "@/hooks/useUser";
import ImageUpload from "../inputs/ImageInput";
import FieldGenerator from "../inputs/FieldGenerator";
import TextArea from "../inputs/TextArea"; 
import useUserFields from "@/hooks/useUserFields";
import useCoverImage from "@/hooks/useCoverImage";
import Image from "next/image";

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
  const { isOpen, onClose } = useEditModal();
  const { data } = useCurrentUser();
  const { mutate: coverimageMutate } = useCoverImage(data?.id);
  const {
    fields,
    isLoading: fieldsLoading,
    mutate: userFieldsMutate,
  } = useUserFields(data?.id);
  const { mutate } = useUser(data?.id);

  const [isLoading, setLoading] = useState(false);

  const [profileFields, setProfileFields] = useState<
    {
      value: string;
      type: "LINK" | "BIRTHDAY" | "JOB";
    }[]
  >([]);

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

  useEffect(() => {
    if (fields && fields.length > 0) {
      setProfileFields(
        fields
          .filter((f) => !(f.type === "LOCATION"))
          .map((f) => ({
            type: f.type as any,
            value: f.value,
          }))
      );
    }
  }, [fields]);

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
            profileFields,
          })
          .then((res) => {
            coverimageMutate();
            userFieldsMutate();
            mutate();
            toast.success(res.data.message);
            form.reset();

            setProfileFields([]);
            onClose();
          });
      } catch (error: any) {
        if (error.response.data) {
          toast.error(error.response.data.message);
        } else {
          toast.error("something went wrong!");
        }
      } finally {
        setLoading(false);
      }
    }
  );

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <ImageUpload
        onChange={(val) => {
          form.setValue("profileImage", val);
        }}
        label="profile image"
        disable={isLoading}
        length={1}
      >
        <Image
          unoptimized
          src={form.watch("profileImage")}
          alt="profile image"
          fill
          className="object-contain "
        />
      </ImageUpload>
      <ImageUpload
        onChange={(val) => {
          form.setValue("coverImage", val);
        }}
        label="cover Image"
        disable={isLoading}
        length={1}
      >
        <Image
          unoptimized
          src={form.watch("coverImage")}
          alt="cover image"
          fill
          className="object-contain "
        />
      </ImageUpload>
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
      <TextArea
        register={form.register("bio")}
        name="bio"
        onChange={(e) => form.setValue("bio", e.target.value)}
        value={form.watch("bio")}
        placeholder="Bio"
        disabled={isLoading}
        className="min-h-[150px]"
      />
      <FieldGenerator
        disabled={isLoading}
        value={profileFields}
        onChange={(fields) => {
          setProfileFields(fields);
        }}
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
      disabled={isLoading || fieldsLoading}
    />
  );
};

export default EditModal;
