const content = document.querySelector(".content"),
    Playimage = content.querySelector(".music-image img"),
    musicName = content.querySelector(".music-titles .name"),
    musicArtist = content.querySelector(".music-titles .artist"),
    Audio = document.querySelector(".main-song"),
    playBtn = content.querySelector(".play-pause"),
    playBtnIcon = content.querySelector(".play-pause span"),
    prevBtn = content.querySelector("#prev"),
    nextBtn = content.querySelector("#next"),
    progressBar = content.querySelector(".progress-bar"),
    progressDetails = content.querySelector(".progress-details"),
    repeatBtn = content.querySelector("#repeat"),
    Shuffle = content.querySelector("#shuffle"),
    volumeSlider = document.getElementById('volume-slider'),
    muteButton = document.getElementById('mute'),
    form = document.getElementById('toForm'),
    modal = document.getElementById('id01'),
    overlay = document.getElementById('overlay'); // Ensure there's an overlay element

let index = 1;

window.addEventListener("load", () => {
    loadData(index);
    Audio.play();
    displayTrackList();
});

function loadData(indexValue) {
    musicName.innerHTML = songs[indexValue - 1].name;
    musicArtist.innerHTML = songs[indexValue - 1].artist;
    Playimage.src = "images/" + songs[indexValue - 1].img + ".jpg";
    Audio.src = "music/" + songs[indexValue - 1].audio + ".mp3";
}

playBtn.addEventListener("click", () => {
    const isMusicPaused = content.classList.contains("paused");
    if (isMusicPaused) {
        pauseSong();
    } else {
        playSong();
    }
});

function playSong() {
    content.classList.add("paused");
    playBtnIcon.innerHTML = "pause";
    Audio.play();
}

function pauseSong() {
    content.classList.remove("paused");
    playBtnIcon.innerHTML = "play_arrow";
    Audio.pause();
}

nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", prevSong);

function nextSong() {
    index++;
    if (index > songs.length) {
        index = 1;
    }
    loadData(index);
    playSong();
}

function prevSong() {
    index--;
    if (index <= 0) {
        index = songs.length;
    }
    loadData(index);
    playSong();
}

Audio.addEventListener("loadeddata", () => {
    let finalTimeData = content.querySelector(".final");
    let AudioDuration = Audio.duration;
    let finalMinutes = Math.floor(AudioDuration / 60);
    let finalSeconds = Math.floor(AudioDuration % 60);
    finalTimeData.innerText = `${finalMinutes}:${finalSeconds < 10 ? '0' : ''}${finalSeconds}`;
});

Audio.addEventListener("timeupdate", (e) => {
    let initialTime = e.target.currentTime;
    let finalTime = e.target.duration;
    let BarWidth = (initialTime / finalTime) * 100;
    progressBar.style.width = `${BarWidth}%`;

    let currentMinutes = Math.floor(initialTime / 60);
    let currentSeconds = Math.floor(initialTime % 60);
    let currentTimeData = content.querySelector(".current");
    currentTimeData.innerText = `${currentMinutes}:${currentSeconds < 10 ? '0' : ''}${currentSeconds}`;
});

progressDetails.addEventListener("click", (e) => {
    let progressValue = progressDetails.clientWidth;
    let clickedOffsetX = e.offsetX;
    let MusicDuration = Audio.duration;
    Audio.currentTime = (clickedOffsetX / progressValue) * MusicDuration;
});

Shuffle.addEventListener("click", () => {
    let randIndex = Math.floor(Math.random() * songs.length) + 1;
    loadData(randIndex);
    playSong();
});

Audio.addEventListener("ended", () => {
    index++;
    if (index > songs.length) {
        index = 1;
    }
    loadData(index);
    playSong();
});

