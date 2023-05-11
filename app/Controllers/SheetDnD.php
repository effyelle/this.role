<?php

namespace App\Controllers;

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

    function character($name): array
    {
        $this->name = $name;
        $this->type = "character";
        $this->icon = "";
        $this->info = [
            "walkspeed" => "0",
            "inspiration" => "0",
            "race" => "",
            "background" => "",
            "characteristics" => [
                "personality_traits" => "",
                "ideals" => "",
                "bonds" => "",
                "flaws" => "",
            ],
        ];
        $this->classes = [
            ["class" => "artificer", "subclass" => "", "lvl" => "", "saves" => "con,int"],
            ["class" => "barbarian", "subclass" => "", "lvl" => "", "saves" => "str,con"],
            ["class" => "bard", "subclass" => "", "lvl" => "", "saves" => "dex,cha"],
            ["class" => "cleric", "subclass" => "", "lvl" => "", "saves" => "wis,cha"],
            ["class" => "druid", "subclass" => "", "lvl" => "", "saves" => "int,wis"],
            ["class" => "fighter", "subclass" => "", "lvl" => "", "saves" => "str,con"],
            ["class" => "monk", "subclass" => "", "lvl" => "", "saves" => "str,dex"],
            ["class" => "paladin", "subclass" => "", "lvl" => "", "saves" => "wis,cha"],
            ["class" => "ranger", "subclass" => "", "lvl" => "", "saves" => "str,dex"],
            ["class" => "rogue", "subclass" => "", "lvl" => "", "saves" => "dex,int"],
            ["class" => "sorcerer", "subclass" => "", "lvl" => "", "saves" => "con,cha"],
            ["class" => "warlock", "subclass" => "", "lvl" => "", "saves" => "wis,cha"],
            ["class" => "wizard", "subclass" => "", "lvl" => "", "saves" => "int,wis"],
        ];
        $this->xp = "0";
        $this->ability_scores = [
            "this_score_str" => [
                "score" => "10",
                "is_prof" => "0",
            ],
            "this_score_dex" => [
                "score" => "10",
                "is_prof" => "0",
            ],
            "this_score_con" => [
                "score" => "10",
                "is_prof" => "0",
            ],
            "this_score_int" => [
                "score" => "10",
                "is_prof" => "0",
            ],
            "this_score_wis" => [
                "score" => "10",
                "is_prof" => "0",
            ],
            "this_score_cha" => [
                "score" => "10",
                "is_prof" => "0",
            ],
        ];
        $this->expertises = [];
        $this->health = [
            'hit_points' => [
                "current_hp" => "0",
                "total_hp" => "0",
                "temporary_hp" => "0",
            ],
            "death_saves" => [
                "successes" => "0",
                "failures" => "0"
            ],
            "conditions" => [
                "ehaustion" => [
                    "lvl" => "0",
                    "1" => "Disadvantage on ability checks",
                    "2" => "Speed halved",
                    "3" => "Disadvantage on attack rolls and saving throws",
                    "4" => "Hit point maximum halved",
                    "5" => "Speed reduced to 0",
                    "6" => "Death",
                ],
                "blinded" => "0",
                "charmed" => "0",
                "deafened" => "0",
                "frightened" => "0",
                "grappled" => "0",
                "incapacitated" => "0",
                "invisible" => "0",
                "paralized" => "0",
                "petrified" => "0",
                "poisoned" => "0",
                "prone" => "0",
                "restrained" => "0",
                "stunned" => "0",
                "unconscious" => "0",
            ],
        ];
        $this->attack = [
            "name" => "",
            "attack" => "",
            "damage_n_type" => "",
            "saving_throw" => "",
        ];
        $this->global_modifier = [
            "name" => "",
            "attack" => "",
            "damage" => "",
            "save" => "",
            "ac" => "",
        ];
        $this->tool_or_custom = [
            "tool" => "",
            "proficiency" => "",
            "attribute" => "",
        ];
        $this->bag_item = [
            "units" => "",
            "name" => "",
            "weight" => "0",
        ];
        $this->bag = [
            "total_weight" => "0",
            "overweight" => "0",
        ];
        $this->custom_feature = [
            "name" => "",
            "origin" => "",
            "description" => "",
        ];
        $this->notes = "";
        $this->backstory = "";

        return [
            "item_name" => $this->name,
            "item_type" => $this->type,
            "item_icon" => $this->icon,
            "info" => $this->info,
            "classes" => $this->classes,
            "xp" => $this->xp,
            "ability_scores" => $this->ability_scores,
            "expertises" => $this->expertises,
            "health" => $this->health,
            "attacks" => [],
            "global_modifiers" => [],
            "tools_n_custom" => [],
            "bag" => [
                "capacity" => $this->bag,
                "bag_items" => [],
            ],
            "custom_features" => [],
            "notes" => $this->notes,
            "backstory" => $this->backstory
        ];
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
                $v = json_encode($v);
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
                return [$k => $v];
            case (bool)preg_match('/race|background|walkspeed|inspiration/', $k):
                $info = json_decode($item['info'], true);
                if ($k === 'inspiration') $v = $info['inspiration'] === "0" ? "1" : "0";
                $info[$k] = $v;
                return ['info' => json_decode($info)];
            case (bool)preg_match('/class|subclass|lvl|new_main/', $k):
                $classes = json_decode($item['classes'], true);
                return ['classes' => $this->getClasses($classes, $k, $v)];
            case (bool)preg_match('/this_prof|this_score/', $k):
                return ['scores' => [$k, $v]];
        }
        return false;
    }

    function getClasses($classes, $k, $v): array
    {
        $main = $this->hasMain($classes);
        for ($i = 0; $i < count($classes); $i++) {
            $c = $classes[$i];
            if (str_contains($k, $c['class']) || str_contains($v, $c['class'])) {
                if (!$main) {
                    $classes[$i]['is_main'] = true;
                }
                if ($main && $main !== $c) {
                    $classes[$i]['is_subclass'] = true;
                }
                if (preg_match('/subclass|lvl/', $k)) {
                    $classes[$i][explode('_', $k)[0]] = $v;
                } elseif ($k === 'new_main') {
                    foreach ($classes as $class) {
                        $class['is_main'] = false;
                    }
                    $classes[$i]['is_main'] = true;
                }
            }
        }
        return $classes;
    }

    function hasMain($classes): bool|array
    {
        foreach ($classes as $c) {
            if (isset($c['is_main']) && $c['is_main']) {
                return $c;
            }
        }
        return false;
    }
}
