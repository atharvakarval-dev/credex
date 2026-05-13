"use client";

import React, { useState } from "react";
import { Link2, Check } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";

export function ShareButton() {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (_err) {
      toast.error("Failed to copy link");
    }
  };

  return (
    <Button variant="outline" onClick={handleShare} className="gap-2">
      {copied ? <Check className="h-4 w-4 text-green-600" /> : <Link2 className="h-4 w-4" />}
      Share Results
    </Button>
  );
}
