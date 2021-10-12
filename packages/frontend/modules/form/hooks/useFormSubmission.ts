import { ARTIFICIAL_DELAY } from "modules/core/constants";
import { wait } from "modules/lang/async";
import { StatusType } from "modules/ui/components/StatusLine";
import { useStatusLine } from "modules/ui/hooks/useStatusLine";
import { useState } from "react";
import { FieldsType, ObservableForm } from "../classes/ObservableForm";

export const useFormSubmission = <F extends FieldsType>(
  form: ObservableForm<F>,
  submit: (serialized: ObservableForm<F>["serialized"]) => Promise<[StatusType, string] | void>,
  handleError: (e: any) => [StatusType, string] = () => ["error", "Noe gikk galt, prøv igjen senere"]
) => {
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useStatusLine();

  const handleSubmit = async () => {
    if (submitting) return;

    const valid = await form.ensureValidity();

    if (valid) {
      setSubmitting(true);
      setStatus("loading", "Vent litt...");

      try {
        const [, result] = await Promise.all([wait(ARTIFICIAL_DELAY), submit(form.serialized)]);

        if (result) {
          const [type, message] = result;
          setStatus(type, message);
        } else {
          setStatus("success", "Skjemaet ble sendt");
        }
      } catch (e) {
        const [type, message] = handleError(e);
        setStatus(type, message);
      }
    } else {
      setStatus("error", "Kontroller at skjemaet er gyldig");
    }

    setSubmitting(false);
  };

  return [status, handleSubmit] as const;
};
