import { StatusType } from "modules/ui/components/StatusLine";
import { useState } from "react";
import { FieldsType, ObservableForm } from "../classes/ObservableForm";

export const useFormSubmission = <F extends FieldsType>(
  form: ObservableForm<F>,
  submit: (serialized: ObservableForm<F>["serialized"]) => Promise<void>,
  handleError: (e: any) => [StatusType, string] = () => ["error", "Noe gikk galt, prøv igjen senere"]
) => {
  const [status, setStatus] = useState<[StatusType, string]>(["info", ""]);

  const handleSubmit = async () => {
    const valid = await form.ensureValidity();

    if (valid) {
      setStatus(["info", "Vent litt..."]);

      try {
        await submit(form.serialized);
      } catch (e) {
        setStatus(handleError(e));
      }
    } else {
      setStatus(["error", "Kontroller at skjemaet er gyldig"]);
    }
  };

  return [status, handleSubmit] as const;
};
