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

    function handout(): array
    {
        $this->info = [
            "name" => ""
        ];
        return ['info' => $this->info];
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
                return [$k => $v];
            //* begin::Info **//
            case (bool)preg_match('/race|background|walkspeed|inspiration/', $k):
                $info = json_decode($item['info'], true);
                if ($info) {
                    if ($k === 'inspiration') $v = $info['inspiration'] === "0" ? "1" : "0";
                    $info[$k] = $v;
                    return ['info' => $info];
                }
                break;
            //* end::Info **//
            //* begin::Classes **//
            case (bool)preg_match('/class|subclass|lvl|new_main/', $k):
                $classes = json_decode($item['classes'], true);
                if ($classes) return ['classes' => $this->getClasses($classes, $k, $v)];
                break;
            //* end::Classes *//
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
            case str_contains($k, 'this_exhaustion'):
                $health = json_decode($item['health'], true);
                if ($health) {
                    $health['conditions']['exhaustion']['lvl'] = $v;
                    return ['health' => $health];
                }
        }
        return false;
    }

    function getClasses(array $classes, string $k, string $v): array
    {
        $main = function ($classes): bool|array {
            foreach ($classes as $c) {
                if (isset($c['is_main']) && $c['is_main']) {
                    return $c;
                }
            }
            return false;
        };
        for ($i = 0; $i < count($classes); $i++) {
            $c = $classes[$i];
            // Find the class that matches the key or the value of post field
            if (str_contains($k, $c['class']) || str_contains($v, $c['class'])) {
                // Set the class as main if there is no main
                if (!$main($classes)) {
                    $classes[$i]['is_main'] = true;
                }
                // If there is a main and this class is not it, set it as subclass
                if ($main($classes) && $main($classes) !== $c) {
                    $classes[$i]['is_multiclass'] = true;
                }
                if (preg_match('/subclass|lvl/', $k)) {
                    $classes[$i][explode('_', $k)[0]] = $v;
                    if (str_contains($k, 'lvl') && ($v === "" || $v === "0")) {
                        // Erase as class if level is zero or empty
                        $classes[$i]['is_main'] = false;
                        $classes[$i]['is_multiclass'] = false;
                    }
                } elseif ($k === 'new_main') {
                    // Remove main
                    for ($j = 0; $j < count($classes); $j++) {
                        $classes[$j]['is_main'] = false;
                    }
                    // Set new main
                    $classes[$i]['is_multiclass'] = false;
                    $classes[$i]['is_main'] = true;
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
                $skills[$name] = $v === "0" ? "1" : ($v === "1" ? "2" : "0");
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
