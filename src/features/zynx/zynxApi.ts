export const ZYNX_MAX_MESSAGE_LENGTH = 2000;

export interface ZynxApiReply {
  reply: string;
}

export interface ZynxApiError {
  error: {
    code: string;
    message: string;
  };
}

export function getZynxErrorMessage(value: unknown) {
  if (
    typeof value === "object" &&
    value !== null &&
    "error" in value &&
    typeof value.error === "object" &&
    value.error !== null &&
    "message" in value.error &&
    typeof value.error.message === "string"
  ) {
    return value.error.message;
  }
  return "ZYNX could not complete that request. Please try again.";
}
