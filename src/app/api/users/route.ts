import { NextRequest, NextResponse } from "next/server";
import { getUserId, getCurrentUser } from "../../../utils/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../../../firebase";
import { UserData } from "../../../types";

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserId();
    console.log("User ID:", userId);
    const userDocRef = doc(db, "users", userId);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      const user = await getCurrentUser();
      console.log("Current User:", user);
      const userData: UserData = {
        name: `${user.firstName} ${user.lastName}`,
        email: user.emailAddresses[0].emailAddress,
      };
      await setDoc(userDocRef, userData);
      console.log("User added to the database");
    } else {
      console.log("User already exists in the database");
    }

    return NextResponse.json({
      message: "User checked and added if necessary.",
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
