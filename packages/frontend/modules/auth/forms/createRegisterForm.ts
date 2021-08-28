import { ObservableForm } from "modules/form/classes/ObservableForm";
import { string } from "modules/form/fields/string";
import { Manager } from "modules/state/types";

export const createRegisterForm = (manager: Manager) => {
  return new ObservableForm(
    {
      firstName: string().required("Du må oppgi et fornavn"),
      lastName: string().required("Du må oppgi et etternavn"),
      email: string().required("Du må oppgi en e-post addresse"),
      password: string()
        .required("Du må oppgi et passord")
        .min(6, "Passord må være minst 6 tegn")
        .max(64, "Imponerende, men ditt passord må være maksimalt 64 tegn"),
    },
    manager
  );
};

export type RegisterForm = ReturnType<typeof createRegisterForm>;
