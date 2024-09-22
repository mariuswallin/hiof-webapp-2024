type DirectionProps = {
  direction: "horizontal" | "vertical";
  setDirection: (direction: "horizontal" | "vertical") => void;
};

export default function Direction({ direction, setDirection }: DirectionProps) {
  return (
    <aside className="direction">
      <div className="field">
        <label htmlFor="horizontal">Horisontal</label>
        <input
          type="radio"
          id="horizontal"
          name="direction"
          checked={direction === "horizontal"}
          onChange={() => setDirection("horizontal")}
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
          onChange={() => setDirection("vertical")}
        />
      </div>
    </aside>
  );
}
