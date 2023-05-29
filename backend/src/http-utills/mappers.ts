export function handleHTTPResponse(info: unknown) {
  return {
    data: info,
  };
}

export function handleHTTPError(message: string) {
  return {
    message,
  };
}
