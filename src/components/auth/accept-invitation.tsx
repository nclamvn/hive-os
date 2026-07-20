"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { acceptInvitationAction } from "@/app/actions/identity";
import { Button } from "@/components/ui/button";
import { FormError } from "./auth-card";

export function AcceptInvitation({ token }: { token: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function accept() {
    setError(null);
    startTransition(async () => {
      const result = await acceptInvitationAction(token);
      if (result.ok && result.slug) {
        router.push(`/w/${result.slug}`);
        router.refresh();
      } else {
        setError(result.error ?? "This invitation could not be accepted");
      }
    });
  }

  return (
    <div>
      <FormError message={error} />
      <Button
        type="button"
        variant="primary"
        onClick={accept}
        disabled={pending}
        className="w-full"
      >
        {pending ? "Joining…" : "Accept invitation"}
      </Button>
    </div>
  );
}
