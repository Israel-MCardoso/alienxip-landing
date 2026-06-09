import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

export function OrbitalSectorIndicator() {
  const { scrollY } = useScroll();
  const [sector, setSector] = useState("001");
  const [heroEnd, setHeroEnd] = useState(0);

  useEffect(() => {
    const getDocumentTop = (element: HTMLElement) => element.getBoundingClientRect().top + window.scrollY;

    const updateHeroEnd = () => {
      const hero = document.querySelector<HTMLElement>(".hero-shell");
      setHeroEnd(hero ? getDocumentTop(hero) + hero.offsetHeight : window.innerHeight);
    };

    const updateSector = () => {
      const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-orbital-sector]"));
      const viewportAnchor = window.scrollY + window.innerHeight * 0.48;
      const active = sections.reduce<HTMLElement | null>((current, section) => {
        if (getDocumentTop(section) <= viewportAnchor) return section;
        return current;
      }, sections[0] ?? null);

      setSector(active?.dataset.orbitalSector ?? "001");
    };

    const handleUpdate = () => {
      updateHeroEnd();
      updateSector();
    };

    handleUpdate();
    window.addEventListener("scroll", updateSector, { passive: true });
    window.addEventListener("resize", handleUpdate);
    window.addEventListener("load", handleUpdate);

    return () => {
      window.removeEventListener("scroll", updateSector);
      window.removeEventListener("resize", handleUpdate);
      window.removeEventListener("load", handleUpdate);
    };
  }, []);

  useEffect(() => {
    document.body.dataset.activeSector = sector;
  }, [sector]);

  const revealStart = heroEnd > 0 ? Math.max(0, heroEnd - window.innerHeight * 0.58) : 0;
  const opacity = useTransform(scrollY, heroEnd > 0 ? [revealStart, heroEnd] : [0, 1], heroEnd > 0 ? [0, 1] : [0, 0], {
    clamp: true,
  });

  return (
    <motion.div className="orbital-sector-indicator" style={{ opacity }} aria-hidden="true">
      <motion.span key={sector} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
        SETOR ORBITAL {sector}
      </motion.span>
      <i />
    </motion.div>
  );
}
