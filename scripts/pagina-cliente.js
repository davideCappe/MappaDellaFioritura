const tracks = [
    { title: 'Benvenuta nel tuo spazio', duration: 272 },
    { title: 'Il tuo centro', duration: 318 },
    { title: 'Una piccola intenzione', duration: 246 },
];

const playButton = document.querySelector('[data-play]');
const playIcon = document.querySelector('.play-icon');
const progress = document.querySelector('[data-progress].progress-bar');
const currentTime = document.querySelector('[data-current-time]');
const durationLabel = document.querySelector('[data-duration]');
const trackTitle = document.querySelector('[data-track-title]');
const chapterLinks = [...document.querySelectorAll('[data-chapter]')];
let trackIndex = 0;
let elapsed = 0;
let timer = null;
let audioContext;
let oscillator;

function formatTime(seconds) {
    return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
}

function renderTrack() {
    const track = tracks[trackIndex];
    trackTitle.textContent = track.title;
    durationLabel.textContent = formatTime(track.duration);
    currentTime.textContent = formatTime(elapsed);
    progress.value = (elapsed / track.duration) * 100;
    progress.style.setProperty('--progress', `${progress.value}%`);
}

function stopTone() {
    if (oscillator) {
        oscillator.stop();
        oscillator.disconnect();
        oscillator = null;
    }
}

function startTone() {
    audioContext ??= new AudioContext();
    oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.frequency.value = 196;
    gain.gain.value = 0.018;
    oscillator.connect(gain).connect(audioContext.destination);
    oscillator.start();
}

function setPlaying(playing) {
    clearInterval(timer);
    stopTone();
    playIcon.textContent = playing ? 'Ⅱ' : '▶';
    playButton.setAttribute('aria-label', playing ? 'Metti in pausa' : 'Riproduci traccia');
    if (!playing) return;

    startTone();
    timer = setInterval(() => {
        elapsed += 1;
        if (elapsed >= tracks[trackIndex].duration) {
            nextTrack();
            return;
        }
        renderTrack();
    }, 1000);
}

function nextTrack() {
    trackIndex = (trackIndex + 1) % tracks.length;
    elapsed = 0;
    renderTrack();
    setPlaying(true);
}

function previousTrack() {
    trackIndex = (trackIndex - 1 + tracks.length) % tracks.length;
    elapsed = 0;
    renderTrack();
}

playButton.addEventListener('click', () => setPlaying(playIcon.textContent !== 'Ⅱ'));
document.querySelector('[data-next]').addEventListener('click', nextTrack);
document.querySelector('[data-previous]').addEventListener('click', previousTrack);
document.querySelector('[data-mute]').addEventListener('click', () => {
    if (audioContext?.state === 'running') audioContext.suspend();
    else audioContext?.resume();
});
progress.addEventListener('input', () => {
    elapsed = (Number(progress.value) / 100) * tracks[trackIndex].duration;
    renderTrack();
});

chapterLinks.forEach((link, index) => {
    link.addEventListener('click', () => {
        chapterLinks.forEach((item) => item.classList.remove('is-active'));
        link.classList.add('is-active');
        trackIndex = index;
        elapsed = 0;
        renderTrack();
        document.getElementById(link.dataset.chapter)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

renderTrack();
