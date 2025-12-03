// grab artistId from the URL (?artistId=1234)
var urlParams   = new URLSearchParams(window.location.search);
var artistId    = urlParams.get("artistId");

var artistNameH = document.getElementById("artistName");
var artistInfoP = document.getElementById("artistInfo");
var albumsRow   = document.getElementById("albums");

if (!artistId) {
    artistNameH.innerHTML = "No artist selected";
    artistInfoP.innerHTML = "Go back and pick someone first.";
} else {
    loadArtistData();
}

async function loadArtistData() {
    // iTunes lookup endpoint for artist + their albums
    var url = "https://itunes.apple.com/lookup?id="
              + artistId
              + "&entity=album";

    try {
        var response = await fetch(url);
        var data = await response.json();

        if (!data.results || data.results.length === 0) {
            artistNameH.innerHTML = "Couldn’t load this artist.";
            artistInfoP.innerHTML = "iTunes didn’t send anything back.";
            return;
        }

        // first object is the artist, the rest are albums
        var artist = data.results[0];
        var albums = data.results.slice(1);

        // show basic artist info
        artistNameH.innerHTML = artist.artistName;
        artistInfoP.innerHTML =
            "Genre: " + (artist.primaryGenreName || "N/A");

        // loop through albums and show them as thumbnails
        for (var i = 0; i < albums.length; i++) {
            var album = albums[i];

            var col = document.createElement("div");
            col.className = "col-xs-6 col-sm-4 col-md-3";

            var year = "N/A";
            if (album.releaseDate) {
                year = new Date(album.releaseDate).getFullYear();
            }

            col.innerHTML =
                "<div class='thumbnail'>" +
                    "<img src='" + album.artworkUrl100 + "' alt='Album cover'>" +
                    "<div class='caption'>" +
                        "<p><strong>" + album.collectionName + "</strong></p>" +
                        "<p class='text-muted'>Year: " + year + "</p>" +
                        "<p>" +
                          "<a href='" + album.collectionViewUrl + "' " +
                             "target='_blank' class='btn btn-xs btn-default'>" +
                             "Open in iTunes" +
                          "</a>" +
                        "</p>" +
                    "</div>" +
                "</div>";

            albumsRow.appendChild(col);
        }

    } catch (e) {
        console.log(e);
        artistNameH.innerHTML = "Error loading artist";
        artistInfoP.innerHTML = "Something went wrong talking to the API.";
    }
}
