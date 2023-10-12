package main

import (
	"fmt"
	"syscall/js"
)

func concat(this js.Value, args []js.Value) interface{} {

	strongOne := args[0].String()
	stringTwo := args[1].String()
	return fmt.Sprintf("%s %s", strongOne, stringTwo)
}

func main() {
	done := make(chan struct{})
	// https://github.com/golang/go/issues/25612
	js.Global().Set("PeprWasm", make(map[string]interface{}))
	module := js.Global().Get("PeprWasm")
	module.Set("concat", js.FuncOf(concat))
	<-done
}
