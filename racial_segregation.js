const TYPE_1 = 1;
const TYPE_2 = 2;
var BLANK_RATIO = 0.1;
var RATIO_1_2 = 0.6;
var BOARD_SIZE = 50;
var ITER_TIME = 750;
var HAPPY_RATIO = 0.5;

//AGENT
class Agent {

    constructor(type, location) {
        this.type = type;
        this.location = location;
        this.isHappy = null;
        this.sameness = 1;
    }

    computeHappy(board) {
        var possibleNeighbourLocations = [
            [this.location[0] - 1, this.location[1]],
            [this.location[0] + 1, this.location[1]],
            [this.location[0], this.location[1] - 1],
            [this.location[0], this.location[1] + 1],
            [this.location[0] - 1, this.location[1] - 1],
            [this.location[0] - 1, this.location[1] + 1],
            [this.location[0] + 1, this.location[1] - 1],
            [this.location[0] + 1, this.location[1] + 1]
        ];

        var neighbours = [];
        var same = 0;

        for (let i = 0; i < possibleNeighbourLocations.length; i++) {
            if (possibleNeighbourLocations[i][0] > -1 && possibleNeighbourLocations[i][1] > -1 && possibleNeighbourLocations[i][0] < BOARD_SIZE && possibleNeighbourLocations[i][1] < BOARD_SIZE) {
                loc = possibleNeighbourLocations[i];
                if (board[loc[0]][loc[1]] != 0) {
                    neighbours.push(loc);
                }
                if (board[loc[0]][loc[1]] == this.type) {
                    same++;
                }
            }
        }

        if (neighbours.length > 0) {
            this.sameness = same / neighbours.length;
        }

        var sum = 0;
        if (neighbours.length == 0) {
            this.isHappy = false;
            return false;
        }
        for (let i = 0; i < neighbours.length; i++) {
            if (board[neighbours[i][0]][neighbours[i][1]] == this.type) {
                sum++;
            }
        }
        this.isHappy = sum / neighbours.length >= HAPPY_RATIO;
        return this.isHappy;
    }

    updateLocation(location) {
        this.location = location;
    }

}

function createBackBoard() {
    //create backend board
    var res = [];
    for (let i = 0; i < BOARD_SIZE; i++) {
        var line = []
        for (let j = 0; j < BOARD_SIZE; j++) {
            line.push(0);
        }
        res.push(line);
    }
    return res;
}

function createFrontBoard() {

    //create frontend board
    var board_container_el = document.getElementById('board_container');
    var agent_size = 100 / BOARD_SIZE;

    board_el = document.createElement('div');
    board_el.id = 'board';

    for (let i = 0; i < BOARD_SIZE; i++) {
        var row_el = document.createElement('div');
        row_el.className = "board_row";
        row_el.style.height = agent_size + "%";

        for (let j = 0; j < BOARD_SIZE; j++) {
            var cell = document.createElement('div');
            cell.className = "board_column";
            cell.id = "cell_" + i + "_" + j;
            cell.style.width = agent_size + "%";
            row_el.appendChild(cell);
        }
        board_el.appendChild(row_el);
    }
    board_container_el.appendChild(board_el);
}

function drawLocation() {
    while (1) {
        var x = Math.floor(Math.random() * BOARD_SIZE); //from 0 to board size
        var y = Math.floor(Math.random() * BOARD_SIZE); //from 0 to board size
        if (board[x][y] == 0) {
            return [x, y];
        }
    }
}

function createAgents() {

    var num_people = Math.floor(BOARD_SIZE * BOARD_SIZE * (1 - BLANK_RATIO));
    var num_type_1 = Math.floor(num_people * RATIO_1_2);
    var num_type_2 = Math.floor(num_people * (1 - RATIO_1_2));

    var res = [];

    for (let i = 0; i < num_type_1; i++) {
        loc = drawLocation();
        res.push(new Agent(TYPE_1, loc));
        board[loc[0]][loc[1]] = 1;
    }
    for (let i = 0; i < num_type_2; i++) {
        loc = drawLocation();
        res.push(new Agent(TYPE_2, loc));
        board[loc[0]][loc[1]] = 2;
    }
    return res;
}

