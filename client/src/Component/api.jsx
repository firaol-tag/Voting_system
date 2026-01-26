import axios from "axios";

const API = axios.create({
  baseURL: "http://192.168.101.181:3270",
  withCredentials: true,
});

export default API;
