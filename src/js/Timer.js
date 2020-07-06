

class Timer  {

    constructor(owner,element,time) { 
       
      this.owner = owner;
      this.time = time;
      this.element = element;
      this.startTime = new Date().getTime();
      this.interval = undefined;
    }

   start() {
    this.interval = setInterval(this.run.bind(this), 100);
   } 

   run() {
    var now = new Date().getTime();

    var diff = (now - this.startTime) / 1000;

    var showTime = this.time - diff;

    if (diff >= this.time) {
        showTime = 0;
        clearInterval(this.interval);
        this.owner.gameOver("time");
    }

    if (showTime <= 10) {
        this.print(showTime.toFixed(1));
    } else {
        this.print(showTime.toFixed(0));
    }
   }

   stop () {
    clearInterval(this.interval);
    var now = new Date().getTime();

    return (now - this.startTime) / 1000;
    };

    print (diff) {
        this.element.replaceChild(document.createTextNode(diff), this.element.firstChild);
    };
}      
module.exports = Timer;