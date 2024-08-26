import { HydrateClient } from "@/trpc/server";
import Link from "next/link";
import CreateSafeTransfer from "./_components/create-safe-transfer";

export default async function Home() {
  return (
    <HydrateClient>
      <main className="mx-auto flex min-h-screen flex-col items-center justify-start gap-8 bg-gradient-to-b from-[#fdfbfb] to-[#ebedee] text-slate-800">
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="mt-16 text-4xl font-bold tracking-tight">
            Safe Transfer by{" "}
            <Link
              href="https://www.nhattien.tech/"
              target="_blank"
              className="text-slate-800/60 underline underline-offset-4"
            >
              Tien
            </Link>
          </h1>
          <p className="text-lg text-slate-800/60">
            Share your secrets securely.
          </p>
        </div>

        <div className="w-full max-w-md">
          <CreateSafeTransfer />
        </div>
      </main>
    </HydrateClient>
  );
}
