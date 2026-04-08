(module
  (import "io" "print" (func $print (param $val i32)))

  (func $test (param $val1 i32) (param $val2 i32) (result i32)
    local.get $val1
    local.get $val2
    i32.add
  )

  (func (export "main")
    i32.const 1
    i32.const 2
    call $test
    call $print
  )

  (func $fib (export "fib") (param $val i32) (result i32)
    (block $body (result i32)
      local.get $val
      i32.const 2
      i32.eq
      (if
        (then
          i32.const 2
          br $body
        )
      )

      local.get $val
      i32.const 1
      i32.eq
      (if
        (then
          i32.const 1
          br $body
        )
      )

      local.get $val
      i32.const 1
      i32.sub
      call $fib

      local.get $val
      i32.const 2
      i32.sub
      call $fib
      i32.add
    )
  )
)
