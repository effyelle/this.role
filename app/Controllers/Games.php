<?php

namespace App\Controllers;

class Games extends BaseController
{
    protected mixed $gamesmodel;
    protected string $now;

    function __construct()
    {
        $this->gamesmodel = model('GamesModel');
        $this->now = date('Y-m-d H:i:s', time());
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

    function game(int $id): string
    {
        $game = $this->gamesmodel->get(['game_id' => $id]);
        if (count($game) === 1) {
            $game = $game[0];
            return template('games/game', ['game' => $game]);
        }
        return template('games/not_found');
    }

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

            if (isset($_FILES['game_icon'])) {
                $folder = $game['game_folder'];
                // Delete old one if exists
                $files = scandir(FCPATH . $folder);
                // Search if there's already an icon
                foreach ($files as $file) {
                    if (preg_match('/game_icon/', $file)) {
                        // Delete file if found
                        unlink(FCPATH . $folder . $file);
                    }
                }
                $img = upload_img('game_icon', $folder, 'game_icon');
                if (str_contains($img, 'game_icon')) {
                    $this->gamesmodel->updt(['game_icon' => $img], ['game_id' => $id]);
                }
            }
            /* End::Attempt to update img */

            $data['game'] = $this->gamesmodel->get(['game_id' => $id])[0];
            return template('games/details', $data);
        }
        return template('games/not_found');
    }

    function join($id): string
    {
        $game = $this->gamesmodel->get(['url_expires > ' => $this->now, 'url' => $id], [$this->gamesmodel->relatedTable => 'game_id=id_game']);
        if (count($game) === 1) {
            $game = $game[0];
            return template('games/join', ['game' => $game]);
        }
        return template('games/not_found');
    }

    public function ajax_join($id): void
    {
        $game = $this->gamesmodel->get(['game_id' => $id]);
        if (count($game) === 1) {
            $game = $game[0];
            // Return if the session user was game creator
            if ($_SESSION['user']['user_id'] == $game['game_creator']) {
                echo json_encode(['response' => false, 'msg' => 'You already joined this game']);
                return;
            }
            $players = $game['game_players'];
            if (!isset($players)) $players = [];
            else {
                $players = json_decode($players);
                foreach ($players as $player) {
                    if ($player->user_id === $_SESSION['user']['user_id']) {
                        echo json_encode(['response' => false, 'msg' => 'You already joined this game']);
                        return;
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
                echo json_encode(['response' => true]);
                return;
            }
            echo json_encode(['response' => false, 'msg' => 'Could not join the game']);
            return;
        }
        echo json_encode(['response' => false, 'msg' => 'Game not found']);
    }

    function createInviteUrl($id)
    {
        // Expire old urls
        $this->gamesmodel->updt(
            ['url_expires' => $this->now], // data
            ['id_game' => $id], // where
            $this->gamesmodel->relatedTable // table
        );
        $url = time();
        if ($this->gamesmodel->new(['url' => $url, 'id_game' => $id], $this->gamesmodel->relatedTable)) {
            echo json_encode(['response' => true, 'url' => $this->baseURL . '/app/games/join/' . $url]);
            return;
        }
        echo json_encode(['response' => false]);
    }
}