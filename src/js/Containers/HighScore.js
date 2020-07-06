import HighScoreStorage from '../HighScoreStorage'

export class HighScore {
    constructor() {
      this.main = document.querySelector('#main_container')
      
      this.getHighScore()
    }
    getHighScore() {
      this.quizGame = document.querySelector('#game-content')
       this.quizGame.classList.add("hidden")
  
      const template = document.createElement('template')
      this.hs = new HighScoreStorage()
      let table = document.createElement('table')
      let hsFrag = this.hs.showHighscore(table)
      template.setAttribute('id','high-scores','class','high-scores')
      template.appendChild(hsFrag)
      this.main.appendChild(template)
    }
  }