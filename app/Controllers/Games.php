<?php

namespace App\Controllers;

class Games extends BaseController
{
    protected mixed $gamesmodel;
    protected mixed $gamechatmodel;
    protected string $now;

    function __construct()
    {
        $this->gamesmodel = model('GamesModel');
        $this->gamechatmodel = model('GameChatModel');
        $this->now = date('Y-m-d H:i:s', time());
    }

    /**
     * Redirect to a game list for the logged user, showing those games in which
     * the user participates or those who the user has created
     *
     * @return string
     */
    function list(): string
    {
        $data = [];
        if (isset($_POST['game_title'])) {
            // Attempt to create new game
            $game_title = validate($_POST['game_title']);
            $game_details = validate($_POST['game_details']);
            if ($game_details === '') $game_details = null;
            // Create game from basics
            if ($this->gamesmodel->new([
                'game_creator' => $_SESSION['user']['user_id'],
                'game_title' => $game_title,
                'game_details' => $game_details
            ])) {
                // *********************************** //
                // * Begin game folder and game icon * //
                // *********************************** //
                // Get the new game ID
                $game_id = intval($this->gamesmodel->maxID()->{'MAX(game_id)'});
                // Declare new folder for the game
                $new_folder = '/assets/media/games/' . time() . '/';
                // Create the folder
                if (mkdir('.' . $new_folder)) {
                    // If folder creates, update game to save folder
                    if ($this->gamesmodel->updt(['game_folder' => $new_folder], ['game_id' => $game_id])) {
                        // * Upload game icon into the new folder * //
                        $img = upload_img('game_icon', $new_folder, 'game_icon');
                        // If the file was uploaded, update game to add new icon
                        if (str_contains($img, 'game_icon')) {
                            $data = ['game_icon' => $img, 'game_folder' => $new_folder, 'game_id', $game_id];
                            $this->gamesmodel->updt(['game_icon' => $img], ['game_id' => $game_id]);
                        }
                    }
                }
                // ********************************* //
                // * End game folder and game icon * //
                // ********************************* //
            }
        }
        // ************************************ //
        // * Begin get games for session user * //
        // ************************************ //
        // Database connect, get games, then load
        if ($games = $this->gamesmodel->get()) {
            $data['games_list'] = [];
            foreach ($games as $game) {
                // If session user is creator OR if it's in $games['game_players'] JSON
                if ($game['game_creator'] === $_SESSION['user']['user_id']) {
                    $data['games_list'][] = $game;
                } // If session user is not creator compare him with games players
                elseif (isset($game['game_players'])) {
                    $players = json_decode($game['game_players']);
                    foreach ($players as $player) {
                        if ($player->user_id === $_SESSION['user']['user_id']) {
                            $data['games_list'][] = $game;
                        }
                    }
                }
            }
        }
        // ********************************** //
        // * End get games for session user * //
        // ********************************** //
        return template('games/list', $data);
    }

    /**
     * Launch game page
     *
     * @param int $id
     *
     * @return string
     */
    function launch(int $id): string
    {
        $game = $this->gamesmodel->get(['game_id' => $id]);
        if (count($game) === 1) {
            $game = $game[0];
            return template('games/game', ['game' => $game]);
        }
        return template('games/not_found');
    }

    /**
     * Redirect to a detailed page for game where user (if creator) can edit
     * game details, title and icon
     *
     * @param int $id
     *
     * @return string
     */
    function details(int $id): string
    {
        $game = $this->gamesmodel->get(['game_id' => $id]);
        $data = [];
        if (count($game) === 1) {
            $game = $game[0];

            /* Start::Update title and details */
            if (isset($_POST['game_title'])) {
                $this->gamesmodel->updt(
                    ['game_title' => validate($_POST['game_title'])],
                    ['game_id' => $id]
                );
            }
            if (isset($_POST['game_details'])) {
                $this->gamesmodel->updt(
                    ['game_details' => validate($_POST['game_details'])],
                    ['game_id' => $id]
                );
            }
            /* End::Update title and details */

            /* Start::Attempt to update img */

            if (isset($_FILES['game_icon']) && $_FILES['game_icon']['error'] === 0) {
                $folder = $game['game_folder'];
                if (is_dir($folder)) {
                    // Delete old one if exists
                    $files = scandir(FCPATH . $folder);
                    // Search if there's already an icon
                    foreach ($files as $file) {
                        if (str_contains($file, 'game_icon')) {
                            // Delete file if found
                            unlink(FCPATH . $folder . $file);
                        }
                    }
                    $img = upload_img('game_icon', $folder, 'game_icon');
                    if (str_contains($img, 'game_icon')) {
                        $this->gamesmodel->updt(['game_icon' => $img], ['game_id' => $id]);
                    }
                }
            }
            /* End::Attempt to update img */

            $data['game'] = $this->gamesmodel->get(['game_id' => $id])[0];
            return template('games/details', $data);
        }
        return template('games/not_found');
    }

