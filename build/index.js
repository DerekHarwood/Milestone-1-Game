"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jquery_1 = __importDefault(require("jquery"));
var game = {
    rows: 8,
    cols: 8,
    num_mines: 10
};
var time_interval = false;
/**
 * On document load, initial setup.
 */
(0, jquery_1.default)(document).ready(function () {
    (0, jquery_1.default)(document).foundation();
    (0, jquery_1.default)(document).on('click', '.mine_cell', cellClick);
    (0, jquery_1.default)(document).on('contextmenu', '.mine_cell', cellRightClick);
    (0, jquery_1.default)('#button').click(newGame);
    (0, jquery_1.default)('#cancel_button').click(hideModal);
    (0, jquery_1.default)('#rows').val(game.rows);
    (0, jquery_1.default)('#cols').val(game.cols);
    (0, jquery_1.default)('#mmines').val(game.num_mines);
    buildNewGame();
});
/**
 * jQuery function to bind an event handler before other handlers for the selected objects
 *
 * @param name{string}
 *            name of the event to bind
 * @param fn{function}
 *            function to bind
 * @return {null}
 */
//@ts-ignore
jquery_1.default.fn.bindFirst = function (name, fn) {
    var elem, handlers, i, _len;
    this.bind(name, fn);
    for (i = 0, _len = this.length; i < _len; i++) {
        elem = this[i];
        handlers = jQuery.data(elem).events[name.split('.')[0]];
        handlers.unshift(handlers.pop());
    }
};
/**
 * Alert popup to alert any test/html
 *
 * @param data{string}
 *            text/html to be alerted
 * @return {null}
 */
function alertModal(data) {
    data = data.toString();
    showModal('', data.replace('\n', '<br>') + '<br><br><span class="button small" onclick="hideModal();"><u>O</u>K</span>', false);
    (0, jquery_1.default)(document).bindFirst('keydown', alertKeydown);
}
/**
 * Event handler for keydown when alert modal is open to close with keyboard
 *
 * @param e{string}
 *            keydown event
 * @return {boolean}
 */
function alertKeydown(e) {
    if (e.which == 13 || e.which == 27 || e.which == 32 || e.which == 79) {
        hideModal();
    }
    return false;
}
/**
 * Displays modal windows with title and content passed in
 *
 * @param title{string}
 *            Modal window header title
 * @param content{string}
 *            Text/HTML content to display
 * @param allow_close{boolean}(true)
 *            If the close X should be displayed or not
 * @return {null}
 */
function showModal(title, content, allow_close) {
    allow_close = (typeof (allow_close) == 'undefined') ? true : allow_close;
    (0, jquery_1.default)('#modal_title').html(title);
    (0, jquery_1.default)('#modal_content').html(content);
    if (allow_close)
        (0, jquery_1.default)('#modal_close').show();
    else
        (0, jquery_1.default)('#modal_close').hide(); //@ts-ignore
    (0, jquery_1.default)('#modal_div').foundation('open');
}
/**
 * Hides any open modal windows
 *
 * @param N/A
 * @return {null}
 */
function hideModal() {
    (0, jquery_1.default)('.reveal').foundation('close');
    (0, jquery_1.default)('#modal_title').html('');
    (0, jquery_1.default)('#modal_content').html('');
    (0, jquery_1.default)(document).unbind('keydown', alertKeydown);
}
/**
 * Updates the game configuration and builds the new game
 *
 * @param N/A
 * @return {null}
 */
function newGame() {
    game.rows = (0, jquery_1.default)('#rows').val(); //@ts-ignore
    game.cols = (0, jquery_1.default)('#cols').val(); //@ts-ignore
    game.num_mines = (0, jquery_1.default)('#mmines').val(); //@ts-ignore
    game.rows = (game.rows == '') ? 8 : parseInt(game.rows); //@ts-ignore
    game.cols = (game.cols == '') ? 8 : parseInt(game.cols); //@ts-ignore
    game.num_mines = (game.num_mines == '') ? 10 : parseInt(game.num_mines);
    buildNewGame();
    hideModal();
}
const newGameBtn = document.getElementById('new_game_button');
//@ts-ignore
newGameBtn.addEventListener('click', function () {
    console.log('clicked');
    newGame();
});
/**
 * Builds a new game grid, randomly places mines, sets jQuery data attributes of the cell objects for usage in the click/right click
 *
 * @param N/A
 * @return {null}
 */
