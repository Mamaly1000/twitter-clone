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
import ImageUpload from "../inputs/ImageUpload";
import FieldGenerator from "../inputs/FieldGenerator";
import TextArea from "../inputs/TextArea";
import useUserLocation from "@/hooks/useUserLocation";
import CountrySelect from "../inputs/Select";
import useCountry, { SingleCountryType } from "@/hooks/useCountry";
import useUserFields from "@/hooks/useUserFields";
import useCoverImage from "@/hooks/useCoverImage";

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
  location: z.string(),
});

const EditModal = () => {
  const { isOpen, onClose } = useEditModal();
  const { getByValue } = useCountry();
  const { data } = useCurrentUser();
  const { location: userLocation, isLoading: locationLoading } =
    useUserLocation(data?.id);
  const { mutate: coverimageMutate } = useCoverImage(data?.id);
  const { fields, isLoading: fieldsLoading } = useUserFields(data?.id);
  const { mutate } = useUser(data?.id);

  const [isLoading, setLoading] = useState(false);
  const [location, setLocation] = useState<SingleCountryType>({
    city: "",
    label: "",
    region: "",
    value: "",
  });
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
      location: "",
    },
  });

  useEffect(() => {
    if (data) {
      const user = objectGenerator<
        User,
        | "name"
        | "username"
        | "bio"
        | "profileImage"
        | "coverImage"
        | "location",
        z.infer<typeof editSchema>
      >(data, [
        "name",
        "username",
        "bio",
        "profileImage",
        "coverImage",
        "location",
      ]);
      form.reset({
        bio: user.bio || "",
        coverImage: user.coverImage || "",
        profileImage: user.profileImage || "",
        name: user.name,
        username: user.username,
        location: userLocation?.toLowerCase() || "",
      });
    }
  }, [data, userLocation]);

  useEffect(() => {
    if (userLocation) {
      setLocation(getByValue(userLocation)!);
    }
  }, [userLocation]);

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
            mutate();
            toast.success(res.data.message);
            form.reset();
            coverimageMutate();
            setLocation({
              city: "",
              label: "",
              region: "",
              value: "",
            });
            setProfileFields([]);
            onClose();
          });
      } catch (error: any) {
        if (error.message) {
          toast.error(error.message);
        } else if (error.response.data) {
          toast.error(error.response.data);
        } else {
          toast.error("something went wrong!");
        }
        console.log(error);
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
        onChange={(image) => {
          form.setValue("profileImage", image);
        }}
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
      <TextArea
        register={form.register("bio")}
        name="bio"
        onChange={(e) => form.setValue("bio", e.target.value)}
        value={form.watch("bio")}
        placeholder="Bio"
        disabled={isLoading}
      />
      <CountrySelect
        onChange={(val) => {
          setLocation(val);
          if (val?.value) {
            form.setValue("location", val.value);
          }
        }}
        className="min-w-full max-w-full"
        value={location}
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
      disabled={isLoading || locationLoading || fieldsLoading}
    />
  );
};

export default EditModal;
