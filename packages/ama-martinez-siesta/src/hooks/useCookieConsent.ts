import { useEffect, useState } from "react";

export interface CookiePreferences {
  essential: boolean; // Siempre true
  analytics: boolean;
  newsletter: boolean;
  timestamp: number;
}

const COOKIE_CONSENT_KEY = "ms-pf-cookie-consent";
// const COOKIE_CONSENT_VERSION = 1;

export const useCookieConsent = () => {
  const [preferences, setPreferences] = useState<CookiePreferences | null>(
    null,
  );
  const [showBanner, setShowBanner] = useState(false);

  // Cargar preferencias del localStorage al montar
  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setPreferences(parsed);
        setShowBanner(false);
      } catch {
        setShowBanner(true);
      }
    } else {
      setShowBanner(true);
    }
  }, []);

  const acceptAll = () => {
    const prefs: CookiePreferences = {
      essential: true,
      analytics: true,
      newsletter: true,
      timestamp: Date.now(),
    };
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(prefs));
    setPreferences(prefs);
    setShowBanner(false);
    // Aquí iría la lógica para activar scripts de analytics/newsletter
    window.dispatchEvent(new CustomEvent("cookieConsent", { detail: prefs }));
  };

  const rejectNonEssential = () => {
    const prefs: CookiePreferences = {
      essential: true,
      analytics: false,
      newsletter: false,
      timestamp: Date.now(),
    };
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(prefs));
    setPreferences(prefs);
    setShowBanner(false);
    window.dispatchEvent(new CustomEvent("cookieConsent", { detail: prefs }));
  };

  const clearConsent = () => {
    localStorage.removeItem(COOKIE_CONSENT_KEY);
    setPreferences(null);
    setShowBanner(true);
  };

  return {
    preferences,
    showBanner,
    acceptAll,
    rejectNonEssential,
    clearConsent,
  };
};
