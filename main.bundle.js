/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const slider_component_1 = __webpack_require__(1);
customElements.define(slider_component_1.SliderComponent.selector, slider_component_1.SliderComponent);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const template = __webpack_require__(2);
const style = __webpack_require__(3);
class SliderComponent extends HTMLElement {
    constructor() {
        super(...arguments);
        this.shadow = this.createShadowRoot();
        this.detail = { value: 0 };
        this.event = new CustomEvent('change', { bubbles: true, detail: this.detail });
    }
    static get observedAttributes() {
        return ['value'];
    }
    get max() {
        return Number(this.getAttribute('max') || 100);
    }
    get min() {
        return Number(this.getAttribute('min') || 0);
    }
    get line() {
        return this.shadow.querySelector('#line');
    }
    get ball() {
        return this.shadow.querySelector('#ball');
    }
    get text() {
        return this.shadow.querySelector('#text');
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
    calcPercent(clientX) {
        const { left, width } = this.line.getBoundingClientRect();
        const moveTo = clientX - left;
        return (moveTo / width) * 100;
    }
    percentToValue(percent) {
        return ((percent / 100) * (this.max - this.min)) + this.min;
    }
    setPercent(percent) {
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
    setValueAttribute(value = this.min) {
        value = isNaN(value) ? this.min : Math.round(value);
        value = value < this.min ? this.min : this.max < value ? this.max : value;
        const modulo = value % this.step;
        if (this.step < modulo * 2) {
            value = value + (this.step - modulo);
        }
        else {
            value = value - modulo;
        }
        this.setAttribute('value', `${value}`);
    }
    focusBlurListeners(ball) {
        const increase = () => {
            const value = this.getAttribute('value');
            const newValue = Number(value) + this.step;
            this.setValueAttribute(newValue);
        };
        const decrease = () => {
            const value = this.getAttribute('value');
            const newValue = Number(value) - this.step;
            this.setValueAttribute(newValue);
        };
        const keydown = (e) => {
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
        const mousewheel = (e) => {
            e.preventDefault();
            if (0 < e.deltaY) {
                increase();
            }
            else {
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
        const onMouseMove = (e) => {
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
        const mouseDown = (e) => {
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
SliderComponent.selector = 'slider-component';
exports.SliderComponent = SliderComponent;


/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = "<div class=\"slider-container\">\n    <div class=\"ball\" tabindex=\"0\" id=\"ball\">\n        <h4 id=\"text\">0</h4>\n    </div>\n    <div class=\"line\" id=\"line\"></div>\n</div>\n";

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(4)(undefined);
// imports


// module
exports.push([module.i, ":host {\n    user-select: none;\n    cursor: pointer;\n}\n.slider-container {\n    width: 400px;\n    height: 30px;\n    position: relative;\n    display: flex;\n    justify-content: center;\n    align-items: center;\n}\n.ball {\n    position: relative;\n    width: 30px;\n    height: 100%;\n    background: aliceblue;\n    border-radius: 50%;\n    z-index: 1;\n    box-shadow: 0 0 1px 0 grey;\n    transform: translateX(15px);\n    outline: none;\n    display: flex;\n    justify-content: center;\n    align-items: center;\n}\n.ball:focus {\n    box-shadow: 0 0 1px 1px grey;\n}\n.ball:hover{\n    box-shadow: 0 0 1px 2px grey;\n}\n.line {\n    background: lightblue;\n    width: 100%;\n    height: 50%;\n}\n", ""]);

// exports


/***/ }),
/* 4 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ })
/******/ ]);