"use client";
import React from "react";
import Card from "../Card/Card";
import Input from "../Input/Input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  registerSchema,
  RegisterInput,
} from "@/app/lib/validation/register/register.schema";
import styles from "./registerForm.module.scss";
import { useAuthStore } from "@/app/store/auth/authStore";
import { userApi } from "@/app/services/api";
import { useToast } from "../../app/context/ToastContext";

export default function Register() {
  const router = useRouter();
  const { showError, showSuccess, showInfo } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    mode: "onSubmit",
  });

  const { isLoading, login } = useAuthStore();

  const onSubmit = async (data: RegisterInput) => {
    try {
      await userApi.registerUser({
        username: data.username,
        email: data.email,
        password: data.password,
      });
      showSuccess("Registration successful! Welcome email will be sent shortly.");
      showInfo("Redirecting to login page...");
      
      // 2 saniye sonra login'e yönlendir
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      showError("Registration failed. Please try again.");
      console.error("Registration failed:", err);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <Card isActive={true} onClick={() => {}}>
          <div className={styles.formContent}>
            Sign up
            <Input
              name="username"
              label="Username"
              type="text"
              placeholder="Username"
              register={register}
              error={errors.username}
            />

            <Input
              name="email"
              label="Email Address"
              type="email"
              placeholder="Email"
              register={register}
              error={errors.email}
            />

            <Input
              name="password"
              label="Password"
              type="password"
              placeholder="Password"
              register={register}
              error={errors.password}
            />

            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting || isLoading ? (
                <span className={styles.loadingSpinner} aria-label="Loading" />
              ) : (
                "Create Account"
              )}
            </button>

            <p className={styles.switchForm}>
              Already have an account?{" "}
              <Link href="/login" className={styles.link}>
                Sign In
              </Link>
            </p>
          </div>
        </Card>
      </form>
    </div>
  );
}
