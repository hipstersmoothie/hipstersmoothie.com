import differenceInDays from "date-fns/differenceInDays";
import Tippy from "@tippyjs/react";
import makeClass from "clsx";

import { DateProperties, EditProperties, LeafObject } from "../utils/leaves";

const plantStates = {
  seedling: "🌱",
  budding: "🌿",
  evergreen: "🌳",
} as const;

type PlantState = keyof typeof plantStates;

const determinePlantHealth = ({
  creationDate,
  edits,
}: DateProperties & EditProperties): PlantState => {
  const daysOld = differenceInDays(new Date(), new Date(creationDate));

  if (edits > 5 || (edits > 2 && daysOld >= 30)) {
    return "evergreen";
  }

  if (edits > 3 || (edits > 1 && daysOld >= 14)) {
    return "budding";
  }

  return "seedling";
};

interface PlantHealthProps extends React.ComponentProps<"div"> {
  leaf: LeafObject;
  showTooltip?: boolean;
  className?: string;
}

export const PlantHealth = ({
  leaf,
  showTooltip,
  ...props
}: PlantHealthProps) => {
  const health = determinePlantHealth(leaf);

  if (showTooltip === false) {
    return (
      <div
        {...props}
        className={makeClass("capitalize space-x-1", props.className)}
      >
        <span>{health}</span>
        <span {...props}>{plantStates[health]}</span>
      </div>
    );
  }

  return (
    <Tippy content={health} className="tippy-box capitalize">
      <span {...props}>{plantStates[health]}</span>
    </Tippy>
  );
};
