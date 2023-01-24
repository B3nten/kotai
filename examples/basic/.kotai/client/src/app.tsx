import { template as _$template } from "solid-js/web";
import { delegateEvents as _$delegateEvents } from "solid-js/web";
import { getNextElement as _$getNextElement } from "solid-js/web";
import { runHydrationEvents as _$runHydrationEvents } from "solid-js/web";
import { getNextMarker as _$getNextMarker } from "solid-js/web";
import { insert as _$insert } from "solid-js/web";
const _tmpl$ = /*#__PURE__*/_$template(`<div><h1>Count: <!#><!/></h1><button>Increment!!</button></div>`, 8);
import { createSignal } from "solid-js";
export default function App() {
  const [count, setCount] = createSignal(0);
  return (() => {
    const _el$ = _$getNextElement(_tmpl$),
      _el$2 = _el$.firstChild,
      _el$3 = _el$2.firstChild,
      _el$4 = _el$3.nextSibling,
      [_el$5, _co$] = _$getNextMarker(_el$4.nextSibling),
      _el$6 = _el$2.nextSibling;
    _$insert(_el$2, count, _el$5, _co$);
    _el$6.$$click = () => setCount(count() + 1);
    _$runHydrationEvents();
    return _el$;
  })();
}
_$delegateEvents(["click"]);