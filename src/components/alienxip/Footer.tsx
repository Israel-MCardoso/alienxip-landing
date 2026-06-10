import { useRef } from "react";
import { ScrambleText } from "../ui/ScrambleText";
import { TextHoverEffect } from "../ui/TextHoverEffect";
import logoImage from "../../assets/alienxip-liquid-glass-logo.webp";

interface FooterLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  text: string;
}

function FooterLink({ text, href, className, ...props }: FooterLinkProps) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  return (
    <a ref={linkRef} href={href} className={className} {...props}>
      <ScrambleText text={text} triggerRef={linkRef} />
    </a>
  );
}

export function Footer() {
  return (
    <footer className="alienxip-footer" id="contato">
      <div className="alienxip-footer-effect-wrap">
        <TextHoverEffect text="ALIENXIP" />
      </div>
      
      <div className="alienxip-footer-content">
        <div className="alienxip-footer-grid">
          <div className="alienxip-footer-brand">
            <img src={logoImage} alt="Alienxip Logo" className="alienxip-footer-logo" />
            <p className="alienxip-footer-description">
              Sua operação pronta para sair da órbita comum. Engenharia de software, design e inovação de ponta.
            </p>
          </div>
          
          <div className="alienxip-footer-links">
            <h4>Navegação</h4>
            <ul>
              <li><FooterLink href="#top" text="Início" /></li>
              <li><FooterLink href="#sobre" text="Sobre" /></li>
              <li><FooterLink href="#diagnostico" text="Diagnóstico" /></li>
            </ul>
          </div>
          
          <div className="alienxip-footer-links">
            <h4>Siga-nos</h4>
            <ul>
              <li><FooterLink href="https://twitter.com/alienxip" target="_blank" rel="noopener noreferrer" text="Twitter" /></li>
              <li><FooterLink href="https://linkedin.com/company/alienxip" target="_blank" rel="noopener noreferrer" text="LinkedIn" /></li>
              <li><FooterLink href="https://github.com/alienxip" target="_blank" rel="noopener noreferrer" text="GitHub" /></li>
            </ul>
          </div>
          
          <div className="alienxip-footer-links">
            <h4>Contato</h4>
            <ul>
              <li><FooterLink href="mailto:contato@alienxip.com" className="alienxip-footer-email" text="contato@alienxip.com" /></li>
              <li><span>Resposta em até 24h</span></li>
              <li><span>Operação Confidencial</span></li>
            </ul>
          </div>
        </div>
        
        <div className="alienxip-footer-bottom">
          <p>© {new Date().getFullYear()} ALIENXIP. Todos os direitos reservados.</p>
          <p className="alienxip-footer-tagline">Iniciando novas eras.</p>
        </div>
      </div>
    </footer>
  );
}
