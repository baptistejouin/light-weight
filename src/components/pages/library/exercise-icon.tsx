import type { ExerciseType } from "@drizzle/schema";
import { type Component, type JSX, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";
import {
  CardioIcon,
  FlexibilityIcon,
  RestIcon,
  WeightIcon,
} from "@/components/icons";

type IconProps = JSX.IntrinsicElements["svg"];

const iconsByType: Record<ExerciseType, Component<IconProps>> = {
  strength: WeightIcon,
  cardio: CardioIcon,
  flexibility: FlexibilityIcon,
  rest: RestIcon,
};

interface ExerciseIconProps extends IconProps {
  exerciseType: ExerciseType;
}

export function ExerciseIcon(props: ExerciseIconProps) {
  const [local, others] = splitProps(props, ["exerciseType"]);

  return (
    <Dynamic
      component={iconsByType[local.exerciseType]}
      aria-hidden="true"
      {...others}
    />
  );
}

interface ExerciseLabelProps {
  exercise: { name: string; type: ExerciseType };
}

export function ExerciseLabel(props: ExerciseLabelProps) {
  return (
    <span class="flex items-center gap-2">
      <ExerciseIcon
        exerciseType={props.exercise.type}
        class="size-4 shrink-0 text-primary"
      />
      {props.exercise.name}
    </span>
  );
}
