import { useContext } from "react";

import { ZynxContext } from "./zynxContextValue";

export function useZynx() {
  const context = useContext(ZynxContext);
  if (!context) {
    throw new Error("useZynx must be used within ZynxProvider.");
  }
  return context;
}
