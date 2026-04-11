import { type RouteSectionProps, useSubmission } from "@solidjs/router";
import { Show } from "solid-js";
import { validateAndLogin } from "~/api";
import Layout from "~/components/layout";

export default function Login(props: RouteSectionProps) {
  const loggingIn = useSubmission(validateAndLogin);

  return (
    <Layout>
      <h1 class="text-2xl">Login</h1>
      <form action={validateAndLogin} method="post" class="flex gap-2 flex-col">
        <input
          type="hidden"
          name="redirectTo"
          value={props.params.redirectTo ?? "/"}
        />
        <fieldset class="border">
          <legend>Login or Register?</legend>
          <label>
            <input type="radio" name="loginType" value="login" checked={true} />{" "}
            Login
          </label>
          <label>
            <input type="radio" name="loginType" value="register" /> Register
          </label>
        </fieldset>
        <div class="border">
          <label for="username-input">Username</label>
          <input name="username" placeholder="kody" autocomplete="username" />
        </div>
        <div class="border">
          <label for="password-input">Password</label>
          <input
            name="password"
            type="password"
            placeholder="twixrox"
            autocomplete="current-password"
          />
        </div>
        <button type="submit">Login</button>
        <Show when={loggingIn.result}>
          <p class="text-red-400" role="alert" id="error-message">
            {loggingIn.result!.message}
          </p>
        </Show>
      </form>
    </Layout>
  );
}
