"use client";

import React from "react";
import Card from "../Card/Card";
import Input from "../Input/Input";
import { useForm } from "react-hook-form";
import styles from "./LoginForm.module.scss";

type FormValues = {
  email: string;
  password: string;
};

function LoginForm({ isSignUp = false }: { isSignUp?: boolean }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  const onSubmit = (data: FormValues) => {
    console.log(data);
    // API call here
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <Card
          title={"Login"}
          isActive={true}
          onClick={() => {}}
        >
          <div className={styles.formContent}>
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
                <div className={styles.spinner} aria-label="Loading" />
              ) : isSignUp ? (
                "Create Account"
              ) : (
                "Sign In"
              )}
            </button>

            {!isSignUp && (
              <div className={styles.secondaryActions}>
                <a href="/forgot-password" className={styles.link}>
                  Forgot Password?
                </a>
              </div>
            )}

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

export default LoginForm;
