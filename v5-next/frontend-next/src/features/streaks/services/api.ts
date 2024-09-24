import { endpoints } from "@/config/urls";
import { ofetch } from "ofetch";

const url = endpoints.streaks;

const list = async () => {
  try {
    const streaks = await ofetch(url);
    return streaks?.data ?? [];
  } catch (error) {
    console.error(error);
  }
};

export default { list };
