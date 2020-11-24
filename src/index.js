import {Localit} from "localit/src/localit";

export const CacheRemember = async (key, time, handler, ...args) => {

    let store = new Localit();
    store.setDomain('cache-remember')
    let result = store.get(key)
    if (result) {
        return result;
    }
    if (typeof handler === "function") {
        if (args)
            result = await Promise.resolve(handler(...args))
        else
            result = await Promise.resolve(handler())
    } else {
        result = await Promise.resolve(handler)
    }
    store.set(key, result, `${time}s`)

    return result;

}
export const CacheAutoUpdate = (key, handler,  ...args) => {

    let store = new Localit();
    store.setDomain('cache-autoupdate')
    let result = store.get(key)
    let promise = null
    if (typeof handler === "function") {
        promise = new Promise(async (resolve) => {
            let result = await Promise.resolve(handler(...args))
            store.set(key, result)
            resolve(result)
        })
    } else {
        promise = new Promise(async (resolve) => {
            let result = await Promise.resolve(handler)
            store.set(key, result)
            resolve(result)
        })
    }
    return result ? result : promise

}