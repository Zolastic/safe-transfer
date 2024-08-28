import { HydrateClient } from "@/trpc/server";
import CreateSafeTransfer from "../components/create-safe-transfer";
import { Lock } from "lucide-react";
import { headers } from "next/headers";

export default async function Home() {
  const headersList = headers();

  const wesbiteDomain = headersList.get("host");

  return (
    <HydrateClient>
      <main className="mx-auto flex min-h-screen flex-col items-center justify-start gap-8">
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="mt-16 flex items-center justify-center gap-2 text-4xl font-bold tracking-tight">
            <span>Safe Transfer</span> <Lock size={36} />
          </h1>
          <p className="text-lg text-slate-800/60">
            Share your secrets securely.
          </p>
        </div>

        <div className="w-full max-w-md">
          <CreateSafeTransfer wesbiteDomain={wesbiteDomain} />
        </div>
      </main>
    </HydrateClient>
  );
}
