import type { ExerciseType } from "@drizzle/schema";
import { type Component, type JSX, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";
import { TimerIcon } from "@/components/icons";

type IconProps = JSX.IntrinsicElements["svg"];

const iconsByType: Partial<Record<ExerciseType, Component<IconProps>>> = {
  rest: TimerIcon,
};

interface BuiltInIconProps extends IconProps {
  exerciseType: ExerciseType;
}

export function BuiltInIcon(props: BuiltInIconProps) {
  const [local, others] = splitProps(props, ["exerciseType"]);

  return (
    <Dynamic
      component={iconsByType[local.exerciseType]}
      aria-hidden="true"
      {...others}
    />
  );
}
