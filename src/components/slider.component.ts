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

    get max() {
        return Number(this.getAttribute('max') || 100);
    }

    get min() {
        return Number(this.getAttribute('min') || 0);
    }

    get line(): HTMLElement {
        return <HTMLElement> this.shadow.querySelector('#line');
    }

    get ball(): HTMLElement {
        return <HTMLElement> this.shadow.querySelector('#ball');
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
                if (+newValue < this.min) {
                    newValue = this.min;
                }
                if (this.max < +newValue) {
                    newValue = this.max;
                }
                if (!this.ball) {
                    return;
                }
                const delta = this.max - this.min;
                this.detail.value = +newValue;
                this.ball.style.left = `calc(${((+newValue - this.min) / delta) * 100}% - ${this.ball.offsetWidth * (((+newValue - this.min) / delta))}px)`;
                this.text.innerText = `${Math.round(+newValue)}`;
                this.dispatchEvent(this.event);
        }
    }
    calcPercent(clientX: number): number {
        const { left, width } = this.line.getBoundingClientRect();
        const moveTo = clientX - left;
        return (moveTo / width) * 100;
    }

    percentToValue(percent: number) {
        return ((percent / 100) * (this.max - this.min)) + this.min;
    }

    setPercent(percent: number) {
        if (0 <= percent && percent <= 100) {
            this.setAttribute('value', percent.toString());
        }
    }
    setBallDragStyle(ball) {
        ball.style.background = '#bcd4e8';
    }

    clearBallDragStyle(ball) {
        ball.style.background = '';
    }

    ballMouseDown(ball) {
        ball.addEventListener('mousedown', (e) => {
            e.stopPropagation();
            if (e.which === 1) {
                this.setEvents(ball);
                this.setBallDragStyle(ball);
            }
        });
    }

    setValueAttribute(value: number = this.min): void {
        value = isNaN(value) ? this.min : Math.round(value);
        value = value < this.min ? this.min : this.max < value ? this.max : value;
        const modulo = value % this.step;
        if (this.step < modulo * 2) {
            value = value + (this.step - modulo);
        } else {
            value = value - modulo;
        }
        this.setAttribute('value', `${value}`);
    }

    focusBlurListeners(ball) {
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

        ball.addEventListener('focus', () => {
            document.addEventListener('keydown', keydown);
            document.addEventListener('mousewheel', mousewheel);
        });

        ball.addEventListener('blur', () => {
            document.removeEventListener('keydown', keydown);
            document.removeEventListener('mousewheel', mousewheel);
        });

    }
    setEvents(ball) {
        const onMouseMove = (e: MouseEvent) => {
            e.stopPropagation();
            const percent = this.calcPercent(e.clientX);
            const value = this.percentToValue(percent);
            this.setValueAttribute(value);
        };

        const onMouseUp = () => {
            clearDocEvents();
            this.clearBallDragStyle(this.ball);
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

    contextMenu() {
        this.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            e.stopPropagation();
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
        this.ballMouseDown(this.ball);
        this.focusBlurListeners(this.ball);
        this.lineMouseDown();
        this.contextMenu();
    }

    connectedCallback() {
        this.shadow.innerHTML = `<style>${style}</style> ${template}`;
        this.initListeners();
        this.setValueAttribute(Number(this.getAttribute('value')));
    }

}