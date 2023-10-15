Building

```bash
GOOS=js GOARCH=wasm go build -o main.wasm

cp "$(go env GOROOT)/misc/wasm/wasm_exec.js" ../capabilities
```


**Important**

_modify wasm_exec.js and add polyfill for globalThis.crypto_

```js
// Initialize the polyfill
if (typeof globalThis.crypto === 'undefined') {
    globalThis.crypto = {
        getRandomValues: (array) => {
        for (let i = 0; i < array.length; i++) {
            array[i] = Math.floor(Math.random() * 256);
        }
        },
    };
}
```

