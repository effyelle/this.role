<?php

namespace App\Controllers;

class Games extends BaseController
{
    protected mixed $gamesmodel;

    function __construct()
    {
        $this->gamesmodel = model('GamesModel');
    }

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
                    $gamePlayers = json_decode($game['game_players']);
                    foreach ($gamePlayers as $gamePlayer) {
                        if ($gamePlayer['id'] === $_SESSION['user']['user_id']) {
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

    function game(string $page, int $id): string
    {
        $game = $this->gamesmodel->get(['game_id' => $id]);
        if (count($game) === 1) {
            $game = $game[0];
            return template('games/' . $page, ['game' => $game]);
        }
        return template('games/not_found');
    }

    function details(int $id): string
    {
        $game = $this->gamesmodel->get(['game_id' => $id]);
        if (count($game) === 1) {
            $game = $game[0];
            return template('games/details', ['game' => $game]);
        }
        return template('games/not_found');
    }

    function join()
    {
    }

    function createInviteUrl($id)
    {
        // Expire old urls
        $this->gamesmodel->updt(
            ['url_expires' => date('Y-m-d H:i:s', time())], // data
            ['id_game' => $id], // where
            $this->gamesmodel->relatedTable // table
        );
        $url = '/app/games/join/' . time();
        if ($this->gamesmodel->new(['url' => $url, 'id_game' => $id], $this->gamesmodel->relatedTable)) {
            echo json_encode(['response' => true, 'url' => $url]);
            return;
        }
        echo json_encode(['response' => false]);
    }
}