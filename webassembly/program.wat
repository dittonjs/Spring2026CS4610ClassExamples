(module
  (func $add (export "add") (param $num1 i32) (param $num2 i32) (param $num3 i32) (result i32)
    local.get $num1
    local.get $num2
    local.get $num3
    i32.add
    i32.add
  )

  (func $fib (export "fib") (param $n i32) (result i32)
    (block $body (result i32)
      local.get $n
      i32.const 2
      i32.eq
      (if
        (then
          i32.const 2
          br $body
        )
      )
      local.get $n
      i32.const 1
      i32.eq
      (if
        (then
          i32.const 1
          br $body
        )
      )

      local.get $n
      i32.const 1
      i32.sub
      call $fib

      local.get $n
      i32.const 2
      i32.sub
      call $fib
      i32.add

    )

  )
)
