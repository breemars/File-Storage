"use client";

//Define a new typescript type for the type of form
type FormType = "sign-in" | "sign-up";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { beginSignUp, beginSignIn } from "@/lib/actions/user.actions";
import OTPModal from "./OTPModal";

// Define validation rules for sign-in and sign-up fields.
const authFormSchema = (formType: FormType) => {
  return z.object({
    fullName:
      formType === "sign-up"
        ? z
            .string()
            .min(1, "Required")
            .min(5, "Name must be at least 5 characters")
            .max(50, "Name must be at most 50 characters")
        : z.string().optional(),
    email: z
      .string()
      .min(1, "Required")
      .email("Please enter a valid email address"),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [accountId, setAccountId] = useState(null);

  // Select the validation rules based on the current form type.
  // Initialize the form with validation and empty default values.
  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      fullName: "",
    },
  });

  // Handle form submission for sign-in and sign-up.
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      if (type === "sign-in") {
        const user = await beginSignIn({
          email: data.email,
        });
        if (user == null) setErrorMessage("Account Not Found. Please Sign-Up.");
        else setAccountId(user.accountId);
      } else {
        const user = await beginSignUp({
          email: data.email,
        });
        if (user == null)
          setErrorMessage("Account Already Exists. Please Sign-In.");
        else setAccountId(user.accountId);
      }
    } catch (error) {
      setErrorMessage("Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="w-full md:max-w-md ">
        <h1 className="pb-8">{type === "sign-in" ? "Sign In" : "Sign Up"}</h1>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            {/* Show the full-name field only during sign-up. */}
            {type === "sign-up" && (
              <Controller
                name="fullName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Full Name</FieldLabel>
                    <Input
                      {...field}
                      id="form-fullName"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter your full name"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            )}
            {/* Email address field */}
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Email</FieldLabel>
                  <Input
                    {...field}
                    id="form-email"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter your email"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          {/* Disable submission while the authentication request is processing. */}
          <Button
            type="submit"
            className="w-full my-5 p-5"
            disabled={isLoading}
          >
            {isLoading ? "LOADING..." : "SUBMIT"}
          </Button>
        </form>

        {/* Provide a link to switch between sign-in and sign-up. */}
        <div className="body-2 flex justify-center">
          <p className="text-light-100">
            {type === "sign-in"
              ? "Don't have an account?"
              : "Already have an account?"}
          </p>
          <Link
            href={type === "sign-in" ? "/sign-up" : "/sign-in"}
            className="ml-1 font-medium text-primary"
          >
            {type === "sign-in" ? "Sign Up" : "Sign In"}
          </Link>
        </div>

        {/* Display an error message when authentication is unsuccessful. */}
        {errorMessage && (
          <p className="text-red-600 flex justify-center pt-8">
            {errorMessage}
          </p>
        )}
      </div>

      {/* OTP Verification */}
      {/* Open the OTP verification modal once an account ID is available. */}
      {accountId && (
        <OTPModal
          email={form.getValues("email")}
          fullName={form.getValues("fullName") || ""}
          accountId={accountId}
        />
      )}
    </>
  );
};

export default AuthForm;
