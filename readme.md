# time-counter

Dead simple count down or count up timer for node and in browser using clientmodules or browserify.

For a standalone version that bundles required modules just use `time-counter.bundled.js`.

This isn't meant to be scientifically amazingly perfect. Because we're just looping and comparing with a start time at a set interval. This approach is a bit flawed because it's impacted by the event loop, etc. But it's good enough for the vast majority of regular web app uses.

## Install

```
npm install time-counter
``` 


## How it works

```js
// creating a count up timer
var Timer = require('time-counter'),
    log = console.log.bind(console);

var countUpTimer = new Timer();

// log out time, could also be used to 
// write to DOM of course.
countUpTimer.on('change', log);

// start it
countUpTimer.start();


// creating a countdown timer
var countDown = new Timer({
    direction: 'down', 
    startValue: '1:00' // one minute 
});

// log it out every time it's updated
countDown.on('change', log);

countDown.on('end', function () {
    console.log('Blastoff!'); 
});
```

## Available options

Default values shown:

```js
{
    direction: 'up',  // can also be 'down'
    startValue: 0, // starting point, useful for 'down' but works for up too
    targetValue: '', // i.e. "1:00:00" is one hour, shoudl be in format: hours:minutes:seconds
    interval: 50, // how fast to run the loop and determine if the time has changed 
    showHours: false // whether or not to show hours if they're empty
}
```

## Building

To build bundled version run `node build` at project root.

## License

MIT
