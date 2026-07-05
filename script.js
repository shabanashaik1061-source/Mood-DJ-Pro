// ===============================
// MOOD DJ PRO - FULL SCRIPT
// Part 3B (Single File)
// ===============================


// -----------------------------
// SONG DATABASE
// -----------------------------

const songLibrary = {

    telugu: {
        happy: [
            { title: "Bujji Thalli", artist: "Thandel" },
            { title: "Neevalle", artist: "Sid Sriram" },
            { title: "Hridayam Lopala", artist: "Kingdom" }
        ],
        sad: [
            { title: "Yemi Cheyamanduve", artist: "Sakhi" },
            { title: "Pasi Manase", artist: "Kaantha" }
        ],
        energetic: [
            { title: "Dabidi Dibidi", artist: "Thaman S" },
            { title: "Ramuloo Ramulaa", artist: "Ala Vaikunthapurramuloo" }
        ]
    },

    hindi: {
        happy: [
            { title: "Sooraj Dooba Hain", artist: "Roy" },
            { title: "Gallan Goodiyaan", artist: "Dil Dhadakne Do" }
        ],
        sad: [
            { title: "Channa Mereya", artist: "Ae Dil Hai Mushkil" },
            { title: "Agar Tum Saath Ho", artist: "Tamasha" }
        ],
        energetic: [
            { title: "Malhari", artist: "Bajirao Mastani" },
            { title: "Zingaat", artist: "Dhadak" }
        ]
    },

    tamil: {
        happy: [
            { title: "Jolly O Gymkhana", artist: "Beast" },
            { title: "Kutti Story", artist: "Master" }
        ],
        sad: [
            { title: "Po Nee Po", artist: "3" },
            { title: "Kanave Kanave", artist: "David" }
        ],
        energetic: [
            { title: "Pathala Pathala", artist: "Vikram" },
            { title: "Rakita Rakita", artist: "Jagame Thandhiram" }
        ]
    },

    english: {
        happy: [
            { title: "Happy", artist: "Pharrell Williams" },
            { title: "Walking on Sunshine", artist: "Katrina" }
        ],
        sad: [
            { title: "Someone Like You", artist: "Adele" },
            { title: "Fix You", artist: "Coldplay" }
        ],
        energetic: [
            { title: "Blinding Lights", artist: "The Weeknd" },
            { title: "Eye of the Tiger", artist: "Survivor" }
        ]
    }
};


// -----------------------------
// STATE VARIABLES
// -----------------------------

let selectedMood = "";
let selectedLanguage = "";

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let recentSongs = JSON.parse(localStorage.getItem("recentSongs")) || [];


// -----------------------------
// MOOD SELECTION
// -----------------------------

document.querySelectorAll(".mood-card").forEach(card => {

    card.addEventListener("click", () => {

        document.querySelectorAll(".mood-card")
        .forEach(c => c.classList.remove("selected"));

        card.classList.add("selected");

        selectedMood = card.dataset.mood;

    });

});


// -----------------------------
// LANGUAGE SELECTION
// -----------------------------

document.querySelectorAll(".language-card").forEach(card => {

    card.addEventListener("click", () => {

        document.querySelectorAll(".language-card")
        .forEach(c => c.classList.remove("selected"));

        card.classList.add("selected");

        selectedLanguage = card.dataset.language;

    });

});
document.getElementById("darkModeBtn")
.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    showToast(
        document.body.classList.contains("dark")
        ? "Dark Mode Enabled 🌙"
        : "Light Mode Enabled ☀️"
    ); 
});

// -----------------------------
// SHOW SONGS BUTTON
// -----------------------------

document
.getElementById("showSongsBtn")
.addEventListener("click", showSongs);


// -----------------------------
// SHOW SONGS FUNCTION
// -----------------------------

