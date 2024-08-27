"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useState } from "react";
import { toast } from "sonner";
import { api } from "@/trpc/react";
import { Input } from "@/components/ui/input";
import { env } from "@/env";
import { Copy } from "lucide-react";

const CreateSafeTransfer = () => {
  const createSafeTransferMutate =
    api.safeTransfer.createSafeTransferLink.useMutation();

  const [content, setContent] = useState("");
  const [expiration, setExpiration] = useState("1d");
  const [linkId, setLinkId] = useState("");
  const [step, setStep] = useState(1);

  const calculateExpirationDate = (expiration: string) => {
    const now = Date.now();
    switch (expiration) {
      case "1d":
        return new Date(now + 1000 * 60 * 60 * 24);
      case "1w":
        return new Date(now + 1000 * 60 * 60 * 24 * 7);
      case "1m":
        return new Date(now + 1000 * 60 * 60 * 24 * 30);
      default:
        return new Date(now + 1000 * 60 * 60 * 24);
    }
  };

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    toast.promise(
      createSafeTransferMutate.mutateAsync({
        content,
        expiresAt: calculateExpirationDate(expiration),
      }),
      {
        loading: "Creating safe transfer link...",
        success: (data) => {
          setLinkId(data.id);
          setStep(2);
          return "Safe transfer link created successfully";
        },
        error: "Failed to create safe transfer link",
      },
    );
  };

  return (
    <>
      {step === 1 && (
        <form
          onSubmit={handleOnSubmit}
          className="flex flex-col items-start justify-center gap-2"
        >
          <div className="w-full">
            <Label>Your Secret</Label>
            <Textarea
              placeholder="Enter your secret"
              className="w-full"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              required
            />
          </div>
          <div className="w-full">
            <Label>Expiration Time</Label>
            <Select
              defaultValue={expiration}
              onValueChange={(value) => setExpiration(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select expiration time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">1 hour</SelectItem>
                <SelectItem value="1d">1 day</SelectItem>
                <SelectItem value="1w">1 week</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit">Generate Link</Button>
        </form>
      )}
      {step === 2 && (
        <div className="flex flex-col items-start justify-center gap-2">
          <Label>Share Safe Transfer Link</Label>
          <div className="flex w-full gap-2">
            <Input
              value={`${env.NEXT_PUBLIC_SITE_URL}/${linkId}`}
              onChange={(e) => setLinkId(e.target.value)}
              placeholder="Enter safe transfer link"
              readOnly
            />
            {/* copy button */}
            <Button
              onClick={async () => {
                await navigator.clipboard.writeText(
                  `${env.NEXT_PUBLIC_SITE_URL}/${linkId}`,
                );
                toast.success("Link copied!");
              }}
            >
              <Copy size={14} />
            </Button>
          </div>
          <p
            className="cursor-pointer text-xs text-slate-800/60 hover:underline hover:underline-offset-4"
            onClick={() => {
              setStep(1);
              setContent("");
              setExpiration("1d");
              setLinkId("");
            }}
          >
            Create another
          </p>
        </div>
      )}
    </>
  );
};

export default CreateSafeTransfer;
