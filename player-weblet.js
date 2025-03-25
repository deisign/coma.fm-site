
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
    </div>

    <a id="spotify-link" href="#" target="_blank" style="margin-left:auto; margin-top:0.4rem;" title="Open in Spotify">
      <svg width="32" height="32" viewBox="0 0 168 168" xmlns="http://www.w3.org/2000/svg">
        <path fill="#1ED760" d="M84 0C37.7 0 0 37.7 0 84s37.7 84 84 84 84-37.7 84-84S130.3 0 84 0zm38.7 121.3c-1.3 2-4 2.6-6 1.3-16.4-10-37-12.3-61.4-6.7-2.3.6-4.7-.7-5.3-3s.7-4.7 3-5.3c27.2-6.3 50-3.7 68.5 7.7 2 1.3 2.6 4 1.2 6zm8.7-20c-1.6 2.4-4.8 3.1-7.2 1.5-18.8-11.7-47.5-15-69.7-8.2-2.6.8-5.3-.6-6-3.2-.8-2.6.6-5.3 3.2-6 26-7.7 58.5-4 80.2 9.5 2.4 1.5 3.2 4.7 1.5 7.2zm.8-20c-23.3-14-61.8-15.3-84.2-8.4-3 .8-6.2-.8-7-3.8-.8-3 .8-6.2 3.8-7 26.3-7.8 68-6.4 94.5 10 2.7 1.7 3.5 5.3 1.7 8-.8 1.4-2 2.3-3.4 2.7z"/>
      </svg>
    </a>

    <audio id="audio" autoplay controls style="margin-left: 0.5rem; margin-top: 0.4rem;">
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
        if (album !== "невідомо") {
          document.getElementById("album").textContent = `альбом: ${album}`;
        } else {
          document.getElementById("album").style.display = "none";
        }
        if (tags !== "—") {
          document.getElementById("tags").textContent = `жанри: ${tags}`;
        } else {
          document.getElementById("tags").style.display = "none";
        }
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
      }
    });
}

fetchTrack();
setInterval(fetchTrack, 30000);
