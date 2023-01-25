import App from "./app.tsx";
import { hydrate } from "solid-js/web";
import { Router } from "@solidjs/router";

hydrate(() => <Router><App /></Router>, document.getElementById("root"));
