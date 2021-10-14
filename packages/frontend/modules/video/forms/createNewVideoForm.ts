import { ObservableForm } from "modules/form/classes/ObservableForm";
import { Option, select } from "modules/form/fields/select";
import { string } from "modules/form/fields/string";
import { Manager } from "modules/state/types";
import { VideoCategoryData } from "../types";

export const createNewVideoForm = (categories: VideoCategoryData[], manager: Manager) => {
  const categoryOptions: Option[] = categories.map((c) => ({
    // FIXME: API expects a string (name) rather than an id
    value: c.name,
    label: c.name,
  }));

  return new ObservableForm(
    {
      name: string().required(),
      header: string(),
      description: string(),
      categories: select({
        options: categoryOptions,
        multiple: true,
        value: [],
      }).required(),
    },
    manager
  );
};

export type NewVideoForm = ReturnType<typeof createNewVideoForm>;
