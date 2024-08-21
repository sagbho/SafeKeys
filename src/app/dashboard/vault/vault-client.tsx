"use client";

import { useEffect, useState } from "react";
import { Password, columns } from "./columns";
import { DataTable } from "./data-table";
import { AddDialog } from "@/components/add-dialog";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export default function VaultClient() {
  const [passwords, setPasswords] = useState<Password[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchPasswords = async () => {
      const res = await fetch("/api/passwords");
      const data = await res.json();
      setPasswords(data);
    };

    fetchPasswords();
  }, []);

  const handleAdd = (newPassword: Password) => {
    setPasswords((prev) => [...prev, newPassword]);
    console.log(newPassword);
    // router.push("/dashboard/vault");
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/passwords/${id}`, {
      method: "DELETE",
    });
    setPasswords(passwords.filter((password) => password.id !== id));
  };

  return (
    <>
      <DataTable
        columns={columns as ColumnDef<Password, unknown>[]}
        data={passwords}
      />
      <div className="mb-4">
        <AddDialog onAdd={handleAdd} />
      </div>
    </>
  );
}
