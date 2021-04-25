import {Localit} from "localit";
import cache from "../dist/main";

const getRandomUser = () => {
    return new Promise(resolve => {
        resolve(Math.random())
    })

}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

test('Prueba almacenar un valor', async () => {
    let result = await cache.remember("Hola", 1000, "YEEEEE")
    expect(result).toBe("YEEEEE")
})
test('Prueba autoclear almacena las últimas', async () => {
    let entriesLength = 0
    for (let i =0; i<20; i++) {
        await cache.autoClear(`jeje-${i}`, "YEEEEE")
        entriesLength = cache.getDomainExpirationDates('cache-autoclear').length
    }
    expect(entriesLength).toBe(cache.config.autoClearEntries)

    cache.store.clearDomain('cache-autoclear')
    entriesLength = cache.getDomainExpirationDates('cache-autoclear').length
    expect(entriesLength).toBe(0)
    cache.config.autoClearEntries=30
    for (let i =0; i<60; i++) {
        await cache.autoClear(`jeje-${i}`, "YEEEEE")
        entriesLength = cache.getDomainExpirationDates('cache-autoclear').length
    }
    expect(entriesLength).toBe(30)
})
test('Prueba almacenar funcion', async () => {
    let result = await cache.remember("Hola", 1000, () => {
        return "YEEEEE"
    },)
    expect(result).toBe("YEEEEE")
})

test('Prueba de caducidad de la cache', async () => {
    let localit = new Localit({domain: 'cache-remember', type: 'localStorage'})
    let temp = await cache.remember("will-die-soon", 1, "Oh no")
    expect(temp).toBe("Oh no")
    expect(localit.get('will-die-soon')).toBe("Oh no")
    await sleep(1000);
    expect(localit.get('will-die-soon')).toBe(null)
})


test('Prueba almacenar promise', async () => {
    let result1 = await cache.remember("Promise1", 1000, getRandomUser())
    let result2 = await cache.remember("Promise1", 1000, getRandomUser())
    let result3 = await cache.remember("Promise2", 1000, getRandomUser())
    expect(result1).toBe(result2)
    expect(result1).not.toBe(result3)
})

test('Prueba auto update texto', async () => {
    let result = cache.autoUpdate('value', "HOLA")
    //La primera llamada devuelve una promise
    expect(typeof result).toBe('object')
    await sleep(500)
    //La segunda llamanda pasado un tiempo, por ejempplo despues de actualizar la pagina devuelve el resultado anterior
    let result2 = cache.autoUpdate('value', "QUE TAL")
    expect(result2).toBe('HOLA')
    let resolvedResult = await result
    //El resultado de la primera promise es el resultado de la siguiente llamada a la funcion
    expect(result2).toBe(resolvedResult)
})
test('Prueba auto update funciones', async () => {
    let result = cache.autoUpdate('function', () => "HOLA")
    //La primera llamada devuelve una promise
    expect(typeof result).toBe('object')
    await sleep(500)
    //La segunda llamanda pasado un tiempo, por ejempplo despues de actualizar la pagina devuelve el resultado anterior
    let result2 = cache.autoUpdate('function', () => "QUE TAL")
    expect(result2).toBe('HOLA')
    let resolvedResult = await result
    //El resultado de la primera promise es el resultado de la siguiente llamada a la funcion
    expect(result2).toBe(resolvedResult)
})
test('Prueba auto update promise', async () => {
    let result = cache.autoUpdate('promise', getRandomUser())
    //La primera llamada devuelve una promise
    expect(typeof result).toBe('object')
    await sleep(500)
    //La segunda llamanda pasado un tiempo, por ejempplo despues de actualizar la pagina devuelve el resultado anterior
    let result2 = cache.autoUpdate('promise', getRandomUser())
    expect(typeof result2).toBe('number')
    let resolvedResult = await result
    //El resultado de la primera promise es el resultado de la siguiente promesa
    expect(result2).toBe(resolvedResult)
})

