"use client";

import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { api } from "@/trpc/react";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import { Copy, LoaderCircle } from "lucide-react";
import { Label } from "./ui/label";

type ViewSafeTransferProps = {
  id: string;
};

const ViewSafeTransfer = ({ id }: ViewSafeTransferProps) => {
  const { data, refetch, isLoading } =
    api.safeTransfer.viewSafeTransferLink.useQuery(
      { id },
      { enabled: false }, // Disable automatic query execution
    );

  const [viewSafeTransfer, setViewSafeTransfer] = useState<boolean>(false);

  const fetchSafeTransferContent = async () => {
    await refetch();
  };

  useEffect(() => {
    if (viewSafeTransfer) {
      void fetchSafeTransferContent();
    }
  }, [viewSafeTransfer]);

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4">
      {!viewSafeTransfer && (
        <div className="flex flex-col items-center justify-center gap-3 text-center">
          <h1 className="text-lg text-slate-800/80">
            Do you want to view the secret shared with you?
          </h1>
          <p className="text-base text-slate-800/60">
            After viewing the secret, it will be deleted and you will not be
            able to view it again.
          </p>
          <Button onClick={() => setViewSafeTransfer(true)}>View Secret</Button>
        </div>
      )}

      {isLoading && (
        <div className="flex flex-col items-center justify-center gap-2">
          <LoaderCircle size={24} className="animate-spin" />
          <span>Getting secret...</span>
        </div>
      )}

      {viewSafeTransfer && data && (
        <div className="flex w-full flex-col items-start justify-center gap-2">
          <Label>Secret Content</Label>
          <div className="flex w-full items-end gap-2">
            <Textarea
              value={data.content}
              className="w-full"
              readOnly
              rows={5}
            />
            <Button
              onClick={async () => {
                await navigator.clipboard.writeText(`${data.content}`);
                toast.success("Link copied!");
              }}
            >
              <Copy size={14} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewSafeTransfer;
