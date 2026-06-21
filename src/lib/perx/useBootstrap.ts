import { useEffect, useRef } from "react";
import { useServerFn } from "@tanstack/react-start";
import { bootstrapDemoUser } from "@/lib/perx/sim.functions";

/** Idempotent: provisions company/provider attachment + wallet on first hit. */
export function useBootstrap() {
  const fn = useServerFn(bootstrapDemoUser);
  const did = useRef(false);
  useEffect(() => {
    if (did.current) return;
    did.current = true;
    fn().catch(() => {});
  }, [fn]);
}
