"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const previousPathname = useRef(pathname);
  const pendingPath = useRef<string | null>(null);
  const [phase, setPhase] = useState<"hidden" | "active" | "exit">("hidden");
  const transitionTimer = useRef<number | null>(null);

  const startTransition = () => {
    if (transitionTimer.current) {
      window.clearTimeout(transitionTimer.current);
    }

    setPhase("active");
    transitionTimer.current = window.setTimeout(() => {
      setPhase("exit");
      transitionTimer.current = window.setTimeout(() => setPhase("hidden"), 600);
    }, 1000);
  };

  useEffect(() => {
    const handleNavigationIntent = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const target = event.target as HTMLElement;
      const link = target.closest("a");
      if (!link || !link.href.startsWith(window.location.origin) || link.pathname === window.location.pathname) {
        return;
      }

      event.preventDefault();
      pendingPath.current = link.pathname;
      startTransition();
      window.setTimeout(() => router.push(`${link.pathname}${link.search}${link.hash}`), 460);
    };

    const handlePopState = () => {
      startTransition();
    };

    document.addEventListener("click", handleNavigationIntent, true);
    window.addEventListener("popstate", handlePopState);

    return () => {
      document.removeEventListener("click", handleNavigationIntent, true);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [router]);

  useEffect(() => {
    if (previousPathname.current !== pathname) {
      previousPathname.current = pathname;
      if (pendingPath.current === pathname) {
        pendingPath.current = null;
      } else {
        startTransition();
      }
    }
  }, [pathname]);

  useEffect(() => () => {
    if (transitionTimer.current) {
      window.clearTimeout(transitionTimer.current);
    }
  }, []);

  if (phase === "hidden") {
    return null;
  }

  return (
    <div className={`page-transition page-transition-${phase}`} aria-live="polite" aria-label="Loading Kau High News">
      <div className="page-transition-content">
        <p className="page-transition-wordmark">KAU HIGH</p>
        <Image
          src="/kau-logo.png"
          alt="Kau High School seal"
          width={220}
          height={220}
          className="page-transition-seal"
          priority
        />
        <p className="page-transition-wordmark">NEWS</p>
      </div>
    </div>
  );
}
