export type Project = {
  cardStack: readonly string[];
  evidence: readonly {
    detail: string;
    label: string;
    value: string;
  }[];
  features: readonly string[];
  fullStack: string;
  id: string;
  images: readonly {
    alt: string;
    caption: string;
    height: number;
    src: string;
    width: number;
  }[];
  links: readonly {
    href: string;
    label: string;
  }[];
  name: string;
  number: string;
  status: string;
  statusDetail: string;
  story: readonly {
    label: string;
    text: string;
  }[];
  summary: string;
  type: string;
};

export const projects = [
  {
    cardStack: ["Python", "Flask", "Supabase"],
    evidence: [
      {
        detail: "Supabase Auth + RLS",
        label: "Dados",
        value: "Isolados por usuário",
      },
      {
        detail: "Hoje, semana e calendário",
        label: "Rotina",
        value: "7 dias em foco",
      },
      {
        detail: "Gerados com ReportLab",
        label: "Saída",
        value: "Relatórios em PDF",
      },
    ],
    features: [
      "Autenticação e dados isolados por usuário",
      "Gestão completa de matérias e tarefas",
      "Visões de hoje, próximos 7 dias e calendário mensal",
      "Busca, filtros, prioridades e ordenação",
      "Estatísticas, alertas e progresso acadêmico",
      "Imagens nas tarefas e exportação em PDF",
    ],
    fullStack:
      "Python / Flask / Supabase / PostgreSQL / Jinja / HTML / CSS / JavaScript / ReportLab / Gunicorn",
    id: "classflow",
    images: [
      {
        alt: "Landing page real do ClassFlow em tema escuro",
        caption: "Landing page da versão analisada",
        height: 1000,
        src: "/images/classflow-landing.png",
        width: 1440,
      },
      {
        alt: "Dashboard demonstrativo real do ClassFlow com tarefas e indicadores",
        caption: "Dashboard com dados demonstrativos",
        height: 1100,
        src: "/images/classflow-demo.png",
        width: 1440,
      },
    ],
    links: [
      {
        href: "https://itspmr.github.io/ClassFlow/",
        label: "Ver case técnico",
      },
    ],
    name: "ClassFlow",
    number: "01",
    status: "Case técnico público",
    statusDetail:
      "Código privado. O case apresenta capturas reais da versão analisada; o deploy Flask não está ativo no momento.",
    story: [
      {
        label: "Problema",
        text: "Provas, trabalhos, imagens e prazos costumam ficar espalhados entre cadernos, mensagens e ferramentas que não conversam entre si.",
      },
      {
        label: "Solução",
        text: "Uma aplicação web que centraliza a rotina acadêmica, revela o que exige atenção e transforma tarefas em uma visão clara de progresso.",
      },
      {
        label: "Desenvolvimento",
        text: "O projeto aplica autenticação, CRUD, regras de negócio, isolamento com RLS, armazenamento de imagens e geração de PDF em uma aplicação Flask renderizada no servidor.",
      },
    ],
    summary:
      "Organização acadêmica que reúne matérias, tarefas e prazos em uma visão única — construída para substituir a dispersão por clareza.",
    type: "Organização acadêmica · Case público",
  },
  {
    cardStack: ["Next.js", "TypeScript", "Supabase"],
    evidence: [
      {
        detail: "Mesas individuais ou em dupla",
        label: "Partidas",
        value: "1×1 e 2×2",
      },
      {
        detail: "Ações processadas no servidor",
        label: "Sincronia",
        value: "Estado autoritativo",
      },
      {
        detail: "Continuidade entre sessões",
        label: "Experiência",
        value: "PWA com retomada",
      },
    ],
    features: [
      "Supabase Realtime e RLS",
      "Motor de regras em TypeScript puro",
      "Suíte de testes unitários e E2E",
      "PWA com retomada de partida",
    ],
    fullStack:
      "Next.js / TypeScript / Supabase / Three.js / Vitest / Playwright",
    id: "pmr-truco",
    images: [
      {
        alt: "Mesa de partida real do PMR Truco com cartas e placar",
        caption: "Partida em ambiente de teste",
        height: 900,
        src: "/images/pmr-truco-game.png",
        width: 1280,
      },
    ],
    links: [
      {
        href: "https://pmr-truco.vercel.app",
        label: "Abrir projeto",
      },
    ],
    name: "PMR Truco",
    number: "02",
    status: "Demo pública",
    statusDetail:
      "A demonstração está disponível publicamente. O código-fonte do projeto permanece privado.",
    story: [
      {
        label: "Problema",
        text: "Uma partida online de cartas precisa manter a mesa sincronizada sem revelar as mãos privadas ou permitir que clientes diferentes decidam regras conflitantes.",
      },
      {
        label: "Solução",
        text: "Um Truco Paulista em tempo real para partidas 1×1 e 2×2, com separação entre estado público e mãos privadas e processamento central das ações.",
      },
      {
        label: "Desenvolvimento",
        text: "O motor de regras em TypeScript puro trabalha com Supabase Realtime e RLS, enquanto testes unitários e E2E validam o fluxo e a PWA permite retomar a partida.",
      },
    ],
    summary:
      "Truco Paulista em tempo real com estado público, mãos privadas e uma mesa sincronizada por um servidor autoritativo.",
    type: "Multiplayer · Demo pública",
  },
  {
    cardStack: ["React", "TypeScript", "Supabase"],
    evidence: [
      {
        detail: "Ações sensíveis pedem aprovação",
        label: "Controle",
        value: "Fluxos confirmados",
      },
      {
        detail: "Tentativas sem duplicação",
        label: "Agenda",
        value: "Execução idempotente",
      },
      {
        detail: "Lógica próxima dos dados",
        label: "Backend",
        value: "Edge Functions",
      },
    ],
    features: [
      "Fluxos protegidos por confirmação",
      "Agendador com idempotência e tentativas",
      "Supabase Edge Functions",
      "Testes com Vitest e Playwright",
    ],
    fullStack: "React / TypeScript / Vite / Supabase / PWA / Edge Functions",
    id: "pmr-assist",
    images: [
      {
        alt: "Interface real do modo demonstrativo local do PMR Assist",
        caption: "Versão analisada em modo demonstração",
        height: 1100,
        src: "/images/pmr-assist-assistant.png",
        width: 1440,
      },
    ],
    links: [
      {
        href: "https://pmr-assist.vercel.app",
        label: "Abrir aplicação (login)",
      },
    ],
    name: "PMR Assist",
    number: "03",
    status: "Protótipo avançado",
    statusDetail:
      "Código privado. A aplicação exige login e as integrações externas seguem em validação.",
    story: [
      {
        label: "Problema",
        text: "Tarefas, agenda, rotinas e lembretes perdem valor quando ficam dispersos ou quando uma automação executa ações importantes sem confirmação.",
      },
      {
        label: "Solução",
        text: "Um sistema pessoal que reúne a organização do dia e um assistente em português baseado em ferramentas estruturadas.",
      },
      {
        label: "Desenvolvimento",
        text: "Fluxos de confirmação protegem ações sensíveis, o agendador usa idempotência e tentativas, e Edge Functions concentram as rotinas de backend validadas com Vitest e Playwright.",
      },
    ],
    summary:
      "Sistema pessoal para organizar tarefas, agenda, rotinas e lembretes com um assistente baseado em ferramentas estruturadas.",
    type: "PWA · Protótipo avançado",
  },
] as const satisfies readonly Project[];
