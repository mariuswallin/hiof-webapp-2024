export const validateForm = (values: Record<string, unknown>): boolean => {
  const keys = Object.keys(values).map((key) => key.toLowerCase());
  if (keys?.length === 0) return false;
  if (["email", "password"].some((key) => !keys.includes(key))) return false;
  return (
    Object.entries(values)
      .map(([key, value]) => {
        if (key === "email") {
          const email = value as string;
          return (
            email.includes("@") &&
            email.length > 8 &&
            email.indexOf(".") > 0 &&
            email.includes("no")
          );
        }
        if (key === "password") {
          return (value as string).length > 4;
        }
        return true;
      })
      .filter((val) => !val).length === 0
  );
};
