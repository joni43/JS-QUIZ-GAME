

export class PlayGame {
  constructor() {
    
    this.main = document.querySelector('#main_container')
    this.startGame()
  }

  startGame () {
    this.quizGame = document.querySelector('#game-content')
     this.quizGame.classList.remove("hidden")    
  }
}