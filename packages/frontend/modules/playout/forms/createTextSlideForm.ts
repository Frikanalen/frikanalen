import { ObservableForm } from "modules/form/classes/ObservableForm";
import { string } from "modules/form/fields/string";
import { Manager } from "modules/state/types";

export const createTextSlideForm = (manager: Manager) => {
  return new ObservableForm(
    {
      heading: string(),
      text: string(),
    },
    manager
  );
};

export type TextSlideForm = ReturnType<typeof createTextSlideForm>;