function displayTrackList() {
    const trackListContainer = document.getElementById("track-list-container");
    trackListContainer.innerHTML = "";

    songs.forEach((song, idx) => {
        const listItem = document.createElement("li");

        const imageWrapper = document.createElement("div");
        imageWrapper.classList.add("image-wrapper");

        const image = document.createElement("img");
        image.src = `images/${song.img}.jpg`;
        image.title = song.name;
        image.classList.add("song-image");

        imageWrapper.appendChild(image);
        listItem.appendChild(imageWrapper);

        const songInfo = document.createElement("div");
        songInfo.classList.add("song-info");

        const songTitle = document.createElement("p");
        songTitle.textContent = song.name;
        songTitle.classList.add("song-title");

        const songArtist = document.createElement("p");
        songArtist.textContent = song.artist;
        songArtist.classList.add("song-artist");

        const songDuration = document.createElement("p");
        songDuration.textContent = formatTime(song.duration);
        songDuration.classList.add("song-duration");
        songInfo.appendChild(songTitle);
        songInfo.appendChild(songArtist);
        songInfo.appendChild(songDuration);

        listItem.appendChild(songInfo);

        listItem.addEventListener("click", () => {
            index = idx + 1;
            loadData(index);
            playSong();
        });

        trackListContainer.appendChild(listItem);
    });
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

function toggleMute() {
    if (Audio.muted) {
        Audio.muted = false;
        muteButton.innerHTML = 'volume_off';  // Icon for unmuted state
        volumeSlider.value = Audio.volume;   // Restore previous volume level
    } else {
        Audio.muted = true;
        muteButton.innerHTML = 'volume_mute';  // Icon for muted state
        volumeSlider.value = 0;   // Set volume slider to 0
    }
}

volumeSlider.addEventListener('input', function() {
    Audio.volume = volumeSlider.value;
    if (volumeSlider.value == '0') {
        muteButton.innerHTML = 'volume_up';
    } else {
        muteButton.innerHTML = 'volume_off';
    }
});

function openModal() {
    modal.style.display = 'block';
    overlay.style.display = 'block'; // Show overlay
    setTimeout(() => {
        modal.style.backgroundColor = 'rgba(0,0,0,0.7)';
        document.querySelector('.modal-content').style.opacity = '1';
    }, 10);
}

function closeModal() {
    modal.style.backgroundColor = 'rgba(0,0,0,0)'; // Optional: To clear any background color
    document.querySelector('.modal-content').style.opacity = '0'; // Fade out the content
    
    setTimeout(() => {
        modal.style.display = 'none'; // Hide the modal
        overlay.style.display = 'none'; // Hide the overlay
    }, 300); // Ensure this matches the opacity transition duration
}

function closeModalOnly() {
    const modal = document.getElementById('id01');
    const overlay = document.getElementById('overlay');
    const form = document.getElementById('toForm');

    // Hide the modal and overlay after the transition
    setTimeout(() => {
        modal.style.display = 'none'; // Hide the modal
        overlay.style.display = 'block'; // Hide the overlay
        form.style.display = 'block';
    }, 300); // Ensure this matches your CSS transition duration
}


document.getElementById('logIn').addEventListener('click', openModal);

document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault(); 
    handleLoginSuccess(); 
});

function handleLoginSuccess() {
    // Hide the form and display the content
    document.getElementById('toForm').style.display = 'none';
    document.querySelector('.content').classList.remove('hidden');
    closeModal(); // Close the modal
}


// Function to switch to sign-up form
function showSignUp() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('sign-up-form').style.display = 'block';
}

// Function to switch to login form
function showLogin() {
    document.getElementById('sign-up-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
}

// Function to sign up a new user
function signUp() {
    const username = document.getElementById('new-username').value;
    const password = document.getElementById('new-password').value;
    
    if (username && password) {
        localStorage.setItem('username', username);
        localStorage.setItem('password', password);
        alert('Sign Up successful! You can now log in.');
        showLogin();
    } else {
        alert('Please enter both username and password.');
    }
}

// Function to log in a user
function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    
    const storedUsername = localStorage.getItem('username');
    const storedPassword = localStorage.getItem('password');
    
    if (username === storedUsername && password === storedPassword) {
        alert('Login successful!');
        closeModal();
    } else {
        alert('Invalid credentials.');
    }
}