import * as template from './slider.component.html';
import * as style from './slider.component.css';

export class SliderComponent extends HTMLElement {
    static selector = 'slider-component';
    shadow: ShadowRoot = (<any>this).createShadowRoot();
    detail: { value: number } = { value: 0 };
    event: CustomEvent = new CustomEvent('change', { bubbles: true, detail: this.detail });

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

    get step() {
        return Number(this.getAttribute('step') || 1);
    }

    attributeChangedCallback(attributeName, oldValue, newValue, namespace) {
        switch (attributeName) {
            case 'value':
                this.detail.value = newValue;
                this.ball.style.left = `calc(${newValue}% - ${this.ball.offsetWidth * (Number(newValue) / 100)}px)`;
                this.text.innerText = `${Math.round(newValue)}`;
                this.dispatchEvent(this.event);
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
    }

    clearBallDragStyle() {
        this.ball.style.background = '';
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

    setValueAttribute(value: number = 0): void {
        value = isNaN(value) ? 0 : value;
        if (0 <= value && value <= 100) {
            this.setAttribute('value', `${value}`);
        }
    }

    focusBlurListeners() {
        const increase = () => {
            const value: string = this.getAttribute('value');
            const newValue: number = Number(value) + this.step;
            this.setValueAttribute(newValue);
        };

        const decrease = () => {
            const value: string = this.getAttribute('value');
            const newValue: number = Number(value) - this.step;
            this.setValueAttribute(newValue);
        };

        const keydown = (e: KeyboardEvent) => {
            e.preventDefault();
            switch (e.which) {
                case 40:
                case 37:
                    decrease();
                    break;
                case 38:
                case 39:
                    increase();
                    break;
            }
        };

        const mousewheel = (e: MouseWheelEvent) => {
            e.preventDefault();
            if (0 < e.deltaY) {
                increase();
            } else {
                decrease();
            }
        };

        this.ball.addEventListener('focus', () => {
            document.addEventListener('keydown', keydown);
            document.addEventListener('mousewheel', mousewheel);
        });

        this.ball.addEventListener('blur', () => {
            document.removeEventListener('keydown', keydown);
            document.removeEventListener('mousewheel', mousewheel);
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
        this.shadow.innerHTML = `<style>${style}</style> ${template}`;
        this.initListeners();
        this.setValueAttribute(Number(this.getAttribute('value')));
        this.addEventListener('change', (e) => {
            console.log(e);
        });
    }

}