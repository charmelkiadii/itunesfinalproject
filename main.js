// grabbing stuff from the page
var searchForm   = document.getElementById("searchForm");
var searchInput  = document.getElementById("searchInput");
var resultsGrid  = document.getElementById("results");
var errorBox     = document.getElementById("errorMessage");

// run this when the form is submitted
searchForm.onsubmit = async function (event) {
    event.preventDefault(); // don’t refresh the page

    // reset old results / errors
    resultsGrid.innerHTML = "";
    errorBox.innerHTML = "";

    var term = searchInput.value.trim();

    if (term === "") {
        errorBox.innerHTML = "Type an artist first 🤦🏽‍♀️";
        return;
    }

    // build the iTunes search URL
    var url = "https://itunes.apple.com/search?term="
              + encodeURIComponent(term)
              + "&entity=musicArtist";

    try {
        // call the REST API (GET request)
        var response = await fetch(url);
        var data = await response.json(); // turn JSON text into a JS object

        if (!data.results || data.results.length === 0) {
            errorBox.innerHTML = "No artists found. Try spelling it different.";
            return;
        }

        // loop through artists and build Bootstrap cards
        for (var i = 0; i < data.results.length; i++) {
            var artist = data.results[i];

            var column = document.createElement("div");
            column.className = "col-md-4";

            // basic card using Bootstrap panel
            column.innerHTML =
                "<div class='panel panel-default'>" +
                    "<div class='panel-heading'>" +
                        "<strong>" + artist.artistName + "</strong>" +
                    "</div>" +
                    "<div class='panel-body'>" +
                        "<p>Genre: " + (artist.primaryGenreName || "N/A") + "</p>" +
                        "<p class='text-muted'>Artist ID: " + artist.artistId + "</p>" +
                        "<a class='btn btn-info btn-sm' " +
                           "href='artist.html?artistId=" + artist.artistId + "'>" +
                           "View Details" +
                        "</a>" +
                    "</div>" +
                "</div>";

            resultsGrid.appendChild(column);
        }

    } catch (e) {
        console.log(e);
        errorBox.innerHTML = "Something broke while talking to iTunes. Try again.";
    }
};
