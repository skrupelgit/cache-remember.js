# remember-cache

remember-cache is a simple package that provides few useful functions for managin cache in your javascript project.

These functions are `remember`, `autoUpdate` and `autoClear` 

```
npm i remember-cache
```

## CacheRemember
 `remember` is a function that recieves three parameters, `key`, `time` , `handler` and returns a `value`. The functionality is very easy, it executes the handler and stores the result in `localstorage` in base the `key` that we provide. This key will expire when the `time` in seconds finish. If we execute from a second time this function with the same key and the time has not expired, it not will trigger the handler so we will save execution time.
 
  This function tries to emulate the functionality of `Cache::remember()` function from Laravel.
  
  ### Example
  
  
  ```js
  import cache from "remember-cache";

  function async apiCall(params){
      //Executes an stressfull api call
      return await myAjaxCaller.get('/idontknow/someurl', params)
  }
  
  let result = await cache.remember("store-hi-api-call", 100,()=>{
      return apiCall("hi");
  }))
  alert(result);
  
  ```
The first time that we execute this example will run more or less at the same speed as usual. However, next time in the next 100 seconds the api call will not be executed so we will get the result instantly.
This is useful for apis that get results that usually dont change in a short amount of time or some time-expensive functions that you can easily can store the result.

If we want to improve the speed of our application without compromising too much the validity of the results of our apis we have the following function

## CacheAutoupdate
`CacheAutoupdate` is similar to `CacheRemember` but it allways executes the handler. However, if it finds that in `localstorage` we have the `key` provided it will return a `value` and execute the handler asynchronously to store the result for the next time that we use it.

The best way to see how it works is with this example
### Example

  ```js
  import cache from "remember-cache";
  let myArray = ['dubai','bananas','hi','spontiak'];
  let results = [];
  for(let value in myArray){
      let results.push(cache.autoUpdate('example-key', value))
  }

console.log(results)
/*
results (array)
    0 : Promise that will return dubai,
    1 : 'dubai',
    2 : 'bananas',
    3 : 'hi'
*/
  ```
As we can see, it always returns the previous element if it exists and if it does not exist it returns a promise with the current element. This is really useful because the already stored items will be retrieved instantly when, for example a user reloads the page. The results may not be the last stored on the server but almost. This can be useful for API calls that often change the results, but getting the latter ones is not too important.
