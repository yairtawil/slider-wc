export class SliderComponent extends HTMLElement {
  static selector = 'slider-component';
  shadow: ShadowRoot;

  constructor() {
    super();
    this.shadow = (<any>this).createShadowRoot();
  }

  static get observedAttributes() {
    return ['value'];
  }

  get ball(): HTMLElement {
    return <HTMLElement> this.shadow.querySelector('#ball');
  }

  get line(): HTMLElement {
    return <HTMLElement> this.shadow.querySelector('#line');
  }

  get text() {
    return <HTMLElement> this.shadow.querySelector('#text');
  }

  attributeChangedCallback(attributeName, oldValue, newValue, namespace) {
    switch (attributeName) {
      case 'value':
        this.ball.style.left = `calc(${newValue}% - ${this.ball.offsetWidth * (Number(newValue) / 100)}px)`;
        this.text.innerText = `${Math.round(newValue)}`;
        break;
    }
  }

  calcPercent(clientX: number): number {
    const { left, width } = this.line.getBoundingClientRect();
    const moveTo = clientX - left;
    const percent = (moveTo / width) * 100;
    return Math.round(percent);
  }

  setPercent(percent: number) {
    if (0 <= percent && percent <= 100) {
      this.setAttribute('value', percent.toString());
    }
  }

  setEvents() {
    const onMouseMove = (e: MouseEvent) => {
      e.stopPropagation();
      const percent = this.calcPercent(e.clientX);
      this.setPercent(percent);
    };

    const onMouseUp = () => {
      clearDocEvents();
      this.clearBallDragStyle();
    };

    const events = [
      { key: 'mouseup', listener: onMouseUp },
      { key: 'mousemove', listener: onMouseMove },
      { key: 'blur', listener: onMouseUp }
    ];

    const setDocEvents = () => {
      events.forEach(({ key, listener }) => document.addEventListener(key, listener));
    };

    const clearDocEvents = () => {
      events.forEach(({ key, listener }) => document.removeEventListener(key, listener));
    };

    setDocEvents();
  }

  setBallDragStyle() {
    this.ball.style.background = '#bcd4e8';
  };

  clearBallDragStyle() {
    this.ball.style.background = '';
  };

  get template(): string {
    return `
      <style>
        :host {
          user-select: none;
          cursor: pointer;
        }
        .slider-container {
            width: 400px;
            height: 30px;
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .ball {
          position: relative;
          width: 30px;
          height: 100%;
          background: aliceblue;
          border-radius: 50%;
          z-index: 1;
          box-shadow: 0 0 1px 0 grey;
          transform: translateX(15px);
          outline: none;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .ball:focus {
          box-shadow: 0 0 1px 1px grey;
        }
        .ball:hover{
          box-shadow: 0 0 1px 2px grey;
        }
        .line {
            background: lightblue;
            width: 100%;
            height: 50%;
        }
      </style>
      <div class="slider-container">
        <div class="ball" tabindex="0" id="ball">
          <h4 id="text">number: ${this.getAttribute('value') || 0}</h4>
        </div>
        <div class="line" id="line"></div>
      </div>
  `;
  }

  ballMouseDown() {
    this.ball.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      if (e.which === 1) {
        this.setEvents();
        this.setBallDragStyle();
      }
    });
  }

  contextMenu() {
    this.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
  }

  focusBlurListeners() {
    const keydown = (e) => {
      switch (e.which) {
        case 37: {
          const value: string = this.getAttribute('value');
          const newValue: number = Number(value) - 1;
          if (newValue <= 0 && newValue <= 100) {
            this.setAttribute('value', `${newValue}`);
          }
          break;
        }
        case 39: {
          const value: string = this.getAttribute('value');
          const newValue: number = Number(value) + 1;
          if (newValue <= 0 && newValue <= 100) {
            this.setAttribute('value', `${newValue}`);
          }
          break;
        }
      }
    };
    this.
    this.ball.addEventListener('focus', () => {
      this.ball.addEventListener('keydown', keydown);
    });

    this.ball.addEventListener('blur', () => {
      this.ball.removeEventListener('keydown', keydown);
    });

  }

  lineMouseDown() {
    const mouseDown = (e: MouseEvent) => {
      const percent = this.calcPercent(e.clientX);
      this.setPercent(percent);
    };
    this.line.addEventListener('mousedown', mouseDown);
  }

  initListeners() {
    this.contextMenu();
    this.ballMouseDown();
    this.focusBlurListeners();
    this.lineMouseDown();
  }

  connectedCallback() {
    this.shadow.innerHTML = this.template;
    this.initListeners();
  }

}