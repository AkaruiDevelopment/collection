export type If<B extends boolean, K, V = unknown> = B extends true ? K : V
export type PartialIf<B extends boolean, K, V = unknown> = If<B, K, K | V>

export type Maybe<T> = undefined | T 

export type FuncComparator<K, V, BIND extends boolean = false> = 
    If<
        BIND,
        (this: Collection<K, V>, left: V, right: V) => boolean,
        (left: V, right: V) => boolean
    >

export type TupleRFuncIterator<K, V, BIND extends boolean = false, RETURN = unknown> = 
    If<
        BIND,
        (this: Collection<K, V>, data: [K, V]) => RETURN,
        (data: [K, V]) => RETURN
    >


export type ReverseRFuncIterator<K, V, BIND extends boolean = false, RETURN = unknown> = 
    If<
        BIND,
        (this: Collection<K, V>, key: K, val: V) => RETURN,
        (key: K, val: V) => RETURN
    >

export type FuncReducer<K, V, T, BIND extends boolean = false> = 
    If<
        BIND,
        (this: Collection<K, V>, left: T, val: V, key: K) => T,
        (left: T, val: V, key: K) => T 
    >

export type FuncIterator<K, V, BIND extends boolean = false> = 
    If<
        BIND,
        (this: Collection<K, V>, value: V, key: K) => void,
        (value: V, key: K) => void
    >

export type MakeAsync<T extends (...args: any) => any> = (this: ThisParameterType<T>, ...args: Parameters<T>) => Promise<ReturnType<T>>

export type RFuncIterator<K, V, BIND extends boolean = false, RETURN = unknown> = 
    If<
        BIND,
        (this: Collection<K, V>, value: V, key: K) => RETURN,
        (value: V, key: K) => RETURN
    >

export class Collection<
    K = unknown,
    V = unknown
