"use client"; // Enable client-side interactivity for hooks and event handlers.

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { REGEXP_ONLY_DIGITS } from "input-otp";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useState } from "react";
import { X } from "lucide-react";
import { sendEmailOTP, verifySecret } from "@/lib/actions/user.actions";
import { useRouter } from "next/navigation";

export function OTPModal({
  accountId,
  email,
  fullName,
}: {
  accountId: string;
  email: string;
  fullName: string;
}) {
  const router = useRouter();
  // Track the modal visibility, entered OTP, and loading state.
  const [isOpen, setIsOpen] = useState(true);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Verify the OTP and redirect to the homepage if successful.
  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); //prevent form from reloading
    setIsLoading(true);

    try {
      // Check the entered code and create a user session if valid.
      const sessionId = await verifySecret({
        accountId,
        password,
        email,
        fullName,
      });
      if (sessionId) router.push("/"); //go to homepage
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Send a new verification code to the user's email.
  const handleResendOTP = async () => {
    await sendEmailOTP({ email });
  };

  // Display a modal for verifying the user's email with a one-time password.
  //Creates a pop-up box using shadcn's alert-dialog
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex flex-row justify-between w-full">
            Enter your OTP
            <X color="#b0b0b0" onClick={() => setIsOpen(false)} />
          </AlertDialogTitle>
          <div className="flex flex-col items-center text-center w-full space-y-5">
            <span className="text-gray-500">
              We&apos;ve sent a code to {email}
            </span>
            {/* Inputs for the six-digit verification code. */}
            <InputOTP
              maxLength={6}
              value={password}
              onChange={setPassword}
              pattern={REGEXP_ONLY_DIGITS}
            >
              <InputOTPGroup>
                <InputOTPSlot
                  index={0}
                  className="text-4xl h-20 sm:w-15 w-10"
                />
                <InputOTPSlot
                  index={1}
                  className="text-4xl h-20 sm:w-15 w-10"
                />
                <InputOTPSlot
                  index={2}
                  className="text-4xl h-20 sm:w-15 w-10"
                />
                <InputOTPSlot
                  index={3}
                  className="text-4xl h-20 sm:w-15 w-10"
                />
                <InputOTPSlot
                  index={4}
                  className="text-4xl h-20 sm:w-15 w-10"
                />
                <InputOTPSlot
                  index={5}
                  className="text-4xl h-20 sm:w-15 w-10"
                />
              </InputOTPGroup>
            </InputOTP>
          </div>
          {/* Buttons to resend the code or submit it for verification. */}
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:flex sm:justify-between">
          <Button type="button" variant="link" onClick={handleResendOTP}>
            Resend Code
          </Button>

          <AlertDialogAction onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "LOADING..." : "Submit"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default OTPModal;
