import { createComponent as _$createComponent } from "solid-js/web";
import App from "./app.tsx";
import { hydrate } from "solid-js/web";
import { Router } from "@solidjs/router";
hydrate(() => _$createComponent(Router, {
  get children() {
    return _$createComponent(App, {});
  }
}), document.getElementById("root"));