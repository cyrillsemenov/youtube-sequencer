const indexToFraction = {
    0: 0.166, // 1/16t
    1: 0.2498, // 1/16
    2: 0.375, // 1/16d
    3: 0.33332, // 1/8t
    4: 0.5, // 1/8
    5: 0.75, // 1/8d
    6: 0.6664, // 1/4t
    7: 1, // 1/4
    8: 1.5, // 1/4d
    9: 1.3332, // 1/2t
    10: 2, // 1/2
    11: 3, // 1/2d
};

class Sequencer {
    constructor(tempo = 120) {
        this.sequence = [];
        this.currentIndex = 0;
        this.timeoutId = null;
        this.ui = null;
        this.running = false;
        this.setTempo(tempo);

        this.video = document.querySelector('video');

        this.load();
    }

    save() {
        const toSave = {
            sequence: this.sequence,
        };
        localStorage.setItem('sequence', JSON.stringify(toSave));
        console.debug('Sequence was saved.');
    }

    load() {
        const savedSequence = localStorage.getItem('sequence');
        if (savedSequence) {
            Object.assign(this, JSON.parse(savedSequence));
            console.log('Sequence was loaded.');
        }
        for (let i = 0; i < this.sequence.length; i++) {
            this.sequence[i].actualSpeed = this.calculateSpeed(
                this.sequence[i].speedMarker
            );
        }
    }

    calculateSpeed(value) {
        let result = 0.0625 * Math.pow(1.05701804056138037868, value);
        return Math.round(result * 10000) / 10000;
    }

    setTempo(bpm) {
        this.tempo = 60000 / bpm;
    }

    addStep(step) {
        step.actualSpeed = this.calculateSpeed(step.speedMarker);
        this.sequence.push(step);
        this.save();
    }

    processStep(step) {
        console.debug(
            `Processing step: Value=${step.value}, SpeedMarker=${step.speedMarker}, Correction=${step.correction}, Length=${step.length}`
        );
        this.interval = this.tempo * indexToFraction[step.length];
        this.simulateKeyPress('0123456789'.charCodeAt(step.value));
        // const speedDir = step.speedMarker > 0 ? 188 : 190;
        const correctionDir = 'jl'.charCodeAt(Number(step.correction > 0));
        this.video.playbackRate = step.actualSpeed;
        // for (let i = 0; i < Math.abs(step.speedMarker); i++) {
        //   this.simulateKeyPress(speedDir, true);
        // }
        for (let i = 0; i < Math.abs(step.correction); i++) {
            this.simulateKeyPress(correctionDir);
        }
    }

    simulateKeyPress(keyCode, shiftKey = false) {
        document.dispatchEvent(
            new KeyboardEvent('keydown', {
                bubbles: true,
                cancelable: true,
                keyCode: keyCode,
                charCode: keyCode,
                shiftKey: shiftKey,
            })
        );
    }

    toggleRun() {
        if (this.running) {
            this.video.pause();
            clearTimeout(this.timeoutId);
            this.running = false;
        } else {
            this.video.play();
            this.run();
        }
    }

    run() {
        if (this.sequence.length < 1) {
            this.running = false;
            console.warn('Sequence is empty.');
            return;
        }
        this.currentIndex %= this.sequence.length;
        if (this.ui) {
            this.ui.updateCurrentStep(this.currentIndex);
        }
        this.processStep(this.sequence[this.currentIndex++]);
        this.timeoutId = setTimeout(() => this.run(), this.interval);
        this.running = true;
    }

    stop() {
        this.video.pause();
        clearTimeout(this.timeoutId);
        this.currentIndex = 0;
        if (this.ui) {
            this.ui.updateCurrentStep(this.currentIndex);
        }
        this.running = false;
    }

    clearSeq() {
        this.stop();
        this.sequence = [];
        this.save();
    }
}

const mySequencer = new Sequencer(120);
const sequencerUI = new SequencerUI(mySequencer);
