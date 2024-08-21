import { auth, currentUser } from "@clerk/nextjs/server";

export async function getUserId() {
  const { userId } = auth();
  if (!userId) {
    throw new Error("User is not signed in.");
  }
  return userId;
}

export async function getCurrentUser() {
  const user = await currentUser();
  if (!user) {
    throw new Error("Failed to retrieve user info.");
  }
  return user;
}
