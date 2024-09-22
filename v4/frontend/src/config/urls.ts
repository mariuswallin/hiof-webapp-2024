const baseUrl = import.meta.env.baseUrl ?? "http://localhost:3999";
const endpointsV1 = {
  habits: `${baseUrl}/v1/habits`,
  streaks: `${baseUrl}/v1/streaks`,
};

export { baseUrl, endpointsV1 as endpoints };
