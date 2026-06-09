import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MissionContinuity } from "./MissionContinuity";
import { MissionArchitecture } from "./MissionArchitecture";
import { MissionSolutions } from "./MissionSolutions";

export function MissionStackContainer() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      const mm = gsap.matchMedia();

      mm.add("(min-width: 1025px)", () => {
        // 1. Pin Mission 001 at top top until Mission 002 reaches top top
        // This makes Mission 002 slide up on top of Mission 001
        ScrollTrigger.create({
          trigger: ".mission-001",
          start: "top top",
          endTrigger: ".mission-002",
          end: "top top",
          pin: true,
          pinSpacing: false,
          onEnter: (self) => {
            const trigger = self as any;
            if (trigger.spacer) {
              gsap.set(trigger.spacer, { zIndex: 1 });
            }
          },
          onEnterBack: (self) => {
            const trigger = self as any;
            if (trigger.spacer) {
              gsap.set(trigger.spacer, { zIndex: 1 });
            }
          }
        });
      });

      return () => {
        mm.revert();
      };
    },
    { scope: containerRef }
  );

  return (
    <div className="mission-scroll-manager" ref={containerRef}>
      <MissionContinuity />
      <MissionArchitecture />
      <MissionSolutions />
    </div>
  );
}
