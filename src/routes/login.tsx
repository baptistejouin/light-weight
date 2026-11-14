import { useSubmission } from "@solidjs/router";
import { Show } from "solid-js";
import { validateAndLogin } from "@/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Login() {
  const loggingIn = useSubmission(validateAndLogin);

  return (
    <form action={validateAndLogin} method="post" class="flex flex-col gap-2">
      <Input name="username" label="Username" />
      <Input name="password" label="Password" type="password" />
      <Button type="submit">Login</Button>
      <Show when={loggingIn.result}>
        <p class="text-red-400" role="alert" id="error-message">
          {loggingIn.result?.message || ""}
        </p>
      </Show>
    </form>
  );
}
