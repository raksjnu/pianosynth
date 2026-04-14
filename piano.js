const piano = document.getElementById('piano');
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// Generate 128 keys
for (let i = 0; i < 128; i++) {
    const key = document.createElement('div');
    const note = i % 12; // 0-11
    const isBlack = [1, 3, 6, 8, 10].includes(note);
    key.className = `key ${isBlack ? 'black' : 'white'}`;
    key.dataset.note = i;
    
    key.addEventListener('mousedown', () => playNote(i));
    key.addEventListener('mouseup', () => stopNote(i));
    
    piano.appendChild(key);
}

function playNote(midiNote) {
    const osc = audioCtx.createOscillator();
    osc.type = 'triangle';
    // Frequency Formula: 440 * 2^((midiNote - 69) / 12)
    osc.frequency.value = 440 * Math.pow(2, (midiNote - 69) / 12);
    osc.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.5); // Short sound
}

// MIDI Input Handling
if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess().then(onMIDISuccess);
}

function onMIDISuccess(midiAccess) {
    for (var input of midiAccess.inputs.values()) {
        input.onmidimessage = getMIDIMessage;
    }
}

function getMIDIMessage(message) {
    var command = message.data[0];
    var note = message.data[1];
    var velocity = (message.data.length > 2) ? message.data[2] : 0;
    
    if (command === 144 && velocity > 0) { // Note on
        playNote(note);
    }
}
