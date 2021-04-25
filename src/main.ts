// @ts-ignore
import {Localit} from 'localit';

export default {

    config: {
        autoClearEntries: 10,
        autoClearMaxTime: 60 * 60 * 60,
    },

    store: new Localit(),


    getDomainKeys: function (domain: string) {
        return Object.keys(localStorage).filter(item => {
            return item.startsWith(domain + "_") && !item.endsWith('_expiration_date')
        })
    },
    getExpirationDate(key) {
        return {key:key, date:new Date(JSON.parse(localStorage.getItem(`${key}_expiration_date`)))}
    },
    getDomainExpirationDates: function (domain: string) {
        let keys = this.getDomainKeys(domain)
        return keys.map(item => {
            return this.getExpirationDate(item)
        })
    },

    getFromStoreOrHandler: async function (store: Localit, key: string, handler: any) {
        let result = this.store.get(key)
        if (result) {
            return result;
        }
        if (typeof handler === "function") {
            result = await handler()
        } else {
            result = await handler
        }
        return result
    },
    remember: async function (key: string, time: number, handler: any) {

        let store = this.store
        store.setDomain('cache-remember')
        let result = await this.getFromStoreOrHandler(store, key, handler)
        if (time !== 0)
            store.set(key, result, `${time}s`)
        else store.set(key, result)

        return result;
    },

    autoClear: async function (key: string, handler: any) {
        let store = this.store
        store.setDomain('cache-autoclear')
        let result = await this.getFromStoreOrHandler(store, key, handler)
        store.set(key, result, `${this.config.autoClearMaxTime}s`)
        let expirations = this.getDomainExpirationDates('cache-autoclear')
        if (expirations.length > this.config.autoClearEntries) {
            let sorted = expirations.sort((a, b) => {
                return a.date.getTime() - b.date.getTime()
            })
            localStorage.removeItem(sorted[0].key)
            localStorage.removeItem(sorted[0].key+"_expiration_date")

        }

        return result
    },

    autoUpdate: function (key: string, handler: any) {

        let store = this.store
        let pr;
        store.setDomain('cache-autoupdate')
        let result = store.get(key)
        if (typeof handler === "function") {
            pr = new Promise(async (resolve) => {
                let result = await handler()
                store.set(key, result)
                resolve(result)
            })
        } else {
            pr = new Promise(async (resolve) => {
                let result = await handler
                store.set(key, result)
                resolve(result)
            })
        }
        return result ?? pr

    }

}

