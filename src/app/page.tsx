import { ArrowIcon } from "@/components/arrow-icon";
import { PointerHalo } from "@/components/pointer-halo";
import { ProjectGallery } from "@/components/project-gallery";
import { RecruiterSignal } from "@/components/recruiter-signal";
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
      <i aria-hidden="true" />
    </div>
  );
}

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <SiteHeader />

      <main id="conteudo" tabIndex={-1}>
        <section aria-labelledby="hero-title" className="hero" id="topo">
          <div className="hero-shell">
            <div aria-hidden="true" className="hero-grid-lines" />

            <div className="hero-kicker hero-enter hero-enter-1">
              <span>Portfólio independente / 2026</span>
              <span>Guarulhos — SP</span>
            </div>

            <h1 className="hero-title" id="hero-title">
              <span className="hero-name-line hero-enter hero-enter-2">
                Pietro
              </span>
              <span className="hero-name-line hero-name-last hero-enter hero-enter-3">
                Martins
                <i aria-hidden="true" />
              </span>
            </h1>

            <div className="hero-statement hero-enter hero-enter-4">
              <p className="hero-role">
                Backend, Python e produtos web construídos para funcionar no
                <em> mundo real.</em>
              </p>

              <div className="hero-copy">
                <span className="hero-copy-label">
                  Em formação / Em prática
                </span>
                <p>
                  Tenho 16 anos, estudo Desenvolvimento de Sistemas e transformo
                  cada etapa do aprendizado em projetos funcionais enquanto
                  busco minha primeira oportunidade em tecnologia.
                </p>
                <div className="hero-actions">
                  <a className="button button-signal" href="#projetos">
                    Explorar projetos
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
          </div>
        </section>

        <section
          aria-labelledby="about-title"
          className="about-section"
          id="sobre"
        >
          <div className="section-shell">
            <Reveal className="about-intro">
              <SectionLabel index="01">Sobre</SectionLabel>
              <h2 id="about-title">
                Ainda no início.
                <br />
                <span>Já em movimento.</span>
              </h2>
            </Reveal>

            <div className="about-grid">
              <Reveal className="about-statement">
                <span className="about-age" aria-hidden="true">
                  16
                </span>
                <p>
                  Curso o Ensino Médio integrado ao técnico em Desenvolvimento
                  de Sistemas. Meu foco está em backend, Python, banco de dados
                  e aplicações web úteis.
                </p>
              </Reveal>

              <Reveal className="about-detail" delay={0.08}>
                <div>
                  <span>Como aprendo</span>
                  <p>
                    Parto de um problema, desenho o fluxo, implemento, testo e
                    reviso. Foi assim que ClassFlow, PMR Truco e PMR Assist
                    saíram do estudo para sistemas funcionais.
                  </p>
                </div>
                <div>
                  <span>O próximo passo</span>
                  <p>
                    Busco uma vaga de Jovem Aprendiz ou estágio para evoluir ao
                    lado de uma equipe e transformar base técnica em experiência
                    profissional.
                  </p>
                </div>
              </Reveal>
            </div>

            <ol
              className="about-manifesto"
              aria-label="Processo de aprendizagem"
              role="list"
            >
              <li>
                <span>Entender</span>
                <i aria-hidden="true">01</i>
              </li>
              <li>
                <span>Construir</span>
                <i aria-hidden="true">02</i>
              </li>
              <li>
                <span>Testar</span>
                <i aria-hidden="true">03</i>
              </li>
              <li>
                <span>Evoluir</span>
                <i aria-hidden="true">04</i>
              </li>
            </ol>
          </div>
        </section>

        <section
          aria-labelledby="projects-title"
          className="work-section"
          id="projetos"
        >
          <div className="section-shell">
            <Reveal className="section-heading section-heading-dark">
              <SectionLabel index="02">Projetos</SectionLabel>
              <h2 id="projects-title">
                Evidência antes
                <br />
                <span>do discurso.</span>
              </h2>
              <p>
                ClassFlow lidera a seleção. PMR Truco e PMR Assist mostram
                outras duas frentes: tempo real e automação. Abra cada projeto
                para entender o problema, a solução e as decisões técnicas.
              </p>
            </Reveal>

            <ProjectGallery />
          </div>
        </section>

        <section
          aria-labelledby="skills-title"
          className="skills-section"
          id="tecnologias"
        >
          <div className="section-shell">
            <Reveal className="skills-heading">
              <SectionLabel index="03">Tecnologias</SectionLabel>
              <h2 id="skills-title">
                Ferramentas entram.
                <br />
                <span>O raciocínio fica.</span>
              </h2>
              <p>
                Conhecimentos aplicados em projetos ou presentes no meu estudo
                atual — sem porcentagens arbitrárias.
              </p>
            </Reveal>

            <div className="skills-index">
              {skillGroups.map((group, index) => (
                <Reveal
                  className="skill-group"
                  delay={index * 0.04}
                  key={group.title}
                >
                  <span className="skill-number">{group.index}</span>
                  <h3>{group.title}</h3>
                  <ul>
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <span className="skill-state">
                    {index < 2 ? "Foco principal" : "Aplicado / estudado"}
                  </span>
                </Reveal>
              ))}
            </div>

            <div className="skills-note">
              <span>Backend first</span>
              <p>
                Gosto de entender dados, regras e fluxo antes da interface — e
                de levar a mesma atenção até a experiência final.
              </p>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="education-title"
          className="education-section"
          id="formacao"
        >
          <div className="section-shell">
            <Reveal className="education-heading">
              <SectionLabel index="04">Formação</SectionLabel>
              <h2 id="education-title">
                Base em construção.
                <br />
                <span>Ritmo constante.</span>
              </h2>
            </Reveal>

            <div className="education-layout">
              <div className="education-column">
                <h3>Formação acadêmica</h3>
                <Reveal className="education-row">
                  <span>2026—27</span>
                  <div>
                    <strong>Técnico em Desenvolvimento de Sistemas</strong>
                    <p>E.E. Prof. Frederico de Barros Brotero</p>
                    <small>Em andamento · integrado ao Ensino Médio</small>
                  </div>
                </Reveal>
                <Reveal className="education-row" delay={0.06}>
                  <span>2025—27</span>
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
          </div>
        </section>

        <section
          aria-labelledby="contact-title"
          className="contact-section"
          id="contato"
        >
          <div className="contact-shell">
            <Reveal className="contact-content">
              <SectionLabel index="05">Contato</SectionLabel>
              <p className="contact-kicker">
                O próximo projeto pode ser em equipe.
              </p>
              <h2 id="contact-title">
                Disponível para a
                <br />
                primeira oportunidade.
              </h2>
              <p className="contact-copy">
                Procuro um ambiente onde possa aprender com contexto real,
                contribuir desde o início e continuar construindo uma base
                técnica sólida.
              </p>
            </Reveal>

            <a className="email-link" href={`mailto:${site.email}`}>
              <span>{site.email}</span>
              <ArrowIcon />
            </a>

            <div className="contact-links">
              <TextLink href={site.linkedin}>LinkedIn</TextLink>
              <TextLink href={site.github}>GitHub</TextLink>
              <TextLink download href={site.resume}>
                Baixar currículo
              </TextLink>
            </div>
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
        <p>Projetado e desenvolvido por Pietro Martins.</p>
        <span>Guarulhos — SP · 2026</span>
      </footer>

      <RecruiterSignal />
      <PointerHalo />
    </>
  );
}
