import { ObservableForm } from "modules/form/classes/ObservableForm";
import { string } from "modules/form/fields/string";
import { Manager } from "modules/state/types";

export const createNewOrganizationForm = (manager: Manager) => {
  return new ObservableForm(
    {
      name: string().required().min(3),
      postalAddress: string().required(),
      streetAddress: string().required(),
      homepage: string().required().url(),
      orgnr: string().min(9).max(9).required(),
    },
    manager
  );
};

export type NewOrganizationForm = ReturnType<typeof createNewOrganizationForm>;
