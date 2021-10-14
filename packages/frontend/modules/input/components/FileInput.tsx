import { GenericButton } from "modules/ui/components/GenericButton";
import { useRef } from "react";

export type FileInputProps = {
  label: string;
  accept?: string;
  multiple?: boolean;
  onChange?: (files: File[]) => void;
};

export function FileInput(props: FileInputProps) {
  const { label, accept, multiple, onChange } = props;
  const ref = useRef<HTMLInputElement>(null);

  const handleFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.currentTarget;
    if (!files || !onChange) return;

    onChange([...files]);
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();

    const { current: input } = ref;
    if (!input) return;

    input.value = "";
    input.click();
  };

  return (
    <>
      <GenericButton variant="primary" label={label} onClick={handleClick} />
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        ref={ref}
        hidden
        style={{ display: "none" }}
        onChange={handleFiles}
      />
    </>
  );
}
