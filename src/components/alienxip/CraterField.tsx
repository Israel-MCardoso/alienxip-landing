import type { CSSProperties } from "react";
import crater01 from "../../assets/craters/crater-01.webp";
import crater02 from "../../assets/craters/crater-02.webp";
import crater03 from "../../assets/craters/crater-03.webp";
import crater04 from "../../assets/craters/crater-04.webp";
import crater05 from "../../assets/craters/crater-05.webp";

const craterImages = [crater01, crater02, crater03, crater04, crater05];

const craterLayout = [
  [0, -5, 18, 20, -10],
  [1, 88, 36, 14, 12],
  [2, 47, 82, 6, -8],
  [4, 8, 124, 13, 16],
  [3, 92, 166, 10, -14],
  [2, 25, 218, 7, 9],
  [1, 73, 268, 13, -18],
  [0, -8, 324, 24, 8],
  [4, 86, 386, 16, -6],
  [3, 40, 442, 10, 18],
  [2, 13, 504, 7, -22],
  [1, 65, 558, 13, 10],
  [4, 4, 622, 18, -13],
  [0, 74, 684, 21, 18],
  [3, 45, 742, 9, -10],
  [2, 90, 806, 7, 24],
  [1, 19, 862, 12, -18],
  [4, 58, 928, 14, 7],
  [3, 95, 986, 10, -12],
  [0, -6, 1048, 19, 14],
] as const;

export function CraterField() {
  return (
    <div className="crater-field" aria-hidden="true">
      {craterLayout.map(([imageIndex, x, y, width, rotation], index) => (
        <img
          className="crater-field-rock"
          src={craterImages[imageIndex]}
          alt=""
          key={`${imageIndex}-${index}`}
          loading="lazy"
          decoding="async"
          style={
            {
              "--crater-x": `${x}vw`,
              "--crater-y": `${y}vh`,
              "--crater-width": `${width}vw`,
              "--crater-rotation": `${rotation}deg`,
              "--crater-delay": `${index * -1.35}s`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
