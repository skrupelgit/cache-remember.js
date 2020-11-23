import {CacheAutoUpdate, CacheRemember} from "../src";

const getRandomUser = () => {
    return new Promise(resolve => {
        resolve(Math.random())
    })

}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


test('Prueba almacenar funcion', async () => {
    let result = await CacheRemember("Hola", () => {
        return "YEEEEE"
    }, 1000)
    expect(result).toBe("YEEEEE")
})


test('Prueba almacenar promise', async () => {
    let result1 = await CacheRemember("Promise1", getRandomUser(), 1000)
    let result2 = await CacheRemember("Promise1", getRandomUser(), 1000)
    let result3 = await CacheRemember("Promise2", getRandomUser(), 1000)
    expect(result1).toBe(result2)
    expect(result1).not.toBe(result3)
})

test('Prueba auto update', async () => {
    let result = CacheAutoUpdate('value', "HOLA")
    //La primera llamada devuelve una promise
    expect(typeof result).toBe('object')
    expect(result.result).toBe(null)
    console.log(await result.updated)
    let result2 = CacheAutoUpdate('value', "QUE TAL")
    expect(result.result).toBe('HOLA')

})