function buildNewGame() {
    (0, jquery_1.default)('#game_div').html('');
    var row;
    var cell;
    var mine_cell; //@ts-ignore
    game.mines = []; //@ts-ignore
    game.cells = []; //@ts-ignore
    game.lost = false; //@ts-ignore
    game.won = false;
    if (time_interval) //@ts-ignore
        clearInterval(time_interval);
    time_interval = false;
    (0, jquery_1.default)('#time').text(0);
    (0, jquery_1.default)('#mines').text(game.num_mines);
    // randomly generate mines
    //@ts-ignore
    while (game.mines.length < game.num_mines) {
        mine_cell = Math.floor(Math.random() * game.rows * game.cols); //@ts-ignore
        if (game.mines.indexOf(mine_cell) == -1) //@ts-ignore
            game.mines.push(mine_cell);
    }
    // calculate number to display for the cells, put -1 for cells with mine in it
    for (var r = 0; r < game.rows; r++) { //@ts-ignore
        game.cells.push([]);
        for (var c = 0; c < game.cols; c++) { //@ts-ignore
            mine_cell = game.mines.indexOf((r * game.cols) + c);
            if (mine_cell == -1) {
                mine_cell = 0; //@ts-ignore
                mine_cell += (r > 0) ? ((c > 0) ? ((game.mines.indexOf(((r - 1) * game.cols) + c - 1) > -1) ? 1 : 0) : 0) : 0; // top left cell
                //@ts-ignore
                mine_cell += (r > 0) ? ((game.mines.indexOf(((r - 1) * game.cols) + c) > -1) ? 1 : 0) : 0; // top cell 
                //@ts-ignore
                mine_cell += (r > 0) ? ((c + 1 < game.cols) ? ((game.mines.indexOf(((r - 1) * game.cols) + c + 1) > -1) ? 1 : 0) : 0) : 0; // top right cell
                //@ts-ignore
                mine_cell += (c > 0) ? ((game.mines.indexOf((r * game.cols) + c - 1) > -1) ? 1 : 0) : 0; // left cell
                //@ts-ignore
                mine_cell += (c + 1 < game.cols) ? ((game.mines.indexOf((r * game.cols) + c + 1) > -1) ? 1 : 0) : 0; // right cell
                //@ts-ignore
                mine_cell += (r + 1 < game.rows) ? ((c > 0) ? ((game.mines.indexOf(((r + 1) * game.cols) + c - 1) > -1) ? 1 : 0) : 0) : 0; // bottom left cell
                //@ts-ignore
                mine_cell += (r + 1 < game.rows) ? ((game.mines.indexOf(((r + 1) * game.cols) + c) > -1) ? 1 : 0) : 0; // bottom cell
                //@ts-ignore
                mine_cell += (r + 1 < game.rows) ? ((c + 1 < game.cols) ? ((game.mines.indexOf(((r + 1) * game.cols) + c + 1) > -1) ? 1 : 0) : 0) : 0; // bottom right cell
            }
            else {
                mine_cell = -1;
            } //@ts-ignore
            game.cells[r].push(mine_cell);
        }
    }
    // add rows and cells to the game grid
    for (var r = 0; r < game.rows; r++) {
        row = (0, jquery_1.default)('<div></div>');
        (0, jquery_1.default)('#game_div').append(row);
        row.addClass('grid-x');
        for (var c = 0; c < game.cols; c++) {
            cell = (0, jquery_1.default)('<div></div>');
            mine_cell = (0, jquery_1.default)('<div></div>');
            cell.append(mine_cell);
            row.append(cell);
            cell.addClass('cell');
            cell.addClass('auto');
            mine_cell.addClass('mine_cell');
            mine_cell.addClass('button'); //@ts-ignore
            mine_cell.data('cell', game.cells[r][c]);
            mine_cell.data('cell_num', (r * game.cols) + c);
            mine_cell.data('row', r);
            mine_cell.data('col', c);
            mine_cell.attr('id', 'cell_' + r + '_' + c);
        }
    }
}
/**
 * Handles left click on game cells, checks for mine, flag, blank, or number.
 *   If cell is blank, trigger click of surrounding cells.
 *   Checks if game is won after cell handled.
 *
 * @param e{event}
 *            click event
 * @return {null}
 */