function drawBoard() {
    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            var cell = document.getElementById("cell_" + i + "_" + j);
            if (board[i][j] == TYPE_1) {
                cell.style.backgroundColor = "blue";
            } else if (board[i][j] == TYPE_2) {
                cell.style.backgroundColor = "red";
            } else if (board[i][j] == 0) {
                cell.style.backgroundColor = "white";
            }
        }
    }
}

function removeBoard() {
    var board_el = document.getElementById('board');
    board_el.parentNode.removeChild(board_el);
}

var board;
var agents;

function initBoard() {
    board = createBackBoard();
    agents = createAgents();
    createFrontBoard();
    drawBoard();
}


function initControls() {

    //1st slider
    var empty_spaces_slider = document.getElementById("empty_places_slider");
    var empty_spaces_output = document.getElementById("empty_spaces_demo");
    empty_spaces_slider.defaultValue = 10;
    empty_spaces_output.innerHTML = empty_spaces_slider.defaultValue + "%"; // Display the default slider value

    // Update the current slider value (each time you drag the slider handle)
    empty_spaces_slider.oninput = function () {
        empty_spaces_output.innerHTML = this.value + "%";
    }

    //2nd slider
    var blue_red_ratio_slider = document.getElementById("blue_red_ratio_slider");
    var blue_red_ratio_output = document.getElementById("blue_red_ratio_demo");
    blue_red_ratio_slider.defaultValue = 50;
    blue_red_ratio_output.innerHTML = blue_red_ratio_slider.defaultValue + "%"; // Display the default slider value

    // Update the current slider value (each time you drag the slider handle)
    blue_red_ratio_slider.oninput = function () {
        blue_red_ratio_output.innerHTML = this.value + "%";
    }

    //3rd slider
    var board_size_slider = document.getElementById("board_size_slider");
    var board_size_output = document.getElementById("board_size_demo");
    board_size_slider.defaultValue = 50;
    board_size_output.innerHTML = board_size_slider.defaultValue; // Display the default slider value

    // Update the current slider value (each time you drag the slider handle)
    board_size_slider.oninput = function () {
        board_size_output.innerHTML = this.value;
    }

    //4th slider
    var iter_time_slider = document.getElementById("iter_time_slider");
    var iter_time_output = document.getElementById("iter_time_demo");
    iter_time_slider.defaultValue = 750;
    iter_time_output.innerHTML = iter_time_slider.defaultValue; // Display the default slider value

    // Update the current slider value (each time you drag the slider handle)
    iter_time_slider.oninput = function () {
        iter_time_output.innerHTML = this.value;
    }

    //5th slider
    var surrounding_equals_slider = document.getElementById("surrounding_equals_slider");
    var surrounding_equals_output = document.getElementById("surrounding_equals_demo");
    surrounding_equals_slider.defaultValue = 50;
    surrounding_equals_output.innerHTML = surrounding_equals_slider.defaultValue + "%"; // Display the default slider value

    // Update the current slider value (each time you drag the slider handle)
    surrounding_equals_slider.oninput = function () {
        surrounding_equals_output.innerHTML = this.value + "%";
    }

    //init output
    var happyCount = 0;
    for (let i = 0; i < agents.length; i++) {
        var happy = agents[i].computeHappy(board);
        if (happy) {
            happyCount++;
        }
    }
    happyRatio = happyCount / agents.length * 100;
    showStats(happyRatio);
}

