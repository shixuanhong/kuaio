import { Kuaio } from 'kuaio'
console.log(Kuaio.create())
// single key sequence
Kuaio.create()
  .S()
  .after()
  .X()
  .after()
  .H()
  .bind(() => {
    console.log('shixuanhong')
  })

// sequence of key combinations
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
