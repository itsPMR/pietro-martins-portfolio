import { ArrowIcon } from "@/components/arrow-icon";
import { ProjectGallery } from "@/components/project-gallery";
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

          <a aria-label="Ir para sobre" className="scroll-cue" href="#sobre">
            <span>Role para conhecer</span>
            <ArrowIcon direction="down" />
          </a>
        </section>

        <section
          aria-labelledby="about-title"
          className="about-section"
          id="sobre"
        >
          <Reveal className="about-intro">
            <SectionLabel index="01">Sobre</SectionLabel>
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
          aria-labelledby="projects-title"
          className="work-section"
          id="projetos"
        >
          <Reveal className="section-heading section-heading-dark">
            <SectionLabel index="02">Projetos</SectionLabel>
            <h2 id="projects-title">
              Projetos com
              <br />
              <span>evidência.</span>
            </h2>
            <p>
              Três construções, o mesmo peso visual. Explore cada case para ver
              o problema, as decisões técnicas e o que realmente foi
              implementado.
            </p>
          </Reveal>

          <ProjectGallery />
        </section>

        <section
          aria-labelledby="skills-title"
          className="skills-section"
          id="tecnologias"
        >
          <Reveal className="skills-heading">
            <SectionLabel index="03">Tecnologias</SectionLabel>
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
            <SectionLabel index="04">Formação</SectionLabel>
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
            <SectionLabel index="05">Contato</SectionLabel>
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
