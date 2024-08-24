import { encryptPassword } from "@/lib/crypto";
import { doc, updateDoc, deleteDoc, getDoc } from "firebase/firestore";
import { NextResponse } from "next/server";
import { db } from "../../../../../firebase";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const passwordRef = doc(db, `users/${userId}/passwords`, params.id);
    const docSnap = await getDoc(passwordRef);

    if (!docSnap.exists()) {
      return NextResponse.json(
        { error: "Password not found" },
        { status: 404 }
      );
    }

    const data = docSnap.data();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching password:", error);
    return NextResponse.json(
      { error: "Failed to fetch password" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { service, email, password } = await req.json();
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const passwordRef = doc(db, `users/${userId}/passwords`, params.id);
    const encryptedPassword = encryptPassword(password);

    await updateDoc(passwordRef, {
      service,
      email,
      password: encryptedPassword,
    });

    return NextResponse.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    return NextResponse.json(
      { error: "Failed to update password" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const passwordRef = doc(db, `users/${userId}/passwords`, params.id);

  await deleteDoc(passwordRef);

  return NextResponse.json({ message: "Password deleted successfully" });
}
