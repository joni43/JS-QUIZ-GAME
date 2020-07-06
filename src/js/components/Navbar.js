import {HighScore} from '../Containers/HighScore'
import {PlayGame} from '../Containers/PlayGame'

export class NavBar extends HTMLElement {
	constructor() {
		super();
		
		this.render = this.render.bind(this);
		this.render();
		this.optionButtons = this.shadowRoot.querySelectorAll('.option_button');
		this.optionButtons.forEach(optionButton =>
			optionButton.addEventListener('click', (e) =>  this.renderTitle(this.shadowRoot,e))
		);
  }
  
  handleClick(e) {
		customElements.define('title-field', Title);
		const selected = e.target.textContent;
		const container = document.querySelector('#display-field');
		container.setAttribute('selected', selected);
		
	}
	options() {
		let options = data.options;

		return Object.keys(options).map(option => {	 
			return `
				<li id="${option}" class="nav_option">
					<button class="option_button ${option}" onclick="this.renderTitle">${option}</button>
				</li>`;
		}).join('');
	}

	render() {
		const shadowRoot = this.shadowRoot || this.attachShadow({ mode: 'open'});
		
		shadowRoot.innerHTML = `
			<style>
				.nav_bar {
					box-sizing: border-box;
					display: flex;
					flex-wrap: wrap;
					justify-content: space-between;
					padding: 0;
					width: 100%;
				}
				
				.nav_option {
					border-bottom: 1px solid transparent;
					box-sizing: border-box;
					display: inline-block;
				}
				
				.option_button {
					background-color: transparent;
					border: 2px solid transparent;
					border-radius: 10%/30%;
					box-sizing: border-box;
					color: white;
					cursor: pointer;
					font-family: 'Open Sans';
					font-size: 0.8em;
					opacity: 0.6;
					padding: .5em 1em;
					transition: all 0.5s ease;
				}
				
				.option_button:focus {
					border-bottom: 2px solid white;
					box-sizing: border-box;
					opacity: 1;
					outline: none;
				}
			</style>
			<ol id="${this.id}" class="nav_bar">
				${this.options()}
			</ol>
		`;
  }
  renderTitle(data,e) {
 
	if (e.target.textContent === "Play Game") {
      data.querySelector('.Play').disabled = true
      data.querySelector('.High').disabled = false
      document.getElementById('high-score').hidden=true;

      let highscore = document.querySelector('#high-scores')
      highscore === null ? '' : highscore.remove() 
     
      new PlayGame()
      
	} if (e.target.textContent === 'High score') {
      data.querySelector('.High').disabled = true
      data.querySelector('.Play').disabled = false
      document.getElementById('high-score').hidden=false;
  
      new HighScore()
    
	}
  }
}

