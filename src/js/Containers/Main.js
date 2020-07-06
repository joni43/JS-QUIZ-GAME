export class Container extends HTMLElement {
    constructor() {
      super();
      const shadowRoot = this.attachShadow({ mode: 'open' });
  
      shadowRoot.innerHTML = `
              <style>
              .container {
                  font-family: 'Poiret One', cursive;
              }
              .title {
                  font-size:3rem;
                  display:flex;
                  justify-content:center;
                  margin-bottom:3rem;
              }
              </style>
              <main id="${this.id}">
              <title class="title"> Quiz Game</title>    
                  <slot></slot>            
              </main>
          `;
    }
  }