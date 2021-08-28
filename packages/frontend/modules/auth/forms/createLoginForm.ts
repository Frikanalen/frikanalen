import { ObservableForm } from "modules/form/classes/ObservableForm";
import { string } from "modules/form/fields/string";
import { Manager } from "modules/state/types";

export const createLoginForm = (manager: Manager) => {
  return new ObservableForm(
    {
      email: string().required(),
      password: string()
        .required()
        .min(6, "Passord må være minst 6 tegn")
        .max(64, "Imponerende, men ditt passord må være maksimalt 64 tegn"),
    },
    manager
  );
};

export type LoginForm = ReturnType<typeof createLoginForm>;
