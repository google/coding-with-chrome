/**
 * @license Copyright 2020 The Coding with Chrome Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Random project name generator for Game Editor.
 * @author mbordihn@google.com (Markus Bordihn)
 */

const projectNames = {
  en: {
    adjectives: [
      'adventurous',
      'colorful',
      'dynamic',
      'unique',
      'fabulous',
      'fantastic',
      'fearless',
      'dangerous',
      'sparkling',
      'great',
      'heroic',
      'tricky',
      'bold',
      'lively',
      'funny',
      'magical',
      'courageous',
      'mystical',
      'fantastic',
      'raving',
      'smoking',
      'fast',
      'fizzy',
      'bubbling',
      'stylish',
      'unpredictable',
      'daring',
      'reckless',
      'enchanting',
    ],
    substantives: [
      'Adventure',
      'Aliens',
      'Dragon',
      'Dragons',
      'Unicorns',
      'Elves',
      'Fairies',
      'Mystery',
      'Heroes',
      'Witch',
      'Witches',
      'Goblin',
      'Legends',
      'Magic',
      'Mermaids',
      'Monsters',
      'Fairy tales',
      'Ninjas',
      'Fantasy',
      'Pirates',
      'Knights',
      'Robots',
      'Treasure Island',
      'Sword',
      'Treasures',
      'Superheroes',
      'Dreams',
      'Space',
      'Wonderland',
      'Magic',
      'Wizards',
      'Magic Wand',
      'Zombies',
      'Future',
    ],
  },
  de: {
    adjectives: [
      'abenteuerlich',
      'bunt',
      'dynamisch',
      'einzigartig',
      'fabelhaft',
      'fantastisch',
      'furchtlos',
      'gefährlich',
      'glitzernd',
      'großartig',
      'heldenhaft',
      'knifflig',
      'kühn',
      'lebendig',
      'lustig',
      'magisch',
      'magisch',
      'mutig',
      'mystisch',
      'phantastisch',
      'rasend',
      'rauchend',
      'schnell',
      'spritzig',
      'sprudelnd',
      'stilvoll',
      'unberechenbar',
      'verwegen',
      'waghalsig',
      'zauberhaft',
    ],
    substantives: [
      'Abenteuer',
      'Aliens',
      'Drache',
      'Drachen',
      'Einhörner',
      'Elfen',
      'Feen',
      'Geheimnis',
      'Helden',
      'Hexe',
      'Hexen',
      'Kobold',
      'Legenden',
      'Magie',
      'Meerjungfrauen',
      'Monster',
      'Märchen',
      'Ninjas',
      'Phantasie',
      'Piraten',
      'Ritter',
      'Roboter',
      'Schatzinsel',
      'Schwert',
      'Schätze',
      'Superhelden',
      'Träume',
      'Weltraum',
      'Wunderland',
      'Zauber',
      'Zauberer',
      'Zauberstab',
      'Zombies',
      'Zukunft',
    ],
  },
};

/**
 * @class
 * @return {String}
 */
class ProjectNameGenerator {
  /**
   * @param {string} language
   * @return {string}
   */
  static generate(language = 'en') {
    const languageData = projectNames[language] || projectNames.en;
    const adjectiveIndex = Math.floor(
      Math.random() * languageData.adjectives.length
    );
    const substantiveIndex = Math.floor(
      Math.random() * languageData.substantives.length
    );
    const adjective = languageData.adjectives[adjectiveIndex];
    const substantive = languageData.substantives[substantiveIndex];
    return `${adjective.charAt(0).toUpperCase() + adjective.slice(1)} ${
      substantive.charAt(0).toUpperCase() + substantive.slice(1)
    }`;
  }
}

export default ProjectNameGenerator;