    /**
     * Redirect to the join game page where an ajax call to {@link ajax_join}
     * will attempt to include user in a game
     *
     * @param $id
     *
     * @return string
     */
    function join($id): string
    {
        $game = $this->gamesmodel->get(['url_expires > ' => $this->now, 'url' => $id], [$this->gamesmodel->relatedTable => 'game_id=id_game']);
        if (count($game) === 1) {
            $game = $game[0];
            return template('games/join', ['game' => $game]);
        }
        return template('games/not_found');
    }

    /* ********************************************************************
     ***************************** AJAX CALLS *****************************
     **********************************************************************/

    /**
     * Create a url to join a game
     *
     * @param $id
     *
     * @return string
     */
    function create_invite_url($id): string
    {
        // Expire old urls
        $this->gamesmodel->updt(
            ['url_expires' => $this->now], // data
            ['id_game' => $id], // where
            $this->gamesmodel->relatedTable // table
        );
        $url = time();
        if ($this->gamesmodel->new(['url' => $url, 'id_game' => $id], $this->gamesmodel->relatedTable)) {
            return json_encode(['response' => true, 'url' => $this->baseURL . '/app/games/join/' . $url]);
        }
        return json_encode(['response' => false, 'msg' => 'Url could not be created']);
    }

    /**
     * Add user to a game
     *
     * @param $id
     *
     * @return string
     */
    function ajax_join($id): string
    {
        $game = $this->gamesmodel->get(['game_id' => $id]);
        if (count($game) === 1) {
            $game = $game[0];
            // Return if the session user was game creator
            if ($_SESSION['user']['user_id'] == $game['game_creator']) {
                return json_encode(['response' => false, 'msg' => 'You already joined this game']);
            }
            $players = $game['game_players'];
            if (!isset($players)) $players = [];
            else {
                $players = json_decode($players);
                foreach ($players as $player) {
                    if ($player->user_id === $_SESSION['user']['user_id']) {
                        return json_encode(['response' => false, 'msg' => 'You already joined this game']);
                    }
                }
            }
            $players[] = [
                'user_id' => $_SESSION['user']['user_id'],
                'user_username' => $_SESSION['user']['user_username']
            ];
            $players = json_encode($players);
            if ($this->gamesmodel->updt(
                ['game_players' => $players],
                ['game_id' => $game['game_id']]
            )) {
                return json_encode(['response' => true]);
            }
            return json_encode(['response' => false, 'msg' => 'Could not join the game']);
        }
        return json_encode(['response' => false, 'msg' => 'Game not found']);
    }

    function set_chat($id): string
    {
        if (isset($_POST['msg']) && isset($_POST['sender']) && isset($_POST['msgType'])) {
            if ($this->gamechatmodel->new([
                'chat_game_id' => $id,
                'chat_sender' => validate($_POST['sender']),
                'chat_msg' => validate($_POST['msg']),
                'chat_msg_type' => validate($_POST['msgType']),
            ])) {
                return json_encode(['response' => true]);
            }
        }
        return json_encode(['response' => false, 'msg' => 'Message could not be sent']);
    }

    function get_chat($id): string
    {
        if ($gameChat = $this->gamechatmodel->get(['chat_game_id' => $id])) {
            return json_encode(['response' => true, 'msgs' => $gameChat]);
        }
        return json_encode(['response' => false, 'msg' => 'Messages could not be loaded']);
    }
}