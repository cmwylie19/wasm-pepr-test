import {
  Log,
  a,
} from "pepr";
import { readFileSync } from "fs";

/**
 *  The HelloPepr Capability is an example capability to demonstrate some general concepts of Pepr.
 *  To test this capability you run `pepr dev`and then run the following command:
 *  `kubectl apply -f capabilities/hello-pepr.samples.yaml`
 */
export const HelloPepr = new Capability({
  name: "hello-pepr",
  description: "A simple example capability to show how things work.",
  namespaces: ["pepr-demo", "pepr-demo-2"],
});

// Use the 'When' function to create a new action, use 'Store' to persist data
const { When, Store } = HelloPepr;

async function callWASM(a,b) {
  const go = new globalThis.Go();

  const wasmData = readFileSync("main.wasm");
  var concated: string;

  await WebAssembly.instantiate(wasmData, go.importObject).then(wasmModule => {
    go.run(wasmModule.instance);
  
    concated = global.peprWasm(a,b);
  });
  return concated;
}


When(a.Pod)
.IsCreated()
.Mutate(async pod => {
  try {
    let label_value = await callWASM("a","b")
    pod.SetLabel("pepr",label_value)
  } 
  catch(err) {
    Log.error(err);
  }
});
