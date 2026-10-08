//Creates a pop-up box using shadcn's alert-dialog

"use client"; //since forms and hooks and whatever

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
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
  const [isOpen, setIsOpen] = useState(true);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); //prevent form from reloading
    setIsLoading(true);

    try {
      //Call API to verify the OTP
      const sessionId = await verifySecret({
        accountId,
        password,
        email,
        fullName,
      });
      if (sessionId) router.push("/"); //go to homepage
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const handleResendOTP = async () => {
    //call OPT
    await sendEmailOTP({ email });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex flex-row justify-between w-full">
            Enter your OTP
            <X color="#b0b0b0" onClick={() => setIsOpen(false)} />
          </AlertDialogTitle>
          <AlertDialogDescription className="flex flex-col items-center w-full space-y-5">
            <span>We&apos;ve sent a code to {email}</span>
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
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button
            type="button"
            variant="link"
            onClick={handleResendOTP}
            className="sm:mr-50"
          >
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
