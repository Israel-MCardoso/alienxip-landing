import { useRef, useState, useEffect } from "react";
import { ScrambleText } from "../ui/ScrambleText";
import { getDiagnosticUrl } from "../../config/diagnosticUrl";

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

function NavLink({ href, text, onClick }: { href: string; text: string; onClick?: () => void }) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  return (
    <a ref={linkRef} href={href} onClick={onClick}>
      <ScrambleText text={text} triggerRef={linkRef} />
    </a>
  );
}

export function Navbar({ showMark = false }: NavbarProps) {
  const brandRef = useRef<HTMLAnchorElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const diagnosticUrl = getDiagnosticUrl();

  // Close menu on pressing ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className={`navbar ${isOpen ? "is-open" : ""}`}>
      <a 
        ref={brandRef} 
        className="brand" 
        href="#top" 
        aria-label="ALIENXIP início"
        onClick={closeMenu}
      >
        {showMark && <AlienxipMark />}
        <ScrambleText text="ALIENXIP" triggerRef={brandRef} />
      </a>

      {/* Hamburger menu button */}
      <button
        className={`menu-toggle ${isOpen ? "is-open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
        aria-expanded={isOpen}
        type="button"
      >
        <span className="menu-toggle-bar" />
        <span className="menu-toggle-bar" />
        <span className="menu-toggle-bar" />
      </button>

      <nav className={`nav-links ${isOpen ? "is-active" : ""}`} aria-label="Navegação principal">
        {navItems.map((item) => {
          const isDiag =
            item === "DiagnÃ³stico" ||
            item === "Diagnóstico" ||
            item.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === "diagnostico";

          const href = isDiag
            ? diagnosticUrl
            : `#${item.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`;

          return (
            <NavLink
              href={href}
              key={item}
              text={item}
              onClick={closeMenu}
            />
          );
        })}
      </nav>
    </header>
  );
}

