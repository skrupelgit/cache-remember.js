import {CacheAutoUpdate, CacheRemember} from "../src";

const getRandomUser = () => {
    return new Promise(resolve => {
        resolve(Math.random())
    })

}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
test('Prueba almacenar un valor', async () => {
    let result = await CacheRemember("Hola", 1000, "YEEEEE")
    expect(result).toBe("YEEEEE")
})
test('Prueba almacenar funcion', async () => {
    let result = await CacheRemember("Hola", 1000, () => {
        return "YEEEEE"
    },)
    expect(result).toBe("YEEEEE")
})
test('Prueba almacenar funcion con argumentos', async () => {
    let argumento1="JEJEJEJE"
    let argumento2="JAJAJAJA"
    let result = await CacheRemember("argumentos", 1000, (arg1, arg2) => {
        return arg1+ arg2
    }, ...[argumento1,argumento2])
    expect(result).toBe("JEJEJEJEJAJAJAJA")
})
test('Prueba almacenar promise', async () => {
    let result1 = await CacheRemember("Promise1", 1000, getRandomUser())
    let result2 = await CacheRemember("Promise1", 1000, getRandomUser())
    let result3 = await CacheRemember("Promise2", 1000, getRandomUser())
    expect(result1).toBe(result2)
    expect(result1).not.toBe(result3)
})

test('Prueba auto update texto', async () => {
    let result = CacheAutoUpdate('value', "HOLA")
    //La primera llamada devuelve una promise
    expect(typeof result).toBe('object')
    await sleep(500)
    //La segunda llamanda pasado un tiempo, por ejempplo despues de actualizar la pagina devuelve el resultado anterior
    let result2 = CacheAutoUpdate('value', "QUE TAL")
    expect(result2).toBe('HOLA')
    let resolvedResult = await result
    //El resultado de la primera promise es el resultado de la siguiente llamada a la funcion
    expect(result2).toBe(resolvedResult)
})
test('Prueba auto update funciones', async () => {
    let result = CacheAutoUpdate('function', () => "HOLA")
    //La primera llamada devuelve una promise
    expect(typeof result).toBe('object')
    await sleep(500)
    //La segunda llamanda pasado un tiempo, por ejempplo despues de actualizar la pagina devuelve el resultado anterior
    let result2 = CacheAutoUpdate('function', () => "QUE TAL")
    expect(result2).toBe('HOLA')
    let resolvedResult = await result
    //El resultado de la primera promise es el resultado de la siguiente llamada a la funcion
    expect(result2).toBe(resolvedResult)
})
test('Prueba auto update funciones', async () => {
    let result = CacheAutoUpdate('promise', getRandomUser())
    //La primera llamada devuelve una promise
    expect(typeof result).toBe('object')
    await sleep(500)
    //La segunda llamanda pasado un tiempo, por ejempplo despues de actualizar la pagina devuelve el resultado anterior
    let result2 = CacheAutoUpdate('promise', getRandomUser())
    expect(typeof result2).toBe('number')
    let resolvedResult = await result
    //El resultado de la primera promise es el resultado de la siguiente promesa
    expect(result2).toBe(resolvedResult)
})