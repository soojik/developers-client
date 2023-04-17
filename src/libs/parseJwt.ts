export const parseJwt = (token: string | null) => {
  if (token) return JSON.parse(window.atob(token.split(".")[1]));
};
