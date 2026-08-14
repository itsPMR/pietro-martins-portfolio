"use client";

import Image from "next/image";
import { AnimatePresence, LazyMotion, m, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowIcon } from "@/components/arrow-icon";
import { PORTFOLIO_PROJECT_OPENED_EVENT } from "@/components/recruiter-signal";
import { Reveal } from "@/components/reveal";
import { projects } from "@/lib/projects";

const loadMotionFeatures = () =>
  import("@/lib/motion-features").then((module) => module.default);

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

type AnimationOrigin = {
  scale: number;
  x: number;
  y: number;
};

const defaultOrigin: AnimationOrigin = { scale: 0.88, x: 0, y: 24 };

export function ProjectGallery() {
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [origin, setOrigin] = useState<AnimationOrigin>(defaultOrigin);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const projectCount = String(projects.length).padStart(2, "0");

  const selectedProject =
    projects.find((project) => project.id === selectedId) ?? null;

  const closeProject = useCallback(() => {
    setIsOpen(false);
  }, []);

  const openProject = (projectId: string, trigger: HTMLButtonElement) => {
    const rectangle = trigger.getBoundingClientRect();
    const cardCenterX = rectangle.left + rectangle.width / 2;
    const cardCenterY = rectangle.top + rectangle.height / 2;
    const approximateDialogWidth = Math.min(window.innerWidth * 0.94, 1440);

    triggerRef.current = trigger;
    setOrigin({
      scale: Math.max(
        0.62,
        Math.min(0.9, rectangle.width / approximateDialogWidth),
      ),
      x: cardCenterX - window.innerWidth / 2,
      y: cardCenterY - window.innerHeight / 2,
    });
    setSelectedId(projectId);
    setIsOpen(true);
    window.dispatchEvent(
      new CustomEvent(PORTFOLIO_PROJECT_OPENED_EVENT, {
        detail: { projectId },
      }),
    );
  };

  useEffect(() => {
    const mountFrame = window.requestAnimationFrame(() => setIsMounted(true));
    return () => window.cancelAnimationFrame(mountFrame);
  }, []);

  useEffect(() => {
    if (!selectedProject) return;

    const backgroundElements = Array.from(document.body.children).filter(
      (element): element is HTMLElement =>
        element instanceof HTMLElement &&
        !element.classList.contains("project-modal-root"),
    );
    const previousInertValues = backgroundElements.map((element) => ({
      element,
      inert: element.inert,
    }));

    document.body.setAttribute("data-project-open", "true");
    backgroundElements.forEach((element) => {
      element.inert = true;
    });

    return () => {
      document.body.removeAttribute("data-project-open");
      previousInertValues.forEach(({ element, inert }) => {
        element.inert = inert;
      });
      window.requestAnimationFrame(() => triggerRef.current?.focus());
    };
  }, [selectedProject]);

  useEffect(() => {
    if (!selectedProject) return;

    const focusTimer = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 0);

    const handleDialogKeys = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeProject();
        return;
      }

      if (event.key !== "Tab") return;

      const focusableElements = Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(focusableSelector) ??
          [],
      ).filter(
        (element) =>
          !element.hasAttribute("disabled") &&
          element.getAttribute("aria-hidden") !== "true",
      );

      if (focusableElements.length === 0) {
        event.preventDefault();
        dialogRef.current?.focus();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements.at(-1);

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    window.addEventListener("keydown", handleDialogKeys);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", handleDialogKeys);
    };
  }, [closeProject, selectedProject]);

  const finishClosing = () => {
    if (isOpen) return;

    setSelectedId(null);
  };

  return (
    <>
      <ul aria-label="Projetos selecionados" className="project-grid">
        {projects.map((project, index) => {
          const projectTier =
            project.id === "classflow" ? "featured" : "secondary";

          return (
            <li
              className={`project-grid-item project-grid-item--${projectTier}`}
              data-featured={projectTier === "featured"}
              data-project-tier={projectTier}
              key={project.id}
            >
              <Reveal delay={index * 0.07}>
                <button
                  aria-controls={
                    selectedId === project.id && isOpen
                      ? "project-dialog"
                      : undefined
                  }
                  aria-expanded={selectedId === project.id && isOpen}
                  aria-haspopup="dialog"
                  aria-label={`Explorar projeto ${project.name}`}
                  className={`project-card project-card--${projectTier}`}
                  data-featured={projectTier === "featured"}
                  data-project={project.id}
                  data-project-tier={projectTier}
                  onClick={(event) =>
                    openProject(project.id, event.currentTarget)
                  }
                  type="button"
                >
                  <span className="project-card-topline">
                    <span className="project-card-number">
                      {project.number} / {projectCount}
                    </span>
                    <span className="project-card-status">
                      {project.status}
                    </span>
                  </span>

                  <span
                    className="project-card-media"
                    data-media-count={project.images.length}
                  >
                    <Image
                      alt={project.images[0].alt}
                      height={project.images[0].height}
                      loading={projectTier === "featured" ? "eager" : "lazy"}
                      sizes={
                        projectTier === "featured"
                          ? "(max-width: 900px) 92vw, (max-width: 1680px) 58vw, 56rem"
                          : "(max-width: 900px) 92vw, (max-width: 1680px) 42vw, 42rem"
                      }
                      src={project.images[0].src}
                      width={project.images[0].width}
                    />
                    <span aria-hidden="true" className="project-card-cross">
                      +
                    </span>
                  </span>

                  <span className="project-card-body">
                    <span className="project-card-eyebrow project-card-type">
                      {project.type}
                    </span>
                    <h3 className="project-card-title">{project.name}</h3>
                    <span className="project-card-summary">
                      {project.summary}
                    </span>
                  </span>

                  <span className="project-card-footer">
                    <span className="project-card-stack">
                      {project.cardStack.join(" · ")}
                    </span>
                    <span className="project-card-action">
                      <span>Explorar projeto</span>
                      <ArrowIcon direction="right" />
                    </span>
                  </span>
                </button>
              </Reveal>
            </li>
          );
        })}
      </ul>

      {isMounted &&
        createPortal(
          <LazyMotion features={loadMotionFeatures} strict>
            <AnimatePresence onExitComplete={finishClosing}>
              {isOpen && selectedProject ? (
                <m.div
                  animate={{ opacity: 1 }}
                  className="project-modal-root"
                  data-project={selectedProject.id}
                  data-project-tier={
                    selectedProject.id === "classflow"
                      ? "featured"
                      : "secondary"
                  }
                  exit={{ opacity: 1 }}
                  initial={{ opacity: 1 }}
                  onPointerDown={(event) => {
                    if (event.currentTarget === event.target) closeProject();
                  }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.48 }}
                >
                  <m.div
                    animate={{ scale: 1, x: 0, y: 0 }}
                    aria-describedby={`project-dialog-description-${selectedProject.id}`}
                    aria-labelledby={`project-dialog-title-${selectedProject.id}`}
                    aria-modal="true"
                    className="project-dialog"
                    data-project={selectedProject.id}
                    data-project-tier={
                      selectedProject.id === "classflow"
                        ? "featured"
                        : "secondary"
                    }
                    exit={
                      shouldReduceMotion
                        ? { scale: 1, x: 0, y: 0 }
                        : {
                            scale: origin.scale,
                            x: origin.x,
                            y: origin.y,
                          }
                    }
                    id="project-dialog"
                    initial={
                      shouldReduceMotion
                        ? false
                        : {
                            scale: origin.scale,
                            x: origin.x,
                            y: origin.y,
                          }
                    }
                    ref={dialogRef}
                    role="dialog"
                    tabIndex={-1}
                    transition={{
                      duration: shouldReduceMotion ? 0 : 0.48,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <div className="project-dialog-toolbar">
                      <div className="project-dialog-index">
                        <span>
                          {selectedProject.number} / {projectCount}
                        </span>
                        <strong>{selectedProject.name}</strong>
                      </div>
                      <div className="project-dialog-actions">
                        <button
                          aria-label={`Minimizar projeto ${selectedProject.name}`}
                          className="project-dialog-minimize"
                          onClick={closeProject}
                          type="button"
                        >
                          <span>Minimizar</span>
                          <ArrowIcon direction="down" />
                        </button>
                        <button
                          aria-label={`Fechar projeto ${selectedProject.name}`}
                          className="project-dialog-close"
                          onClick={closeProject}
                          ref={closeButtonRef}
                          type="button"
                        >
                          <span aria-hidden="true" />
                          <span aria-hidden="true" />
                        </button>
                      </div>
                    </div>

                    <div className="project-dialog-scroll">
                      <header className="project-dialog-hero">
                        <div className="project-dialog-heading">
                          <span className="project-dialog-eyebrow">
                            {selectedProject.type}
                          </span>
                          <h2
                            className="project-dialog-title"
                            id={`project-dialog-title-${selectedProject.id}`}
                          >
                            {selectedProject.name}
                          </h2>
                        </div>
                        <div className="project-dialog-intro">
                          <p
                            className="project-dialog-summary"
                            id={`project-dialog-description-${selectedProject.id}`}
                          >
                            {selectedProject.summary}
                          </p>
                          <span className="project-dialog-stackline">
                            {selectedProject.fullStack}
                          </span>
                        </div>
                      </header>

                      <div
                        className="project-dialog-images"
                        data-image-count={selectedProject.images.length}
                      >
                        {selectedProject.images.map((image, index) => (
                          <figure
                            className={
                              index === 0
                                ? "project-dialog-image project-dialog-image--lead"
                                : "project-dialog-image project-dialog-image--supporting"
                            }
                            data-image-index={index + 1}
                            key={image.src}
                          >
                            <Image
                              alt={image.alt}
                              height={image.height}
                              sizes="(max-width: 672px) 100vw, 88vw"
                              src={image.src}
                              width={image.width}
                            />
                            <figcaption>
                              <span>0{index + 1}</span>
                              {image.caption}
                            </figcaption>
                          </figure>
                        ))}
                      </div>

                      <section
                        aria-label={`Narrativa do projeto ${selectedProject.name}`}
                        className="project-dialog-story"
                      >
                        {selectedProject.story.map((block) => (
                          <div
                            className="project-dialog-story-block"
                            key={block.label}
                          >
                            <span className="project-dialog-story-label">
                              {block.label}
                            </span>
                            <p>{block.text}</p>
                          </div>
                        ))}
                      </section>

                      <section
                        aria-label={`Dados técnicos do projeto ${selectedProject.name}`}
                        className="project-dialog-evidence"
                      >
                        {selectedProject.evidence.map((item) => (
                          <div
                            className="project-dialog-evidence-item"
                            key={item.label}
                          >
                            <span>{item.label}</span>
                            <strong>{item.value}</strong>
                            <small>{item.detail}</small>
                          </div>
                        ))}
                      </section>

                      <div className="project-dialog-details">
                        <section>
                          <div className="project-dialog-label">
                            <span>A</span>
                            <span>Funcionalidades</span>
                          </div>
                          <ol className="project-dialog-feature-list">
                            {selectedProject.features.map((feature, index) => (
                              <li
                                className="project-dialog-feature"
                                key={feature}
                              >
                                <span>
                                  {String(index + 1).padStart(2, "0")}
                                </span>
                                {feature}
                              </li>
                            ))}
                          </ol>
                        </section>

                        <section className="project-dialog-stack">
                          <div className="project-dialog-label">
                            <span>B</span>
                            <span>Stack aplicada</span>
                          </div>
                          <p>{selectedProject.fullStack}</p>
                          <div className="project-dialog-status">
                            <span>Status</span>
                            <strong>{selectedProject.status}</strong>
                            <p>{selectedProject.statusDetail}</p>
                          </div>
                          <div className="project-dialog-links">
                            {selectedProject.links.map((link) => (
                              <a
                                href={link.href}
                                key={link.href}
                                rel="noreferrer"
                                target="_blank"
                              >
                                <span>{link.label}</span>
                                <ArrowIcon />
                              </a>
                            ))}
                          </div>
                        </section>
                      </div>

                      <div className="project-dialog-end">
                        <span className="project-dialog-end-label">
                          Fim do case
                        </span>
                        <button
                          className="project-dialog-end-action"
                          onClick={closeProject}
                          type="button"
                        >
                          Voltar aos projetos
                          <ArrowIcon direction="up-right" />
                        </button>
                      </div>
                    </div>
                  </m.div>
                </m.div>
              ) : null}
            </AnimatePresence>
          </LazyMotion>,
          document.body,
        )}
    </>
  );
}
