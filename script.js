document.addEventListener("DOMContentLoaded", function () {

    var userInput = document.getElementById("userInput");

    userInput.addEventListener("keydown", function (event) {
        if (!(event.ctrlKey && event.key === "v")) {
            event.preventDefault();
        }
    });

    userInput.addEventListener("paste", function (event) {

        event.preventDefault();

        var pastedText = (event.clipboardData || window.clipboardData).getData('text');

        userInput.value = pastedText;

        fetchData(event);
    });

    userInput.addEventListener("input", function (event) {

        if (userInput.value.length > 0) {
            userInput.value = userInput.value.charAt(0);
        }

        fetchData(event);
    });

    userInput.addEventListener("click", function (event) {
        userInput.select();
    });
});

async function fetchData() {

    var productUrl = document.getElementById("userInput").value.trim();

    if (productUrl === "") {
        clearData();
        return;
    }

    var id = getIdFromUrl(productUrl);

    if (!id) {
        displayError("Neplatný odkaz.");
        return;
    }

    const proxyUrl = "https://corsproxy.io/?"

    const apiUrl = "https://www.alza.cz/api/carousels/v1/commodities/" + id + "/recommendedAccessorySlots?country=CZ&pgrik=p_26752&ucik=u_lg1_e39d5";

    const finalUrl = proxyUrl + apiUrl

    fetch(finalUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            displayCarouselItemsCount(data);
        })
        .catch(error => {
            console.error('Chyba při načítání dat:', error);
            displayError("Chyba při načítání dat.");
        });
}

function getIdFromUrl(url) {

    var matches = url.match(/-d(\d+)\.htm/);

    if (matches && matches.length > 1) {
        return matches[1];
    } else {
        matches = url.match(/dq=(\d+)/);
        if (matches && matches.length > 1) {
            return matches[1];
        }
    }
    return null;
}

function displayCarouselItemsCount(data) {

    var carousels = data.carousels;
    var dataElement = document.getElementById("data");
    var totalItems = 0;

    clearError();

    dataElement.innerHTML = "";

    carousels.forEach(carousel => {
        var title = carousel.title;
        var itemsCount = carousel.items.length;
        totalItems += itemsCount;

        dataElement.innerHTML += "<p>• " + title + ": " + itemsCount + "</p>";
    });

    dataElement.innerHTML += "<hr>";

    var totalCountElement = document.createElement("p");

    totalCountElement.innerHTML = "<strong>Celkový počet: " + totalItems + "</strong>";

    totalCountElement.classList.add("totalCount");

    dataElement.appendChild(totalCountElement);
}


function displayError(message) {

    var dataElement = document.getElementById("data");
    dataElement.innerHTML = "<p id='error'>" + message + "</p>";
}

function clearError() {

    var errorElement = document.getElementById("error");

    if (errorElement) {
        errorElement.remove();
    }
}

function clearData() {

    var dataElement = document.getElementById("data");
    dataElement.innerHTML = "";
}
