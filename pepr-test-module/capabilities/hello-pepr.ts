import {
  Capability,
  K8s,
  Log,
  PeprMutateRequest,
  RegisterKind,
  a,
  fetch,
  fetchStatus,
  kind,
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
  var result: string = undefined;

  await WebAssembly.instantiate(wasmData, go.importObject).then(wasmModule => {
    go.run(wasmModule.instance);
  
    result = global.peprWasm(a,b);
  });
  return result;
}

/**
 * ---------------------------------------------------------------------------------------------------
 *                                   Mutate Action (Namespace)                                   *
 * ---------------------------------------------------------------------------------------------------
 *
 * This action removes the label `remove-me` when a Namespace is created.
 * Note we don't need to specify the namespace here, because we've already specified
 * it in the Capability definition above.
 */
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
