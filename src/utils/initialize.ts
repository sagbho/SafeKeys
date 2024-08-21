"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";

const InitializeUser: React.FC = () => {
  const { user } = useUser();

  useEffect(() => {
    const addUser = async () => {
      if (user) {
        try {
          const response = await fetch("/api/users", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
          }

          const data = await response.json();
          console.log("User added to DB:", data);
        } catch (error) {
          console.error("Error adding user to DB:", error);
        }
      }
    };

    addUser();
  }, [user]);

  return null;
};

export default InitializeUser;
