"use client";

import React, { useEffect } from "react";
import Card from "../Card/Card";
import Input from "../Input/Input";
import { useForm } from "react-hook-form";
import styles from "./LoginForm.module.scss";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/store/auth/authStore";

type FormValues = {
  email: string;
  password: string;
};

export default function LoginForm({
  isSignUp = false,
}: {
  isSignUp?: boolean;
}) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const { login, isLoading, isAuthenticated, checkTokenValidity } =
    useAuthStore();

  useEffect(() => {
    checkTokenValidity();
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router, checkTokenValidity]);

  const onSubmit = async (data: FormValues) => {
    try {
      await login({ email: data.email, password: data.password });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <Card isActive={true} onClick={() => {}}>
          <div className={styles.formContent}>
            Login
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
              disabled={isLoading}
            >
              {isLoading ? (
                <div className={styles.spinner} aria-label="Loading" />
              ) : isSignUp ? (
                "Create Account"
              ) : (
                "Sign In"
              )}
            </button>


            <p className={styles.switchForm}>
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <a href={isSignUp ? "/login" : "/signup"} className={styles.link}>
                {isSignUp ? "Sign In" : "Create Account"}
              </a>
            </p>
          </div>
        </Card>
      </form>
    </div>
  );
}
