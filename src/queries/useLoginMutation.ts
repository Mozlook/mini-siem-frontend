import { useMutation } from "@tanstack/react-query";
import { login } from "../api/siem";
import { setToken } from "../lib/token";

export function useLoginMutation() {
  return useMutation({
    mutationFn: (password: string) => login(password),
    onSuccess: (data) => {
      setToken(data.access_token);
    },
  });
}
