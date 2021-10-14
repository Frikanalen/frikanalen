import { ObservableForm } from "modules/form/classes/ObservableForm";
import { Option, select } from "modules/form/fields/select";
import { string } from "modules/form/fields/string";
import { Manager } from "modules/state/types";
import { VideoCategoryData } from "../types";

export const createNewVideoForm = (categories: VideoCategoryData[], manager: Manager) => {
  const categoryOptions: Option[] = categories.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  return new ObservableForm(
    {
      name: string().required(),
      header: string(),
      description: string(),
      category: select({
        options: categoryOptions,
        value: [],
      }).required(),
    },
    manager
  );
};

export type NewVideoForm = ReturnType<typeof createNewVideoForm>;
