import ViewSafeTransfer from "@/components/view-safe-transfer";
import { api, HydrateClient } from "@/trpc/server";
import { Frown, Lock } from "lucide-react";
import React from "react";

type LinkPageProps = {
  params: {
    link: string;
  };
};

const LinkPage = async ({ params }: LinkPageProps) => {
  const { link } = params;

  const { exists, oneTimeView, isViewed, isPastExpiry, passwordProtected } =
    await api.safeTransfer.doesSafeTransferLinkExists({ id: link });

  const isLinkInvalid = !exists || (oneTimeView && isViewed) || isPastExpiry;

  const renderContent = (): React.JSX.Element => {
    if (isLinkInvalid) {
      return renderErrorMessage("This link does not exist or has expired.");
    }

    return (
      <div className="w-full max-w-md">
        <ViewSafeTransfer
          id={link}
          passwordProtected={passwordProtected}
          oneTimeView={oneTimeView}
        />
      </div>
    );
  };

  const renderErrorMessage = (message: string) => (
    <div className="flex flex-col items-center justify-center gap-1 text-lg text-slate-800/60">
      <h1 className="flex items-center justify-center gap-1">
        Uh oh! <Frown size={18} />
      </h1>
      <p>{message}</p>
    </div>
  );

  return (
    <HydrateClient>
      <main className="mx-auto flex min-h-screen flex-col items-center justify-start gap-8">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <h1 className="mt-16 flex items-center justify-center gap-2 text-4xl font-bold tracking-tight">
            <span>Safe Transfer</span> <Lock size={36} />
          </h1>
          <p className="text-lg text-slate-800/60">
            Access the secret shared with you securely.
          </p>
        </div>
        {renderContent()}
      </main>
    </HydrateClient>
  );
};

export default LinkPage;
