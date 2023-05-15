function initGame(dbGame, session) {

    function reloadGameInfo() {
        $.ajax({
            type: "get", url: "/app/games_ajax/get_game_info/" + dbGame.game_id, dataType: "json", succes: (data) => {
                if (data.response && data.game) dbGame = data.game; else {
                    alert("Este juego ya no existe");
                    window.location.assign('/index');
                }
            }, error: (e) => {
                console.log("Error: ", e);
            }
        });
    }


    thisShouldBeAWebSocket();
    setInterval(thisShouldBeAWebSocket, 300000);

    const dataChanged = (data) => {
        const items = data.results;
        for (let i in items) {
            if (items[i].item_icon !== journal.items.list[i].info.item_icon) {
                return;
            }
        }
        return false;
    }

    function thisShouldBeAWebSocket() {
        reloadGameInfo();
        //getChat();
        //board.map.loadLayers();
        /*journal.getJournalAjax().done((data) => {
            if (data.results && data.results.length === journal.items.length) {
                if (!dataChanged(data)) return;
                journal.reload();
            }
        });*/
    }
}