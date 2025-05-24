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

export default function Register() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    mode: "onSubmit",
  });

  const onSubmit = async (data: RegisterInput) => {
    console.log(data);
    // API call here
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <Card title="Register" isActive={true} onClick={() => {}}>
          <div className={styles.formContent}>
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
              disabled={isSubmitting}
            >
              {isSubmitting ? (
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
