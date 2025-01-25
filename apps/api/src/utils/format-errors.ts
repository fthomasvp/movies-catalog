import { ZodError } from "zod";

export const formatZodError = (error: ZodError) => {
  const [issue] = error.issues;
  const code = issue.code.replace(/_/g, " ");
  const message = issue.message.toLowerCase();
  const path = issue.path.join(".");

  if (issue.code === "invalid_type") {
    return `${code}: expected '${issue.expected}' but got '${issue.received}' on the '${path}' property`;
  }

  if (path) {
    return `${code}: ${message} on the '${path}' property`;
  }

  return `${code}: ${message}`;
};
