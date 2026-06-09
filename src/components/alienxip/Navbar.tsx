import { useRef } from "react";
import { ScrambleText } from "../ui/ScrambleText";

import logoMark from "../../assets/alienxip-logo-mark-purple.png";

const navItems = ["Soluções", "Cases", "Diagnóstico", "Sobre", "Contato"];

type NavbarProps = {
  showMark?: boolean;
};

function AlienxipMark() {
  return (
    <img src={logoMark} alt="" className="brand-mark" style={{ objectFit: "contain" }} />
  );
}

function NavLink({ href, text }: { href: string; text: string }) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  return (
    <a ref={linkRef} href={href}>
      <ScrambleText text={text} triggerRef={linkRef} />
    </a>
  );
}

export function Navbar({ showMark = false }: NavbarProps) {
  const brandRef = useRef<HTMLAnchorElement>(null);

  return (
    <header className="navbar">
      <a ref={brandRef} className="brand" href="#top" aria-label="ALIENXIP início">
        {showMark && <AlienxipMark />}
        <ScrambleText text="ALIENXIP" triggerRef={brandRef} />
      </a>

      <nav className="nav-links" aria-label="Navegação principal">
        {navItems.map((item) => (
          <NavLink href={`#${item.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`} key={item} text={item} />
        ))}
      </nav>
    </header>
  );
}

