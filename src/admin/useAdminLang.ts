import { useEffect, useState } from "react";
import type { Lang } from "@/lib/routes";

export function useAdminLang() {
  const [lang, setLang] = useState<Lang>("nl");
  useEffect(() => {
    try {
      if (localStorage.getItem("col-lang") === "en") setLang("en");
    } catch {
      /* ignore */
    }
  }, []);
  const change = (l: Lang) => {
    setLang(l);
    try {
      localStorage.setItem("col-lang", l);
    } catch {
      /* ignore */
    }
  };
  return [lang, change] as const;
}
