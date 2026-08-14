"use client";

import { useEffect, useId, useRef, useState } from "react";
import styles from "./recruiter-signal.module.css";

export const PORTFOLIO_PROJECT_OPENED_EVENT = "portfolio:project-opened";

const levels = [
  {
    description: "Objetivo, formação e direção profissional.",
    label: "Perfil",
  },
  {
    description: "Projetos reais e decisões de produto.",
    label: "Evidências",
  },
  {
    description: "Tecnologias aplicadas em contexto.",
    label: "Stack",
  },
  {
    description: "Próximo passo: iniciar uma conversa.",
    label: "Contato / Match",
  },
] as const;

const timeMilestones = [7_000, 18_000, 34_000, 55_000, 90_000] as const;
const timeScores = [0, 0, 1, 2, 3, 5] as const;
const scrollScores = [0, 1, 2, 3] as const;

function getScrollStage() {
  const scrollableDistance =
    document.documentElement.scrollHeight - window.innerHeight;

  if (scrollableDistance <= 0) return 0;

  const depth = Math.min(1, Math.max(0, window.scrollY / scrollableDistance));

  if (depth >= 0.78) return 3;
  if (depth >= 0.5) return 2;
  if (depth >= 0.18) return 1;
  return 0;
}

function getLevel(score: number) {
  if (score >= 5) return 4;
  if (score >= 3) return 3;
  if (score >= 1) return 2;
  return 1;
}

export function RecruiterSignal() {
  const panelId = useId();
  const [isExpanded, setIsExpanded] = useState(false);
  const [projectWasOpened, setProjectWasOpened] = useState(false);
  const [scrollStage, setScrollStage] = useState(0);
  const [timeStage, setTimeStage] = useState(0);
  const [announcement, setAnnouncement] = useState("");
  const autoCollapseTimer = useRef<number | null>(null);
  const previousLevel = useRef(0);

  useEffect(() => {
    const timers = timeMilestones.map((delay, index) =>
      window.setTimeout(() => setTimeStage(index + 1), delay),
    );

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, []);

  useEffect(() => {
    let animationFrame = 0;

    const updateScrollStage = () => {
      animationFrame = 0;
      const nextStage = getScrollStage();
      setScrollStage((currentStage) =>
        nextStage > currentStage ? nextStage : currentStage,
      );
    };

    const handleScroll = () => {
      if (animationFrame) return;
      animationFrame = window.requestAnimationFrame(updateScrollStage);
    };

    updateScrollStage();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  useEffect(() => {
    const handleProjectOpened: EventListener = () => setProjectWasOpened(true);

    window.addEventListener(
      PORTFOLIO_PROJECT_OPENED_EVENT,
      handleProjectOpened,
    );

    return () =>
      window.removeEventListener(
        PORTFOLIO_PROJECT_OPENED_EVENT,
        handleProjectOpened,
      );
  }, []);

  const isVisible = timeStage > 0;
  const engagementScore =
    timeScores[timeStage] +
    scrollScores[scrollStage] +
    (projectWasOpened ? 2 : 0);
  const currentLevel = isVisible ? getLevel(engagementScore) : 0;
  const currentLevelData = levels[Math.max(0, currentLevel - 1)];

  useEffect(() => {
    if (currentLevel === 0) return;

    const openFrame = window.requestAnimationFrame(() => setIsExpanded(true));
    const collapseDelay = currentLevel === 4 ? 8_200 : 5_200;

    autoCollapseTimer.current = window.setTimeout(() => {
      setIsExpanded(false);
      autoCollapseTimer.current = null;
    }, collapseDelay);

    return () => {
      window.cancelAnimationFrame(openFrame);
      if (autoCollapseTimer.current === null) return;
      window.clearTimeout(autoCollapseTimer.current);
      autoCollapseTimer.current = null;
    };
  }, [currentLevel]);

  useEffect(() => {
    if (currentLevel === 0 || previousLevel.current === currentLevel) return;

    previousLevel.current = currentLevel;
    setAnnouncement(
      `Nível ${String(currentLevel).padStart(2, "0")}: ${levels[currentLevel - 1].label}.`,
    );
  }, [currentLevel]);

  if (!isVisible) return null;

  const togglePanel = () => {
    if (autoCollapseTimer.current !== null) {
      window.clearTimeout(autoCollapseTimer.current);
      autoCollapseTimer.current = null;
    }

    setIsExpanded((expanded) => !expanded);
  };

  return (
    <aside
      aria-label="Rota de leitura para recrutadores"
      className={styles.root}
      data-level={currentLevel}
    >
      <p aria-atomic="true" aria-live="polite" className={styles.srOnly}>
        {announcement}
      </p>

      <section className={styles.panel} hidden={!isExpanded} id={panelId}>
        <header className={styles.panelHeader}>
          <div>
            <span className={styles.eyebrow}>
              <span aria-hidden="true" className={styles.signalDot} />
              Leitura ativa
            </span>
            <h2 className={styles.title}>Rota do recrutador</h2>
          </div>
          <span className={styles.counter}>
            {String(currentLevel).padStart(2, "0")} / 04
          </span>
        </header>

        <p className={styles.summary}>{currentLevelData.description}</p>

        <ol
          aria-label="Progresso da leitura"
          className={styles.levels}
          role="list"
        >
          {levels.map((level, index) => {
            const levelNumber = index + 1;
            const state =
              levelNumber < currentLevel
                ? "complete"
                : levelNumber === currentLevel
                  ? "current"
                  : "pending";

            return (
              <li
                aria-current={state === "current" ? "step" : undefined}
                className={styles.level}
                data-state={state}
                key={level.label}
              >
                <span className={styles.levelNumber}>
                  {String(levelNumber).padStart(2, "0")}
                </span>
                <span className={styles.levelCopy}>
                  <strong>{level.label}</strong>
                  <small>{level.description}</small>
                </span>
                <span aria-hidden="true" className={styles.levelMarker} />
              </li>
            );
          })}
        </ol>

        {currentLevel === 4 ? (
          <a
            className={styles.panelCta}
            href="#contato"
            onClick={() => setIsExpanded(false)}
          >
            <span>Conversar com Pietro</span>
            <span aria-hidden="true">↗</span>
          </a>
        ) : (
          <p className={styles.hint}>
            Continue explorando os projetos e a stack.
          </p>
        )}
      </section>

      <div className={styles.controls}>
        {currentLevel === 4 ? (
          <a className={styles.quickCta} href="#contato">
            Contato
          </a>
        ) : null}

        <button
          aria-controls={panelId}
          aria-expanded={isExpanded}
          aria-label={
            isExpanded
              ? "Recolher rota do recrutador"
              : "Expandir rota do recrutador"
          }
          className={styles.toggle}
          onClick={togglePanel}
          type="button"
        >
          <span aria-hidden="true" className={styles.toggleSignal} />
          <span className={styles.toggleCopy}>
            <small>Recruiter signal</small>
            <strong>
              {String(currentLevel).padStart(2, "0")} · {currentLevelData.label}
            </strong>
          </span>
          <span
            aria-hidden="true"
            className={styles.chevron}
            data-expanded={isExpanded}
          />
        </button>
      </div>
    </aside>
  );
}
