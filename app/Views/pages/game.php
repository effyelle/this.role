<div class="this-game w-100 h-100 bg-white"></div>
<script type="text/javascript" src="/assets/js/custom/games/Board.js"></script>
<script>
    document.addEventListener('DOMContentLoaded', function () {

        let board = new Board('.btn.dice');

        $('.btn.dice').click(function () {
            console.log(board.dices[this.value].roll());
        });
    });
</script>