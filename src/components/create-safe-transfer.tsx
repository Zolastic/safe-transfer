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
import { Switch } from "./ui/switch";
import CopyTextButton from "./copy-text-button";

interface CreateSafeTransferProps {
  wesbiteDomain: string | null;
}

interface CreateSafeTransfer {
  content: string;
  expiration: string;
  passwordProtected: boolean;
  password: string;
  oneTimeView: boolean;
}

const CreateSafeTransfer = ({ wesbiteDomain }: CreateSafeTransferProps) => {
  const createSafeTransferMutate =
    api.safeTransfer.createSafeTransferLink.useMutation();

  const [formData, setFormData] = useState<CreateSafeTransfer>({
    content: "",
    expiration: "1d",
    passwordProtected: false,
    password: "",
    oneTimeView: false,
  });

  const [linkId, setLinkId] = useState<string>("");
  const [step, setStep] = useState<number>(1);

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

    if (
      formData.passwordProtected &&
      !formData.password &&
      formData.password.trim() === ""
    ) {
      toast.warning("Password is required for password protected link");
      return;
    }

    toast.promise(
      createSafeTransferMutate.mutateAsync({
        content: formData.content,
        expiresAt: calculateExpirationDate(formData.expiration),
        passwordProtected: formData.passwordProtected,
        password: formData.password,
        oneTimeView: formData.oneTimeView,
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

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <>
      {step === 1 && (
        <form
          onSubmit={handleOnSubmit}
          className="flex flex-col items-start justify-center gap-3"
        >
          <div className="flex w-full flex-col gap-1">
            <Label>Your Secret</Label>
            <Textarea
              placeholder="Enter your secret"
              className="w-full"
              value={formData.content}
              onChange={(e) => handleChange("content", e.target.value)}
              rows={5}
              required
            />
          </div>
          <div className="flex w-full flex-col gap-1">
            <Label>Expiration Time</Label>
            <Select
              defaultValue={formData.expiration}
              onValueChange={(value) => handleChange("expiration", value)}
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
          <div className="flex w-full flex-col gap-1">
            <div className="flex items-center justify-between gap-2">
              <Label>Password</Label>
              <Switch
                checked={formData.passwordProtected}
                onCheckedChange={(checked) =>
                  handleChange("passwordProtected", checked)
                }
              />
            </div>
            {formData.passwordProtected && (
              <Input
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                placeholder="Enter password"
                type="password"
                required
              />
            )}
          </div>
          <div className="flex w-full flex-col gap-1">
            <div className="flex items-center justify-between gap-2">
              <Label>On time view</Label>
              <Switch
                checked={formData.oneTimeView}
                onCheckedChange={(checked) =>
                  handleChange("oneTimeView", checked)
                }
              />
            </div>
            <p className="text-xs text-slate-800/60">
              The link will be destroyed after the first view.
            </p>
          </div>
          <Button type="submit">Generate Link</Button>
        </form>
      )}
      {step === 2 && (
        <div className="flex flex-col items-start justify-center gap-2">
          <Label>Share Safe Transfer Link</Label>
          <div className="flex w-full gap-2">
            <Input
              value={`${wesbiteDomain}/${linkId}`}
              onChange={(e) => setLinkId(e.target.value)}
              placeholder="Enter safe transfer link"
              readOnly
            />
            <CopyTextButton content={`${wesbiteDomain}/${linkId}`} />
          </div>
          <p
            className="cursor-pointer text-xs text-slate-800/60 hover:underline hover:underline-offset-4"
            onClick={() => {
              setStep(1);
              setFormData({
                content: "",
                expiration: "1d",
                passwordProtected: false,
                password: "",
                oneTimeView: false,
              });
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
