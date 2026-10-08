"use client";

//Defining a new typescript type
type FormType = "sign-in" | "sign-up";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { beginSignUp, beginSignIn } from "@/lib/actions/user.actions";
import OTPModal from "./OTPModal";

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

  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      fullName: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setErrorMessage("");
    //also for loggin in???
    console.log("submitted");

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

          <Button
            type="submit"
            className="w-full my-5 p-5"
            disabled={isLoading}
          >
            {isLoading ? "LOADING..." : "SUBMIT"}
          </Button>
        </form>

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

        {errorMessage && (
          <p className="text-red-600 flex justify-center pt-8">
            {errorMessage}
          </p>
        )}
      </div>

      {/* OTP Verification */}
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
