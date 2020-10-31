import axios from "axios";
import Cookies from "js-cookie";
import configs from "../configs";

export async function APIGET(endpoint) {
  let requestHeaders;
  const token = Cookies.get("token");

  if (token) {
    requestHeaders = {
      Authorization: `Token ${token}`,
      "Content-Type": "application/json",
    };
  } else {
    requestHeaders = {
      "Content-Type": "application/json",
    };
  }

  const res = await axios.get(configs.api + endpoint, {
    headers: requestHeaders,
  });
  return res.data;
}

export async function APIPOST(endpoint, data) {
  const res = await axios.post(configs.api + endpoint, data, {
    headers: {
      Authorization: `Token ${Cookies.get("token")}`,
      "Content-Type": "application/json",
    },
  });
  return res.data;
}
