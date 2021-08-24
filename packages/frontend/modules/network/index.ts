import axios from "axios";
import configs from "components/configs";

export const api = axios.create({
  baseURL: configs.api,
});
