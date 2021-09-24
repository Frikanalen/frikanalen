import { BrregAddress } from "./fetchBrregData";

export const formatAddress = (address: BrregAddress) => {
  return address.adresse.join("\n") + "\n" + `${address.postnummer} ${address.poststed}`;
};
