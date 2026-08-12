"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowIcon } from "@/components/arrow-icon";
import { navigation, site } from "@/lib/site";

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const mobileNavRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    document.body.dataset.menuOpen = isOpen ? "true" : "false";

    if (!isOpen) {
      return () => {
        delete document.body.dataset.menuOpen;
      };
    }

    const inertElements = [
      document.querySelector<HTMLElement>(".skip-link"),
      document.querySelector<HTMLElement>("main"),
      document.querySelector<HTMLElement>(".site-footer"),
    ].filter((element): element is HTMLElement => element !== null);

    inertElements.forEach((element) => {
      element.inert = true;
    });

    const focusTimer = window.setTimeout(() => {
      firstLinkRef.current?.focus();
    }, 0);

    const handleMenuKeys = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsOpen(false);
        window.requestAnimationFrame(() => toggleRef.current?.focus());
        return;
      }

      if (event.key !== "Tab") return;

      const links = Array.from(
        mobileNavRef.current?.querySelectorAll<HTMLAnchorElement>("a[href]") ??
          [],
      );
      const focusableElements = [toggleRef.current, ...links].filter(
        (element): element is HTMLAnchorElement | HTMLButtonElement =>
          element !== null,
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements.at(-1);

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement?.focus();
      }
    };

    window.addEventListener("keydown", handleMenuKeys);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", handleMenuKeys);
      inertElements.forEach((element) => {
        element.inert = false;
      });
      delete document.body.dataset.menuOpen;
    };
  }, [isOpen]);

  const closeAtDestination = (href: string) => {
    setIsOpen(false);
    window.requestAnimationFrame(() => {
      const destination = document.querySelector<HTMLElement>(href);
      if (!destination) return;

      destination.setAttribute("tabindex", "-1");
      destination.focus({ preventScroll: true });
      destination.addEventListener(
        "blur",
        () => destination.removeAttribute("tabindex"),
        { once: true },
      );
    });
  };

  return (
    <header className="site-header">
      <a
        className="wordmark"
        href="#topo"
        aria-label="PMR — Pietro Martins — início"
      >
        <span>PMR</span>
        <span className="wordmark-dot" aria-hidden="true" />
      </a>

      <nav className="desktop-nav" aria-label="Navegação principal">
        {navigation.map((item) => (
          <a href={item.href} key={item.href}>
            {item.label}
          </a>
        ))}
      </nav>

      <a className="header-contact" href={`mailto:${site.email}`}>
        <span>Contato</span>
        <ArrowIcon />
      </a>

      <button
        aria-controls="mobile-navigation"
        aria-expanded={isOpen}
        aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
        className="menu-toggle"
        onClick={() => setIsOpen((current) => !current)}
        ref={toggleRef}
        type="button"
      >
        <span />
        <span />
      </button>

      <div
        aria-hidden={!isOpen}
        aria-label="Menu principal"
        aria-modal="true"
        className="mobile-nav"
        data-open={isOpen}
        id="mobile-navigation"
        ref={mobileNavRef}
        role="dialog"
      >
        <nav aria-label="Navegação mobile">
          {navigation.map((item, index) => (
            <a
              href={item.href}
              key={item.href}
              onClick={() => closeAtDestination(item.href)}
              ref={index === 0 ? firstLinkRef : undefined}
              tabIndex={isOpen ? 0 : -1}
            >
              <span>0{index + 1}</span>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="mobile-nav-meta">
          <span>{site.location}</span>
          <span>Portfólio / 2026</span>
        </div>
      </div>
    </header>
  );
}
