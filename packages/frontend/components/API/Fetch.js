import axios from "axios";
import configs from "../configs";

export async function APIGET(endpoint, token) {
  let requestHeaders;

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

export async function APIPOST(endpoint, data, token) {
  const res = await axios.post(configs.api + endpoint, data, {
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": "application/json",
    },
  });
  return res.data;
}