function showSongs() {

    const container = document.getElementById("songsContainer");

    container.innerHTML = "";

    if (!selectedMood || !selectedLanguage) {

        container.innerHTML =
        "<h2 style='color:white;'>Please select mood and language</h2>";

        return;
    }

    const songs = songLibrary[selectedLanguage][selectedMood];

    songs.forEach(song => {

        const card = document.createElement("div");

        card.className = "song-card";

        card.innerHTML = `

            <h4>🎵 ${song.title}</h4>

            <p><strong>Artist:</strong> ${song.artist}</p>

            <button class="playBtn">▶ Play</button>

            <button class="favoriteBtn">❤️ Favorite</button>

        `;

        // PLAY BUTTON
        card.querySelector(".playBtn").addEventListener("click", () => {
            playSong(song);
        });

        // FAVORITE BUTTON
        card.querySelector(".favoriteBtn").addEventListener("click", () => {
            addFavorite(song);
        });

        container.appendChild(card);

    });
}
document.getElementById("randomBtn")
.addEventListener("click", () => {

    if (!selectedMood || !selectedLanguage) {
        showToast("Select mood & language first!");
        return;
    }

    const songs = songLibrary[selectedLanguage][selectedMood];

    const randomSong = songs[Math.floor(Math.random() * songs.length)];
    showToast("🎲 Random Song: " + randomSong.title);
    playSong(randomSong);
});

function showToast(message) {

    const toast = document.getElementById("toast");

    toast.innerText = message;

    toast.style.display = "block";

    setTimeout(() => {
        toast.style.display = "none";
    }, 2000);
}

// -----------------------------
// PLAY SONG
// -----------------------------

function playSong(song) {

    // Now Playing UI update
    const nowPlaying = document.getElementById("nowPlaying");

    if (nowPlaying) {

        nowPlaying.innerHTML = `
            <div class="musicIcon">🎧</div>
            <h2>${song.title}</h2>
            <p>${song.artist}</p>
        `;
    }

    // Save recent
    recentSongs.unshift(song);
    recentSongs = recentSongs.slice(0, 5);

    localStorage.setItem("recentSongs", JSON.stringify(recentSongs));

    displayRecent();
    showToast("Playing: " + song.title);
    // Open YouTube
    const query = encodeURIComponent(song.title + " " + song.artist + " official song");

    window.open(
        "https://www.youtube.com/results?search_query=" + query,
        "_blank"
    );
}


// -----------------------------
// ADD FAVORITE
// -----------------------------

function addFavorite(song) {

    const exists = favorites.some(s => s.title === song.title);

    if (exists) {
        alert("Already in Favorites ❤️");
        return;
    }

    favorites.push(song);

    localStorage.setItem("favorites", JSON.stringify(favorites));

    displayFavorites();
    showToast("Added to Favorites ❤️");
}


// -----------------------------
// DISPLAY FAVORITES
// -----------------------------

function displayFavorites() {

    const container = document.getElementById("favoriteContainer");

    container.innerHTML = "";

    favorites.forEach(song => {

        container.innerHTML += `
            <div class="song-card">
                ❤️ ${song.title}
                <br>
                <small>${song.artist}</small>
            </div>
        `;
    });
}


// -----------------------------
// DISPLAY RECENT SONGS
// -----------------------------

function displayRecent() {

    const container = document.getElementById("recentContainer");

    container.innerHTML = "";

    recentSongs.forEach(song => {

        container.innerHTML += `
            <div class="song-card">
                🕒 ${song.title}
                <br>
                <small>${song.artist}</small>
            </div>
        `;
    });
}


// -----------------------------
// LIVE SEARCH
// -----------------------------

document.getElementById("searchSong")
.addEventListener("keyup", function () {

    const value = this.value.toLowerCase();

    const cards = document.querySelectorAll(".song-card");

    cards.forEach(card => {

        if (card.innerText.toLowerCase().includes(value)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }

    });

});


// -----------------------------
// INIT LOAD
// -----------------------------

displayFavorites();
displayRecent();