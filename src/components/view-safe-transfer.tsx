"use client";

import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { api } from "@/trpc/react";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import CopyTextButton from "./copy-text-button";

type ViewSafeTransferProps = {
  id: string;
  passwordProtected: boolean;
};

const ViewSafeTransfer = ({ id, passwordProtected }: ViewSafeTransferProps) => {
  const [viewSafeTransfer, setViewSafeTransfer] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");

  const { data, refetch, isLoading, isError, error } =
    api.safeTransfer.viewSafeTransferContent.useQuery(
      { id, password: passwordProtected ? password : "" },
      { enabled: false }, // Disable automatic query execution
    );

  const fetchSafeTransferContent = async () => {
    if (passwordProtected && password.trim() === "") {
      toast.warning("Password is required for password protected link");
      setViewSafeTransfer(false);
      return;
    }

    await refetch();
  };

  useEffect(() => {
    if (viewSafeTransfer) {
      void fetchSafeTransferContent();
    }
  }, [viewSafeTransfer]);

  useEffect(() => {
    if (isError) {
      toast.error(`Failed to load secret${error ? `: ${error.message}` : ""}`);
      setViewSafeTransfer(false);
    }
  }, [isError]);

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4">
      {!viewSafeTransfer && (
        <form
          onSubmit={() => setViewSafeTransfer(true)}
          className="flex flex-col items-center justify-center gap-3 text-center"
        >
          <h1 className="text-lg text-slate-800/80">
            Do you want to view the secret shared with you?
          </h1>
          {/* <p className="text-base text-slate-800/60">
            After viewing the secret, it will be deleted and you will not be
            able to view it again.
          </p> */}
          {passwordProtected && (
            <div className="flex w-full flex-col gap-1 text-center">
              {/* <Label>Password</Label> */}
              <p className="text-xs text-slate-800/60">
                This secret is password protected. You will need to enter the
                password to view it.
              </p>
              <Input
                type="password"
                placeholder="Enter password"
                className="w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          )}
          <Button type="submit">View Secret</Button>
        </form>
      )}

      {isLoading && (
        <div className="flex flex-col items-center justify-center gap-2">
          <LoaderCircle size={24} className="animate-spin" />
          <span>Loading secret...</span>
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
            <CopyTextButton content={data.content} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewSafeTransfer;
