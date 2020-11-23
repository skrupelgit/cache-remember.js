import {Localit} from "localit/src/localit";

export const CacheRemember = async (key, handler, time) => {

    let store = new Localit('cache-remember');
    let result = store.get(key)
    if (result) {
        return result;
    } else {
        if (typeof handler === "function") {
            result = await Promise.resolve(handler())
        } else {
            result = await Promise.resolve(handler)
        }
        store.set(key, result, `${time}s`)

        return result;
    }
}
export const CacheAutoUpdate = (key, handler) => {

    let store = new Localit();
    store.setDomain('cache-autoupdate')
    let result = store.get(key)
    let promise = null
    if (typeof handler === "function") {
        Promise.resolve(handler()).then((result) => store.set(key, result))
    } else {
        promise = new Promise(async (resolve) => {
            let result = await Promise.resolve(handler)
            store.set(key, result)
            resolve(true)
        })
    }
    console.log(localStorage)
    return {
        result:result,
        updated:promise
    };

}