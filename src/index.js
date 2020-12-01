import {Localit} from "localit";

 const CacheRemember = async (key, time, handler) => {

    let store = new Localit();
    store.setDomain('cache-remember')
    let result = store.get(key)
    if (result) {
        return result;
    }
    if (typeof handler === "function") {
        result = await handler()
    } else {
        result = await handler
    }
    store.set(key, result, `${time}s`)

    return result;

}
 const CacheAutoUpdate = (key, handler) => {

    let store = new Localit();
    let promise;
    store.setDomain('cache-autoupdate')
    let result = store.get(key)
    if (typeof handler === "function") {
        promise = new Promise(async (resolve) => {
            let result = await handler()
            store.set(key, result)
            resolve(result)
        })
    } else {
        promise = new Promise(async (resolve) => {
            let result = await handler
            store.set(key, result)
            resolve(result)
        })
    }
    return result ?? promise

}
export {CacheRemember, CacheAutoUpdate}