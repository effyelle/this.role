<?php

namespace App\Controllers;

class Games extends BaseController
{
    protected mixed $gamesmodel;

    function __construct()
    {
        $this->gamesmodel = model('GamesModel');
    }

    function games(): string
    {
        $data = [];
        if (isset($_POST['game_title'])) {
            // Attempt to create new game
            $game_title = validate($_POST['game_title']);
            $game_details = validate($_POST['game_details']);
            if ($game_details === '') $game_details = null;
            // Create game from basics
            if ($this->gamesmodel->new([
                'game_user_creator' => $_SESSION['user']['user_id'],
                'game_title' => $game_title,
                'game_details' => $game_details
            ])) {
                // Get the new game ID
                $game_id = intval($this->gamesmodel->maxID()->{'MAX(game_id)'});
                // Declare new folder for the game
                $new_folder = '/assets/media/games/' . time() . '/';
                // Create the folder
                if (mkdir('.' . $new_folder)) {
                    // If folder creates, update game to save folder
                    if ($this->gamesmodel->updt(['game_folder' => $new_folder], ['game_id' => $game_id])) {
                        // Upload imagen into the new folder
                        $img = upload_img('game_icon', $new_folder, 'game_icon');
                        // If the file was uploaded, update game to add new icon
                        if (str_contains($img, 'game_icon')) {
                            $data = ['game_icon' => $img, 'game_folder' => $new_folder, 'game_id', $game_id];
                            if ($this->gamesmodel->updt(['game_icon' => $img], ['game_id' => $game_id])) {
                                // Nothing else to do from here?
                            }
                        }
                    }
                }
            }
        }
        // Database connect, get games, then load
        if ($games = $this->gamesmodel->get()) $data['games_list'] = $games;
        return template('games', $data);
    }

    function game(int $id): string
    {
        if ($game = $this->gamesmodel->get($id)) {
            return template('game', ['game' => $game]);
        }
        return template('game_not_found');
    }
}