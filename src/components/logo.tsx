import Link from "next/link";
import React from "react";

export default function Logo({ hrefLink }: { hrefLink: string }) {
  return (
    <Link href={hrefLink} className="text-xl tracking-tighter font-bold">
      SafeKeys
    </Link>
  );
}
