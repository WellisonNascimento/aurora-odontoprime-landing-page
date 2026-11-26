import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  isValidBrazilianPhone,
  isValidEmail,
  isValidInterest,
  isValidName,
  sanitizeInput,
  submitAppointmentRequest,
} from "../script.js";

type Treatment = {
  title: string;
  interest: string;
  description: string;
  image: string;
  imageAlt: string;
};

const treatments: Treatment[] = [
  {
    title: "Implantes dentários",
    interest: "implantes",
    description:
      "Reabilitação funcional e estética, planejada para devolver segurança ao mastigar e sorrir.",
    image:
      "https://images.pexels.com/photos/32852534/pexels-photo-32852534.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1100&h=850",
    imageAlt: "Dentista apresenta um modelo odontológico durante uma consulta.",
  },
  {
    title: "Lentes em resina ou porcelana",
    interest: "lentes",
    description:
      "Harmonia do sorriso com indicação cuidadosa, respeitando a estrutura e a naturalidade de cada dente.",
    image:
      "https://images.pexels.com/photos/6627575/pexels-photo-6627575.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1100&h=850",
    imageAlt: "Profissional confere a tonalidade dos dentes com uma escala de cor.",
  },
  {
    title: "Invisalign® e alinhadores",
    interest: "alinhadores",
    description:
      "Ortodontia com planejamento digital. A indicação e disponibilidade dependem de avaliação individual.",
    image:
      "https://images.pexels.com/photos/28407749/pexels-photo-28407749.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1100&h=850",
    imageAlt: "Alinhadores transparentes apoiados nas mãos de uma profissional.",
  },
];

const interestOptions = [
  { value: "avaliacao", label: "Avaliação inicial" },
  { value: "implantes", label: "Implantes dentários" },
  { value: "lentes", label: "Lentes em resina ou porcelana" },
  { value: "alinhadores", label: "Alinhadores invisíveis" },
  { value: "outro", label: "Outro assunto" },
];

const stories = [
  {
    quote:
      "Eu tinha receio de voltar ao dentista. A equipe explicou cada etapa com calma e respeitou meu tempo. Saí da primeira conversa muito mais tranquila.",
    context: "Acolhimento e avaliação",
  },
  {
    quote:
      "Entendi as possibilidades antes de decidir. O planejamento foi claro, sem pressa e pensado para o que fazia sentido para mim.",
    context: "Planejamento do sorriso",
  },
  {
    quote:
      "Fui recebida com atenção do começo ao fim. Poder conversar e tirar minhas dúvidas mudou completamente a experiência.",
    context: "Experiência na clínica",
  },
];

const faqs = [
  {
    question: "Como funciona a primeira avaliação?",
    answer:
      "A conversa começa pela sua expectativa e pelo que é importante para você. A equipe avalia seu caso, explica as possibilidades e apresenta os próximos passos com clareza, sem compromisso de iniciar um tratamento.",
  },
  {
    question: "O formulário já confirma uma consulta?",
    answer:
      "Não. Esta página demonstra um fluxo de pré-agendamento: nenhum dado é transmitido e nenhum horário é reservado. Em uma implantação real, a equipe confirmaria disponibilidade por um canal seguro.",
  },
  {
    question: "Lentes de contato dental são indicadas para todo mundo?",
    answer:
      "Não. A indicação depende de avaliação individual, saúde bucal e objetivos de cada pessoa. A conversa clínica deve explicar benefícios, limites e alternativas antes de qualquer decisão.",
  },
  {
    question: "Alinhadores transparentes podem ser uma opção para mim?",
    answer:
      "Em alguns casos, sim. A necessidade de movimentação dentária, a saúde bucal e seus hábitos são avaliados para definir a abordagem mais adequada, incluindo ou não alinhadores.",
  },
  {
    question: "O resultado do comparador é uma promessa de resultado?",
    answer:
      "Não. As imagens do comparador são ilustrativas e não representam um paciente real. Cada sorriso tem características próprias e qualquer resultado depende de avaliação e planejamento individual.",
  },
];

type Particle = {
  x: number;
  y: number;
  depth: number;
  vx: number;
  vy: number;
};

