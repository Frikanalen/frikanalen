import { ButtonList } from "modules/ui/components/ButtonList";
import { GenericButton } from "modules/ui/components/GenericButton";
import { MixEffectsBusInput } from "../types";

export type ATEMControlsProps = {
  inputs: MixEffectsBusInput[];
  index: number;
  onChange: (index: number) => void;
};

export function ATEMControls(props: ATEMControlsProps) {
  const { inputs, index, onChange } = props;

  return (
    <ButtonList horizontal>
      {inputs.map((input) => (
        <GenericButton
          key={input.index}
          variant={index === input.index ? "primary" : "secondary"}
          color={index === input.index ? "danger" : "accent"}
          label={input.name}
          onClick={() => onChange(input.index)}
        />
      ))}
    </ButtonList>
  );
}
