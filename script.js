let section = document.querySelectorAll("section")
let container = document.getElementById("container");
let timer = document.getElementById("timer")
let submitPage = document.getElementById("submit-page")
let scoreboard = document.getElementById("scoreboard")
let initialsDiv = document.getElementById("initials-msg")

// Check to see if section is a nodeList
// console.log(section)

let time = 60;
let score = 0;
let index = 0;

// Object that stores user initial and scores. Saved to and grabbed from local storage later.
let scores = {

};

// Function that iterates over section nodeList and returns the current node the user is on.
// The current node is always the index variable value and not the other way around
function currentIndex() {
    for (var i = 0; i < section.length; i++) {
        // if the current node data-question value in the for loop matches index value
        if (section[i].dataset.index === index.toString()) {
            return section[i];
        } 
    }
};

// Check to see if the current index node is returned
// console.log(currentIndex())

// Function that hides all other noncurrent nodes and shows current node
function posListener() {
        // Loops over all nodes and adds class hidden
        for (var i = 0; i < section.length; i++) {
            section[i].setAttribute("class", "hidden");
        };
        // Remove class hidden from current index
        currentIndex().removeAttribute("class");
};

// Function that grabs scores from local storage and renders it to scoreboard
function renderScores() {
    // Clear board
    while (scoreboard.firstChild) {
        scoreboard.removeChild(scoreboard.firstChild)
    };

    // Stringified scores object is parsed back into an object
    let scoresStored = JSON.parse(localStorage.getItem("scores"));

    if (scoresStored === undefined || scoresStored === null) {
        return;
    }
    // Check to see if initials is parsed and turned back into an object
    // console.log(initials);

    // The scoresStored object keys and values are stored as an array respectively
    initialKeys = Object.keys(scoresStored);
    scoreValues = Object.values(scoresStored);

    // For loop to create score pair string value, create paragraph element, and append it to the scoreboard div
    for (var i = 0; i < initialKeys.length; i++) {
        // For every loop, since initialKeys.length and scoreValues.length is the same, we are able to pair the strings.
        scorePair = initialKeys[i] + ": " + scoreValues[i].toString();

        // We create an element, set element content to scorePair, and append it to the scoreboard div
        let scorePara = document.createElement("p");
        let scoreContent = document.createTextNode(scorePair);
        scorePara.appendChild(scoreContent);
        scoreboard.appendChild(scorePara);
    }
};

// Event delegation. Delegates click function for all buttons available. https://davidwalsh.name/event-delegate
container.addEventListener("click", function(targ) {
    // If the targ (clicked element) is a button
    if (targ.target && targ.target.matches("#btn")) {
        index++;

        // If the button also has the class "start"
        if (targ.target && targ.target.matches(".start")) {

            // Timer function. Timer element on the top of the page that is appended based on time variable
            // Timer needs if less than 0 condition that doesn't allow it to go less than 0 and exits quiz when hits 0
            let timerFunc = setInterval(function() {
                time--;
                // Makes the value of time variable into a string and assigns it to timeHolder
                timeHolder = time.toString();
                // Sets text of timer equal to timeHolder value
                timer.textContent = timeHolder;

                // Console Log the timeHolder value to see if it's a string
                // console.log(timeHolder)

                if (time < 1) {
                    // Clears timer for timerFunc specifically
                    clearInterval(timerFunc);

                    // Turning submit page index string value into a number and setting it equal to index
                    index = parseInt(submitPage.dataset.index);

                    posListener();
                }

                // Trying to change class for timer in the last 10 seconds
                // if (time < 11) {
                //     timer.className += "lastTen";
                // }

                if (index > 10) {
                    clearInterval(timerFunc);
                }
            }, 1000);
        };

        // Score keeper - Fundamental flaw = using classes makes it VERY easy to cheat lol~ Could use dataset values later or objects and have serverside requests?
        // If the target btn also has the class correct and index is greater than 10
        if (targ.target && targ.target.matches(".correct") && index > 10) {
            score++;
            // If condition above + index is less than or equal to 10
        } else if (targ.target && targ.target.matches(".correct")) {
            score++;
            currentIndex().lastChild.textContent = "Correct!";
        };
        // Doing the same for incorrect answers 
        if (targ.target && targ.target.matches(".incorrect") && index > 10) {
            time -= 5;
        } else if (targ.target && targ.target.matches(".incorrect")) {
            time -= 5;
            currentIndex().lastChild.textContent = "Incorrect!";
        };

        // If the button also has the class "submit-btn"
        if (targ.target && targ.target.matches(".submit-btn")) {
            event.preventDefault();

            // Grabs user input value for initials
            let initials = document.getElementById("initials").value;

            if (initials === "") {
                initialsDiv.textContent = "You have to enter your initials!";

                // Counter the index++ in the beginning so the index stays the same if button is clicked
                index--;
                return;
            } else {
                // The user's initials input and score are stored into the scores object
                scores[initials] = score;

                // Getting existing scores
                let scoresStored = JSON.parse(localStorage.getItem("scores"));

                // Merging all scores into one object
                let allScores = {
                    ...scoresStored,
                    ...scores
                };

                // The scores object is stored into the local strage as a string
                localStorage.setItem("scores", JSON.stringify(allScores));

                renderScores();
            }
        };

        // If the button also has the class "back"
        if (targ.target && targ.target.matches(".back")) {
            
            // Set time back to 60 seconds and score back to 0
            time = 60;
            timer.textContent = "60";
            score = 0;

            // Set index back to 0 and go back to start quiz
            index = 0;
            posListener();
        };

        // If the button also has the class "clear"
        if (targ.target && targ.target.matches(".clear")) {
            // Counter index++
            index--;

            // Remove stringified object 'scores' from local storage and clears object
            localStorage.removeItem("scores")
            scores = {};

            // Delete all children from scoreboard element. https://developer.mozilla.org/en-US/docs/Web/API/Node/removeChild
            while (scoreboard.firstChild) {
                scoreboard.removeChild(scoreboard.firstChild)
            };
        }
        
        // Towards the end because I want other conditions to be met first
        posListener();
    }
});

// TODO~ Scoreboard that can log the same name over and over. 
// A quiz question/answer randomizer
// FIX - Scoreboard system local storage function is fundamentally flawed.