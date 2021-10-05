import { ObservableForm } from "modules/form/classes/ObservableForm";
import { string } from "modules/form/fields/string";
import { Manager } from "modules/state/types";
import { User } from "../schemas";

export const createProfileForm = (user: User, manager: Manager) => {
  return new ObservableForm(
    {
      firstName: string({
        value: user.firstName,
      }),
      lastName: string({
        value: user.lastName,
      }),
      phoneNumber: string({
        value: user.phoneNumber,
      }),
    },
    manager
  );
};

export type ProfileForm = ReturnType<typeof createProfileForm>;
