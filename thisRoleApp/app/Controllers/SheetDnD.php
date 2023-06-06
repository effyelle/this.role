<?php

namespace App\Controllers;

/**
 * \App\Controllers\SheetDnD, like \App\Controllers\Mailer, does not make direct calls to any models and does not return
 * HTML views. This class is in charge of managing the data received through ajax type "post" that have to do with the
 * character files, as well as generating the default fields for a new file, depending on the type of file. To generate
 * the character tokens, a character_DnD.json file is used.
 */
class SheetDnD
{
    /**
     * ---
     * GET SHEET DATA
     * ---
     * Name for game item sheet is required.
     * Returns game item sheet data according to the sheet type received. If none is given, character data is returned.
     *
     * @param string $name
     * @param string $type
     *
     * @return array
     */
    function __init(string $name, string $type = 'character'): array
    {
        return $this->$type($name);
    }

    /**
     * ---
     * HANDOUT SHEET DATA
     * ---
     * @param $name
     *
     * @return array
     */
    function handout($name): array
    {
        $sheet = file_get_contents(FCPATH . '/assets/js/custom/games/character_DnD.json');
        if ($sheet) {
            $sheet = json_decode($sheet, true);
            $sheet['item_name'] = $name;
            $sheet['item_type'] = 'handout';
        }
        return $sheet;
    }

    /**
     * ---
     * CHARACTER SHEET DATA
     * ---
     * Uses file '/public/assets/js/custom/games/character_DnD.json' to get data for a new item sheet.
     *
     * @param $name
     *
     * @return array|bool
     */
    function character($name): array|bool
    {
        $sheet = file_get_contents(FCPATH . '/assets/js/custom/games/character_DnD.json');
        if ($sheet) {
            $sheet = json_decode($sheet, true);
            $sheet['item_name'] = $name;
            $sheet['item_type'] = 'character';
        }
        return $sheet;
    }

    /**
     * ---
     * EDIT ITEM VISIBILITY
     * ---
     * @param $post
     * @return array
     */
    function _edit_view($post): array
    {
        // * begin::Save players can see or edit if it was set * //
        $post['item_viewers'] = [];
        $post['item_editors'] = [];
        if (isset($_POST['players'])) {
            foreach ($_POST['players'] as $k => $v) {
                if ($v === 'can_see') {
                    $post['item_viewers'][] = substr($k, 0, 1);
                }
                if ($v === 'can_edit') {
                    $post['item_editors'][] = substr($k, 0, 1);
                }
            }
        }
        // * end::Save players can see or edit if it was set * //
        return $post;
    }

    /**
     * ---
     * PROCESS DATA FOR INSERT
     * ---
     * Processes arrays and objects into json format, leaving all other variable types unchanged.
     *
     * @param array $post
     *
     * @return array
     */
    function _json_process(array $post): array
    {
        foreach ($post as $k => $v) {
            // Encode if array
            if (gettype($v) === 'array' || gettype($v) === 'object') {
                $v = json_encode($v, JSON_UNESCAPED_UNICODE);
            }
            $post[$k] = $v;
        }
        return $post;
    }

