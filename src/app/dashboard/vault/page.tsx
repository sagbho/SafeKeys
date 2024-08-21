import { Toaster } from "sonner";
import VaultClient from "./vault-client";

export default function VaultPage() {
  return (
    <div className="container mx-auto py-10">
      <VaultClient />
      <Toaster />
    </div>
  );
}
