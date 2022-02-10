import { Suite } from "benchmark";
import coll from "@discordjs/collection"
import { Collection } from "..";

const djs = new coll<string, number>()

const newer = new Collection<string, number>()

const arr: number[] = new Array(100000).fill(1)

for (const key of arr) {
    djs.set(key.toString(), key)
    newer.set(key.toString(), key)
}

const fn = (x: number) => x + 1

const reducer = (x: number, y: number) => x + y 

const finder = (x: number) => x === 50000

const sorter = (x: number, y: number) => x - y 
const sorter2 = (x: number, y: number) => x > y

new Suite()
.add("Djs Collection Sort", () => {
    djs.sort(sorter)
})
.add("Akarui Collection Sort", () => {
    newer.sort(sorter2)
})
.add("Djs Collection first", () => {
    djs.first()
})
.add("Akarui Collection first", () => {
    newer.first()
})
.add("Djs Collection Reducer", () => {
    djs.reduce(reducer, 0) 
})
.add("Akarui Collection Reducer", () => {
    newer.reduce(reducer, 0)
})
.add("Djs Collection Map", () => {
    djs.map(fn) 
})
.add("Akarui Collection Map", () => {
    newer.map(fn)
})
.add("Djs Collection Find", () => {
    djs.find(finder)
})
.add("Akarui Collection Find", () => {
    newer.find(finder)
})
.add("Djs Collection Filter", () => {
    djs.filter(finder)
})
.add("Akarui Collection Filter", () => {
    newer.filter(finder)
})
.add("Djs Collection toArray", () => {
    Array.from(djs.values())
})
.add("Akarui Collection toArray", () => {
    newer.array()
})
.add("Djs Collection last", () => {
    djs.last()
})
.add("Akarui Collection last", () => {
    newer.last()
})
.on("cycle", (d: any) => {
    console.log(String(d.target))
})
.on("complete", function(this: any) {
    console.log(`Fastest is ${this.filter("fastest")[0]}`)
})
.run()