import clubeBoaVontadeLogo from "../../assets/clients/clube-atletico-boa-vontade-clean.png";
import familiaMineiraLogo from "../../assets/clients/familia-mineira-clean.png";
import faculdadeCidadeLogo from "../../assets/clients/faculdade-da-cidade-clean.png";
import fides7Logo from "../../assets/clients/fides7-clean.png";
import institutoTransformandoLogo from "../../assets/clients/instituto-transformando-historia-clean.png";
import martronicsLogo from "../../assets/clients/martronics-clean.png";
import visionCarLogo from "../../assets/clients/vision-car-clean.png";

const clients = [
  {
    name: "Clube Atletico Boa Vontade",
    logo: clubeBoaVontadeLogo,
    alt: "Logo do Clube Atletico Boa Vontade",
  },
  {
    name: "Familia Mineira",
    logo: familiaMineiraLogo,
    alt: "Logo da Familia Mineira",
  },
  {
    name: "Faculdade da Cidade",
    logo: faculdadeCidadeLogo,
    alt: "Logo da Faculdade da Cidade",
  },
  {
    name: "FIDES7",
    logo: fides7Logo,
    alt: "Logo da FIDES7 Engenharia e Solucoes",
  },
  {
    name: "Instituto Transformando Historia",
    logo: institutoTransformandoLogo,
    alt: "Logo do Instituto Transformando Historia",
  },
  {
    name: "Martronics",
    logo: martronicsLogo,
    alt: "Logo da Martronics",
  },
  {
    name: "Vision Car",
    logo: visionCarLogo,
    alt: "Logo da Vision Car",
  },
];

export function ClientsMarquee() {
  return (
    <section className="clients-marquee-section" aria-labelledby="clients-marquee-title">
      <div className="clients-marquee-shell">
        <div className="clients-marquee-copy">
          <h2 id="clients-marquee-title">Marcas que já embarcaram com a ALIENXIP</h2>
        </div>

        <div
          className="clients-marquee-viewport"
          aria-label="Empresas que ja trabalharam com a ALIENXIP"
        >
          <div className="clients-marquee-track">
            {[0, 1].map((groupIndex) => (
              <div
                className="clients-marquee-group"
                aria-hidden={groupIndex === 1}
                key={groupIndex}
              >
                {clients.map((client) => (
                  <div className="client-logo-item" key={`${groupIndex}-${client.name}`}>
                    <img
                      src={client.logo}
                      alt={groupIndex === 0 ? client.alt : ""}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
