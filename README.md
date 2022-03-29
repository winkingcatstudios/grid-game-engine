# cs43700-ggEngine
Grid based engine for rogue-like, tabletop rpg simulator, turn-based RPG overworld, strategy RPG, zelda-like grid adventure, and more.

My current engine implements a scene and sprite. Additional features include input customization, game states for pausing the game, and frame rate calculation. There is not currently a way to add non-tile objects (ie: items, traps, etc.) or NPCs other than the player, but I have set that up as an extension of the sprite class. You can in fact create these with a spritesheet index and starting position, but the code is not implemented to draw them.


*****Spritesheet Requirements, refer to spriteSheetSampleDoc.png*****

       -Sprites can be any dimensions as long as they are uniform. All tiles and character direction frames much be the same 
              dimensions. Recommended default sprite width/height is 64 as that is used by LPC characters.

       -Red outline: tile section, 25 (5x5) tile sprites supported

       -Blue outline: solid tile collisions. Use for walls or solid objects; anything to block movement

       -Green outline: path tile collision. Use for floors, ground, bridges; anything to walk over

       -Purple outline: character sprites, should be transparent. No actual limit on number, add move columns to the right 
              of the five provided to add more.

       -NOTE: character sprites can be pulled from 
              https://sanderfrenken.github.io/Universal-LPC-Spritesheet-Character-Generator/#
              Use top left sprite and the three below it. Make sure to credit individual authors.

       -NOTE: online tool for quick transparecy: https://www12.lunapic.com/editor/



*****Code Requirement, HTML file must include the following 8 requirement*****
  
           1. Reference to this js file
               Example:
                   <script type="text/javascript"
                       src = "ggEngine.js">
                   </script>
  
           2. Grid variable filled with numbers corresponding to the tiles in your spritesheet.
               25 (5x5) tiles are supported
               Example: 
                    var grid = [
                        0, 0, 0, 0, 0, 0,
                        0, 4, 2, 2, 3, 3, 
                        0, 4, 1, 2, 2, 3, 
                        0, 4, 1, 3, 2, 2, 
                        0, 4, 1, 3, 3, 2, 
                        0, 4, 4, 4, 4, 4, 
                        ];    
   
           3. Two variables for the tile width and tile height of your spritesheet.
               spritesheet tiles can be any size as long as all tiles are uniform
               on the sheet.
               Example:
                       var tileWidth = 64; 
                       var tileHeight = 64; 
  
           4. Instantiation of KeyPrefs
               Example:
                   keys = new KeyPrefs(87, 65, 83, 68, 27, "WASD + Esc");
  
           5. Instantiation of Sprite
               Example:
                   skeleton = new Sprite(64, 64, 1, 1, 0);
  
           6. Instantiation of Scene
               Example:
                   scene = new Scene(skeleton, keys, 20, 20, "spriteSheet1.png");
 
           7. Call .init() on your scene instatiation at end of custum javascript
               Example:
                   scene.init();
  
           8. HTML must contain a canvas with id="game"
               Width and hieght are customizatable
               Example:
                   <body>
                       <canvas id="game" width="800" height="600"></canvas>
                   </body>
 
  
 *****Function API*****
  
        /**
        * Scene Class
        *      Draws the map and controls the playable sprite
        *      Must instantiate once
        *      Must call .Init() on instance to start the game
        *
        * @param[in]      playerSprite     player controlled character, instance of Sprite class
        * @param[in]      keyPrefs         keymapping preferrence, instance of KeyPrefs class
        * @param[in]      gridWidth        number of horizontal tiles in grid
        * @param[in]      gridHeight       number of vertical tiles in grid
        * @param[in]      tileSet          tiles used for map, supports 25 (5x5) tiles. 
        *                                        First 3 columns are solid, last 2 columns are paths
        * 
        */
       function Scene(playerSprite, keyPrefs, gridWidth, gridHeight, spriteSheet)


        /**
        * Sprite Class
        *      Use for sprites that are drawn over the map
        *      Must be instantiated at least once to pass to scene for player sprite
        *      Currently, only the player uses Sprite. However, the next extention is to
        *      Allow other non-player characters/objects to use Sprite and place them on the map
        *
        * @param[in]      spriteWidth          supports making sprites larger than a single tile
        *                                          Large boss or tree covering mutiple tiles. 
        *                                          Not recommended for player.
        * @param[in]      spriteHeight         same as spriteWidth
        * @param[in]      posTileX             horizontal index of desired starting tile on the grid
        * @param[in]      posTileY             vertical index of desired starting tile on the grid
        * @param[in]      spriteSheetIndex     horizontal index of character in bottom row of spritesheet
        * 
        */
        function Sprite(spriteWidth, spriteHeight, posTileX, posTileY, spriteSheetIndex)


       /**
        * KeyPrefs Class
        *      Allows input customization
        *      Must be instantiated and passed to scene
        *      Examples:
        *          Arrows + P: 38, 37, 40, 39, 80
        *	        WASD + Esc: 87, 65, 83, 68, 27
        *
        * @param[in]      up                   moves the player sprite up
        * @param[in]      left                 moves the player sprite left
        * @param[in]      down                 moves the player sprite down
        * @param[in]      right                moves the player sprite right
        * @param[in]      pause                toggle to pause or run the game
        * @param[in]      controlsMessage      GUI instructions for controls. Example: "WASD + Esc"
        * 
        */
       function KeyPrefs(up, left, down, right, pause, controlsMessage)
  
 
  




