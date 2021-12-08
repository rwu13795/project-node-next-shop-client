// while in "edidMode", capitalize the category name so that it will match the value
// in the category arrays and show the correct value in the selection

import { inputNames } from "../enums-types/input-names";
import { InputValues } from "./input-error-check";

export const capitalize = (cat: string | number | undefined) => {
  if (cat !== undefined) {
    return cat.toString().charAt(0).toUpperCase() + cat.toString().slice(1);
  }
  return;
};

export const capitalizeAddress = (address: InputValues): InputValues => {
  const capAddress = { ...address };
  for (let [k, v] of Object.entries(address)) {
    switch (k) {
      case inputNames.address_1:
      case inputNames.address_2:
      case inputNames.first_name:
      case inputNames.last_name:
      case inputNames.city:
        let capValue = capitalize(v);
        if (capValue) {
          capAddress[k] = capValue;
        }
        break;
      default:
        break;
    }
  }
  return capAddress;
};
