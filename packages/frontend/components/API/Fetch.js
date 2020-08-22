import configs from "../../components/configs";
import useSWR from "swr";
import axios from "axios";
import Cookies from "js-cookie";

export async function APIGET(endpoint) {
  const res = await axios.get(configs.api + endpoint, {
    headers: {
      Authorization: "Token " + Cookies.get("token"),
      "Content-Type": "application/json",
    },
  });
  return res.data;
}

export async function APIPOST(endpoint, data) {
  const res = await axios.post(configs.api + endpoint, data, {
    headers: {
      Authorization: "Token " + Cookies.get("token"),
      "Content-Type": "application/json",
    },
  });
  return res.data;
}
