"use server"; //should always be run on the server in order to keep the secret key hidden
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

//why sometimes he write props like this and sometimes like the above?
export const sendEmailOTP = async ({ email }: { email: string }) => {
  const { account } = await createAdminClient();

  //APPWRITE SENDS AN EMAIL WITH AN OTP CODE TO THE SPECIFIEIED EMAIL ADDRESS
  //creates a 'user account' in appwrite's internal accounts table
  //if an email address is already in the table, userID will be IGNORED
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
//RUNS WHEN THE USER SUBMITS THE SIGNIN/UP FORM
//destructuring the props
//user enters full name and email
//RETURNS THE ACCOUNT ID
export const beginSignUp = async ({ email }: { email: string }) => {
  //check if user already exists using email, returns if found
  try {
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return null; //account already exists
    }

    //creates a new account ID but does not create the account yet
    //send OTP to user's email
    const accountId = await sendEmailOTP({ email });
    return parseStringify({ accountId });
  } catch (error) {
    console.log("Failed to sign-up");
  }
};

export const beginSignIn = async ({ email }: { email: string }) => {
  //check if user already exists using email, returns if found

  try {
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      const accountId = await sendEmailOTP({ email });
      return parseStringify({ accountId });
    } else {
      return null; //user does not exist
    }
  } catch (error) {
    console.log("Failed to sign-in");
  }
};

////////////////////////////////////////////////////////
//RUNS WHEN THE USER SUBMITS THE OTP CODE
//verify session
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
    const session = await account.createSession({
      userId: accountId,
      secret: password,
    });

    //OTP verified, create the account if needed
    const existingUser = await getUserByEmail(email);
    if (!existingUser) {
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

    //save the session in as a cookie
    //options necessary for security
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
//Grabs the user's information to display on the home screen or settings maybe
export const getCurrentUser = async () => {
  const { tables, account } = await createSessionClient();

  const result = await account.get();

  const user = await tables.getRow({
    databaseId: appwriteConfig.databaseId,
    tableId: appwriteConfig.usersId,
    rowId: String(result.$id),
  });

  return user;
};

///////////////////////////////
export const signOutUser = async () => {
  const { account } = await createSessionClient();
  try {
    account.deleteSession({ sessionId: "current" });
    (await cookies()).delete("appwrite-session");
    redirect("/sign-in");
  } catch (error) {
    handleError(error, "Failed to sign out user");
  }
};
