package main

import (
	"fmt"
	"syscall/js"
)

func concats(this js.Value, args []js.Value) interface{} {

	strongOne := args[0].String()
	stringTwo := args[1].String()
	return fmt.Sprintf("%s%s", strongOne, stringTwo)
}

func main() {
	done := make(chan struct{}, 0)
	js.Global().Set("peprWasm", js.FuncOf(concats))
	<-done
}
