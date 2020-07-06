

import Timer from './Timer'
import HighScoreStorage from './HighScoreStorage';
import { NavBar } from './components/Navbar'
import {Container} from './Containers/Main'

const template = document.createElement('template')
template.innerHTML = `
<style>
button {
  cursor:pointer;
  background:rgb(64, 163, 203);
  color:#fff;
  border:0;
  border-radius:5px;
  padding:5px 10px;
}
.hidden{
  display:none;
}
#content-start {
  position: relative;
  display: flex;
  justify-content: center;
 font-size:1rem;
  margin-top: 2rem;
}
#username {
  margin-right: 1rem;
}
#start-game {
  position:absolute;
  margin-top:5rem;
}
#timer, #output-questions {
  position: relative;
    display: flex;
    justify-content: center;
    font-size:1.2rem;
    margin-top: 2rem;
}
#alt-answer {
  display: flex;
    justify-content: center;
    margin-top: 1rem;
    font-size: 20px
}
.answer {
  display: flex;
    justify-content: center;
    margin-top: 3rem;
}
#submit {
  margin-left:1rem;
}
.btn {
  margin: 0.5rem;
    font-size: 0.9rem;;
}
</style>

<div class="content">
<div id="content-start" > 
<input id="username"> Enter username</input>
<button id="start-game">Start Quiz </button>
</div>

<div class="content-game hidden">

<div class="answer">
<input id="input"> </input>
<button id="submit">Submit</button>
</div>
<section id="output-questions"> </section>
<section id="alt-answer"> </section>
<div id="timer"> </div>
</div>

</div>

`
class QuizGame extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({ mode: 'open' })

    this._url = "http://vhost3.lnu.se:20080/question/1"
    this.nextUrl = 'http://vhost3.lnu.se:20080/question/1';
    this.userName;
    this.quizTime = 0
    this.totalTime = 0
    this.newTime = 0
  }

  async clickToStart() {
    this.username = this._user.value
    this.data = await this.initalGame()
    this._updateRendering()

  }
  connectedCallback() {
    this.shadowRoot.appendChild(template.content.cloneNode(true))

    this._content = this.shadowRoot.querySelector('.content')
    this._contentGame = this.shadowRoot.querySelector('.content-game')
    this._start = this.shadowRoot.querySelector('#start-game')
    this._user = this.shadowRoot.querySelector('#username')
    this._submit = this.shadowRoot.querySelector('#submit')
    this._input = this.shadowRoot.querySelector('#input')
    this._alt = this.shadowRoot.querySelector('#alt-answer')
    this._timer = this.shadowRoot.querySelector('#timer')

    this._start.addEventListener('click', (e) => {
      this.dispatchEvent(
        new CustomEvent('onClick', {
          detail: new RemoveUsernameElement().change(),

        }),
        this._contentGame.classList.remove("hidden"),
        this.clickToStart()
      )
    })

    this._submit.addEventListener('click', e => {
      this._answerQuestion(e, this._input)
    })


  }
  gameOver() {
  
    let gameoverContent = document.createElement('h1')
    gameoverContent.appendChild(document.createTextNode('Game Over '))

    const ptag = document.createElement('button')
    ptag.appendChild(document.createTextNode('Play again'))
    ptag.addEventListener('click', () => {
      window.location.reload()
    })

    this._contentGame.innerHTML = ''
    this._contentGame.appendChild(gameoverContent)
    this._contentGame.appendChild(ptag)
    this.totalTime += this.timer.stop();
  }

  clearInputBox() {
    this._input.value = ''
  }

  async initalGame() {
    this._input.classList.remove("hidden")
    this._submit.classList.remove("hidden")

    this._alt.innerHTML = ''

    let quizAPI = await window.fetch(this._url)
    let question = await quizAPI.json()

    if (question.alternatives) {
      this.showAlternative(question, this.data)
      this._input.classList.add("hidden")
      this._submit.classList.add("hidden")
    }

    return question
  }

  async postAnswer(url, answer) {

    const settings = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(answer)
    };

    try {
      const fetchResponse = await fetch(url, settings)
      const data = await fetchResponse.json()

      this.data = data;
      url = data.nextURL

      if (!data.nextURL && data.message === 'Correct answer!') {
        this.endgame()
      }
      if (data.message === 'Correct answer!') {
        this._url = url;
        this.data = await this.initalGame(this._url)
        this._updateRendering()
      }
      else {
        this.gameOver()
      }
    }
    catch (e) {
      return e
    }
  }

  endgame() {
    this.shadowRoot.innerHTML = ''
    const section = document.createElement('section')
    const div = document.createElement('div')
    const h2 = document.createElement('h2')
    const p = document.createElement('p')
    const table = document.createElement('table')
    const PrevScore = document.createElement('p')
  
    PrevScore.appendChild(document.createTextNode('previous highscore:'))
    h2.appendChild(document.createTextNode('Good Game'))
    div.appendChild(h2)
    section.append(div, table)


    this.shadowRoot.innerHTML = ''
    this.shadowRoot.appendChild(section)

    this.shadowRoot.querySelector('table').setAttribute('id', 'score')
    this.hs = new HighScoreStorage(this.username, this.totalTime.toFixed(1));
    this.hs.addToList()

    if (this.hs.highScore.length > 0) {

      this.shadowRoot.querySelector('table').appendChild(PrevScore)
      let hsFrag = this.hs.showHighscore(table)
      this.shadowRoot.appendChild(hsFrag)
    }

    const button = document.createElement('button')
    button.appendChild(document.createTextNode('Play again'))
    button.addEventListener('click', () => {
      window.location.reload()
    })

    this.shadowRoot.appendChild(button)
    const userScore = document.createTextNode(`Your score ${this.hs.score}`)
    p.appendChild(userScore)
    div.appendChild(p)
    section.append(table, button)
  }

  showAlternative(data) {

    for (let i in data.alternatives) {

      const button = document.createElement('button')
      button.innerText = JSON.stringify(data.alternatives[i])
      button.value = i
      button.classList.add('btn')
      button.addEventListener('click', e => { this._selectOption(e, data) })
      this._alt.appendChild(button)
    }
  }

  _selectOption(e, data) {
    e.preventDefault()

    const answer = { answer: e.target.value }

    this.postAnswer(this.data.nextURL, answer)
    this.totalTime += this.timer.stop();
    this.clearInputBox()
  }

  _answerQuestion(e, input) {

    let answerText = input.value;
    let answer = { answer: answerText }

    this.totalTime += this.timer.stop();
    this.postAnswer(this.data.nextURL, answer)
    this.clearInputBox()
  }

  _updateRendering() {
    
    this._contentGame.classList.remove("hidden")
    const questions = this.shadowRoot.querySelector('#output-questions')
    questions.textContent = this.data.question

    this.timer = new Timer(this, this._timer, 100);
    this.timer.start();
  }

  disconnectedCallback() {
    
    this.shadowRoot.querySelector('#start-game').removeEventListener('click', this.clickToStart)

  }

}

customElements.define('main-container', Container);
customElements.define('nav-bar', NavBar);
window.customElements.define('quiz-game', QuizGame)


class RemoveUsernameElement {
  constructor() {}
  change() {


    let contentElement = document.querySelector('quiz-game').shadowRoot.querySelector('#content-start')
    contentElement.remove()


  }

  removeGame() {
    let quizGame = document.querySelector('quiz-game').shadowRoot.querySelector('#content-game')
    quizGame.remove()
  }
}

