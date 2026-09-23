const tracks = [
    { title: 'Talenti', src: 'audio/TALENTI.ogg' },
    { title: 'Relazioni', src: 'audio/RELAZIONI.ogg' },
    { title: 'Karma Materiale', src: 'audio/TALENTI.ogg' },
    { title: 'Finanze', src: 'audio/RELAZIONI.ogg' },
    { title: 'Coda Karmica', src: 'audio/TALENTI.ogg' },
    { title: 'Talenti Materiali', src: 'audio/RELAZIONI.ogg' },
];

const playButton = document.querySelector('[data-play]');
const playIcon = document.querySelector('.play-icon');
const progressInputs = [...document.querySelectorAll('[data-progress]')];
const currentTime = document.querySelector('[data-current-time]');
const durationLabel = document.querySelector('[data-duration]');
const trackTitle = document.querySelector('[data-track-title]');
const chapterLinks = [...document.querySelectorAll('[data-chapter]')];
const audio = document.querySelector('[data-audio]');
let trackIndex = 0;

function formatTime(seconds) {
    return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
}

function renderTrack() {
    const track = tracks[trackIndex];
    trackTitle.textContent = track.title;
    const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
    const percentage = duration ? (audio.currentTime / duration) * 100 : 0;
    durationLabel.textContent = duration ? formatTime(duration) : '--:--';
    currentTime.textContent = formatTime(audio.currentTime || 0);
    progressInputs.forEach((input) => {
        input.value = percentage;
        input.style.setProperty('--progress', `${percentage}%`);
    });
}

function loadTrack(autoplay = false) {
    audio.src = tracks[trackIndex].src;
    audio.load();
    renderTrack();
    if (autoplay) audio.play();
}

function nextTrack() {
    trackIndex = (trackIndex + 1) % tracks.length;
    loadTrack(true);
}

function previousTrack() {
    trackIndex = (trackIndex - 1 + tracks.length) % tracks.length;
    loadTrack(false);
}

playButton.addEventListener('click', () => {
    if (audio.paused) audio.play();
    else audio.pause();
});
document.querySelector('[data-next]').addEventListener('click', nextTrack);
document.querySelector('[data-previous]').addEventListener('click', previousTrack);
document.querySelector('[data-mute]').addEventListener('click', () => {
    audio.muted = !audio.muted;
});
progressInputs.forEach((input) => input.addEventListener('input', () => {
    if (Number.isFinite(audio.duration)) {
        audio.currentTime = (Number(input.value) / 100) * audio.duration;
    }
    renderTrack();
}));
audio.addEventListener('loadedmetadata', renderTrack);
audio.addEventListener('timeupdate', renderTrack);
audio.addEventListener('play', () => {
    playIcon.textContent = 'Ⅱ';
    playButton.setAttribute('aria-label', 'Metti in pausa');
});
audio.addEventListener('pause', () => {
    playIcon.textContent = '▶';
    playButton.setAttribute('aria-label', 'Riproduci traccia');
});
audio.addEventListener('ended', nextTrack);

chapterLinks.forEach((link, index) => {
    link.addEventListener('click', () => {
        chapterLinks.forEach((item) => item.classList.remove('is-active'));
        link.classList.add('is-active');
        trackIndex = index;
        loadTrack(false);
        document.getElementById(link.dataset.chapter)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

loadTrack(false);
