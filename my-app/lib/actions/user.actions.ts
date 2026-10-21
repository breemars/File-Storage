"use server"; // Run these actions on the server to keep secret keys private.
import { appwriteConfig } from "../appwrite/config";
import { createAdminClient, createSessionClient } from "../appwrite";
import { Query, ID } from "node-appwrite";
import { parseStringify } from "../utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

//Find a user based on email address
const getUserByEmail = async (email: string) => {
  const { tables } = await createAdminClient();
  const result = await tables.listRows({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.usersId,
    queries: [Query.equal("email", [email])],
  });

  return result.total > 0 ? result.rows[0] : null;
};

const handleError = (error: unknown, message: string) => {
  console.log(error, message);
  throw error;
};

////////////////////////////////////////

// Send an email verification code using Appwrite.
export const sendEmailOTP = async ({ email }: { email: string }) => {
  const { account } = await createAdminClient();

  //APPWRITE SENDS AN EMAIL WITH AN OTP CODE TO EMAIL ADDRESS
  //creates a 'user account' in appwrite's internal accounts table
  //if an email address is already in the table, userID will be IGNORED

  // Generate an OTP and associate it with the email address.
  try {
    const user = await account.createEmailToken({
      userId: ID.unique(),
      email: email,
    });
    return user.userId;
  } catch (error) {
    handleError(error, "Failed to send email OTP");
  }
};

///////////////////////////////////////////////////

//RUNS WHEN THE USER SUBMITS THE SIGN UP FORM
export const beginSignUp = async ({ email }: { email: string }) => {
  // Start sign-up by checking whether the email is already registered.
  try {
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return null; // Stop sign-up if a user with this email already exists.
    }

    //creates a new account ID but does not create the account yet
    //send OTP to user's email
    const accountId = await sendEmailOTP({ email });
    return parseStringify({ accountId });
  } catch (error) {
    console.log("Failed to sign-up");
  }
};

//RUNS WHEN THE USER SUBMITS THE SIGN IN FORM
export const beginSignIn = async ({ email }: { email: string }) => {
  // Start sign-in by checking whether the email belongs to an existing user.
  try {
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      // Send a verification code only if the user exists.
      const accountId = await sendEmailOTP({ email });
      return parseStringify({ accountId });
    } else {
      return null; // Stop sign-in if no matching user is found.
    }
  } catch (error) {
    console.log("Failed to sign-in");
  }
};

////////////////////////////////////////////////////////

//RUNS WHEN THE USER SUBMITS THE OTP CODE
// Verify the OTP and establish the user's session.
export const verifySecret = async ({
  accountId,
  password,
  email,
  fullName,
}: {
  accountId: string;
  password: string;
  email: string;
  fullName: string;
}) => {
  try {
    const { account } = await createAdminClient();

    // Exchange the account ID and OTP for an authenticated session.
    const session = await account.createSession({
      userId: accountId,
      secret: password,
    });

    // Check whether the user already has a database record.
    const existingUser = await getUserByEmail(email);

    //OTP verified, create the account if needed
    if (!existingUser) {
      // Create a database record for new users after verification.
      const { tables } = await createAdminClient();
      await tables.createRow({
        databaseId: appwriteConfig.databaseId,
        tableId: appwriteConfig.usersId,
        rowId: accountId,
        data: {
          fullName,
          email,
        },
      });
    }

    // Store the session secret in a secure, HTTP-only cookie.
    // Selected options necessary for security
    (await cookies()).set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify({ sessionId: session.$id });
  } catch (error) {
    handleError(error, "Failed to verify OTP");
  }
};

///////////////////////////////////////////

// Retrieve the current user's account and database profile to display it
export const getCurrentUser = async () => {
  try {
    const { tables, account } = await createSessionClient();

    const result = await account.get();

    const user = await tables.getRow({
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.usersId,
      rowId: String(result.$id),
    });

    return user;
  } catch (error) {
    console.log("No user found, redirecting to sign-in.");
  }
};

///////////////////////////////

// End the current session and redirect the user to sign-in.
export const signOutUser = async () => {
  const { account } = await createSessionClient();
  try {
    account.deleteSession({ sessionId: "current" }); // Invalidate the current Appwrite session.
    (await cookies()).delete("appwrite-session"); // Remove the session cookie from the browser.
    redirect("/sign-in");
  } catch (error) {
    handleError(error, "Failed to sign out user");
  }
};
