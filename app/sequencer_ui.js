const LENGTH_OPTIONS = [
    '1/16t',
    '1/16',
    '1/16d',
    '1/8t',
    '1/8',
    '1/8d',
    '1/4t',
    '1/4',
    '1/4d',
    '1/2t',
    '1/2',
    '1/2d',
];

class SequencerUI {
    constructor(sequencer) {
        this.sequencer = sequencer;
        this.sequencer.ui = this;
        this.createContainer();
        this.bindEventListeners();
        this.drawGrid();
    }

    createContainer() {
        const body = document.querySelector('body');
        this.#appendElement(body, 'div', {
            id: 'seq-container',
            innerHTML: this.innerHTML,
        });
        this.container = document.getElementById('sequencer');
    }

    bindEventListeners() {
        document
            .getElementById('btn-add')
            .addEventListener('click', e => this.onAddStep(e));
        document
            .getElementById('playSeq')
            .addEventListener('click', e => this.onPlay(e));
        document
            .getElementById('stopSeq')
            .addEventListener('click', e => this.onStop(e));
        document
            .getElementById('clearSeq')
            .addEventListener('click', e => this.onClear(e));
        document
            .getElementById('tempo')
            .addEventListener('change', e => this.onTempoChange(e));
    }

    drawGrid() {
        this.sequencer.sequence.forEach(step => {
            this.addStepToUI(step);
        });
    }

    onPlay = event => {
        this.sequencer.toggleRun();
    };

    onStop = event => {
        this.sequencer.stop();
    };

    onTempoChange = event => {
        this.sequencer.setTempo(Number(event.currentTarget.value));
    };

    onChange = e => {
        const target = e.currentTarget;
        const attr = target.name;
        const stepToChange = target.parentElement;
        const stepNumber = [...stepToChange.parentNode.children].indexOf(
            stepToChange
        );
        const value = Number(target.value, 10);
        let step = this.sequencer.sequence[stepNumber];
        step[attr] = value;
        this.sequencer.sequence[stepNumber] = step;
        console.debug(
            `Attribute "${attr}" of step "${stepNumber}" changed to "${value}".`
        );
        this.sequencer.save();
    };

    onDelete = event => {
        const stepToDelete = event.currentTarget.parentElement;
        const stepNumber = [...stepToDelete.parentNode.children].indexOf(
            stepToDelete
        );
        if (stepToDelete) {
            stepToDelete.remove();
            console.debug(`Step "${stepNumber}" deleted.`);
        } else {
            console.warn(`Step "${stepNumber}" not found.`);
        }
        this.sequencer.sequence = this.sequencer.sequence.toSpliced(
            stepNumber,
            1
        );
        if (this.sequencer.sequence.length < 1) {
            this.sequencer.stop();
        }
    };

    onClear = event => {
        console.debug('"Clear sequence" button pressed');
        this.container.replaceChildren();
        this.sequencer.clearSeq();
    };

    onAddStep(event) {
        event.preventDefault();
        const step = {
            value: Number(document.getElementById('new-value').value),
            speedMarker: Number(document.getElementById('new-speed').value),
            correction: Number(document.getElementById('new-corr').value),
            length: Number(document.getElementById('new-len').value),
        };
        this.addStepToUI(step);
        // step.speedMarker = this.calculateSpeed(step.speedMarker);
        this.sequencer.addStep(step);
    }

    calculateSpeed(value) {
        let result = 0.0625 * Math.pow(1.05701804056138037868, value);
        return Math.round(result * 10000) / 10000;
    }

    #addValueInput(parent, step) {
        this.#createInput(parent, 'value', {
            min: 0,
            max: 9,
            value: step.value,
        });
    }

    #addSpeedInput(parent, step) {
        this.#createInput(parent, 'speedMarker', {
            min: 0,
            max: 100,
            value: step.speedMarker,
        });
    }

    #addCorrectionInput(parent, step) {
        this.#createInput(parent, 'correction', {
            value: step.correction,
            style: { display: 'none' },
        });
    }

    #addLengthSelection(parent, step) {
        this.#createSelect(parent, 'length', LENGTH_OPTIONS, {
            selected: step.length,
        });
    }

    #addDeleteButton(parent, step) {
        this.#appendElement(parent, 'button', {
            className: 'btn-del',
            textContent: '-',
            onclick: e => this.onDelete(e),
        });
    }

    addStepToUI(step) {
        const gridItem = this.#appendElement(this.container, 'div', {
            className: 'grid-item step',
        });

        this.#addValueInput(gridItem, step);
        this.#addSpeedInput(gridItem, step);
        this.#addCorrectionInput(gridItem, step);
        this.#addLengthSelection(gridItem, step);
        this.#addDeleteButton(gridItem, step);
    }

    updateCurrentStep(currentIndex) {
        for (let i = 0; i < this.container.children.length; i++) {
            this.container.children[i].classList.toggle(
                'current-step',
                i == currentIndex
            );
        }
    }

    innerHTML = `
    <h1>Youtube Sequencer</h1>
    <div id="add-step">
        <label for="tempo">Tempo</label>
        <input type="number" value="120" id="tempo" min="20" max="250">
        <div style="width: 20em;"></div>
        <label for="new-value">Value</label>
        <input type="number" value="0" id="new-value" min="0" max="9">
        <input type="number" value="50" id="new-speed">
        <input type="number" value="0" id="new-corr">
        <select id="new-len" name="len">
            <option value=0>1/16t</option>
            <option value=1>1/16</option>
            <option value=2>1/16d</option>
            <option value=3>1/8t</option>
            <option value=4>1/8</option>
            <option value=5>1/8d</option>
            <option value=6>1/4t</option>
            <option value=7 selected="selected">1/4</option>
            <option value=8>1/4d</option>
            <option value=9>1/2t</option>
            <option value=10>1/2</option>
            <option value=11>1/2d</option>
        </select>
        <button id="btn-add">+</button>
    </div>
    <div id="sequencer" class="grid-container">
        <!-- Dynamically populated steps will go here -->
    </div>
    <div class="playback-controls">
        <button id="playSeq">&#9199; Play</button>
        <button id="stopSeq">&#9209; Stop</button>
        <button id="clearSeq">&#128465; Clear Sequence</button>
    </div>
    `;

    #createElement(type, properties) {
        const element = document.createElement(type);
        let { style, ...props } = properties;
        Object.assign(element, props);
        Object.assign(element.style, style);
        return element;
    }

    #appendElement(parent, type, properties) {
        const element = this.#createElement(type, properties);
        parent.appendChild(element);
        return element;
    }

    #createInput(parent, name, props = {}) {
        const defaultProps = {
            name: name,
            type: 'number',
            onchange: e => this.onChange(e),
        };
        Object.assign(defaultProps, props);
        this.#appendElement(parent, 'input', defaultProps);
    }

    #createSelect(parent, name, options, props = {}) {
        props.name = name;
        props.onchange = e => this.onChange(e);
        let { selected, ...properties } = props;
        const select = this.#appendElement(parent, 'select', properties);
        options.forEach((optionText, index) => {
            this.#appendElement(select, 'option', {
                value: index,
                textContent: optionText,
                selected: index === selected,
            });
        });
    }
}
