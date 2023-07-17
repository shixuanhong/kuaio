import { Kuaio } from 'kuaio'

// sequence with multiple single keys
Kuaio.create()
  .K()
  .after()
  .U()
  .after()
  .A()
  .after()
  .I()
  .after()
  .O()
  .bind(() => {
    console.log('Kuaio')
  })

// sequence with multiple key combinations
Kuaio.create({
  preventDefault: true
})
  .Control()
  .K()
  .after()
  .Control()
  .C()
  .bind(() => {
    console.log('Ctrl+K, Ctrl+C')
  })

// binding multiple sequences to the same callback
Kuaio.create({
  preventDefault: true
})
  .Control()
  .A()
  .or()
  .Control()
  .B()
  .bind(() => {
    console.log('Ctrl+A or Ctrl+B')
  })
