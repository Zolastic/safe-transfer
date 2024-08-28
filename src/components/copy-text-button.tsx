"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";

type CopyTextButtonProps = {
  content: string;
  iconSize?: number;
};

const CopyTextButton = ({ content, iconSize = 14 }: CopyTextButtonProps) => {
  const [copy, setCopy] = useState(false);

  return (
    <Button
      onClick={async () => {
        await navigator.clipboard.writeText(`${content}`);
        setCopy(true);
        toast.success("Link copied!");
        setTimeout(() => {
          setCopy(false);
        }, 2000);
      }}
    >
      {!copy && <Copy size={iconSize} />}
      {copy && <Check size={iconSize} />}
    </Button>
  );
};

export default CopyTextButton;
