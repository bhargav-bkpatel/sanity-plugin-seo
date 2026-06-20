import { useState, useEffect } from "react";
import { isProEnabled, isLicenseValidating, SEO_PRO_EVENT } from "../config";

export default function useProEnabled(): { isPro: boolean; validating: boolean } {
  const [isPro, setIsPro] = useState(isProEnabled());
  const [validating, setValidating] = useState(isLicenseValidating());

  useEffect(() => {
    const handler = () => {
      setIsPro(isProEnabled());
      setValidating(isLicenseValidating());
    };
    window.addEventListener(SEO_PRO_EVENT, handler);
    handler();
    return () => window.removeEventListener(SEO_PRO_EVENT, handler);
  }, []);

  return { isPro, validating };
}
