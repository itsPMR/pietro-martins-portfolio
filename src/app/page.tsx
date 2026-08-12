import Image from "next/image";
import { ArrowIcon } from "@/components/arrow-icon";
import { Reveal } from "@/components/reveal";
import { SiteHeader } from "@/components/site-header";
import { certifications, site, skillGroups } from "@/lib/site";

type TextLinkProps = {
  children: React.ReactNode;
  className?: string;
  download?: boolean;
  href: string;
};

function TextLink({ children, className, download, href }: TextLinkProps) {
  const isExternal = href.startsWith("http");

  return (
    <a
      className={className ? `text-link ${className}` : "text-link"}
      download={download}
      href={href}
      rel={isExternal ? "noreferrer" : undefined}
      target={isExternal ? "_blank" : undefined}
    >
      <span>{children}</span>
      <ArrowIcon />
    </a>
  );
}

function SectionLabel({
  children,
  index,
}: {
  children: React.ReactNode;
  index: string;
}) {
  return (
    <div className="section-label">
      <span>{index}</span>
      <span>{children}</span>
    </div>
  );
}

const classFlowFeatures = [
  "Autenticação e dados isolados por usuário",
  "Gestão completa de matérias e tarefas",
  "Visões de hoje, próximos 7 dias e calendário mensal",
  "Busca, filtros, prioridades e ordenação",
  "Estatísticas, alertas e progresso acadêmico",
  "Imagens nas tarefas e exportação em PDF",
] as const;

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <SiteHeader />

      <main id="conteudo">
        <section aria-labelledby="hero-title" className="hero" id="topo">
          <div aria-hidden="true" className="hero-grid-lines" />

          <div className="hero-kicker hero-enter hero-enter-1">
            <span>Portfólio / 2026</span>
            <span>Guarulhos — SP</span>
          </div>

          <h1 className="hero-title" id="hero-title">
            <span className="hero-name-line hero-enter hero-enter-2">
              Pietro
            </span>
            <span className="hero-name-line hero-name-last hero-enter hero-enter-3">
              <i aria-hidden="true" />
              Martins
            </span>
          </h1>

          <div className="hero-statement hero-enter hero-enter-4">
            <p className="hero-role">
              Desenvolvedor em formação com foco em <em>backend</em>, Python e
              aplicações web.
            </p>
            <div className="hero-copy">
              <p>
                Estudante técnico em Desenvolvimento de Sistemas. Aos 16 anos,
                transformo o que estudo em produtos próprios enquanto busco
                minha primeira oportunidade em tecnologia.
              </p>
              <div className="hero-actions">
                <a className="button button-light" href="#projetos">
                  Ver projetos
                  <ArrowIcon direction="down" />
                </a>
                <TextLink href={site.github}>GitHub</TextLink>
                <TextLink href={site.linkedin}>LinkedIn</TextLink>
                <TextLink download href={site.resume}>
                  Currículo
                </TextLink>
              </div>
            </div>
          </div>

          <div className="hero-facts hero-enter hero-enter-5">
            <div>
              <span>Formação</span>
              <strong>Técnico em Desenvolvimento de Sistemas</strong>
            </div>
            <div>
              <span>Foco</span>
              <strong>Python · Backend · Dados</strong>
            </div>
            <div>
              <span>Objetivo</span>
              <strong>Primeira oportunidade em TI</strong>
            </div>
          </div>

          <a
            aria-label="Ir para projetos"
            className="scroll-cue"
            href="#projetos"
          >
            <span>Role para explorar</span>
            <ArrowIcon direction="down" />
          </a>
        </section>

        <section
          aria-labelledby="projects-title"
          className="work-section"
          id="projetos"
        >
          <Reveal className="section-heading section-heading-dark">
            <SectionLabel index="01">Trabalho selecionado</SectionLabel>
            <h2 id="projects-title">
              Projetos com
              <br />
              <span>evidência.</span>
            </h2>
            <p>
              Menos volume, mais contexto. Três projetos escolhidos pelo
              problema, pelas decisões técnicas e pelo que realmente foi
              implementado.
            </p>
          </Reveal>

          <article aria-labelledby="classflow-title" className="classflow-case">
            <Reveal className="case-title-row">
              <div>
                <span className="case-index">01 / Projeto principal</span>
                <h3 id="classflow-title">ClassFlow</h3>
              </div>
              <p>
                Organização acadêmica que reúne matérias, tarefas e prazos em
                uma visão única — construída para substituir a dispersão por
                clareza.
              </p>
            </Reveal>

            <Reveal className="classflow-visual">
              <figure>
                <div className="visual-main">
                  <Image
                    alt="Landing page real do ClassFlow em tema escuro"
                    height={1000}
                    sizes="(max-width: 768px) 100vw, 94vw"
                    src="/images/classflow-landing.png"
                    width={1440}
                  />
                </div>
                <div className="visual-inset">
                  <Image
                    alt="Dashboard demonstrativo real do ClassFlow com tarefas e indicadores"
                    height={1000}
                    sizes="(max-width: 768px) 76vw, 42vw"
                    src="/images/classflow-demo.png"
                    width={1440}
                  />
                </div>
                <figcaption>
                  Capturas locais da versão analisada · dados demonstrativos
                </figcaption>
              </figure>
            </Reveal>

            <Reveal className="case-story">
              <div className="story-block story-lead">
                <span>Problema</span>
                <p>
                  Provas, trabalhos, imagens e prazos costumam ficar espalhados
                  entre cadernos, mensagens e ferramentas que não conversam
                  entre si.
                </p>
              </div>
              <div className="story-block">
                <span>Solução</span>
                <p>
                  Uma aplicação web que centraliza a rotina acadêmica, revela o
                  que exige atenção e transforma tarefas em uma visão clara de
                  progresso.
                </p>
              </div>
              <div className="story-block">
                <span>Desenvolvimento</span>
                <p>
                  O projeto aplica autenticação, CRUD, regras de negócio,
                  isolamento com RLS, armazenamento de imagens e geração de PDF
                  em uma aplicação Flask renderizada no servidor.
                </p>
              </div>
            </Reveal>

            <Reveal className="case-evidence">
              <div>
                <span>Dados</span>
                <strong>Isolados por usuário</strong>
                <small>Supabase Auth + RLS</small>
              </div>
              <div>
                <span>Rotina</span>
                <strong>7 dias em foco</strong>
                <small>Hoje, semana e calendário</small>
              </div>
              <div>
                <span>Saída</span>
                <strong>Relatórios em PDF</strong>
                <small>Gerados com ReportLab</small>
              </div>
            </Reveal>

            <div className="case-details">
              <Reveal className="case-features">
                <SectionLabel index="A">Funcionalidades</SectionLabel>
                <ol>
                  {classFlowFeatures.map((feature, index) => (
                    <li key={feature}>
                      <span>0{index + 1}</span>
                      {feature}
                    </li>
                  ))}
                </ol>
              </Reveal>

              <Reveal className="case-stack" delay={0.08}>
                <SectionLabel index="B">Stack aplicada</SectionLabel>
                <p>
                  Python / Flask / Supabase / PostgreSQL / Jinja / HTML / CSS /
                  JavaScript / ReportLab / Gunicorn
                </p>
                <div className="case-note">
                  <span>Status</span>
                  <p>
                    Código privado. A documentação pública está disponível; o
                    deploy Flask não está ativo no momento.
                  </p>
                </div>
                <TextLink href="https://itspmr.github.io/ClassFlow/">
                  Ler documentação
                </TextLink>
              </Reveal>
            </div>
          </article>
        </section>

        <section
          aria-labelledby="other-projects-title"
          className="secondary-projects"
        >
          <Reveal className="secondary-heading">
            <SectionLabel index="02—03">Outras construções</SectionLabel>
            <h2 id="other-projects-title">
              Engenharia também
              <br />
              aparece nos detalhes.
            </h2>
          </Reveal>

          <article aria-labelledby="truco-title" className="project-feature">
            <Reveal className="project-copy">
              <span className="project-number">02</span>
              <p className="project-type">
                Multiplayer · Demo pública · Código privado
              </p>
              <h3 id="truco-title">PMR Truco</h3>
              <p className="project-description">
                Truco Paulista em tempo real para partidas 1×1 e 2×2. O jogo
                separa estado público e mãos privadas, processa ações em um
                servidor autoritativo e mantém a mesa sincronizada entre
                jogadores.
              </p>
              <ul className="project-proof" aria-label="Destaques técnicos">
                <li>Supabase Realtime e RLS</li>
                <li>Motor de regras em TypeScript puro</li>
                <li>Suíte de testes unitários e E2E</li>
                <li>PWA com retomada de partida</li>
              </ul>
              <p className="project-stack-line">
                Next.js · TypeScript · Supabase · Three.js · Vitest · Playwright
              </p>
              <TextLink href="https://pmr-truco.vercel.app">
                Abrir projeto
              </TextLink>
            </Reveal>

            <Reveal
              className="project-visual project-visual-truco"
              delay={0.08}
            >
              <figure>
                <Image
                  alt="Mesa de partida real do PMR Truco com cartas e placar"
                  height={900}
                  sizes="(max-width: 900px) 100vw, 58vw"
                  src="/images/pmr-truco-game.png"
                  width={1280}
                />
                <figcaption>
                  Captura de uma partida em ambiente de teste
                </figcaption>
              </figure>
            </Reveal>
          </article>

          <article
            aria-labelledby="assist-title"
            className="project-feature project-feature-reverse"
          >
            <Reveal className="project-copy">
              <span className="project-number">03</span>
              <p className="project-type">
                PWA · Protótipo avançado · Código privado
              </p>
              <h3 id="assist-title">PMR Assist</h3>
              <p className="project-description">
                Sistema pessoal para organizar tarefas, agenda, rotinas e
                lembretes, com um assistente em português baseado em ferramentas
                estruturadas. Integrações externas seguem em validação.
              </p>
              <ul className="project-proof" aria-label="Destaques técnicos">
                <li>Fluxos protegidos por confirmação</li>
                <li>Agendador com idempotência e tentativas</li>
                <li>Supabase Edge Functions</li>
                <li>Testes com Vitest e Playwright</li>
              </ul>
              <p className="project-stack-line">
                React · TypeScript · Vite · Supabase · PWA · Edge Functions
              </p>
              <TextLink href="https://pmr-assist.vercel.app">
                Abrir aplicação <small>(login)</small>
              </TextLink>
            </Reveal>

            <Reveal
              className="project-visual project-visual-assist"
              delay={0.08}
            >
              <figure>
                <Image
                  alt="Interface real do modo demonstrativo local do PMR Assist"
                  height={1100}
                  sizes="(max-width: 900px) 100vw, 58vw"
                  src="/images/pmr-assist-assistant.png"
                  width={1440}
                />
                <figcaption>
                  Captura local da versão analisada · modo demonstração
                </figcaption>
              </figure>
            </Reveal>
          </article>
        </section>

        <section
          aria-labelledby="about-title"
          className="about-section"
          id="sobre"
        >
          <Reveal className="about-intro">
            <SectionLabel index="04">Sobre</SectionLabel>
            <h2 id="about-title">
              Formação em curso.
              <br />
              <span>Iniciativa já em prática.</span>
            </h2>
          </Reveal>

          <div className="about-grid">
            <Reveal className="about-statement">
              <p>
                Tenho 16 anos e curso o Ensino Médio integrado ao curso técnico
                em Desenvolvimento de Sistemas. Meu foco está em backend,
                Python, banco de dados e na construção de aplicações web úteis.
              </p>
            </Reveal>
            <Reveal className="about-detail" delay={0.08}>
              <p>
                Aprendo construindo: parto de um problema, desenho o fluxo,
                implemento, testo e reviso. É assim que projetos como ClassFlow,
                PMR Truco e PMR Assist saíram do campo de estudo para sistemas
                funcionais.
              </p>
              <p>
                Busco minha primeira oportunidade — Jovem Aprendiz ou estágio —
                para evoluir ao lado de uma equipe, contribuir com disciplina e
                transformar base técnica em experiência profissional.
              </p>
            </Reveal>
          </div>

          <div
            className="about-manifesto"
            aria-label="Processo de aprendizagem"
          >
            <span>Entender</span>
            <i>→</i>
            <span>Construir</span>
            <i>→</i>
            <span>Testar</span>
            <i>→</i>
            <span>Evoluir</span>
          </div>
        </section>

        <section
          aria-labelledby="skills-title"
          className="skills-section"
          id="tecnologias"
        >
          <Reveal className="skills-heading">
            <SectionLabel index="05">Tecnologias</SectionLabel>
            <h2 id="skills-title">O que uso para construir.</h2>
            <p>
              Conhecimentos aplicados em projetos ou presentes no meu estudo
              atual — sem porcentagens arbitrárias.
            </p>
          </Reveal>

          <div className="skills-grid">
            {skillGroups.map((group, index) => (
              <Reveal
                className="skill-group"
                delay={index * 0.05}
                key={group.title}
              >
                <div className="skill-title">
                  <span>{group.index}</span>
                  <h3>{group.title}</h3>
                </div>
                <ul>
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </section>

        <section
          aria-labelledby="education-title"
          className="education-section"
          id="formacao"
        >
          <Reveal className="education-heading">
            <SectionLabel index="06">Formação</SectionLabel>
            <h2 id="education-title">Base para o próximo passo.</h2>
          </Reveal>

          <div className="education-layout">
            <div className="education-column">
              <h3>Formação acadêmica</h3>
              <Reveal className="education-row">
                <span>2026—2027</span>
                <div>
                  <strong>Técnico em Desenvolvimento de Sistemas</strong>
                  <p>E.E. Prof. Frederico de Barros Brotero</p>
                  <small>Em andamento · integrado ao Ensino Médio</small>
                </div>
              </Reveal>
              <Reveal className="education-row" delay={0.06}>
                <span>2025—2027</span>
                <div>
                  <strong>Ensino Médio</strong>
                  <p>E.E. Prof. Frederico de Barros Brotero</p>
                  <small>2º ano · em andamento</small>
                </div>
              </Reveal>
            </div>

            <div className="education-column certification-column">
              <h3>Certificações selecionadas</h3>
              {certifications.map((certificate, index) => (
                <Reveal
                  className="certificate-row"
                  delay={index * 0.05}
                  key={certificate.name}
                >
                  <span>{certificate.date}</span>
                  <div>
                    <strong>{certificate.name}</strong>
                    <p>{certificate.issuer}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section
          aria-labelledby="contact-title"
          className="contact-section"
          id="contato"
        >
          <Reveal className="contact-content">
            <SectionLabel index="Agora">Contato</SectionLabel>
            <h2 id="contact-title">
              Disponível para a
              <br />
              primeira oportunidade.
            </h2>
            <p>
              Procuro uma equipe onde possa aprender com contexto real,
              contribuir desde o início e continuar construindo uma base técnica
              sólida.
            </p>
            <a className="email-link" href={`mailto:${site.email}`}>
              <span>{site.email}</span>
              <ArrowIcon />
            </a>
          </Reveal>

          <div className="contact-links">
            <TextLink href={site.linkedin}>LinkedIn</TextLink>
            <TextLink href={site.github}>GitHub</TextLink>
            <TextLink download href={site.resume}>
              Baixar currículo
            </TextLink>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <a
          className="wordmark"
          href="#topo"
          aria-label="PMR — voltar ao início"
        >
          <span>PMR</span>
          <span className="wordmark-dot" aria-hidden="true" />
        </a>
        <p>Projetado e desenvolvido com intenção, código e evidência.</p>
        <span>Guarulhos — SP · 2026</span>
      </footer>
    </>
  );
}
