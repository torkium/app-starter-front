"use client";

import { useEffect } from "react";

export function CleanAuthTokenUrl({ param = "token" }: { param?: string }) {
  useEffect(() => {
    const url = new URL(window.location.href);

    if (!url.searchParams.has(param)) {
      return;
    }

    url.searchParams.delete(param);
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  }, [param]);

  return null;
}