function cellClick() {
    if (!time_interval) //@ts-ignore
        time_interval = setInterval(updateTime, 1000); //@ts-ignore
    if (game.lost || game.won || (typeof ((0, jquery_1.default)(this).data('flag')) != 'undefined' && (0, jquery_1.default)(this).data('flag') > 0))
        return;
    if (!(0, jquery_1.default)(this).data('triggered')) {
        (0, jquery_1.default)(this).data('triggered', true);
        (0, jquery_1.default)(this).addClass('hollow');
        if ((0, jquery_1.default)(this).data('cell') == -1) { // bomb cell, you lost
            //@ts-ignore
            game.lost = true;
            (0, jquery_1.default)(this).html('<i class="fa fa-bomb fa-spin"></i>');
            (0, jquery_1.default)(this).addClass('alert');
            alertModal('You lost');
            (0, jquery_1.default)('.mine_cell:not(.hollow)').each(function () {
                if ((0, jquery_1.default)(this).data('cell') == -1) {
                    if ((0, jquery_1.default)(this).data('flag') != 1)
                        (0, jquery_1.default)(this).html('<i class="fa fa-bomb"></i>');
                }
                else if ((0, jquery_1.default)(this).data('flag') == 1) {
                    (0, jquery_1.default)(this).html('<i class="fa fa-times-circle"></i>');
                }
            });
        }
        else if ((0, jquery_1.default)(this).data('cell') == 0) { // blank cell, click surrounding
            // handle row above
            if ((0, jquery_1.default)(this).data('row') > 0) {
                if ((0, jquery_1.default)(this).data('col') > 0)
                    (0, jquery_1.default)('#cell_' + ((0, jquery_1.default)(this).data('row') - 1) + '_' + ((0, jquery_1.default)(this).data('col') - 1)).click(); // top left
                (0, jquery_1.default)('#cell_' + ((0, jquery_1.default)(this).data('row') - 1) + '_' + (0, jquery_1.default)(this).data('col')).click(); // top
                if ((0, jquery_1.default)(this).data('col') + 1 < game.cols)
                    (0, jquery_1.default)('#cell_' + ((0, jquery_1.default)(this).data('row') - 1) + '_' + ((0, jquery_1.default)(this).data('col') + 1)).click(); // top right
            }
            // cell to left and right
            if ((0, jquery_1.default)(this).data('col') > 0)
                (0, jquery_1.default)('#cell_' + (0, jquery_1.default)(this).data('row') + '_' + ((0, jquery_1.default)(this).data('col') - 1)).click(); // left
            if ((0, jquery_1.default)(this).data('col') + 1 < game.cols)
                (0, jquery_1.default)('#cell_' + (0, jquery_1.default)(this).data('row') + '_' + ((0, jquery_1.default)(this).data('col') + 1)).click(); // right
            // handle row below
            if ((0, jquery_1.default)(this).data('row') + 1 < game.rows) {
                if ((0, jquery_1.default)(this).data('col') > 0)
                    (0, jquery_1.default)('#cell_' + ((0, jquery_1.default)(this).data('row') + 1) + '_' + ((0, jquery_1.default)(this).data('col') - 1)).click(); // bottom left
                (0, jquery_1.default)('#cell_' + ((0, jquery_1.default)(this).data('row') + 1) + '_' + (0, jquery_1.default)(this).data('col')).click(); // bottom
                if ((0, jquery_1.default)(this).data('col') + 1 < game.cols)
                    (0, jquery_1.default)('#cell_' + ((0, jquery_1.default)(this).data('row') + 1) + '_' + ((0, jquery_1.default)(this).data('col') + 1)).click(); // bottom right
            }
        }
        else { // display number for cell
            (0, jquery_1.default)(this).text((0, jquery_1.default)(this).data('cell'));
        }
        checkIfWon();
    }
}
/**
 * Handles right click events for game cells for placing flags, marking questionable
 *
 * @param e{event}
 * @return {boolean}(false)
 */
function cellRightClick(e) {
    if (!time_interval) //@ts-ignore
        time_interval = setInterval(updateTime, 1000);
    e.preventDefault();
    e.stopImmediatePropagation(); //@ts-ignore
    if (game.lost || game.won)
        return false;
    if (!(0, jquery_1.default)(this).data('triggered')) {
        switch ((0, jquery_1.default)(this).data('flag')) {
            case 1:
                (0, jquery_1.default)(this).html('<i class="fa fa-question"></i>');
                (0, jquery_1.default)('#mines').text(parseInt((0, jquery_1.default)('#mines').text()) + 1);
                (0, jquery_1.default)(this).data('flag', 2);
                break;
            case 2:
                (0, jquery_1.default)(this).html('');
                (0, jquery_1.default)(this).data('flag', 0);
                break;
            default:
                if (parseInt((0, jquery_1.default)('#mines').text()) == 0) {
                    alert('You do not have any more flags to place.');
                }
                else {
                    (0, jquery_1.default)(this).html('<i class="fa fa-flag"></i>');
                    (0, jquery_1.default)('#mines').text(parseInt((0, jquery_1.default)('#mines').text()) - 1);
                    (0, jquery_1.default)(this).data('flag', 1);
                    checkIfWon();
                }
        }
    }
    return false;
}
/**
 * Called on interval to updated the game time seconds
 *
 * @param N/A
 * @return {null}
 */
function updateTime() {
    if (!game.lost && !game.won)
        (0, jquery_1.default)('#time').text(parseInt((0, jquery_1.default)('#time').text()) + 1);
    else //@ts-ignore
        clearInterval(time_interval);
}
/**
 * Checks if the user has won the game based on the following:
 *    The number of cells not clicked equals the number of mines for the game
 *    The number of flags remaining equals 0 and all flagged cells are mines
 *
 * @param N/A
 * @return {null}
 */
function checkIfWon() {
    if (!game.lost && !game.won) {
        if ((0, jquery_1.default)('.mine_cell:not(.hollow)').length == game.num_mines) { //@ts-ignore
            game.won = true;
            alertModal('<h3>You Won!</h3>');
        }
        else if (parseInt((0, jquery_1.default)('#mines').text()) == 0) { //@ts-ignore
            game.won = true;
            (0, jquery_1.default)('.mine_cell:not(.hollow)').each(function () {
                if (typeof ((0, jquery_1.default)(this).data('flag')) != 'undefined' && (0, jquery_1.default)(this).data('flag') > 0)
                    if ((0, jquery_1.default)(this).data('cell') != -1) //@ts-ignore
                        game.won = false;
            }); //@ts-ignore
            if (game.won)
                alertModal('<h3>You Won!</h3>');
        }
    }
}
