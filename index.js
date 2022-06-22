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