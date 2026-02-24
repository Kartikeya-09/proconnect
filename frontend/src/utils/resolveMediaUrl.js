import { baseURL } from "@/config";

export const resolveMediaUrl = (path) => {
  if (!path || typeof path !== "string") return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${baseURL}/${path}`;
};
