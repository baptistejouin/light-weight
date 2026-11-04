import { BuiltInIcon } from "@/components/pages/library/built-in-icon";

interface StepLabelProps {
  index: number;
  name: string;
  exerciseType: string;
}

export function StepLabel(props: StepLabelProps) {
  return (
    <>
      {props.index + 1}.{" "}
      <BuiltInIcon exerciseType={props.exerciseType} class="size-3.5" />
      {props.name}
    </>
  );
}
