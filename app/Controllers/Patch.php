<?php

namespace App\Controllers;

class Patch extends BaseController
{
    function index()
    {
        $compendiumSectionsFolder = '/assets/appmedia/compendium/sections_profile/';
        if (!is_dir(__DIR__ . '/../../public' . $compendiumSectionsFolder)) $compendiumSectionsFolder = 'not_a_folder/';
        $data['mainSections'] = [
            ['name' => 'Classes', 'img_src' => $compendiumSectionsFolder . 'classes.png'],
            ['name' => 'Races', 'img_src' => $compendiumSectionsFolder . 'races.png'],
            ['name' => 'Backgrounds', 'img_src' => $compendiumSectionsFolder . 'backgrounds.png'],
            ['name' => 'Spells', 'img_src' => $compendiumSectionsFolder . 'spells.png'],
            ['name' => 'Items', 'img_src' => $compendiumSectionsFolder . 'armor.png'],
            ['name' => 'Bestiary', 'img_src' => $compendiumSectionsFolder . 'bestiary.png'],
            ['name' => 'Conditions & Diseases', 'img_src' => $compendiumSectionsFolder . 'conds_diseases.png'],
            ['name' => 'Actions', 'img_src' => $compendiumSectionsFolder . 'actions.png'],
        ];
        return template('patch', $data);
    }
}