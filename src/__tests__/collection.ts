import { Collection } from "..";

const coll = new Collection<string, number>()

coll.set("ok", 1).set("tmr", 2)

console.log(
    coll.first(),
    coll.last(),
    coll.toJSON(),
    coll.toString()
)

console.log(
    coll,
    coll.reverse(),
    coll.reduce<number[]>((x, y) => {
        x.push(y)
        return x 
    }, [])
)

console.log(
    coll.find((v, k) => k === 'tmr')
)