    /**
     * ---
     * PROCESS POST
     * ---
     * Process item data and updates if necessary according to post parameters given.
     *
     * @param $params - $_POST: $k for HTML form name, $v for value
     * @param $item
     *
     * @return array|bool
     */
    function _process_post($params, $item): array|bool
    {
        $k = array_keys($params)[0];
        $v = $params[$k];
        switch ($k) {
            case 'item_name':
            case 'xp':
            case 'notes':
            case 'backstory':
            case 'attacks':
            case 'global_modifiers':
            case 'tools_n_custom':
            case 'bag':
            case 'custom_features':
                return [$k => $v];
            //* begin::Info **//
            case (bool)preg_match('/class|subclass|lvl|race|background|walkspeed|inspiration|spellcasting/', $k):
                $info = json_decode($item['info'], true);
                if ($info) {
                    if ($k === 'inspiration') $v = $info['inspiration'] === "0" ? "1" : "0";
                    $info[$k] = $v;
                    return ['info' => $info];
                }
                break;
            //* end::Info **//
            /*// * begin::Classes * //
            case (bool)preg_match('/_subclass|_lvl|_main/', $k):
                $classes = json_decode($item['classes'], true);
                if ($classes) return ['classes' => $this->getClasses($classes, $k, $v)];
                break;
            // * end::Classes * //*/
            //* begin::Ability Scores **//
            case (bool)preg_match('/this_prof|this_score/', $k):
                if ($v !== '') {
                    $scores = json_decode($item['ability_scores'], true);
                    if ($scores) return ['ability_scores' => $this->getScores($scores, $k, $v)];
                }
                break;
            //* end::Ability Scores **//
            //* begin::Skill Proficiencies **//
            case str_contains($k, 'this_skill'):
                if ($v !== '') {
                    $skills = json_decode($item['skill_proficiencies'], true);
                    if ($skills) return ['skill_proficiencies' => $this->getSkills($skills, $k, $v)];
                }
                break;
            //* end::Skill Proficiencies **//
            case (bool)preg_match('/_hp|_hd|this_hit_dice/', $k):
                if ($v !== '') {
                    $health = json_decode($item['health'], true);
                    if ($health) {
                        $health['hit_points'][$k] = $v;
                        return ['health' => $health];
                    }
                }
                break;
            case (bool)preg_match('/this_death_save|this_cond|this_exhaustion/', $k):
                if ($v !== '') {
                    $health = json_decode($item['health'], true);
                    if ($health) {
                        $split = explode('_', $k);
                        $type = $split[count($split) - 1];
                        if (str_contains($k, 'this_death_save')) $health['death_saves'][$type] = $v;
                        elseif (str_contains($k, 'this_cond')) $health['conditions'][$type] = $v;
                        elseif (str_contains($k, 'this_exhaustion')) $health['conditions']['exhaustion']['lvl'] = $v;
                        return ['health' => $health];
                    }
                }
                break;
        }
        return false;
    }

    /**
     * ---
     * GET CLASSES ARRAY
     * ---
     *
     * @param array $classes
     * @param string $k
     * @param string $v
     *
     * @return array
     */
    function getClasses(array $classes, string $k, string $v): array
    {
        for ($i = 0; $i < count($classes); $i++) {
            $c = $classes[$i];
            // Find the class that matches the key or the value of post field
            if (str_contains($k, $c['class'])) {
                // Set the class as main if there is no main
                if (preg_match('/_subclass|_lvl/', $k)) {
                    $classes[$i][explode('_', $k)[1]] = $v;
                } elseif (str_contains($k, '_main')) {
                    $classes[$i][explode('_', $k)[1]] = $v;
                    if ($v === "0") $classes[$i]['multiclass'] = "1";
                }
            }
        }
        return $classes;
    }

    /**
     * ---
     * GET ABILITY SCORES ARRAY
     * ---
     *
     * @param array $scores
     * @param string $k
     * @param string $v
     *
     * @return array
     */
    function getScores(array $scores, string $k, string $v): array
    {
        foreach ($scores as $name => $score) {
            if (str_contains($k, $name)) {
                $key = str_contains($k, 'this_prof') ? "is_prof" : "score";
                $scores[$name][$key] = $v;
            }
        }
        return $scores;
    }

    /**
     * ---
     * GET SKILLS ARRAY
     * ---
     *
     * @param array $skills
     * @param string $k
     * @param string $v
     *
     * @return array
     */
    function getSkills(array $skills, string $k, string $v): array
    {
        foreach ($skills as $name => $skill) {
            if (str_contains($k, $name)) {
                $skills[$name]['is_prof'] = $v === "0" ? "1" : ($v === "1" ? "2" : "0");
            }
        }
        return $skills;
    }

    /**
     * ---
     * GET HEALTH ARRAY
     * ---
     *
     * @param array $health
     * @param string $k
     * @param string $v
     *
     * @return array
     */
    function getHealth(array $health, string $k, string $v): array
    {
        $health['hit_points'][$k] = $v;
        return $health;
    }
}
