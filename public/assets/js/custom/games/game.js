function initGame(dbGame, session) {

    const dataChanged = (data) => {
        const items = data.results;
        for (let i in items) {
            if (items[i].item_icon !== journal.items.list[i].info.item_icon) {
                return;
            }
        }
        return false;
    }
}