> extends Map<K, V> {

    map(fn: RFuncIterator<K, V, false, V>): Array<V> {
        const arr = new Array<V>(this.size)

        const iter = this.keys()

        let item: ReturnType<typeof iter["next"]>

        for (let i = 0;;++i) {
            item = iter.next()

            if (item.done) {
                break
            }

            const val = this.get(item.value)!

            arr[i] = fn(val, item.value)
        }

        return arr 
    }

    bindedMap(fn: RFuncIterator<K, V, true, V>): Array<V> {
        const arr = new Array<V>(this.size)

        const iter = this.keys()

        let item: ReturnType<typeof iter["next"]>

        for (let i = 0;;++i) {
            item = iter.next()

            if (item.done) {
                break
            }

            const val = this.get(item.value)!

            arr[i] = fn.call(this, val, item.value)
        }

        return arr 
    }

    keyArray(): Array<K> {
        const arr = new Array<K>(this.size)

        const iter = this.keys()

        let item: ReturnType<typeof iter["next"]>

        for (let i = 0;;++i) {
            item = iter.next()

            if (item.done) {
                break
            }

            arr[i] = item.value
        }

        return arr 
    }

    entryArray(): Array<[K, V]> {
        const arr = new Array<[K, V]>(this.size)

        const iter = this.keys()

        let item: ReturnType<typeof iter["next"]>

        for (let i = 0;;++i) {
            item = iter.next()

            if (item.done) {
                break
            }

            arr[i] = [item.value, this.get(item.value)!]
        }

        return arr 
    }

    array(): Array<V> {
        const arr = new Array<V>(this.size)

        const iter = this.values()

        let item: ReturnType<typeof iter["next"]>

        for (let i = 0;;++i) {
            item = iter.next()

            if (item.done) {
                break
            }

            arr[i] = item.value
        }

        return arr 
    }
    
    firstKey(): Maybe<K> {
        return this.keys().next().value
    }

    lastKey(): Maybe<K> {
        return this.keyAt(this.size - 1)
    }

    set eqMap(fn: Parameters<this["map"]>[0]) {
        this.map(fn)
    }

    set eqBindedMap(fn: Parameters<this["bindedMap"]>[0]) {
        this.bindedMap(fn)
    }

    set eqSet(pair: [K, V]) {
        this.set(pair[0], pair[1])
    }

    set eqDelete(key: K) {
        this.delete(key)
    }

    insert(key: K, value: V): boolean {
        if (this.has(key)) {
            return false
        } else {
            this.set(key, value)
            return true 
        }
    }

    some(fn: RFuncIterator<K, V, false, boolean>): boolean {
        const iter = this.keys()

        let item: ReturnType<typeof iter["next"]>

        for (let i = 0;;++i) {
            item = iter.next()

            if (item.done) {
                break
            }

            const val = this.get(item.value)!

            if (fn(val, item.value)) {
                return true 
            }
        }

        return false
    }

    *iter() {
        return this.iterate()
    }

    *iterate(): Iterator<[K, Maybe<V>], undefined> {
        const iter = this.keys()

        let item: ReturnType<typeof iter["next"]>

        while (item = iter.next()) {
            if (item.done) {
                break
            }

            yield [item.value, this.get(item.value)]
        }

        return undefined
    }

    bindedEvery(fn: RFuncIterator<K, V, true, boolean>): boolean {
        const iter = this.keys()

        let item: ReturnType<typeof iter["next"]>

        for (let i = 0;;++i) {
            item = iter.next()

            if (item.done) {
                break
            }

            const val = this.get(item.value)!

            if (!fn.call(this, val, item.value)) {
                return false
            }
        }

        return true
    }

    every(fn: RFuncIterator<K, V, false, boolean>): boolean {
        const iter = this.keys()

        let item: ReturnType<typeof iter["next"]>

        for (let i = 0;;++i) {
            item = iter.next()

            if (item.done) {
                break
            }

            const val = this.get(item.value)!

            if (!fn(val, item.value)) {
                return false
            }
        }

        return true
    }
    
    bindedSome(fn: RFuncIterator<K, V, false, boolean>): boolean {
        const iter = this.keys()

        let item: ReturnType<typeof iter["next"]>

        for (let i = 0;;++i) {
            item = iter.next()

            if (item.done) {
                break
            }

            const val = this.get(item.value)!

            if (fn.call(this, val, item.value)) {
                return true
            }
        }

        return false
    }

    check(fn: RFuncIterator<K, V, false>) {
        const iter = this.keys()

        let item: ReturnType<typeof iter["next"]>

        for (let i = 0;;++i) {
            item = iter.next()

            if (item.done) {
                break
            }

            fn(this.get(item.value)!, item.value)
        }
    }

    bindedCheck(fn: RFuncIterator<K, V, true>) {
        const iter = this.keys()

        let item: ReturnType<typeof iter["next"]>

        for (let i = 0;;++i) {
            item = iter.next()

            if (item.done) {
                break
            }

            fn.call(this, this.get(item.value)!, item.value)
        }
    }

    first(): Maybe<V> {
        return this.values().next().value
    }

    last() {
        return this.at(this.size - 1)
    }

    toString() {
        return JSON.stringify(this)
    }

    toJSON(): Record<string, V> {
        const rc: Record<string, V> = {}

        this.check(
            (value, key) => {
                rc[key as unknown as string] = value
            }
        )

        return rc 
    }

    keyAt(index: number): Maybe<K> {
        const iter = this.keys()

        let item: Maybe<ReturnType<typeof iter["next"]>> = undefined

        for (let i = 0;i <= index;i++) {
            item = iter.next()
        }

        return item?.value 
    }

    at(index: number): Maybe<V> {
        const iter = this.keys()

        let item: Maybe<ReturnType<typeof iter["next"]>> = undefined

        for (let i = 0;i <= index;i++) {
            item = iter.next()
        }

        if (!item?.value) return 

        return this.get(item?.value)
    }

    deleteAt(index: number): boolean {
        const key = this.keyAt(index)

        if (key === undefined) return false

        return this.delete(key)
    }

    reverse() {
        const arr = this.entryArray()

        this.clear()

        for (let i = arr.length;i > 0;i--) {
            const [ key, value ] = arr[i - 1]
            this.set(key, value)
        }

        return this 
    }
    
    bindedReduce<T>(fn: FuncReducer<K, V, T, true>, init?: T): T {
        let acc!: T 
        
        if (init !== undefined) {
            acc = init
        }

        const iter = this.keys()

        let item: ReturnType<typeof iter["next"]>

        for (let i = 0;;++i) {
            item = iter.next()

            if (item.done) {
                break
            }

            acc = fn.call(this, acc, this.get(item.value)!, item.value)
        }

        return acc 
    }

    bindedSort(fn: FuncComparator<K, V, true>) {
        const entries = this.entryArray()

        this.clear()

        for (let i = 0, len = entries.length;i < len;i++) {
            const left = entries[i]
            const right = entries[i + 1]

            if (left === undefined || right === undefined) {
                continue
            } 

            const [ 
                ,
                leftValue
            ] = left

            const [
                ,
                rightValue
            ] = right

            const bool = fn.call(this, leftValue, rightValue)

            if (bool) {
                entries[i] = right
                entries[i + 1] = left
            
                i -= 2
            }
        }

        for (let i = 0, len = entries.length;i < len;i++) {
            const [ key, value ] = entries[i]
            this.set(key, value)
        }

        return this
    }

    bindedFilter(fn: RFuncIterator<K, V, true, boolean>): V[] {
        const arr = new Array()

        const iter = this.keys()

        let item: ReturnType<typeof iter["next"]>

        for (let i = 0;;++i) {
            item = iter.next()

            if (item.done) {
                break
            }

            const val = this.get(item.value)!

            if (fn.call(this, val, item.value)) {
                arr.push(val)
            }
        }

        return arr 
    }
    
    bindedFilterKeys(fn: ReverseRFuncIterator<K, V, true, boolean>): K[] {
        const arr = new Array()

        const iter = this.keys()

        let item: ReturnType<typeof iter["next"]>

        for (let i = 0;;++i) {
            item = iter.next()

            if (item.done) {
                break
            }

            const val = this.get(item.value)!

            if (fn.call(this, item.value, val)) {
                arr.push(item.value)
            }
        }

        return arr 
    }

    bindedFilterEntries(fn: TupleRFuncIterator<K, V, true, boolean>): [K, V][] {
        const arr = new Array<[K, V]>()

        const iter = this.keys()

        let item: ReturnType<typeof iter["next"]>

        for (let i = 0;;++i) {
            item = iter.next()

            if (item.done) {
                break
            }

            const val = this.get(item.value)!

            const res: [K, V] = [item.value, val]

            if (fn.call(this, res)) {
                arr.push(res)
            }
        }

        return arr 
    }

    filterEntries(fn: TupleRFuncIterator<K, V, false, boolean>): [K, V][] {
        const arr = new Array<[K, V]>()

        const iter = this.keys()

        let item: ReturnType<typeof iter["next"]>

        for (let i = 0;;++i) {
            item = iter.next()

            if (item.done) {
                break
            }

            const val = this.get(item.value)!

            const res: [K, V] = [item.value, val]

            if (fn(res)) {
                arr.push(res)
            }
        }

        return arr 
    }

    isEmpty() {
        return this.size === 0
    }

    get empty() {
        return this.size === 0
    }

    filterKeys(fn: ReverseRFuncIterator<K, V, false, boolean>): K[] {
        const arr = new Array()

        const iter = this.entries()

        let item: ReturnType<typeof iter["next"]>

        for (;;) {
            item = iter.next()

            if (item.done) {
                break
            }

            const [ key, val ] = item.value

            if (fn(key, val)) {
                arr.push(key)
            }
        }

        return arr 
    }

    filter(fn: RFuncIterator<K, V, false, boolean>): V[] {
        const arr = new Array()

        const iter = this.entries()

        let item: ReturnType<typeof iter["next"]>

        for (;;) {
            item = iter.next()

            if (item.done) {
                break
            }

            const [ key, val ] = item.value

            if (fn(val, key)) {
                arr.push(val)
            }
        }

        return arr 
    }

    bindedFind(fn: RFuncIterator<K, V, true, boolean>): Maybe<V> {
        const iter = this.entries()

        let item: ReturnType<typeof iter["next"]>

        for (;;) {
            item = iter.next()

            if (item.done) {
                break
            }
            
            const [ key, val ] = item.value

            if (fn.call(this, val, key)) {
                return val
            }
        }

        return undefined
    }

    bindedFindKey(fn: ReverseRFuncIterator<K, V, true, boolean>): Maybe<K> {
        const iter = this.entries()

        let item: ReturnType<typeof iter["next"]>

        for (;;) {
            item = iter.next()

            if (item.done) {
                break
            }

            const [ key, val ] = item.value

            if (fn.call(this, key, val)) {
                return key
            }
        }

        return undefined
    }

    findKey(fn: ReverseRFuncIterator<K, V, false, boolean>): Maybe<K> {
        const iter = this.entries()

        let item: ReturnType<typeof iter["next"]>

        for (;;) {
            item = iter.next()

            if (item.done) {
                break
            }

            const [ key, val ] = item.value

            if (fn(key, val)) {
                return key
            }
        }

        return undefined
    }

    find(fn: RFuncIterator<K, V, false, boolean>): Maybe<V> {
        const iter = this.entries()

        let item: ReturnType<typeof iter["next"]>

        for (;;) {
            item = iter.next()

            if (item.done) {
                break
            }

            const [ key, val ] = item.value

            if (fn(val, key)) {
                return val
            }
        }

        return undefined
    }

    bindedFindEntry(fn: TupleRFuncIterator<K, V, true, boolean>): Maybe<[K, V]> {
        const iter = this.entries()

        let item: ReturnType<typeof iter["next"]>

        for (;;) {
            item = iter.next()

            if (item.done) {
                break
            }

            if (fn.call(this, item.value)) {
                return item.value
            }
        }

        return undefined
    }

    findEntry(fn: TupleRFuncIterator<K, V, false, boolean>): Maybe<[K, V]> {
        const iter = this.entries()

        let item: ReturnType<typeof iter["next"]>

        for (;;) {
            item = iter.next()

            if (item.done) {
                break
            }

            if (fn(item.value)) {
                return item.value
            }
        }

        return undefined
    }

    sort(fn: FuncComparator<K, V, false>) {
        const entries = this.entryArray()

        this.clear()

        for (let i = 0, len = entries.length;i < len;i++) {
            const left = entries[i]
            const right = entries[i + 1]

            if (left === undefined || right === undefined) {
                continue
            } 

            const [ 
                ,
                leftValue
            ] = left

            const [
                ,
                rightValue
            ] = right

            const bool = fn(leftValue, rightValue)

            if (bool) {
                entries[i] = right
                entries[i + 1] = left
            
                i -= 2
            }
        }

        for (let i = 0, len = entries.length;i < len;i++) {
            const [ key, value ] = entries[i]
            this.set(key, value)
        }

        return this
    }

    reduce<T>(fn: FuncReducer<K, V, T, false>, init?: T): T {
        let acc!: T 
        
        if (init !== undefined) {
            acc = init
        }

        const iter = this.entries()

        let item: ReturnType<typeof iter["next"]>

        for (;;) {
            item = iter.next()

            if (item.done) {
                break
            }

            const [ key, val ] = item.value

            acc = fn(acc, val, key)
        }

        return acc 
    }

    merge<K2, V2>(other: Collection<K2, V2>): Collection<K | K2, V | V2> {
        const newer: Collection<K | K2, V | V2> = this as unknown as Collection<K | K2, V | V2>

        other.check(
            (value, key) => newer.set(key, value)
        )

        return newer
    }

    bindedMapAsync(fn: MakeAsync<RFuncIterator<K, V, true, V>>): Promise<V[]> {
        const arr = new Array<Promise<V>>(this.size)

        const iter = this.entries()

        let item: ReturnType<typeof iter["next"]>

        for (let i = 0;;i++) {
            item = iter.next()

            if (item.done) {
                break
            }

            const [ key, val ] = item.value

            arr[i] = fn.call(this, val, key)
        }

        return Promise.all(arr) 
    } 

    async bindedFilterAsync(fn: MakeAsync<RFuncIterator<K, V, true, boolean>>): Promise<V[]> {
        const arr = new Array<V>()

        const iter = this.entries()

        let item: ReturnType<typeof iter["next"]>

        for (;;) {
            item = iter.next()

            if (item.done) {
                break
            }

            const [ key, val ] = item.value

            if (await fn.call(this, val, key)) {
                arr.push(val)
            }
        }

        return arr 
    }

    async filterAsync(fn: MakeAsync<RFuncIterator<K, V, false, boolean>>): Promise<V[]> {
        const arr = new Array<V>()

        const iter = this.entries()

        let item: ReturnType<typeof iter["next"]>

        for (;;) {
            item = iter.next()

            if (item.done) {
                break
            }

            const [ key, val ] = item.value

            if (await fn(val, key)) {
                arr.push(val)
            }
        }

        return arr 
    }

    mapAsync(fn: MakeAsync<RFuncIterator<K, V, false, V>>): Promise<V[]> {
        const arr = new Array<Promise<V>>(this.size)

        const iter = this.entries()

        let item: ReturnType<typeof iter["next"]>

        for (let i = 0;;++i) {
            item = iter.next()

            if (item.done) {
                break
            }

            const [ key, val ] = item.value

            arr[i] = fn(val, key)
        }

        return Promise.all(arr) 
    } 

    async sortAsync(fn: MakeAsync<FuncComparator<K, V, false>>) {
        const entries = this.entryArray()

        this.clear()

        for (let i = 0, len = entries.length;i < len;i++) {
            const left = entries[i]
            const right = entries[i + 1]

            if (left === undefined || right === undefined) {
                continue
            } 

            const [ 
                ,
                leftValue
            ] = left

            const [
                ,
                rightValue
            ] = right

            const bool = await fn(leftValue, rightValue)

            if (bool) {
                entries[i] = right
                entries[i + 1] = left
            
                i -= 2
            }
        }

        for (let i = 0, len = entries.length;i < len;i++) {
            const [ key, value ] = entries[i]
            this.set(key, value)
        }

        return this
    }

    async bindedSortAsync(fn: MakeAsync<FuncComparator<K, V, true>>) {
        const entries = this.entryArray()

        this.clear()

        for (let i = 0, len = entries.length;i < len;i++) {
            const left = entries[i]
            const right = entries[i + 1]

            if (left === undefined || right === undefined) {
                continue
            } 

            const [ 
                ,
                leftValue
            ] = left

            const [
                ,
                rightValue
            ] = right

            const bool = await fn.call(this, leftValue, rightValue)

            if (bool) {
                entries[i] = right
                entries[i + 1] = left
            
                i -= 2
            }
        }

        for (let i = 0, len = entries.length;i < len;i++) {
            const [ key, value ] = entries[i]
            this.set(key, value)
        }

        return this
    }

    async bindedFindAsync(fn: MakeAsync<RFuncIterator<K, V, true, boolean>>): Promise<Maybe<V>> {
        const iter = this.entries()

        let item: ReturnType<typeof iter["next"]>

        for (;;) {
            item = iter.next()

            if (item.done) {
                break
            }

            const [ key, val ] = item.value

            if (await fn.call(this, val, key)) {
                return val
            }
        }

        return undefined
    }

    async findAsync(fn: MakeAsync<RFuncIterator<K, V, false, boolean>>): Promise<Maybe<V>> {
        const iter = this.entries()

        let item: ReturnType<typeof iter["next"]>

        for (;;) {
            item = iter.next()

            if (item.done) {
                break
            }

            const [ key, val ] = item.value

            if (await fn(val, key)) {
                return val
            }
        }

        return undefined
    }
}
