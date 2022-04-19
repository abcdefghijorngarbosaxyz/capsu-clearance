import axios from "axios";

export const getPeriod = async () => {
  const { data } = await axios.get("/api/getperiod");
  console.log(data);
};
