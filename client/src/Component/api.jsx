import axios from "axios";
const API = axios.create({
  baseURL: "https://backdressingvote.gpower-et.com",
  withCredentials: true,
});

export default API;
