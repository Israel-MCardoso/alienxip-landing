import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type SectorStop = {
  top: number;
  sector: string;
};

export function OrbitalSectorIndicator() {
  const { scrollY } = useScroll();
  const [sector, setSector] = useState("001");
  const [heroEnd, setHeroEnd] = useState(0);
  const sectorRef = useRef("001");
  const sectorStopsRef = useRef<SectorStop[]>([]);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const getDocumentTop = (element: HTMLElement) => element.getBoundingClientRect().top + window.scrollY;

    const updateHeroEnd = () => {
      const hero = document.querySelector<HTMLElement>(".hero-shell");
      setHeroEnd(hero ? getDocumentTop(hero) + hero.offsetHeight : window.innerHeight);
    };

    const updateSectorStops = () => {
      const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-orbital-sector]"));
      sectorStopsRef.current = sections.map((section) => ({
        top: getDocumentTop(section),
        sector: section.dataset.orbitalSector ?? "001",
      }));
    };

    const updateSector = () => {
      const viewportAnchor = window.scrollY + window.innerHeight * 0.48;
      const active = sectorStopsRef.current.reduce<SectorStop | null>((current, section) => {
        if (section.top <= viewportAnchor) return section;
        return current;
      }, sectorStopsRef.current[0] ?? null);
      const nextSector = active?.sector ?? "001";

      if (nextSector !== sectorRef.current) {
        sectorRef.current = nextSector;
        setSector(nextSector);
      }
    };

    const scheduleSectorUpdate = () => {
      if (rafRef.current !== null) {
        return;
      }

      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;
        updateSector();
      });
    };

    const handleUpdate = () => {
      updateSectorStops();
      updateHeroEnd();
      updateSector();
    };

    handleUpdate();
    window.addEventListener("scroll", scheduleSectorUpdate, { passive: true });
    window.addEventListener("resize", handleUpdate, { passive: true });
    window.addEventListener("load", handleUpdate);

    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
      window.removeEventListener("scroll", scheduleSectorUpdate);
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
