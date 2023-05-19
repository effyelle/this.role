<?php

namespace App\Controllers;

use function PHPUnit\Framework\stringContains;

class SheetDnD
{
    public string $name;
    public string $type;
    public string $icon;
    public array $info;
    public array $classes;
    public string $xp;
    public array $ability_scores;
    public array $expertises;
    public array $health;
    public array $attack;
    public array $global_modifier;
    public array $tool_or_custom;
    public array $bag_item;
    public array $bag;
    public array $custom_feature;
    public string $notes;
    public string $backstory;

    function __init($name, $type = 'character'): array
    {
        return $this->$type($name);
    }

    function handout($name): array
    {
        return [
            'item_name' => $name,
            'item_type' => 'handout'
        ];
    }

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
            case (bool)preg_match('/class|subclass|lvl|race|background|walkspeed|inspiration/', $k):
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
                $scores = json_decode($item['ability_scores'], true);
                if ($scores) return ['ability_scores' => $this->getScores($scores, $k, $v)];
                break;
            //* end::Ability Scores **//
            //* begin::Skill Proficiencies **//
            case str_contains($k, 'this_skill'):
                $skills = json_decode($item['skill_proficiencies'], true);
                if ($skills) return ['skill_proficiencies' => $this->getSkills($skills, $k, $v)];
                break;
            //* end::Skill Proficiencies **//
            case (bool)preg_match('/_hp|_hd/', $k):
                $health = json_decode($item['health'], true);
                if ($health) {
                    $health['hit_points'][$k] = $v;
                    return ['health' => $health];
                }
                break;
            case (bool)preg_match('/this_death_save|this_cond|this_exhaustion/', $k):
                $health = json_decode($item['health'], true);
                if ($health) {
                    $split = explode('_', $k);
                    $type = $split[count($split) - 1];
                    if (str_contains($k, 'this_death_save')) $health['death_saves'][$type] = $v;
                    elseif (str_contains($k, 'this_cond')) $health['conditions'][$type] = $v;
                    elseif (str_contains($k, 'this_exhaustion')) $health['conditions']['exhaustion']['lvl'] = $v;
                    return ['health' => $health];
                }
                break;
        }
        return false;
    }

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

    function getSkills(array $skills, string $k, string $v): array
    {
        foreach ($skills as $name => $skill) {
            if (str_contains($k, $name)) {
                $skills[$name]['is_prof'] = $v === "0" ? "1" : ($v === "1" ? "2" : "0");
            }
        }
        return $skills;
    }

    function getHealth(array $health, string $k, string $v): array
    {
        $health['hit_points'][$k] = $v;
        return $health;
    }
}
