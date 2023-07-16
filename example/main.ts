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

//sequence of key combinations
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
