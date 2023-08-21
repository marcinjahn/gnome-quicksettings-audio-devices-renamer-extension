import { ObservableMap } from "./observable-map";

// Real Jest tests suite will be added in the future... maybe

let map = new Map<number, string>();
map.set(1, "one");
map.set(2, "two");

let observableMap = ObservableMap.fromNativeMap(map);
observableMap.subscribe(() => {
  console.log("NEW");
});

console.log("testing get: " + observableMap.get(1));
console.log("testing has: " + observableMap.has(1));

console.log("testing forof");
for (const [id, value] of observableMap) {
  console.log(id + " " + value);
}

console.log("testing set");
observableMap.set(3, "three");
