import { useLoginModal } from "@/hooks/useLoginModal";
import React, { useCallback, useState } from "react";
import Modal from "./Modal";
import Input from "../inputs/Input";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegisterModal } from "@/hooks/useRegisterModal";
import { toast } from "react-toastify";
import { signIn } from "next-auth/react";
const loginSchema = z.object({
  email: z.string().email("not valid email").min(1, "minimum character is 1"),
  password: z
    .string({
      required_error: "your password is required",
    })
    .min(6, "minimum character is 6"),
});

const LoginModal = () => {
  const { isOpen, onClose } = useLoginModal();
  const registerModal = useRegisterModal();
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [isLoading, setLoading] = useState(false);

  const onToggle = useCallback(() => {
    onClose();
    registerModal.onOpen();
  }, [onClose, registerModal]);

  const onSubmit = form.handleSubmit(
    async (values: z.infer<typeof loginSchema>) => {
      try {
        setLoading(true);
        console.log(values);

        await signIn("credentials", {
          email: values.email,
          password: values.password,
        }).then(() => {
          form.reset();
          toast.success("wellcome back!");
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
      <Input
        register={form.register("password", { required: true })}
        placeholder="Password"
        type="password"
        name="password"
        onChange={(e) => form.setValue("password", e.target.value)}
        value={form.watch("password")}
        disabled={isLoading}
      />
    </div>
  );

  const footerContent = (
    <div className="text-neutral-400 text-center mt-4">
      <p>
        First time using Twitter?
        <span
          onClick={onToggle}
          className="
            text-white 
            cursor-pointer 
            hover:underline
          "
        >
          {" "}
          Create an account
        </span>
      </p>
    </div>
  );

  return (
    <Modal
      actionLabel="Login"
      onClose={onClose}
      onSubmit={onSubmit}
      body={bodyContent}
      disabled={isLoading}
      footer={footerContent}
      isOpen={isOpen}
      title="Sign in"
    />
  );
};

export default LoginModal;
