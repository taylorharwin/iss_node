Documentation: Batch Module
======

This module exports a constructor function called Batch. The purpose of a batch is to schedule a number of display-related events for execution in a way that maintains a smooth frame rate in the browser. It also allows for control over whether events happen sequentially (sync) or all-at-once (async).

The constructor takes one argument, 'sync', which is a boolean representing whether animation-related events are meant to occur synchronously or asynchronously.If a batch is instantiated without using the "new" keyword, that keyword will be added anyway as a convenience to the developer. 

Batch objects have 3 instance properties:

- **sync**: a user-provided boolean representing whether animations are meant to happen in sequence or all at once
- **jobs**: an array of animation-related events to perform, initialized as an empty array.
- **frame**: a variable used to reference the current frameID in an animation loop (initialized as null)


Batch objects have 4 prototype methods:

- **queue(fn)**: a function that takes a function as its argument, and adds the function to the batch's jobs array. If the sync property is false (i.e., if events are meant to all happpen at once), the queue function will also call request_frame(), which will restart the animation loop with the new function included.
- **run()**: a function that iterates over the jobs array, calls each function in turn, and sets the jobs array back to an empty array
  - This function can only be called in the context of the specific Batch instance. This function binding occurs at initialization. For example:
    
        batch1.run.apply(batch2, args ) //processes all jobs for batch1, not batch2
  

- **request_frame()**: A function that takes no arguments. It first checks whether there is a current animation frame to reference. If there is one (i.e., an animation is running), the function returns. If there isn't one, the function kicks off the event loop-- meaning it calls this.run() inside of an "requestAnimationFrame" loop, in order to call all the functions in this.jobs. It also  saves a reference to the current frame in this.frame.

- **add(fn)**: a function that takes a function as its argument. It does work to this function, then passes a transformed version of it to the queue method described aboved, to be called with its original arguments and in the correct context. An internal flag keeps track of the function having been called. If it hasn't been called before, it will be added to the jobs list. Afterward, it will execute in the request_frame loop, but can't be re-added to the Jobs list.

Batch also makes a free function available to the global scope, called *requestAnimationFrame*. 

- **requestAnimationFrame(callback)**: A free function that takes a callback, looks up the appropriate "requestAnimationFrame" function for a given browser, and then invokes that function, passing it the callback. It's essentially a browser shim. If a version of requestAnimationFrame is not available, the callback gets executed after a delay of about .16 seconds (i.e., 60 frames/second). requestAnimationFrame creates a persistent loop, much like setInterval, but optimized for web animations. For more documentation on this API, see:
    - [https://developer.mozilla.org/en/docs/Web/API/window.requestAnimationFrame](https://developer.mozilla.org/en/docs/Web/API/window.requestAnimationFrame)
    - [http://css-tricks.com/using-requestanimationframe/](http://css-tricks.com/using-requestanimationframe/)

###Bugs to investigate

1. requestAnimationFrame: Line 72
  Unless there is a "global" object available to the environment where this module is loaded, there will be an error when looking for browser-specific functions on the "global" object. "window" is probably the object to reference in this check.

###Style

1. Duplicated Function Names: This Javascript contains two sets of function expressions with the names "run" and "queue". Since they are declared in different scopes, they won't collide, but it might help with future bug investigation to give them different names. I suggest that the functions declared within the add function be called "queueInt" and "runInt".  

2.  add: Lines 21-23
 If the intended use-case for this function is to transform functions that need to be added to the jobs list but can only be called once, it might be helpul to make the name more specific. (i.e., "AddAndPreventRepeating").
