import { type RouteSectionProps, useSubmission } from "@solidjs/router";
import { Show } from "solid-js";
import { validateAndLogin } from "~/api";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

export default function Login(props: RouteSectionProps) {
  const loggingIn = useSubmission(validateAndLogin);

  return (
    <form action={validateAndLogin} method="post" class="flex gap-2 flex-col">
      <input
        type="hidden"
        name="redirectTo"
        value={props.params.redirectTo ?? "/"}
      />
      <Input name="username" />
      <Input name="password" />
      <Button type="submit">Login</Button>
      <Show when={loggingIn.result}>
        <p class="text-red-400" role="alert" id="error-message">
          {loggingIn.result?.message || ""}
        </p>
      </Show>
    </form>
  );
}
