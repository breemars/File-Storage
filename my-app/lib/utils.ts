export { cn } from "cn";

//for passing large payloads, need to do this
export const parseStringify = (value: unknown) => {
  return JSON.parse(JSON.stringify(value));
};
