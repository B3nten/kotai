import { createComponent as _$createComponent } from "solid-js/web";
import App from "./app.tsx";
import { Router } from "npm:@solidjs/router";
export default (() => _$createComponent(Router, {
  get children() {
    return _$createComponent(App, {});
  }
}));