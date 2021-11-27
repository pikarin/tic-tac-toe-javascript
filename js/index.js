document.addEventListener('DOMContentLoaded', function() {
    // Store submit button in a variable for easy reference
    const optionButton = document.getElementById("optionSubmit");

    function isEven(value){
        if (value % 2 == 0) {
            return true;
        }

        return false;
    }

    function isOdd(value){
        if (value % 1 == 0) {
            return true;
        }

        return false;
    }

    function allSame(array) { // Ultimately got this solution from stack overflow post, I had a lot of difficulty getting it to work on my own
        const first = array[0];

        if (array[0] == "") {
            return false;
        }

        return array.every((element) => element == first);
    }

    // Capture input value to determine board size and set up the board
    optionButton.addEventListener("click", function() {
        // Change play button to reset
        optionButton.innerHTML = "Reset";

        // Set board size based on user input value parsed to integer
        const boardSize = parseInt(document.getElementById("boardsizeInput").value);

        // Create variable game board (empty array)
        const gameBoard = [];

        // Declare a global click counter
        let boardClicks = 0;

        // create variable numSquares, which is gameboard size squared
        const numSquares = (boardSize * boardSize);

        // Create gameboard array containing array of board size squared
        for (let i = 0; i < numSquares; i++) {
            gameBoard.push(i);
        }

        // Create a wrapper div called "board" inside of "game"
        document.getElementById("game").innerHTML = '<div id="board"></div>';

        // Store board div inside of a variable
        const board = document.getElementById("board");

        // To make scalable, set wrapper div width and height 100px * the board size
        board.style.height = (100 * boardSize) + 'px';
        board.style.width = (100 * boardSize) + 'px';

        // Iterate over gameboard, for every index in gameboard, print to document a div
        for (let i = 0; i < numSquares; i++) {
            board.innerHTML += '<div class="square"></div>';
        }

        // Store square divs in a variable - need to include in global scope
        const squares = document.querySelectorAll(".square");

        for (let i = 0; i < numSquares; i++) {
            // Set unique DIV IDs to each square
            squares[i].setAttribute("id", i.toString());
        }

        // Make every other square light gray
        if (numSquares % 2 !== 0) { // If board size is odd
            for (let i = 0; i < numSquares; i += 2) { // make every other square light gray
                squares[i].style.backgroundColor = '#e3e3e3';
            }
        } else { // If board size is even
            for (i = 0; i < numSquares; i += 1) {
                if (isEven(i/boardSize)) { // make even rows alternate color
                    for (let squareNum = i; squareNum < (i + boardSize); squareNum += 2) {
                        squares[squareNum].style.backgroundColor = '#e3e3e3';
                    }
                } else if (isOdd(i/boardSize)) { // make odd rows alternate color
                    for (let squareNum = i+1; squareNum < (i + boardSize); squareNum += 2) {
                        squares[squareNum].style.backgroundColor = '#e3e3e3';
                    }
                }
            }
        }

        // Store turn indicator div in a variable for easy access
        const turnIndicator = document.getElementById("turnIndicator")

        // After board is made, randomly determine who goes first
        if (Math.random() > 0.5) {
            turnIndicator.style.color = "black";
            turnIndicator.innerHTML = "X's Turn";
            boardClicks = 0;
        } else {
            turnIndicator.style.color = "red";
            turnIndicator.innerHTML = "O's Turn";
            boardClicks = 1;
        }

        // If board is clicked, increment global click counter
        board.addEventListener("click", function() {
            if (determineWinner()) { // determineWinner will return true if it finds a winning combination
                turnIndicator.style.color = "blue";
                turnIndicator.innerHTML = winningPlayer[0] + ' wins!';
            } else if (isEven(boardClicks)) {
                turnIndicator.style.color = "red";
                turnIndicator.innerHTML = "O's Turn";
            } else {
                turnIndicator.style.color = "black";
                turnIndicator.innerHTML = "X's Turn";
            };
            boardClicks++;
        }); // End board click function

        // Make an array to hold square click data
        const squareClicks = [];

        // Set squareclick data for each square to 0
        for (let i = 0; i < numSquares; i++) {
            squareClicks[i] = 0;
        }

        // Make a variable to store winning combination
        let winningPlayer;

        // Add function to determine winner based on clicks array
        const determineWinner = function() {
            // Check for win by row
            for (let i = 0; i < numSquares; i += 1) { // iterate over entire board
                if ((i % boardSize) == 0) {
                    const rowCheck = [];
                    for (let squareNum = i; squareNum < (i + boardSize); squareNum += 1) { // iteration over column 1
                        rowCheck.push(squares[squareNum].innerHTML);
                    }
                    // console.log('Row ' + i + ' is ' + rowCheck);
                    // console.log(allSame(rowCheck));

                    if (allSame(rowCheck)) {
                        winningPlayer = rowCheck; // Push winning player data
                        return true;
                    }
                }
            }

            // Check for win by column
            for (let i = 0; i < numSquares; i += 1) { // iterate over entire board
                if (i < boardSize) { //
                    const colCheck = [];
                    for (let squareNum = i; squareNum < numSquares; squareNum += boardSize) { // iteration over row 1
                        colCheck.push(squares[squareNum].innerHTML);
                    }
                    // console.log('Column ' + i + ' is ' + colCheck);
                    // console.log(allSame(colCheck));

                    if (allSame(colCheck)) {
                        winningPlayer = colCheck; // Push winning player data
                        return true;
                    }
                }
            }

            // Check for win by left diagonal
            const diag1Check = []; // Needs to be outside of for loop to prevent overwriting array
            for (let i = 0; i < numSquares; i += 1) { // first iteration over board
                if ((i % (boardSize + 1)) == 0) { // use condition if iterator % BOARDSIZE + 1 === 0 to get left diagonals
                    // console.log(i)
                    diag1Check.push(squares[i].innerHTML);
                };
            }

            // console.log(diag1Check)
            // console.log(allSame(diag1Check));
            if (allSame(diag1Check)) { // As does the return statement
                winningPlayer = diag1Check; // Push winning player data
                return true;
            }

            // Check for win by right diagonal
            const diag2Check = []; // Needs to be outside of for loop to prevent overwriting array
            for (let i = (boardSize - 1); i < (numSquares - 1); i += 1) { // first iteration over board
                if ((i % (boardSize - 1)) == 0) { // use condition if iterator % BOARDSIZE - 1 === 0 to get right diagonals
                    // console.log(i)
                    diag2Check.push(squares[i].innerHTML);
                };
            }
            // console.log(diag2Check) // These also need to be outside of for loop to prevent checks on incomplete arrays
            // console.log(allSame(diag2Check));
            if (allSame(diag2Check)) { // As does the return statement
                winningPlayer = diag2Check; // Push winning player data
                return true;
            }
        } // End determineWinner function

        const countClicks = function() {
            const divID = this.getAttribute("id");
            squareClicks[divID] += 1;
            // If global click counter is even and local click is == 1, change innerhtml of div to 'X'
            if (isEven(boardClicks) && squareClicks[divID] == 1) {
                this.innerHTML = 'X';
            // If global click counter is odd and local click is == 1, change innerhtml of div to 'O'
            } else if (isOdd(boardClicks) && squareClicks[divID] == 1) {
                this.innerHTML = 'O';
                this.style.color = "red";
            // If local click counter is greater than 1, alert player and subtract 1 from global clicks
            } else if (!determineWinner()) {
                alert('You cannot move there. That space is taken.');
                boardClicks -= 1;
            }

            // Check for winner, if true, lock all local clicks
            if (determineWinner()) { // determine winner will return true or false if it identifies a winning combination
                // Set all square clicks to 2 to "lock" them to prevent further moves from taking place
                for (let i = 0; i < numSquares; i++) {
                    squareClicks[i] = 2;
                };
                // Change play button to say play again
               optionButton.innerHTML = "Play again?"
            };
        }

        // listen for click to each square on the board
        for (let i = 0; i < numSquares; i++) {
            squares[i].addEventListener("click", countClicks);
        }
    });

});