import { useLoginModal } from "@/hooks/useLoginModal";
import React, { useCallback, useState } from "react";
import Modal from "./Modal";
import Input from "../inputs/Input";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegisterModal } from "@/hooks/useRegisterModal";
import axios from "axios";
import { toast } from "react-toastify";
import { signIn } from "next-auth/react";
import CountrySelect from "../inputs/Select";
import { SingleCountryType } from "@/hooks/useCountry";
const registerSchema = z.object({
  email: z.string().email("not valid email").min(1, "minimum character is 1"),
  password: z
    .string({
      required_error: "your password is required",
    })
    .min(6, "minimum character is 6"),
  name: z
    .string({
      required_error: "please enter your name!",
    })
    .min(3, "minimum character is 3"),
  username: z
    .string({
      required_error: "please enter your username!",
    })
    .min(3, "minimum character is 3"),
  location: z.string({
    required_error: "you need to select your location",
  }),
});

const RegisterModal = () => {
  const { isOpen, onClose } = useRegisterModal();
  const loginModal = useLoginModal();
  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      username: "",
      location: "",
    },
  });

  const [location, setLocation] = useState<SingleCountryType>({
    city: "",
    label: "",
    region: "",
    value: "",
  });
  const [isLoading, setLoading] = useState(false);

  const onToggle = useCallback(() => {
    if (isLoading) {
      return;
    }

    onClose();
    loginModal.onOpen();
  }, [loginModal, onClose, isLoading]);

  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    try {
      setLoading(true);
      await axios.post("/api/register", values).then(async (res) => {
        await signIn("credentials", {
          email: values.email,
          password: values.password,
        }).then(() => {
          form.reset();
          toast.success(res.data.message);
        });
        toast.success(res.data.message);
        form.reset();
      });

      onClose();
    } catch (error) {
      console.log(error);
      toast.error("something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const bodyContent = (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
    >
      <Input
        register={form.register("name", {
          required: true,
        })}
        name="name"
        placeholder="Name"
        onChange={(e) => form.setValue("name", e.target.value)}
        value={form.watch("name")}
        disabled={isLoading}
      />
      <Input
        register={form.register("username", {
          required: true,
        })}
        name="username"
        placeholder="Username"
        onChange={(e) => form.setValue("username", e.target.value)}
        value={form.watch("username")}
        disabled={isLoading}
      />
      <Input
        register={form.register("email", {
          required: true,
        })}
        name="email"
        placeholder="Email"
        onChange={(e) => form.setValue("email", e.target.value)}
        value={form.watch("email")}
        disabled={isLoading}
      />
      <CountrySelect
        className="min-w-full max-w-full"
        onChange={(val) => {
          setLocation(val);
          if (val?.value) {
            form.setValue("location", val.value);
          }
        }}
        value={location}
      />
      <Input
        register={form.register("password", { required: true })}
        placeholder="Password"
        type="password"
        name="password"
        onChange={(e) => form.setValue("password", e.target.value)}
        value={form.watch("password")}
        disabled={isLoading}
      />
    </form>
  );

  const footerContent = (
    <div className="text-neutral-400 text-center mt-4">
      <p>
        Already have an account?
        <span
          onClick={onToggle}
          className="
          dark:text-white text-black 
            cursor-pointer 
            hover:underline
          "
        >
          Sign in
        </span>
      </p>
    </div>
  );

  return (
    <Modal
      actionLabel="Register"
      onClose={onClose}
      onSubmit={form.handleSubmit(onSubmit)}
      body={bodyContent}
      disabled={isLoading}
      isOpen={isOpen}
      footer={footerContent}
      title="Create an account"
    />
  );
};

export default RegisterModal;
