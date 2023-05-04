<?php

namespace App\Controllers;

use function PHPUnit\Framework\isNan;

class Games extends BaseController
{
    protected mixed $gamesmodel;
    protected mixed $gamechatmodel;
    protected mixed $usermodel;
    protected mixed $journalmodel;
    protected mixed $playermodel;
    protected mixed $layermodel;
    protected string $now;
    protected string $mediaGames = FCPATH . 'assets/media/games/';

    function __construct()
    {
        $this->gamesmodel = model('GamesModel');
        $this->gamechatmodel = model('GameChatModel');
        $this->usermodel = model('UsersModel');
        $this->journalmodel = model('GameJournalModel');
        $this->playermodel = model('GamePlayerModel');
        $this->layermodel = model('GameLayersModel');
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
        $sessionUser = $_SESSION['user']['user_id'];
        // * BEGIN::Submit post * //
        if (isset($_POST['game_title'])) {
            // Attempt to create new game
            $game_title = validate($_POST['game_title']);
            $game_details = validate($_POST['game_details']);
            if ($game_details === '') $game_details = null;
            // Create game from basics
            if ($this->gamesmodel->new([
                'game_creator' => $sessionUser,
                'game_title' => $game_title,
                'game_details' => $game_details
            ])) {
                // *********************************** //
                // * Begin game folder and game icon * //
                // *********************************** //
                // Get the new game ID
                $game_id = intval($this->gamesmodel->maxID()->{'MAX(game_id)'});
                // Add user to players in this game
                $this->playermodel->new([
                    'game_player_id_user' => $sessionUser,
                    'game_player_id_game' => $game_id
                ]);
                // Declare new folder for the game
                $new_folder = time();
                $newRoute = $this->mediaGames . $new_folder . '/';
                // Create the folder
                if (mkdir($newRoute) && mkdir($newRoute . '/layers') && mkdir($newRoute . '/players')) {
                    // If folder creates, update game to save folder
                    if ($this->gamesmodel->updt(['game_folder' => $new_folder], ['game_id' => $game_id])) {
                        // * Upload game icon into the new folder * //
                        $img = upload_img('game_icon', $newRoute, 'game_icon');
                        // If the file was uploaded, update game to add new icon
                        if (str_contains($img, 'game_icon')) {
                            $newFile = explode('/', $img)[count(explode('/', $img)) - 1];
                            $this->gamesmodel->updt(['game_icon' => $newFile], ['game_id' => $game_id]);
                        } else {
                            $data = ['game_icon' => $img, 'game_folder' => $new_folder, 'game_id', $game_id];
                        }
                    }
                }
                // ********************************* //
                // * End game folder and game icon * //
                // ********************************* //
            }
        }
        // * END::Submit POST * //
        // * BEGIN::Get games for session user * //
        // Database connect, get games, then load
        if ($games = $this->gamesmodel->get(
            ['game_player_id_user' => $sessionUser, 'game_deleted' => null], // where
            ['game_player' => 'game_player_id_game=game_id'] // join
        )) {
            $data['games_list'] = $games;
        }
        // * END::Get games for session user * //
        return template('games/list', $data);
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
                if (is_dir($this->mediaGames . $folder)) {
                    // Delete old one if exists
                    $fullRoute = $this->mediaGames . $folder . '/';
                    $files = scandir($fullRoute);
                    // Search if there's already an icon
                    foreach ($files as $file) {
                        if (str_contains($file, 'game_icon')) {
                            // Delete file if found
                            unlink($fullRoute . $file);
                        }
                    }
                    $img = upload_img('game_icon', $fullRoute, 'game_icon');
                    if (str_contains($img, 'game_icon')) {
                        $newFile = explode('/', $img)[count(explode('/', $img)) - 1];
                        $this->gamesmodel->updt(['game_icon' => $newFile], ['game_id' => $id]);
                    } else {
                        $data['error'] = $img;
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
     * Launch game page
     *
     * @param int $id
     *
     * @return string
     */
    function launch(int $id): string
    {
        $data = [];
        $game = $this->gamesmodel->get(['game_id' => $id]);
        if (count($game) === 1) {
            $data = [
                'game' => $game[0],
                'title' => $game[0]['game_title']
            ];
            $players = $this->usermodel->get(['game_player_id_game' => $id], ['game_player' => 'game_player_id_user=user_id']);
            if (count($players) > 0) $data['players'] = $players;
            return template('games/game', $data);
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
        $sessionUser = $_SESSION['user']['user_id'];
        $game = $this->gamesmodel->get(['game_id' => $id]);
        if (count($game) === 1) {
            $game = $game[0];
            // Return if the session user was game creator
            if (count($this->playermodel->get(['game_player_id_user' => $sessionUser])) > 0) {
                return json_encode(['response' => false, 'msg' => 'You already joined this game']);
            }
            if ($this->playermodel->new(['game_player_id_game' => $id, 'game_player_id_user' => $sessionUser])) {
                return json_encode(['response' => true]);
            }
            return json_encode(['response' => false, 'msg' => 'Could not join the game']);
        }
        return json_encode(['response' => false, 'msg' => 'Game not found']);
    }

    function ajax_del_game($id): string
    {
        if ($this->gamesmodel->updt(
            ['game_deleted' => $this->now], //data
            ['game_id' => $id] //where
        )) {
            return json_encode(['response' => true]);
        }
        return json_encode(['response' => false, 'msg' => 'Game could not be deleted']);
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

    function set_journal_item($id): string
    {
        $data['response'] = false;
        $data['msg'] = 'Missing some data';
        if (isset($_POST['journal_title-input']) && isset($_POST['journal-item_type']) && $_POST['journal-item_type'] !== '-1') {
            $gameId = is_numeric(validate($id)) ? intval(validate($id)) : null;
            if (isset($gameId)) {
                if ($this->journalmodel->new([
                    'item_id_game' => $gameId,
                    'item_title' => validate($_POST['journal_title-input']),
                    'item_type' => validate($_POST['journal-item_type']),
                ])) {
                    $data = ['response' => true, 'msg' => null];
                } else {
                    $data['msg'] = 'Item could not be added';
                }
            } else {
                $data['msg'] = 'Please don\'t script into Database!';
            }
        }
        return json_encode($data);
    }

    function get_journal_items($id): string
    {
        if ($journalItems = $this->journalmodel->get(['item_id_game' => $id], null, ['item_title' => 'ASC'])) {
            return json_encode(['response' => true, 'results' => $journalItems]);
        }
        return json_encode(['response' => false]);
    }

    function sheet($id): string
    {
        return view('/pages/games/sheet', ['sheet' => $this->journalmodel->get(['item_id' => $id])[0]]);
    }

    function save_sheet($id): string
    {
        $data['response'] = false;
        $data['post'] = $_POST;
        if (isset($_POST['char_sheet'])) {
            $params = [];
            foreach ($_POST['char_sheet'] as $key => $val) {
                $params[$key] = validate($val);
            }
            $key = array_keys($params)[0];
            if ($key === 'item_icon') {
                // Upload image, delete old image (?)
            }
            $data['keys'] = $key;

            if ($this->journalmodel->updt($params, ['item_id_game' => $id])) {
                $data['response'] = true;
            }
            $data['params'] = $params;
        }
        return json_encode($data);
    }

    function add_map($id): string
    {
        $data = [
            'img' => 'No data was found',
            'resposne' => false
        ];
        if (isset($_POST['layer_name']) && isset($_FILES['layer_img'])) {
            // Add layer by name
            if ($this->layermodel->new([
                'layer_name' => validate($_POST['layer_name']),
                'layer_id_game' => $id
            ])) {
                // Get folder for game
                $game = $this->gamesmodel->get(['game_id' => $id])[0];
                $newName = time();
                $newRoute = $this->mediaGames . $game['game_folder'] . '/layers/';
                // * Upload game icon into the new folder * //
                $img = upload_img('layer_img', $newRoute, $newName);
                $data ['img'] = $img;
                // If the file was uploaded, update layer
                if (str_contains($img, $newName)) {
                    $newFile = explode('/', $img)[count(explode('/', $img)) - 1];
                    if ($this->layermodel->updt(
                        ['layer_bg' => $newFile],
                        ['layer_id' => $this->layermodel->maxID()->layer_id]
                    )) {
                        $data = [
                            'img' => $newFile,
                            'response' => true,
                            'layers' => $this->layermodel->get(['layer_id_game' => $id])
                        ];
                    }
                }
            }
        }
        return json_encode(['data' => $data]);
    }

    function edit_map($id): string
    {
        $data['response'] = false;
        $layerName = validate($_POST['layer_name']);
        $layerID = $_POST['layer_id'];
        if ($this->layermodel->uptd(['layer_name' => $layerName], ['layer_id' => $layerID])) {
            if (isset($_FILES['layer_img'])) {
                $game = $this->gamesmodel->get(['game_id' => $id])[0];
                $newMap=
                $layer = $this->layermodel->get(['layer_id' => $layerID])[0];
                $oldMap = $game['game_folder'] . '/layers/' . $layer['layer_bg'];
                // If old map img exists delete it
                if (is_file($oldMap)) unlink($oldMap);

            }
        }
        return json_encode(['data' => $data]);
    }

    function get_layers($id): string
    {
        $data ['response'] = false;
        if ($data['layers'] = $this->layermodel->get(['layer_id_game' => $id])) {
            $data['response'] = true;
        }
        return json_encode($data);
    }

    function set_selected_layer($id): string
    {
        $data = ['response' => false];
        if (isset($_GET['layer_id'])) {
            if ($this->gamesmodel->updt(
                ['game_layer_selected' => $_GET['layer_id']],
                ['game_id' => $id]
            )) {
                $data['response'] = true;
            }
        }
        return json_encode($data);
    }

    function delete_layer($id): string
    {
        $data['response'] = false;
        if ($this->layermodel->del(['layer_id' => $id])) {
            $data['response'] = true;
        }
        return json_encode($data);
    }
}