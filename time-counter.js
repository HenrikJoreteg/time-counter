var WildEmitter = require('wildemitter');


function Timer(opts) {
    WildEmitter.call(this);
    this.config = {
        direction: 'up',
        startValue: 0,
        targetValue: '',
        interval: 50,
        showHours: false
    };

    if (typeof opts === 'object') {
        for (var item in opts) {
            this.config[item] = opts[item];
        }
    }
}

Timer.prototype = Object.create(WildEmitter.prototype, {
    constructor: {
        value: Timer
    }
});

Timer.prototype.setStartTime = function () {
    var now = Date.now();

    if (this.config.startValue) {
        this.timerStartTime = now - this._parseStartValue(this.config.startValue);
    } else {
        this.timerStartTime = now;
    }

    if (this.config.direction === 'down') {
        // adding 1 second here actually ensures that the first value is going to be what
        // was passed in as start time since we're using Math.floor, this makes sense.
        this.timerTargetTime = now + this._parseStartValue(this.config.startValue) + 999;
    }
};

Timer.prototype.start = function () {
    this.setStartTime();
    if (this.stoppedTime) {
        this.stoppedTime = 0;
    }
    this.timerStopped = false;
    this._update();
    this.emit('start');
    return this;
};

Timer.prototype.stop = function () {
    this.timerStopped = true;
    this.stoppedTime = Date.now();
    this.emit('stop');
    return this;
};

Timer.prototype.getTime = function () {
    return this.time;
};

Timer.prototype._update = function () {
    if (this.timerStopped) return;

    var self = this,
        direction = this.config.direction,
        diff = function () {
            var now = Date.now();
            if (direction === 'up') {
                return now - self.timerStartTime;
            } else {
                return Math.abs(self.timerTargetTime - now);
            }
        }(),
        s = Math.floor(diff / 1000) % 60,
        min = Math.floor((diff / 1000) / 60) % 60,
        hr = Math.floor(((diff / 1000) / 60) / 60) % 60,
        hasHours = hr > 0,
        time = ((this.config.showHours || hasHours) ? hr + ':' : '') + [hasHours ? this._zeroPad(min) : min, this._zeroPad(s)].join(':');

    if (this.time !== time) {
        this.time = time;
        this.emit('change', this.time);

        if (this.config.direction === 'down' && diff < 1000) {
            this.emit('done');
            this.stop();
        } else if (this.config.direction === 'up' && this.time === this.config.targetValue) {
            this.emit('done');
            this.stop();
        }
    }

    setTimeout(this._update.bind(this), this.config.interval);
};

Timer.prototype._zeroPad = function (num) {
    return (('' + num).length === 1) ? '0' + num : num;
};

Timer.prototype._parseStartValue = function (value) {
    var split = ('' + value).split(':'),
        hours = 0,
        minutes = 0,
        seconds = 0;

    if (split.length === 3) {
        hours = parseInt(split[0], 10);
        minutes = parseInt(split[1], 10);
        seconds = parseInt(split[2], 10);
    } else if (split.length === 2) {
        minutes = parseInt(split[0], 10);
        seconds = parseInt(split[1], 10);
    } else if (split.length === 1) {
        seconds = parseInt(split[0], 10);
    }

    return (hours * 3600000) + (minutes * 60000) + (seconds * 1000)
};


module.exports = Timer;
