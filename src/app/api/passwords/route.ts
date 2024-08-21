// app/api/passwords/route.ts
import { NextResponse } from "next/server";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../../../../firebase";
import { decryptPassword, encryptPassword } from "../../../lib/crypto";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const { service, email, password } = await req.json();
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const encryptedPassword = encryptPassword(password);
    const passwordRef = await addDoc(
      collection(db, `users/${userId}/passwords`),
      {
        service,
        email,
        password: encryptedPassword,
      }
    );

    return NextResponse.json({
      id: passwordRef.id,
      service,
      email,
      password: encryptedPassword,
    });
  } catch (error) {
    console.error("Error adding password:", error);
    return NextResponse.json(
      { error: "Failed to add password" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const querySnapshot = await getDocs(
    collection(db, `users/${userId}/passwords`)
  );
  const passwords = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    password: decryptPassword(doc.data().password),
  }));

  return NextResponse.json(passwords);
}
