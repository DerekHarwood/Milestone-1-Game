var game = {
    rows: 8,
    cols: 8,
    num_mines: 10
};

// On document load, initial setup.

$(document).ready(function() {
    $(document).foundation();
    $(document).on('click', '.mine_cell', cellClick);
    $(document).on('contextmenu', '.mine_cell', cellRightClick);
    $('#button').click(newGame);
    $('#cancel_button').click(hideModal);
    $('#rows').val(game.rows);
    $('#cols').val(game.cols);
    $('#mines').val(game.num_mines);
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
 $.fn.bindFirst = function(name, fn) {
    var elem, handlers, i, _len;
    this.bind(name, fn);
    for (i = 0, _len = this.length; i < _len; i++) {
        elem = this[i];
        handlers = jQuery._data(elem).events[name.split('.')[0]];
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
    $(document).bindFirst('keydown', alertKeydown);
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