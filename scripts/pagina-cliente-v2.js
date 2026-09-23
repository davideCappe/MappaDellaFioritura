const tracks = [
    { title: 'Talenti', src: 'audio/TALENTI.ogg', copy: 'Le energie che sostengono ciò che sai esprimere.' },
    { title: 'Relazioni', src: 'audio/RELAZIONI.ogg', copy: 'I numeri che parlano del tuo modo di incontrare gli altri.' },
    { title: 'Karma Materiale', src: 'audio/TALENTI.ogg', copy: 'Le energie da osservare nel rapporto con il mondo concreto.' },
    { title: 'Finanze', src: 'audio/RELAZIONI.ogg', copy: 'Il canale collegato allo scambio e alle risorse.' },
    { title: 'Coda Karmica', src: 'audio/TALENTI.ogg', copy: 'I punti che raccontano una lezione da integrare.' },
    { title: 'Talenti Materiali', src: 'audio/RELAZIONI.ogg', copy: 'Le qualità da portare nella vita quotidiana.' },
];

const matrixPoints = {
    eta0: [10, 121, 500], eta10: [18, 233, 233], eta20: [8, 501, 122], eta30: [11, 768, 233], eta40: [21, 879, 500], eta50: [6, 768, 768], eta60: [12, 501, 879], eta70: [22, 233, 768],
    centro: [6, 502, 500], top1: [22, 501, 198], top2: [14, 501, 252], top3: [20, 501, 355], left1: [8, 197, 500], left2: [16, 251, 500], left3: [22, 355, 500], right1: [9, 750, 500], right2: [3, 803, 500], right3: [12, 576, 500], right4: [18, 630, 500], bottom1: [18, 501, 750], bottom2: [3, 501, 803],
    upLeft1: [3, 286, 286], upLeft2: [3, 324, 324], upRight1: [16, 714, 286], upRight2: [5, 677, 324], downLeft2: [7, 324, 677], downLeft3: [11, 286, 714], downRight1: [18, 677, 677], downRight2: [6, 714, 714], moneyLove1: [9, 613, 613], moneyLove2: [18, 678, 548], moneyLove3: [9, 548, 677],
};

const highlightGroups = [
    ['centro', 'top1', 'top2', 'top3', 'upLeft1', 'upLeft2', 'upRight1', 'upRight2'],
    ['left1', 'left2', 'left3', 'right1', 'right2', 'right3', 'right4'],
    ['moneyLove1', 'moneyLove2', 'moneyLove3'],
    ['right1', 'right2', 'moneyLove1', 'moneyLove2', 'moneyLove3'],
    ['bottom1', 'bottom2', 'downLeft2', 'downLeft3', 'downRight1', 'downRight2'],
    ['centro', 'left3', 'right3', 'moneyLove3'],
];

const svgGroup = document.querySelector('[data-matrix-numbers]');
const trackList = document.querySelector('[data-track-list]');
const trackTitle = document.querySelector('[data-track-title]');
const highlightTitle = document.querySelector('[data-highlight-title]');
const highlightCopy = document.querySelector('[data-highlight-copy]');
const audio = document.querySelector('[data-audio]');
const playButton = document.querySelector('[data-play]');
const playIcon = document.querySelector('.play-icon');
const progressInputs = [...document.querySelectorAll('[data-progress]')];
const currentTime = document.querySelector('[data-current-time]');
const durationLabel = document.querySelector('[data-duration]');
let trackIndex = 0;
let pointElements = new Map();

function formatTime(seconds) { return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`; }

function drawMatrix() {
    Object.entries(matrixPoints).forEach(([key, [value, x, y]]) => {
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.dataset.point = key;
        group.classList.add('matrix-point');
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', x); circle.setAttribute('cy', y); circle.setAttribute('r', key === 'centro' ? 42 : 27);
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', x); text.setAttribute('y', y); text.textContent = value;
        group.append(circle, text); svgGroup.append(group); pointElements.set(key, group);
    });
}

function setTrack(index, autoplay = false) {
    trackIndex = (index + tracks.length) % tracks.length;
    const track = tracks[trackIndex];
    trackTitle.textContent = track.title;
    highlightTitle.textContent = track.title;
    highlightCopy.textContent = track.copy;
    document.querySelectorAll('[data-track-index]').forEach((item, itemIndex) => item.classList.toggle('is-active', itemIndex === trackIndex));
    pointElements.forEach((point) => point.classList.remove('is-highlighted'));
    (highlightGroups[trackIndex] || []).forEach((key) => pointElements.get(key)?.classList.add('is-highlighted'));
    audio.src = track.src; audio.load(); renderProgress();
    if (autoplay) audio.play().catch(() => { });
}

function renderProgress() {
    const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
    const percentage = duration ? (audio.currentTime / duration) * 100 : 0;
    currentTime.textContent = formatTime(audio.currentTime || 0); durationLabel.textContent = duration ? formatTime(duration) : '--:--';
    progressInputs.forEach((input) => { input.value = percentage; input.style.setProperty('--progress', `${percentage}%`); });
}

function renderPlaylist() {
    trackList.replaceChildren(...tracks.map((track, index) => {
        const button = document.createElement('button'); button.type = 'button'; button.dataset.trackIndex = index; button.innerHTML = `<span>${String(index + 1).padStart(2, '0')}</span><strong>${track.title}</strong>`; button.addEventListener('click', () => setTrack(index)); return button;
    }));
}

drawMatrix(); renderPlaylist(); setTrack(0);
document.querySelector('[data-next]').addEventListener('click', () => setTrack(trackIndex + 1, true));
document.querySelector('[data-previous]').addEventListener('click', () => setTrack(trackIndex - 1));
playButton.addEventListener('click', () => audio.paused ? audio.play().catch(() => { }) : audio.pause());
document.querySelector('[data-mute]').addEventListener('click', () => { audio.muted = !audio.muted; });
progressInputs.forEach((input) => input.addEventListener('input', () => { if (Number.isFinite(audio.duration)) audio.currentTime = Number(input.value) / 100 * audio.duration; renderProgress(); }));
audio.addEventListener('loadedmetadata', renderProgress); audio.addEventListener('timeupdate', renderProgress); audio.addEventListener('ended', () => setTrack(trackIndex + 1, true));
audio.addEventListener('play', () => { playIcon.textContent = 'Ⅱ'; playButton.setAttribute('aria-label', 'Metti in pausa'); });
audio.addEventListener('pause', () => { playIcon.textContent = '▶'; playButton.setAttribute('aria-label', 'Riproduci traccia'); });
