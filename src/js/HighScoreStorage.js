

 class HighScoreStorage {

    constructor(username,score){
        this.username= username;
        this.score = score;
        this.highScore = []

        this.readFromLocalStorage()
    }
    
    readFromLocalStorage() {
       
        let highScoreFile = localStorage.getItem('hs');

        if(highScoreFile) {
            let json = JSON.parse(highScoreFile)

            for(let username in json) {
                if(json.hasOwnProperty(username)) {
                    this.highScore.push(json[username])
                }
            }
        }
    }

    isHigh() {
        let isHigh = false;
    
        if(this.highScore.length === 0) {
            isHigh = true;
        } else {
            let lastScore = this.highScore[this.highScore.length -1].score;
    
            if(this.score < lastScore || this.highScore.length < 5) {
                isHigh = true;
            }
        }

        return isHigh;
    }

    addToList () {
        let add = false;
        if(this.username.length === 0) {
            this.username ='undefined'
        }

        if(this.isHigh()) {
            let thisScore = {
                username: this.username,
                score: this.score
            };
            
            if(this.highScore.length === 5) {
                this.highScore.splice(-1,1)
            }
            this.highScore.push(thisScore);
            this.highScore = this.highScore.sort(function(a,b) {
                return a.score - b.score
            })
            this.saveToLocalStorage()

            add = true;
        }
        return add;
    }


    // save highscore to local storage
    saveToLocalStorage () {
        localStorage.setItem('hs',JSON.stringify(this.highScore))
    }

    showHighscore(element) {
        let fragment = document.createDocumentFragment()
        let template;
        let username
        let highscore;

        for(let i =0; i < this.highScore.length; i+=1) {
            
            template = element
            let tr = document.createElement('tr')
            username = document.createElement('td')
            username.classList.add("hs-nickname")

            highscore= document.createElement('td')
            highscore.classList.add("hs-score")
            
            tr.appendChild(username)
            tr.appendChild(highscore)
            template.appendChild(tr)
            
        
            username.appendChild(document.createTextNode(this.highScore[i].username))
            highscore.appendChild(document.createTextNode(this.highScore[i].score))

            fragment.appendChild(template)
        }
        
        return fragment;
        
    }

    
}

module.exports = HighScoreStorage;


