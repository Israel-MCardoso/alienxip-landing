import { useState, useRef, useEffect } from "react";
import { ScrambleText } from "../ui/ScrambleText";
import { CircularGallery, GalleryItem } from "../ui/CircularGallery";
import { DeferredParticleGalaxy } from "../ui/DeferredParticleGalaxy";
import clubeBoaVontadeLogo from "../../assets/clients/clube-atletico-boa-vontade-clean.webp";
import familiaMineiraLogo from "../../assets/clients/familia-mineira-clean.webp";
import faculdadeCidadeLogo from "../../assets/clients/faculdade-da-cidade-clean.webp";
import fidesLogo from "../../assets/clients/fides7-clean.webp";
import martronicsLogo from "../../assets/clients/martronics-clean.webp";
import visionCarLogo from "../../assets/clients/vision-car-clean.webp";
import institutoTransformandoLogo from "../../assets/clients/instituto-transformando-historia-clean.webp";
import sistemaEducacionalInspireLogo from "../../assets/clients/sistema-educacional-inspire-clean.webp";

type PortfolioProject = GalleryItem & {
  operation: string;
  name: string;
};

const portfolioProjects: PortfolioProject[] = [
  {
    operation: "115",
    name: "Sistema Educacional Inspire",
    common: "OPERAÇÃO 115",
    binomial: "Sistema Educacional Inspire",
    photo: {
      url: sistemaEducacionalInspireLogo,
      text: "Identidade do projeto Sistema Educacional Inspire",
      by: "Zoho CRM & Automação",
    },
  },
  {
    operation: "077",
    name: "Faculdade da Cidade",
    common: "OPERAÇÃO 077",
    binomial: "Faculdade da Cidade",
    photo: {
      url: faculdadeCidadeLogo,
      text: "Identidade do projeto Faculdade da Cidade",
      by: "HubSpot CRM & Automação",
    },
  },
  {
    operation: "054",
    name: "Clube Atlético Boa Vontade",
    common: "OPERAÇÃO 054",
    binomial: "Clube Atlético Boa Vontade",
    photo: {
      url: clubeBoaVontadeLogo,
      text: "Identidade do projeto Clube Atlético Boa Vontade",
      by: "App Mobile & CRM",
    },
  },
  {
    operation: "099",
    name: "VisionCar",
    common: "OPERAÇÃO 099",
    binomial: "VisionCar",
    photo: {
      url: visionCarLogo,
      text: "Identidade do projeto VisionCar",
      by: "ERP & Gestão de Clientes",
    },
  },
  {
    operation: "033",
    name: "Instituto Transformando História",
    common: "OPERAÇÃO 033",
    binomial: "Instituto Transformando História",
    photo: {
      url: institutoTransformandoLogo,
      text: "Identidade do projeto Instituto Transformando História",
      by: "Plataforma Social & CRM",
    },
  },
  {
    operation: "088",
    name: "FIDSET Engenharia",
    common: "OPERAÇÃO 088",
    binomial: "FIDSET Engenharia",
    photo: {
      url: fidesLogo,
      text: "Identidade do projeto FIDSET Engenharia",
      by: "Landing Page & Branding",
    },
  },
  {
    operation: "021",
    name: "Família Mineira",
    common: "OPERAÇÃO 021",
    binomial: "Família Mineira",
    photo: {
      url: familiaMineiraLogo,
      text: "Identidade do projeto Família Mineira",
      by: "Omnichannel & CRM Hub",
    },
  },
  {
    operation: "108",
    name: "Martronics",
    common: "OPERAÇÃO 108",
    binomial: "Martronics",
    photo: {
      url: martronicsLogo,
      text: "Identidade do projeto Martronics",
      by: "ERP Customizado & Indústria 4.0",
    },
  },
];

interface PortfolioProjectButtonProps {
  project: PortfolioProject;
  isActive: boolean;
  onClick: () => void;
}

function PortfolioProjectButton({ project, isActive, onClick }: PortfolioProjectButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null);
  return (
    <button
      ref={btnRef}
      type="button"
      className={isActive ? "is-active" : ""}
      onClick={onClick}
    >
      <strong>
        <ScrambleText text={`OPERAÇÃO ${project.operation}`} triggerRef={btnRef} />
      </strong>
      <span>
        <ScrambleText text={project.name} triggerRef={btnRef} />
      </span>
    </button>
  );
}

export function MissionPortfolio() {
  const [activeIndex, setActiveIndex] = useState(2);
  const [activeSignal, setActiveSignal] = useState(0);
  const [radius, setRadius] = useState(360);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width <= 480) {
        setRadius(130);
      } else if (width <= 768) {
        setRadius(160);
      } else if (width <= 1024) {
        setRadius(240);
      } else {
        setRadius(360);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const selectProject = (index: number) => {
    setActiveIndex(index);
    setActiveSignal((current) => current + 1);
  };

  return (
    <section
      className="mission-portfolio"
      id="cases"
      aria-labelledby="mission-portfolio-title"
      data-orbital-sector="006"
    >
      <DeferredParticleGalaxy
        className="mission-portfolio-galaxy"
        particleCount={11500}
        particleSize={0.026}
        rotationSpeed={0.0007}
        spiralArms={4}
        colors={["#7568ff", "#c076ff", "#f7f2ff"]}
        mouseInfluence={0.16}
        spread={2.7}
        density={0.78}
        glow={70}
        centerConcentration={0.48}
        pulsateSpeed={0.45}
        cameraMovement={false}
        enableZoom={false}
        enableDrag={false}
        enableTouch={false}
      />
      <div className="mission-portfolio-copy">
        <p className="mission-portfolio-label">MISSÃO 006</p>
        <h2 id="mission-portfolio-title">
          <ScrambleText text="Algumas operações" scrambleOnScroll />
          <br />
          <ScrambleText text="continuam " scrambleOnScroll />
          <span>
            <ScrambleText text="existindo" scrambleOnScroll />
          </span>
          <br />
          <ScrambleText text="mesmo após a missão." scrambleOnScroll />
        </h2>
        <p>
          Projetos.
          <br />
          Infraestrutura.
          <br />
          Sistemas.
          <br />
          Produtos.
        </p>
      </div>

      <div className="mission-portfolio-gallery-wrap">
        <CircularGallery
          items={portfolioProjects}
          activeIndex={activeIndex}
          onActiveIndexChange={setActiveIndex}
          activeSignal={activeSignal}
          radius={radius}
        />
      </div>

      <aside className="mission-portfolio-selector" aria-label="Arquivo de operações">
        <p>
          ARQUIVO DE OPERAÇÕES <span>// {portfolioProjects.length} REGISTROS</span>
        </p>
        <div className="mission-portfolio-project-list">
          {portfolioProjects.map((project, index) => (
            <PortfolioProjectButton
              key={project.operation}
              project={project}
              isActive={index === activeIndex}
              onClick={() => selectProject(index)}
            />
          ))}
        </div>
      </aside>
    </section>
  );
}
