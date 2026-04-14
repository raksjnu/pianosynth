const piano = document.getElementById('piano-container');
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// Function to play a tone
function playNote(midiNote) {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    // Calculate frequency for the MIDI note
    oscillator.frequency.setValueAtTime(440 * Math.pow(2, (midiNote - 69) / 12), audioCtx.currentTime);
    oscillator.type = 'sine'; // Can change to 'square', 'sawtooth', or 'triangle'

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1);
    oscillator.stop(audioCtx.currentTime + 1);
}

// Generate 128 keys (MIDI notes 0-127)
for (let i = 0; i < 128; i++) {
    const key = document.createElement('div');
    key.className = 'key';
    
    // Determine if note is black (sharps/flats)
    const noteInOctave = i % 12;
    if ([1, 3, 6, 8, 10].includes(noteInOctave)) {
        key.classList.add('black');
    }

    key.addEventListener('mousedown', () => playNote(i));
    piano.appendChild(key);
}
