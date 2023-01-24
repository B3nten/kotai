import { ssr as _$ssr } from "solid-js/web";
import { escape as _$escape } from "solid-js/web";
import { ssrHydrationKey as _$ssrHydrationKey } from "solid-js/web";
const _tmpl$ = ["<div", "><h1>Count: <!--#-->", "<!--/--></h1><button>Increment!!</button></div>"];
import { createSignal } from "solid-js";
export default function App() {
  const [count, setCount] = createSignal(0);
  return _$ssr(_tmpl$, _$ssrHydrationKey(), _$escape(count()));
}