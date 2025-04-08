"use client";
import { useLoginModal } from "@/hooks/useLoginModal";
import React, { useCallback } from "react";
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
  const isLoading = form.formState.isSubmitting;

  const email = form.watch("email");
  const password = form.watch("password");

  const isAllowSubmit = email.trim().length > 0 && password.trim().length >= 6;

  const onToggle = useCallback(() => {
    onClose();
    registerModal.onOpen();
  }, [onClose, registerModal]);

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: true,
      callbackUrl: "/",
    }).then((val) => {
      if (val) {
        form.reset();
        toast.success("wellcome back!");
      } else {
        toast.error("Sth went wrong!");
      }
    });
  };

  const bodyContent = (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-4 h-full"
    >
      <Input
        register={form.register("email", {
          required: true,
        })}
        autofocus
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
      <button className="hidden" disabled={isAllowSubmit} type="submit" />
    </form>
  );

  const footerContent = (
    <div className="text-neutral-400 text-center mt-4">
      <p>
        First time using Twitter?
        <span
          onClick={onToggle}
          className="
            dark:text-white text-black
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
      AllowSubmit={!isAllowSubmit}
      onSubmit={form.handleSubmit(onSubmit)}
      body={bodyContent}
      disabled={isLoading}
      footer={footerContent}
      isOpen={isOpen}
      title="Sign in"
    />
  );
};

export default LoginModal;
