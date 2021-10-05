import { ARTIFICIAL_DELAY } from "modules/core/constants";
import { wait } from "modules/lang/async";
import { StatusType } from "modules/ui/components/StatusLine";
import { useState } from "react";
import { FieldsType, ObservableForm } from "../classes/ObservableForm";

const statusTimeout = 5000;

export const useFormSubmission = <F extends FieldsType>(
  form: ObservableForm<F>,
  submit: (serialized: ObservableForm<F>["serialized"]) => Promise<[StatusType, string] | void>,
  handleError: (e: any) => [StatusType, string] = () => ["error", "Noe gikk galt, prøv igjen senere"]
) => {
  const [status, setStatus] = useState<[StatusType, string]>(["info", ""]);

  const handleSubmit = async () => {
    const valid = await form.ensureValidity();

    if (valid) {
      setStatus(["info", "Vent litt..."]);

      try {
        const [, result] = await Promise.all([wait(ARTIFICIAL_DELAY), submit(form.serialized)]);

        if (result) {
          setStatus(result);
        } else {
          setStatus(["success", "Skjemaet ble sendt"]);
        }

        await wait(statusTimeout);
        setStatus(["info", ""]);
      } catch (e) {
        setStatus(handleError(e));
        await wait(statusTimeout);
        setStatus(["info", ""]);
      }
    } else {
      setStatus(["error", "Kontroller at skjemaet er gyldig"]);
    }
  };

  return [status, handleSubmit] as const;
};