function ArrowIcon({ diagonal = false }: { diagonal?: boolean }) {
  return diagonal ? (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
      <path d="M5 15 15 5M6 5h9v9" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ) : (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
      <path d="M3.5 10h12m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function ToothMark() {
  return (
    <svg className="tooth-mark" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path
        d="M14.3 8.4c3.9 0 6.2 2.1 9.7 2.1s5.8-2.1 9.7-2.1c5.4 0 8.2 4.3 7.5 10.2-.7 5.8-3.5 12.3-5.9 17.3-1.4 2.9-3 4.8-4.8 4.8-2.5 0-3-4.2-4.2-8.4-.6-2.1-1.2-3.8-2.3-3.8s-1.7 1.7-2.3 3.8c-1.2 4.2-1.7 8.4-4.2 8.4-1.8 0-3.4-1.9-4.8-4.8-2.4-5-5.2-11.5-5.9-17.3-.7-5.9 2.1-10.2 7.5-10.2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M24 14v11" stroke="currentColor" strokeWidth="1.2" opacity=".7" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3.5 19 6v5.7c0 4.4-2.8 7.4-7 9.3-4.2-1.9-7-4.9-7-9.3V6l7-2.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="m9 12.1 2 2 4-4.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function PrecisionCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !context) return;

    const particles: Particle[] = [];
    const pointer = { x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 };
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let frameId = 0;
    let pixelRatio = 1;

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      width = Math.max(bounds.width, 1);
      height = Math.max(bounds.height, 1);
      pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      const count = Math.min(64, Math.max(26, Math.round((width * height) / 21000)));
      particles.length = 0;

      for (let index = 0; index < count; index += 1) {
        particles.push({
          x: Math.random(),
          y: Math.random(),
          depth: Math.random(),
          vx: (Math.random() - 0.5) * 0.00011,
          vy: (Math.random() - 0.5) * 0.0001,
        });
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      pointer.targetX = event.clientX / Math.max(window.innerWidth, 1);
      pointer.targetY = event.clientY / Math.max(window.innerHeight, 1);
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);
      pointer.x += (pointer.targetX - pointer.x) * 0.025;
      pointer.y += (pointer.targetY - pointer.y) * 0.025;

      const points = particles.map((particle) => {
        if (!reducedMotion) {
          particle.x += particle.vx;
          particle.y += particle.vy;
          if (particle.x < -0.04) particle.x = 1.04;
          if (particle.x > 1.04) particle.x = -0.04;
          if (particle.y < -0.04) particle.y = 1.04;
          if (particle.y > 1.04) particle.y = -0.04;
        }

        return {
          x: particle.x * width + (pointer.x - 0.5) * 18 * particle.depth,
          y: particle.y * height + (pointer.y - 0.5) * 12 * particle.depth,
          depth: particle.depth,
        };
      });

      for (let first = 0; first < points.length; first += 1) {
        const point = points[first];
        const radius = 0.8 + point.depth * 1.5;
        context.beginPath();
        context.arc(point.x, point.y, radius, 0, Math.PI * 2);
        context.fillStyle = point.depth > 0.68 ? "rgba(221, 190, 132, .48)" : "rgba(204, 226, 216, .26)";
        context.fill();

        for (let second = first + 1; second < points.length; second += 1) {
          const other = points[second];
          const distance = Math.hypot(point.x - other.x, point.y - other.y);
          if (distance > 118) continue;
          context.beginPath();
          context.moveTo(point.x, point.y);
          context.lineTo(other.x, other.y);
          context.strokeStyle = `rgba(214, 203, 171, ${(1 - distance / 118) * 0.12})`;
          context.lineWidth = 0.55;
          context.stroke();
        }
      }

      if (!reducedMotion) frameId = window.requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-network" aria-hidden="true" />;
}

function useScrollReveal() {
  useEffect(() => {
    document.documentElement.classList.add("has-js");
    const items = document.querySelectorAll<HTMLElement>("[data-reveal]");

    if (!("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -45px 0px" },
    );

    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);
}

function App() {
  useScrollReveal();

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [privacyVisible, setPrivacyVisible] = useState(true);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedInterest, setSelectedInterest] = useState("avaliacao");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [split, setSplit] = useState(50);
  const [activeStory, setActiveStory] = useState(0);
  const [openFaq, setOpenFaq] = useState(-1);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const consentRef = useRef<HTMLInputElement>(null);
  const statusRef = useRef<HTMLParagraphElement>(null);
  const submitTimesRef = useRef<number[]>([]);

  const openBooking = (interest = "avaliacao") => {
    setSelectedInterest(isValidInterest(interest) ? interest : "avaliacao");
    setBookingOpen(true);
    setMobileNavOpen(false);
  };

  const closeBooking = () => {
    if (dialogRef.current?.open) dialogRef.current.close();
    else setBookingOpen(false);
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!bookingOpen || !dialog) return;

    const previouslyFocused = document.activeElement;
    if (!dialog.open) dialog.showModal();
    document.body.classList.add("dialog-open");
    statusRef.current && (statusRef.current.textContent = "");
    window.requestAnimationFrame(() => nameRef.current?.focus());

    return () => {
      document.body.classList.remove("dialog-open");
      if (dialog.open) dialog.close();
      if (previouslyFocused instanceof HTMLElement && previouslyFocused.isConnected) {
        previouslyFocused.focus({ preventScroll: true });
      }
    };
  }, [bookingOpen]);

  const setFormStatus = (message: string) => {
    if (statusRef.current) statusRef.current.textContent = message;
  };

  const handleDialogClose = () => {
    formRef.current?.reset();
    setIsSubmitting(false);
    if (statusRef.current) statusRef.current.textContent = "";
    setBookingOpen(false);
  };

  const handleBookingSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting || !formRef.current) return;

    const now = Date.now();
    const recentAttempts = submitTimesRef.current.filter((time) => now - time < 60_000);
    const lastAttempt = recentAttempts[recentAttempts.length - 1] ?? 0;

    if (recentAttempts.length >= 3 || (lastAttempt > 0 && now - lastAttempt < 1_200)) {
      submitTimesRef.current = recentAttempts;
      setFormStatus("Aguarde um instante antes de tentar novamente.");
      return;
    }

    recentAttempts.push(now);
    submitTimesRef.current = recentAttempts;

    const form = formRef.current;
    const formData = new FormData(form);
    const value = (key: string) => {
      const fieldValue = formData.get(key);
      return typeof fieldValue === "string" ? sanitizeInput(fieldValue) : "";
    };

    const nameInput = form.elements.namedItem("name") as HTMLInputElement;
    const phoneInput = form.elements.namedItem("phone") as HTMLInputElement;
    const emailInput = form.elements.namedItem("email") as HTMLInputElement;
    const interestInput = form.elements.namedItem("interest") as HTMLSelectElement;
    const consentInput = form.elements.namedItem("consent") as HTMLInputElement;
    const honeypot = value("website");

    const lead = {
      name: value("name"),
      phone: value("phone"),
      email: value("email"),
      interest: value("interest"),
    };

    nameInput.value = lead.name;
    phoneInput.value = lead.phone;
    emailInput.value = lead.email;
    interestInput.value = lead.interest;

    const validName = isValidName(lead.name);
    const validPhone = isValidBrazilianPhone(lead.phone);
    const validEmail = isValidEmail(lead.email);
    const validInterest = isValidInterest(lead.interest);

    nameInput.setAttribute("aria-invalid", String(!validName));
    phoneInput.setAttribute("aria-invalid", String(!validPhone));
    emailInput.setAttribute("aria-invalid", String(!validEmail));
    interestInput.setAttribute("aria-invalid", String(!validInterest));

    if (honeypot) {
      setFormStatus("Não foi possível validar o pedido. Confira os dados e tente novamente.");
      return;
    }

    const firstInvalid = !validName
      ? nameInput
      : !validPhone
        ? phoneInput
        : !validEmail
          ? emailInput
          : !validInterest
            ? interestInput
            : null;

    if (firstInvalid) {
      setFormStatus("Confira nome, telefone e e-mail para continuar.");
      firstInvalid.focus();
      return;
    }

    if (!consentInput.checked) {
      setFormStatus("Para continuar, marque o consentimento de uso dos dados para contato.");
      consentRef.current?.focus();
      return;
    }

    setIsSubmitting(true);
    setFormStatus("Validando seu pedido com segurança...");

    try {
      await submitAppointmentRequest(lead);
      form.reset();
      setFormStatus(
        "Simulação concluída. Nenhum dado foi transmitido ou salvo. Em produção, conecte o serviço seguro descrito no README.",
      );
    } catch {
      setFormStatus("Não foi possível concluir a simulação. Tente novamente em instantes.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCardPointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    event.currentTarget.style.setProperty("--rotate-x", `${(0.5 - x) * 5}deg`);
    event.currentTarget.style.setProperty("--rotate-y", `${(y - 0.5) * 4}deg`);
  };

  const resetCardTilt = (event: ReactPointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty("--rotate-x", "0deg");
    event.currentTarget.style.setProperty("--rotate-y", "0deg");
  };

  const moveStory = (direction: number) => {
    setActiveStory((current) => (current + direction + stories.length) % stories.length);
  };

  return (
    <>
      <a className="skip-link" href="#conteudo">
        Ir para o conteúdo
      </a>

      <section className="hero" id="inicio" aria-labelledby="hero-title">
        <img
          className="hero-image"
          src="./images/aurora-hero.jpg"
          alt="Paciente conversa sorrindo com uma dentista em uma clínica acolhedora."
          fetchPriority="high"
        />
        <div className="hero-wash" aria-hidden="true" />
        <PrecisionCanvas />

        <div className="hero-shell">
          <header className="site-header">
            <a className="brand-lockup" href="#inicio" aria-label="Aurora OdontoPrime, início">
              <ToothMark />
              <span className="brand-lockup__type">
                <span>Aurora</span>
                <strong>OdontoPrime</strong>
              </span>
            </a>

            <button
              className={`menu-toggle${mobileNavOpen ? " is-open" : ""}`}
              type="button"
              aria-expanded={mobileNavOpen}
              aria-controls="primary-navigation"
              aria-label={mobileNavOpen ? "Fechar menu" : "Abrir menu"}
              onClick={() => setMobileNavOpen((open) => !open)}
            >
              <span />
              <span />
            </button>

            <nav
              className={`primary-nav${mobileNavOpen ? " is-open" : ""}`}
              id="primary-navigation"
              aria-label="Navegação principal"
            >
              <a href="#especialidades" onClick={() => setMobileNavOpen(false)}>
                Especialidades
              </a>
              <a href="#experiencia" onClick={() => setMobileNavOpen(false)}>
                Nossa essência
              </a>
              <a href="#historias" onClick={() => setMobileNavOpen(false)}>
                Histórias
              </a>
              <a href="#duvidas" onClick={() => setMobileNavOpen(false)}>
                Dúvidas
              </a>
              <button className="header-cta" type="button" onClick={() => openBooking()}>
                Pré-agendar avaliação <ArrowIcon diagonal />
              </button>
            </nav>
          </header>

          <div className="hero-copy">
            <p className="hero-wordmark">
              <span>Aurora</span>
              <i>OdontoPrime</i>
            </p>
            <h1 id="hero-title">
              Seu melhor sorriso começa com <em>um cuidado diferente.</em>
            </h1>
            <p className="hero-intro">
              Odontologia de alta precisão, com escuta atenta e um plano pensado para você.
            </p>
            <div className="hero-actions">
              <button className="button button--gold" type="button" onClick={() => openBooking()}>
                Agendar uma avaliação <ArrowIcon />
              </button>
              <a className="text-link text-link--light" href="#especialidades">
                Conheça a Aurora <ArrowIcon diagonal />
              </a>
            </div>
          </div>

          <a className="scroll-cue" href="#conteudo" aria-label="Role para conhecer a clínica">
            <span className="scroll-cue__line" />
            <span>Role para conhecer</span>
          </a>
        </div>
      </section>

      {privacyVisible && (
        <aside className="privacy-notice" aria-label="Aviso de privacidade">
          <div className="privacy-notice__inner">
            <ShieldIcon />
            <p>
              Privacidade em primeiro lugar: esta demonstração não usa cookies e não salva dados pessoais no navegador.
            </p>
            <a href="https://www.gov.br/anpd/pt-br" target="_blank" rel="noopener noreferrer">
              Saiba sobre a LGPD <ArrowIcon diagonal />
            </a>
            <button
              type="button"
              className="privacy-dismiss"
              aria-label="Fechar aviso de privacidade"
              onClick={() => setPrivacyVisible(false)}
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
        </aside>
      )}

      <main id="conteudo">
        <section className="manifesto section-wrap" aria-labelledby="manifesto-title">
          <div className="manifesto-main" data-reveal>
            <p className="eyebrow"><span>01</span> Cuidado de ponta a ponta</p>
            <h2 id="manifesto-title">
              Odontologia precisa.<br />
              <em>Conversa sem pressa.</em>
            </h2>
            <p className="manifesto-copy">
              Tecnologia só faz sentido quando deixa o cuidado mais humano. Aqui, cada escolha começa com escuta, informação clara e respeito ao seu tempo.
            </p>
          </div>
          <div className="manifesto-aside" data-reveal>
            <span className="manifesto-ornament" aria-hidden="true">A</span>
            <blockquote>“Cuidar de um sorriso é também cuidar de tudo o que ele representa.”</blockquote>
            <p>Uma experiência tranquila, do primeiro encontro ao acompanhamento.</p>
          </div>
        </section>

        <section className="specialties section-wrap" id="especialidades" aria-labelledby="specialties-title">
          <div className="section-heading" data-reveal>
            <div>
              <p className="eyebrow"><span>02</span> Especialidades</p>
              <h2 id="specialties-title">Seu sorriso,<br /><em>em boas mãos.</em></h2>
            </div>
            <p className="section-heading__note">
              Planos feitos para a sua saúde, seus objetivos e a naturalidade do seu sorriso.
            </p>
          </div>

          <div className="specialty-grid">
            {treatments.map((treatment, index) => (
              <article
                className="specialty-card reveal"
                data-reveal
                key={treatment.interest}
                onPointerMove={handleCardPointerMove}
                onPointerLeave={resetCardTilt}
              >
                <button
                  className="specialty-card__button"
                  type="button"
                  onClick={() => openBooking(treatment.interest)}
                  aria-label={`Conversar sobre ${treatment.title}`}
                >
                  <span className="specialty-card__image">
                    <img src={treatment.image} alt={treatment.imageAlt} loading="lazy" />
                    <span className="specialty-card__index">0{index + 1}</span>
                  </span>
                  <span className="specialty-card__body">
                    <span className="specialty-card__title-row">
                      <span className="specialty-card__title">{treatment.title}</span>
                      <span className="specialty-card__arrow"><ArrowIcon diagonal /></span>
                    </span>
                    <span className="specialty-card__description">{treatment.description}</span>
                    <span className="specialty-card__link">Conversar com a equipe</span>
                  </span>
                </button>
              </article>
            ))}
          </div>
          <p className="specialties-footnote" data-reveal>
            Invisalign® é uma marca de terceiros. A indicação de alinhadores depende de avaliação profissional.
          </p>
        </section>

        <section className="experience" id="experiencia" aria-labelledby="experience-title">
          <div className="experience-copy" data-reveal>
            <p className="eyebrow eyebrow--light"><span>03</span> A experiência Aurora</p>
            <h2 id="experience-title">Um plano que faz sentido <em>para você.</em></h2>
            <p className="experience-intro">
              Do primeiro papo ao cuidado contínuo, você entende cada etapa e participa de cada decisão.
            </p>
            <ol className="experience-steps">
              <li><span>01</span><strong>Escuta com tempo</strong><small>Entendemos o que você busca e o que importa na sua rotina.</small></li>
              <li><span>02</span><strong>Plano explicado</strong><small>Apresentamos possibilidades, etapas e alternativas com clareza.</small></li>
              <li><span>03</span><strong>Acompanhamento próximo</strong><small>Seguimos ao seu lado durante o cuidado e em cada retorno.</small></li>
            </ol>
          </div>
          <div className="experience-image" aria-hidden="true">
            <img
              src="https://images.pexels.com/photos/5355723/pexels-photo-5355723.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1500&h=1500"
              alt=""
              loading="lazy"
            />
          </div>
          <div className="experience-grain" aria-hidden="true" />
        </section>

        <section className="transformation section-wrap" aria-labelledby="transformation-title">
          <div className="transformation-copy" data-reveal>
            <p className="eyebrow"><span>04</span> Um novo olhar</p>
            <h2 id="transformation-title">A mudança começa <em>na conversa.</em></h2>
            <p>
              Explore o comparador e veja uma demonstração visual de harmonização do sorriso. Cada caso é único e exige avaliação individual.
            </p>
            <div className="illustrative-note">
              <span className="illustrative-note__mark" aria-hidden="true">i</span>
              <span>Imagens geradas para demonstração. Não representam paciente real nem garantem resultados.</span>
            </div>
          </div>

          <div className="comparison reveal" data-reveal>
            <div className="comparison-frame" style={{ "--split": `${split}%` } as CSSProperties}>
              <img
                className="comparison-image comparison-image--before"
                src="./images/smile-before.jpg"
                alt="Demonstração ilustrativa do sorriso antes do tratamento."
                loading="lazy"
              />
              <img
                className="comparison-image comparison-image--after"
                src="./images/smile-after.jpg"
                alt="Demonstração ilustrativa do sorriso após uma harmonização."
                loading="lazy"
              />
              <span className="comparison-label comparison-label--before">Antes</span>
              <span className="comparison-label comparison-label--after">Depois</span>
              <span className="comparison-divider" aria-hidden="true">
                <span className="comparison-divider__handle"><ArrowIcon /></span>
              </span>
              <input
                className="comparison-range"
                type="range"
                min="12"
                max="88"
                value={split}
                onChange={(event) => setSplit(Number(event.currentTarget.value))}
                aria-label="Deslize para comparar as imagens de antes e depois"
                aria-valuetext={`${split}% do comparador mostra a imagem depois`}
              />
            </div>
            <p className="comparison-caption">Arraste o controle para comparar as duas imagens</p>
          </div>
        </section>

        <section className="stories section-wrap" id="historias" aria-labelledby="stories-title">
          <div className="stories-heading" data-reveal>
            <p className="eyebrow"><span>05</span> Experiências de cuidado</p>
            <h2 id="stories-title">Acolher também <em>transforma.</em></h2>
            <p>Um bom atendimento começa com atenção, conversa aberta e respeito às escolhas de cada pessoa.</p>
          </div>

          <div
            className="story-carousel"
            data-reveal
            role="region"
            aria-label="Prévia do carrossel de relatos demonstrativos"
            aria-roledescription="carrossel"
          >
            <div className="story-carousel__topline">
              <span className="story-kicker">PRÉVIA EDITORIAL</span>
              <span className="story-counter">0{activeStory + 1} <i>/</i> 0{stories.length}</span>
            </div>
            <div className="story-content" key={activeStory} aria-live="polite">
              <span className="quote-mark" aria-hidden="true">“</span>
              <blockquote>{stories[activeStory].quote}</blockquote>
              <div className="story-attribution">
                <span className="story-attribution__line" />
                <span>{stories[activeStory].context}</span>
                <span className="story-demo-label">Relato demonstrativo</span>
              </div>
            </div>
            <div className="story-carousel__controls">
              <p>
                Textos ilustrativos para demonstrar o carrossel. Avaliações reais só devem ser publicadas com autorização.
              </p>
              <div className="story-arrows">
                <button type="button" onClick={() => moveStory(-1)} aria-label="Ver relato anterior">
                  <ArrowIcon />
                </button>
                <button type="button" onClick={() => moveStory(1)} aria-label="Ver próximo relato">
                  <ArrowIcon />
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="faq section-wrap" id="duvidas" aria-labelledby="faq-title">
          <div className="faq-intro" data-reveal>
            <p className="eyebrow"><span>06</span> Perguntas frequentes</p>
            <h2 id="faq-title">Tudo claro, <em>desde o início.</em></h2>
            <p>Se sua dúvida não estiver aqui, podemos conversar com calma na avaliação.</p>
            <button className="text-link" type="button" onClick={() => openBooking()}>
              Fale com a equipe <ArrowIcon diagonal />
            </button>
          </div>
          <div className="faq-list" data-reveal>
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              const answerId = `faq-answer-${index}`;
              return (
                <div className={`faq-item${isOpen ? " is-open" : ""}`} key={faq.question}>
                  <h3>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={answerId}
                      onClick={() => setOpenFaq(isOpen ? -1 : index)}
                    >
                      <span>{faq.question}</span>
                      <span className="faq-plus" aria-hidden="true" />
                    </button>
                  </h3>
                  <div className="faq-answer" id={answerId} hidden={!isOpen}>
                    <p>{faq.answer}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="final-cta" aria-labelledby="final-cta-title">
          <div className="final-cta__ornament" aria-hidden="true">A</div>
          <div className="final-cta__content" data-reveal>
            <p className="eyebrow eyebrow--light"><span>Seu próximo passo</span></p>
            <h2 id="final-cta-title">Um sorriso mais seu começa <em>com uma conversa.</em></h2>
            <p>Conte o que você procura. A gente começa escutando.</p>
            <button className="button button--gold" type="button" onClick={() => openBooking()}>
              Quero conversar <ArrowIcon />
            </button>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-main">
          <a className="brand-lockup brand-lockup--footer" href="#inicio" aria-label="Aurora OdontoPrime, voltar ao início">
            <ToothMark />
            <span className="brand-lockup__type">
              <span>Aurora</span>
              <strong>OdontoPrime</strong>
            </span>
          </a>
          <p>Precisão no cuidado.<br />Leveza em cada sorriso.</p>
          <button className="footer-contact" type="button" onClick={() => openBooking()}>
            Fale com nossa equipe <ArrowIcon diagonal />
          </button>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Aurora OdontoPrime</span>
          <span>Conteúdo informativo. Indicações dependem de avaliação profissional.</span>
          <a href="https://www.gov.br/anpd/pt-br" target="_blank" rel="noopener noreferrer">
            Privacidade e LGPD <ArrowIcon diagonal />
          </a>
        </div>
      </footer>

      <button className="floating-contact" type="button" onClick={() => openBooking()}>
        <ShieldIcon />
        <span>Contato seguro</span>
      </button>

      <dialog
        className="booking-dialog"
        ref={dialogRef}
        aria-labelledby="booking-title"
        onClose={handleDialogClose}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeBooking();
        }}
      >
        <div className="booking-panel">
          <div className="booking-intro">
            <button className="booking-close" type="button" onClick={closeBooking} aria-label="Fechar formulário">
              <span aria-hidden="true">×</span>
            </button>
            <ToothMark />
            <p className="eyebrow eyebrow--light"><span>Um primeiro passo</span></p>
            <h2 id="booking-title">Vamos conversar sobre <em>o seu sorriso.</em></h2>
            <p>Deixe seus dados para conhecer o fluxo de pré-agendamento da Aurora OdontoPrime.</p>
            <div className="booking-security"><ShieldIcon /><span>Seus dados permanecem apenas nesta sessão de demonstração.</span></div>
          </div>

          <div className="booking-form-wrap">
            <p className="booking-form-kicker">Pré-agendamento</p>
            <form ref={formRef} onSubmit={handleBookingSubmit} noValidate>
              <div className="honeypot" aria-hidden="true">
                <label htmlFor="website">Não preencha este campo</label>
                <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
              </div>

              <label className="form-field" htmlFor="name">
                <span>Nome completo</span>
                <input
                  ref={nameRef}
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="off"
                  maxLength={80}
                  required
                  placeholder="Ex.: Ana Souza"
                />
              </label>

              <div className="form-row">
                <label className="form-field" htmlFor="phone">
                  <span>Telefone com DDD</span>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="off"
                    maxLength={22}
                    required
                    placeholder="(31) 99999-9999"
                  />
                </label>
                <label className="form-field" htmlFor="email">
                  <span>E-mail</span>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="off"
                    maxLength={254}
                    required
                    placeholder="voce@email.com.br"
                  />
                </label>
              </div>

              <label className="form-field" htmlFor="interest">
                <span>Assunto de interesse</span>
                <select id="interest" name="interest" defaultValue={selectedInterest} key={selectedInterest} required>
                  {interestOptions.map((option) => (
                    <option value={option.value} key={option.value}>{option.label}</option>
                  ))}
                </select>
              </label>

              <label className="consent-field" htmlFor="consent">
                <input ref={consentRef} id="consent" name="consent" type="checkbox" required />
                <span>
                  Autorizo o uso destes dados somente para retorno sobre este pedido, conforme a LGPD.
                </span>
              </label>

              <p className="form-privacy-note">
                Não informe dados de saúde neste formulário. Esta demonstração não envia nem armazena informações.
              </p>

              <button className="button button--green form-submit" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Validando pedido..." : "Enviar pedido de contato"}
                <ArrowIcon />
              </button>
              <p className="form-status" ref={statusRef} role="status" aria-live="polite" />
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}

export default App;