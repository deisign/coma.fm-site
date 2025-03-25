
const playerContainer = document.getElementById("nowplaying-player");

playerContainer.innerHTML = `
  <div style="position:fixed; bottom:20px; left:50%; transform:translateX(-50%);
       background: rgba(0,0,0,0.5); backdrop-filter: blur(10px);
       border-radius: 1rem; padding: 1rem 2rem; color: white;
       display: flex; align-items: flex-start; z-index:10; gap: 1rem;">

    <img id="artwork" src="" width="64" height="64" style="border-radius:8px; margin-top: 4px;">

    <div style="line-height: 1.4;">
      <div id="title" style="font-weight: bold;">Loading...</div>
      <div id="artist" style="opacity: 0.8;">...</div>
      <div id="album" style="opacity: 0.6;">альбом: невідомо</div>
      <div id="tags" style="opacity: 0.6;">жанри: ...</div>
      <a id="spotify-link" href="#" target="_blank" style="color:#1DB954; text-decoration:none; font-weight:bold;">🎧 Відкрити в Spotify</a>
    </div>

    <audio id="audio" autoplay controls style="margin-left: auto; margin-top: 0.4rem;">
      <source src="https://stream.radio.co/s4360dbc20/listen" type="audio/mpeg">
    </audio>
  </div>
`;

const LASTFM_API_KEY = "c7a0f0ef6e54d0bc9c877ef6cdaf3949";
const SPOTIFY_CLIENT_ID = "c129e640644a4b00aea9f879d5dd54f1";
const SPOTIFY_CLIENT_SECRET = "ed3cf875c7a0492bb93a0aed5a5eaefd";

function fetchTrack() {
  fetch("https://public.radio.co/stations/s4360dbc20/status")
    .then(response => response.json())
    .then(data => {
      const track = data.current_track;
      const artist = track.artist;
      const title = track.title;
      document.getElementById("title").textContent = title;
      document.getElementById("artist").textContent = artist;
      document.getElementById("artwork").src = track.artwork_url || "";

      fetchLastFM(artist, title);
      fetchSpotifyLink(artist, title);
    });
}

function fetchLastFM(artist, title) {
  const url = `https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${LASTFM_API_KEY}&artist=${encodeURIComponent(artist)}&track=${encodeURIComponent(title)}&format=json`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (data && data.track) {
        const album = data.track.album ? data.track.album.title : "невідомо";
        const tags = data.track.toptags?.tag?.slice(0, 4).map(t => t.name).join(", ") || "—";
        document.getElementById("album").textContent = `альбом: ${album}`;
        document.getElementById("tags").textContent = `теги: ${tags}`;
      }
    });
}

let spotifyToken = null;
function fetchSpotifyToken() {
  return fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": "Basic " + btoa(SPOTIFY_CLIENT_ID + ":" + SPOTIFY_CLIENT_SECRET)
    },
    body: "grant_type=client_credentials"
  })
    .then(res => res.json())
    .then(data => {
      spotifyToken = data.access_token;
    });
}

function fetchSpotifyLink(artist, title) {
  if (!spotifyToken) {
    fetchSpotifyToken().then(() => fetchSpotifyLink(artist, title));
    return;
  }
  const q = encodeURIComponent(`${artist} ${title}`);
  fetch(`https://api.spotify.com/v1/search?q=${q}&type=track&limit=1`, {
    headers: {
      "Authorization": "Bearer " + spotifyToken
    }
  })
    .then(res => res.json())
    .then(data => {
      const track = data.tracks.items[0];
      if (track) {
        document.getElementById("spotify-link").href = track.external_urls.spotify;
      } else {
        document.getElementById("spotify-link").textContent = "Spotify не знайдено";
        document.getElementById("spotify-link").style.color = "gray";
      }
    });
}

fetchTrack();
setInterval(fetchTrack, 30000);
