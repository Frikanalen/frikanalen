import axios from "axios";

export type BrregAddress = {
  adresse: string[];
  kommune: string;
  postnummer: string;
  poststed: string;
};

export type BrregData = {
  navn: string;
  postadresse: BrregAddress;
  forretningsadresse: BrregAddress;
  hjemmeside: string;
};

export const fetchBrregData = async (organization: string) => {
  try {
    const { data } = await axios.get<BrregData>(`https://data.brreg.no/enhetsregisteret/api/enheter/${organization}`);
    return data;
  } catch {
    return;
  }
};
