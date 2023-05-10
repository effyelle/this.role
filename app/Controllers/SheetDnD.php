<?php

namespace App\Controllers;

class SheetDnD
{
    public string $name;
    public string $type;
    public string $icon;
    public array $info;
    public array $class;
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
        $this->class = ["class" => "", "subclass" => "", "lvl" => ""];
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
            "classes" => [],
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

    function _json_process($post): array
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

    function _process_post($params, $item): array
    {
        $this->__init($item['item_type']);
        $k = array_keys($params)[0];
        $v = $params[$k];
        $other = 'other';
        switch ($k) {
            case 'item_name':
            case 'race':
                break;
            case 'this_insp':
                $info = json_decode($item['info']);
                $info->inspiration = $info->inspiration === "0" ? "1" : "0";
                $k = 'info';
                $v = json_encode($info);
                break;
            case (bool)preg_match('/class|subclass|lvl/', $k):
                $classes = json_decode($item['classes'], true);
                $classExists = false;
                if ($classes) {
                    // Check if class exists
                    foreach ($classes as $key => $class) {
                        if ($k === 'class') {
                            $field = $k;
                            $classname = $v;
                        } else {
                            $field = explode('_', $k)[0];
                            $classname = explode('_', $k)[1];
                        }
                        if ($class['class'] === $classname) {
                            $classes[$key][$field] = $v;
                            $classExists = true;
                        }
                    }
                }
                if (!$classExists) {
                    // Create new class
                    $newClass = $this->class;
                    // Save field value
                    $newClass[$k] = $v;
                    // Insert new class into classes array
                    $classes[] = $newClass;
                    break;
                }
                $k = 'classes';
                $v = json_encode($classes);
                break;
            case
            (bool)preg_match('/this_prof|this_score/', $k):
                $v = 'Preg match';
                break;
        }
        return [$k => $v];
        //return [$k => $v, 'other' => $other];
    }
}