function applyControls() {
    var empty_spaces_slider = document.getElementById("empty_places_slider");
    var blue_red_ratio_slider = document.getElementById("blue_red_ratio_slider");

    BLANK_RATIO = empty_spaces_slider.value / 100;
    RATIO_1_2 = blue_red_ratio_slider.value / 100;
    BOARD_SIZE = board_size_slider.value;
    ITER_TIME = iter_time_slider.value;
    HAPPY_RATIO = surrounding_equals_slider.value / 100;

    board = createBackBoard();
    agents = createAgents();
    removeBoard();
    createFrontBoard();
    drawBoard();

    var but = document.getElementById("trybtn");
    but.textContent = "TRY IT";
    but.className = "btn btn-primary btn-lg btn-block";
    but.onclick = () => { main(); }

}

function showStats(happyRatio, iter) {
    //calculate average sameness
    var total = 0;
    for (let i = 0; i < agents.length; i++) {
        total += agents[i].sameness;
    }
    var avg = total / agents.length;

    //calculate segregation
    var segregation = (avg - 0.5) * 2;
    if (segregation < 0) segregation = 0;

    //show it on screen
    var segregation_output = document.getElementById("segregation_demo");
    var segregation_progress = document.getElementById("segregation_progress");
    segregation_output.innerHTML = Math.floor(segregation * 100) + "%";
    segregation_progress.value = Math.floor(segregation * 100);
    segregation_progress.style.width = segregation_progress.value + "%";

    //Happy people
    var happy_people_output = document.getElementById("happy_people_demo");
    var happy_people_progress = document.getElementById("happy_people_progress");
    happy_people_output.innerHTML = Math.floor(happyRatio) + "%";
    happy_people_progress.value = Math.floor(happyRatio);
    happy_people_progress.style.width = happy_people_progress.value + "%";

    //iteration
    var iteration_output = document.getElementById("iteration_demo");
    iteration_output.innerHTML = iter || 0;

    //update table
    var table = document.getElementById('table');
    table.appendChild(createRow(iter || 0, happyRatio, segregation * 100));
}


function main() {

    var happyRatio = 0;
    var iter = 1;

    var but = document.getElementById("trybtn");
    but.textContent = "STOP";
    but.className = "btn btn-outline-danger btn-lg btn-block";
    but.onclick = () => { clearInterval(id); location.reload(true); }

    id = setInterval(() => {

        var happyCount = 0;
        for (let i = 0; i < agents.length; i++) {
            var happy = agents[i].computeHappy(board);
            if (happy) {
                happyCount++;
            }
        }

        for (let i = 0; i < agents.length; i++) {
            if (!agents[i].isHappy) {
                var new_loc = drawLocation();
                board[agents[i].location[0]][agents[i].location[1]] = 0;
                board[new_loc[0]][new_loc[1]] = agents[i].type;
                agents[i].updateLocation(new_loc);
            }
        }

        drawBoard();

        happyRatio = happyCount / agents.length * 100;

        showStats(happyRatio, iter);

        if (happyRatio == 100) {
            //finish loop!!
            endLoop();
            clearInterval(id);
        }

        iter++;

    }, ITER_TIME);
}

function endLoop() {
    var but = document.getElementById("trybtn");
    but.textContent = "SUCCESS!! - RESTART";
    but.className = "btn btn-outline-success btn-lg btn-block";
    but.onclick = () => { location.reload(true); }
}

function createRow(iter, happyRatio, segregation) {
    var row = document.createElement("tr");
    var cellIter = document.createElement("td");
    var cellRatio = document.createElement("td");
    var cellSegregation = document.createElement("td");
    var iterText = document.createTextNode(iter);
    var ratioText = document.createTextNode(happyRatio + " %");
    var segregationText = document.createTextNode(segregation + " %");

    if (iter % 2 == 0) {
        row.className = "table-light";
    } else {
        row.className = "table-secondary";
    }

    cellIter.appendChild(iterText);
    cellRatio.appendChild(ratioText);
    cellSegregation.appendChild(segregationText);
    row.appendChild(cellIter);
    row.appendChild(cellRatio);
    row.appendChild(cellSegregation);

    return row;
}