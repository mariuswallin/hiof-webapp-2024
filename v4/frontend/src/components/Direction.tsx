import { useState, type PropsWithChildren } from "react";

type DirectionProps = PropsWithChildren;

export default function Direction(props: DirectionProps) {
  const { children } = props;
  const [direction, setDirection] = useState<"vertical" | "horizontal">(
    (window.localStorage.getItem("direction") as "vertical" | "horizontal") ??
      "horizontal"
  );

  const handleDirectionChange = (direction: "horizontal" | "vertical") => {
    setDirection(direction);
    window.localStorage.setItem("direction", direction);
  };

  return (
    <section className={`layout ${direction}`}>
      <aside className="direction">
        <div className="field">
          <label htmlFor="horizontal">Horisontal</label>
          <input
            type="radio"
            id="horizontal"
            name="direction"
            checked={direction === "horizontal"}
            onChange={() => handleDirectionChange("horizontal")}
          />
        </div>
        <div className="field">
          <label htmlFor="vertical">Vertikal</label>
          <input
            type="radio"
            id="vertical"
            name="direction"
            value="vertical"
            checked={direction === "vertical"}
            onChange={() => handleDirectionChange("vertical")}
          />
        </div>
      </aside>
      {children}
    </section>
  );
}
