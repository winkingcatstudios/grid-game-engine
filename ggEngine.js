/**
 * BEGIN PROJECT REQUIREMENTS
 * 
 *      HTML file must include the following 8 requirement:
 * 
 *          1. Reference to this js file
 *              Example:
 *                  <script type="text/javascript"
 *                      src = "ggEngine.js">
 *                  </script>
 * 
 *          2. Grid variable filled with numbers corresponding to the tiles in your spritesheet.
 *              25 (5x5) tiles are supported
 *              Example: 
 *                   var grid = [
 *                       0, 0, 0, 0, 0, 0,
 *                       0, 4, 2, 2, 3, 3, 
 *                       0, 4, 1, 2, 2, 3, 
 *                       0, 4, 1, 3, 2, 2, 
 *                       0, 4, 1, 3, 3, 2, 
 *                       0, 4, 4, 4, 4, 4, 
 *                       ];    
 *  
 *          3. Two variables for the tile width and tile height of your spritesheet.
 *              spritesheet tiles can be any size as long as all tiles are uniform
 *              on the sheet.
 *              Example:
 *                      var tileWidth = 64; 
 *                      var tileHeight = 64; 
 * 
 *          4. Instantiation of KeyPrefs
 *              Example:
 *                  keys = new KeyPrefs(87, 65, 83, 68, 27, "WASD + Esc");
 * 
 *          5. Instantiation of Sprite
 *              Example:
 *                  skeleton = new Sprite(64, 64, 1, 1, 0);
 * 
 *          6. Instantiation of Scene
 *              Example:
 *                  scene = new Scene(skeleton, keys, 20, 20, "spriteSheet1.png");
 * 
 *          7. Call .init() on your scene instatiation at end of custum javascript
 *              Example:
 *                  scene.init();
 * 
 *          8. HTML must contain a canvas with id="game"
 *              Width and hieght are customizatable
 *              Example:
 *                  <body>
 *                      <canvas id="game" width="800" height="600"></canvas>
 *                  </body>
 *
 * END PROJECT REQUIREMENTS
 */


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
 * @param[in]      tileSet          tiles used for map, supports 25 (5x5) tiles. First 3 columns are solid, last 2 columns are paths
 * 
 */
function Scene(playerSprite, keyPrefs, gridWidth, gridHeight, spriteSheet){
    // context is set in init after onload check
    var ctx = null;

    // Used for FPS calcs
    var currentSecond = 0, frameCount = 0, framesLastSecond = 0, lastFrameTime = 0;
    
    // Vars to keep load in spritesheet once
    var spritesheet = null;
    var spritesheetPath = spriteSheet; 
    var spritesheetLoaded = false;  

    // Game states based on game clock, could also add more states to speed up or slow down time
    var gameTime = 0;
    var gameStates = [
	    {name:"Running", mult:2},
	    {name:"Paused", mult:0} 
    ];
    var currentState = 0;

    // Collision type for types to determine if player can walk over tile
    var tileCollision = {
        solid	: 0,
        path	: 1,
    };

    // 25 (5x5) grid of tiles from spritesheet. First 3 rows are solid (walls, objects), last 2 are passable
    // Calc based on tileWidth and tileHeight since spritesheet can be any size as long as it's uniform
    var tileTypes = {
        0 : { tile:tileCollision.solid,     sprite:[{x:tileWidth*0,y:tileHeight*0,w:tileWidth,h:tileHeight}]	},
        1 : { tile:tileCollision.solid,     sprite:[{x:tileWidth*1,y:tileHeight*0,w:tileWidth,h:tileHeight}]	},
        2 : { tile:tileCollision.solid,	    sprite:[{x:tileWidth*2,y:tileHeight*0,w:tileWidth,h:tileHeight}]	},
        3 : { tile:tileCollision.path,	    sprite:[{x:tileWidth*3,y:tileHeight*0,w:tileWidth,h:tileHeight}]	},
        4 : { tile:tileCollision.path,	    sprite:[{x:tileWidth*4,y:tileHeight*0,w:tileWidth,h:tileHeight}]	},
        5 : { tile:tileCollision.solid,	    sprite:[{x:tileWidth*0,y:tileHeight*1,w:tileWidth,h:tileHeight}]	},
        6 : { tile:tileCollision.solid,	    sprite:[{x:tileWidth*1,y:tileHeight*1,w:tileWidth,h:tileHeight}]	},
        7 : { tile:tileCollision.solid,	    sprite:[{x:tileWidth*2,y:tileHeight*1,w:tileWidth,h:tileHeight}]	},
        8 : { tile:tileCollision.path,	    sprite:[{x:tileWidth*3,y:tileHeight*1,w:tileWidth,h:tileHeight}]	},
        9 : { tile:tileCollision.path,	    sprite:[{x:tileWidth*4,y:tileHeight*1,w:tileWidth,h:tileHeight}]	},
        10 : { tile:tileCollision.solid,	sprite:[{x:tileWidth*0,y:tileHeight*2,w:tileWidth,h:tileHeight}]	},
        11 : { tile:tileCollision.solid,	sprite:[{x:tileWidth*1,y:tileHeight*2,w:tileWidth,h:tileHeight}]	},
        12 : { tile:tileCollision.solid,	sprite:[{x:tileWidth*2,y:tileHeight*2,w:tileWidth,h:tileHeight}]	},
        13 : { tile:tileCollision.path,	    sprite:[{x:tileWidth*3,y:tileHeight*2,w:tileWidth,h:tileHeight}]	},
        14 : { tile:tileCollision.path,	    sprite:[{x:tileWidth*4,y:tileHeight*2,w:tileWidth,h:tileHeight}]	},
        15 : { tile:tileCollision.solid,	sprite:[{x:tileWidth*0,y:tileHeight*3,w:tileWidth,h:tileHeight}]	},
        16 : { tile:tileCollision.solid,	sprite:[{x:tileWidth*1,y:tileHeight*3,w:tileWidth,h:tileHeight}]	},
        17 : { tile:tileCollision.solid,	sprite:[{x:tileWidth*2,y:tileHeight*3,w:tileWidth,h:tileHeight}]	},
        18 : { tile:tileCollision.path, 	sprite:[{x:tileWidth*3,y:tileHeight*3,w:tileWidth,h:tileHeight}]	},
        19 : { tile:tileCollision.path,	    sprite:[{x:tileWidth*4,y:tileHeight*3,w:tileWidth,h:tileHeight}]	},
        20 : { tile:tileCollision.solid,	sprite:[{x:tileWidth*0,y:tileHeight*4,w:tileWidth,h:tileHeight}]	},
        21 : { tile:tileCollision.solid,	sprite:[{x:tileWidth*1,y:tileHeight*4,w:tileWidth,h:tileHeight}]	},
        22 : { tile:tileCollision.solid,	sprite:[{x:tileWidth*2,y:tileHeight*4,w:tileWidth,h:tileHeight}]	},
        23 : { tile:tileCollision.path,	    sprite:[{x:tileWidth*3,y:tileHeight*4,w:tileWidth,h:tileHeight}]	},
        24 : { tile:tileCollision.path,	    sprite:[{x:tileWidth*4,y:tileHeight*4,w:tileWidth,h:tileHeight}]	},
    };

    // Object to stop player's move/face direction
    var directions = {
        up		: 0,
        right	: 1,
        down	: 2,
        left	: 3
    };
    
    // Object to stop input, actual keycodes are customized and passed from KeyPrefs 
    var keysDown = {
        KEY_LEFT : false,
        KEY_UP : false,
        KEY_RIGHT : false,
        KEY_DOWN : false
    };
    
    // Camera centered on player
    var camera = {
        // Keep track of canvas and tiles for camera
        screen		: [0,0],
        startTile	: [0,0],
        endTile		: [0,0],
        offset		: [0,0],

        // Start with the center of the canvas based width/height, and find the tile at that location.
        // Set a start and end tile based on which tiles fit in the canvas given the current center
        // tile. This is used to prevent "drawing" out of bounds in the main drawGame() loop
        update		: function(px, py) {
            this.offset[0] = Math.floor((this.screen[0]/2) - px);
            this.offset[1] = Math.floor((this.screen[1]/2) - py);
    
            var tile = [ Math.floor(px/tileWidth), Math.floor(py/tileHeight) ];
    
            this.startTile[0] = tile[0] - 1 - Math.ceil((this.screen[0]/2) / tileWidth);
            this.startTile[1] = tile[1] - 1 - Math.ceil((this.screen[1]/2) / tileHeight);
    
            if(this.startTile[0] < 0) { this.startTile[0] = 0; }
            if(this.startTile[1] < 0) { this.startTile[1] = 0; }
    
            this.endTile[0] = tile[0] + 1 + Math.ceil((this.screen[0]/2) / tileWidth);
            this.endTile[1] = tile[1] + 1 + Math.ceil((this.screen[1]/2) / tileHeight);
    
            if(this.endTile[0] >= gridWidth) { this.endTile[0] = gridWidth-1; }
            if(this.endTile[1] >= gridHeight) { this.endTile[1] = gridHeight-1; }
        }
    };

    // Must be called on instantiated scene to start the game
    this.init = function(){
        // Wait for the window to load to safely call getElecementByID()
        window.onload = function(){
            // Set up context and request first animation frame
            ctx = document.getElementById('game').getContext("2d");
            requestAnimationFrame(drawGame);
            
            // Add event listeners for keydown and keyup. Actual keycodes are passed in from
            // KeyPrefs instance. Controls are used to move player and toggle game state.
            // NOTE: event.keycode is deprecated, but works fine for a simple input system
            window.addEventListener("keydown", function(e) {
                if(e.keyCode==keyPrefs.KEY_UP || e.keyCode==keyPrefs.KEY_LEFT || 
                    e.keyCode==keyPrefs.KEY_DOWN || e.keyCode<=keyPrefs.KEY_RIGHT) 
                { keysDown[e.keyCode] = true; }
            });
            window.addEventListener("keyup", function(e) {
                if(e.keyCode==keyPrefs.KEY_UP || e.keyCode==keyPrefs.KEY_LEFT || 
                    e.keyCode==keyPrefs.KEY_DOWN || e.keyCode<=keyPrefs.KEY_RIGHT)  
                { keysDown[e.keyCode] = false; }
                if(e.keyCode==keyPrefs.KEY_PAUSE){
                    currentState = (currentState>=(gameStates.length-1) ? 0 : currentState+1);
                }
            });
            
            // Pass canvas parameters to the camera
            camera.screen = [document.getElementById('game').width, 
                document.getElementById('game').height];
    
            // Load in the spritesheet once. Throws an error if spritesheet cannot be found
            spritesheet = new Image();
            spritesheet.onerror = function(){
                ctx = null;
                alert("Spritesheet not found");
            };
            spritesheet.onload = function() { spritesheetLoaded = true; };
            spritesheet.src = spritesheetPath;
        };
    
        // Main loop to draw the sprites, started in init()
        // Uses requestAnimationFrame to recursively call itself when the browser is able
        function drawGame(){
            // Checks that context and spritesheet are set
            if(ctx==null) { return; }
            if(!spritesheetLoaded) { requestAnimationFrame(drawGame); return; }
    
            // Calculate FPS, for display only
            var currentFrameTime = Date.now();
            var timeElapsed = currentFrameTime - lastFrameTime;
            gameTime+= Math.floor(timeElapsed * gameStates[currentState].mult);
            var sec = Math.floor(Date.now()/1000);
            if(sec!=currentSecond){
                currentSecond = sec;
                framesLastSecond = frameCount;
                frameCount = 1;
            }
            else { frameCount++; }

            // Move player sprite based on keydown input with checks for destination tile collision type
            if(!player.processMovement(gameTime) && gameStates[currentState].mult!=0)
            {
                if(keysDown[keyPrefs.KEY_UP] && player.canMoveUp())			{ player.moveUp(gameTime); }
                else if(keysDown[keyPrefs.KEY_DOWN] && player.canMoveDown())	{ player.moveDown(gameTime); }
                else if(keysDown[keyPrefs.KEY_LEFT] && player.canMoveLeft())	{ player.moveLeft(gameTime); }
                else if(keysDown[keyPrefs.KEY_RIGHT] && player.canMoveRight())	{ player.moveRight(gameTime); }
            }
    
            // Update the camera on move to remain centered on the player
            camera.update(player.position[0] + (player.dimensions[0]/2),
                player.position[1] + (player.dimensions[1]/2));
            // Set a background color for "off map"
            // Could extend to let this be passed into scene() as an extension
            ctx.fillStyle = "#000000";
            ctx.fillRect(0, 0, camera.screen[0], camera.screen[1]);
    
            // Draw the tile sprites, that fit on camera, according to the game grid
            for(var y = camera.startTile[1]; y <= camera.endTile[1]; ++y){
                for(var x = camera.startTile[0]; x <= camera.endTile[0]; ++x){
                    var tile = tileTypes[grid[toIndex(x,y)]];

                    ctx.drawImage(spritesheet,
                        tile.sprite[0].x, tile.sprite[0].y, tile.sprite[0].w, tile.sprite[0].h,
                        camera.offset[0] + (x*tileWidth), camera.offset[1] + (y*tileHeight),
                        tileWidth, tileHeight);
                }
            }
    
            // Draw the player sprite, based on move/face direction
            // Could extend here to add walking animation
            var sprite = player.sprites[player.direction];
            ctx.drawImage(spritesheet,
                sprite[0].x, sprite[0].y, sprite[0].w, sprite[0].h,
                camera.offset[0] + player.position[0], camera.offset[1] + player.position[1],
                player.dimensions[0], player.dimensions[1]);
    
            // GUI style text display the FPS, game state, and controls
            ctx.fillStyle = "#ff0000";
            ctx.font = "bold 10pt sans-serif";
            ctx.fillText("FPS: " + framesLastSecond, 10, 20);
            ctx.fillText("Game state: " + gameStates[currentState].name, 10, 40);
            ctx.fillText("Controls: " + keyPrefs.controlsMessage, 10, 60);
            
            // Update frameTime and request another animation frame from browser
            lastFrameTime = currentFrameTime;
            requestAnimationFrame(drawGame);
        }
    }

    // Special sprite entity used for player controlled character
    // Starting tile, starting position, and dimensions are passed in from playerSprite
    // Buttom 4 rows of spritesheet are reserved for characters, playerSprite will
    // also pass the horizontal index of the player sprite 
    var player = new Player();
    function Player(){
        this.tileFrom	= [1,1];
        this.tileTo		= [playerSprite.posTileX,playerSprite.posTileY];
        this.timeMoved	= 0;
        this.dimensions	= playerSprite.dimensions;
        this.position	= playerSprite.position;
        this.delayMove	= 700;
    
        // Set default face and load in directional sprites
        // If extended for walking animation, additional sprites would be loaded here
        this.direction	= directions.down;
        this.sprites = {};
        this.sprites[directions.up]		= [{x:playerSprite.spriteSheetIndex*tileWidth,y:tileHeight*5,w:tileWidth,h:tileHeight}];
        this.sprites[directions.left]	= [{x:playerSprite.spriteSheetIndex*tileWidth,y:tileHeight*6,w:tileWidth,h:tileHeight}];
        this.sprites[directions.down]	= [{x:playerSprite.spriteSheetIndex*tileWidth,y:tileHeight*7,w:tileWidth,h:tileHeight}];
        this.sprites[directions.right]	= [{x:playerSprite.spriteSheetIndex*tileWidth,y:tileHeight*8,w:tileWidth,h:tileHeight}];
    }

    // Prototype to place the player on a tile center
    Player.prototype.placeAt = function(x, y){
        this.tileFrom	= [x,y];
        this.tileTo		= [x,y];
        this.position	= [((tileWidth*x)+((tileWidth-this.dimensions[0])/2)),
            ((tileHeight*y)+((tileHeight-this.dimensions[1])/2))];
    };

    // Prototype to move the player to the destination tile with delay to smooth input
    Player.prototype.processMovement = function(t){
        if(this.tileFrom[0]==this.tileTo[0] && this.tileFrom[1]==this.tileTo[1]) { return false; }
    
        if((t-this.timeMoved)>=this.delayMove){
            this.placeAt(this.tileTo[0], this.tileTo[1]);
        }
        else{
            this.position[0] = (this.tileFrom[0] * tileWidth) + ((tileWidth-this.dimensions[0])/2);
            this.position[1] = (this.tileFrom[1] * tileHeight) + ((tileHeight-this.dimensions[1])/2);
    
            if(this.tileTo[0] != this.tileFrom[0]){
                var diff = (tileWidth / this.delayMove) * (t-this.timeMoved);
                this.position[0]+= (this.tileTo[0]<this.tileFrom[0] ? 0 - diff : diff);
            }
            if(this.tileTo[1] != this.tileFrom[1]){
                var diff = (tileHeight / this.delayMove) * (t-this.timeMoved);
                this.position[1]+= (this.tileTo[1]<this.tileFrom[1] ? 0 - diff : diff);
            }
    
            this.position[0] = Math.round(this.position[0]);
            this.position[1] = Math.round(this.position[1]);
        }
    
        return true;
    }

    // Check tile collision type to determine if destination tile is valid for movement
    Player.prototype.canMoveTo = function(x, y){
        if(x < 0 || x >= gridWidth || y < 0 || y >= gridHeight) { return false; }
        if(tileTypes[grid[toIndex(x,y)]].tile!=tileCollision.path) { return false; }
        return true;
    };

    // Collection of functions to check for validity of move in 4 cardinal direction, and start move processor
    // for same direction. Could be extended to allow for diagonals
    Player.prototype.canMoveUp		= function() { return this.canMoveTo(this.tileFrom[0], this.tileFrom[1]-1); };
    Player.prototype.canMoveDown 	= function() { return this.canMoveTo(this.tileFrom[0], this.tileFrom[1]+1); };
    Player.prototype.canMoveLeft 	= function() { return this.canMoveTo(this.tileFrom[0]-1, this.tileFrom[1]); };
    Player.prototype.canMoveRight 	= function() { return this.canMoveTo(this.tileFrom[0]+1, this.tileFrom[1]); };
    
    Player.prototype.moveLeft	= function(t) { this.tileTo[0]-=1; this.timeMoved = t; this.direction = directions.left; };
    Player.prototype.moveRight	= function(t) { this.tileTo[0]+=1; this.timeMoved = t; this.direction = directions.right; };
    Player.prototype.moveUp		= function(t) { this.tileTo[1]-=1; this.timeMoved = t; this.direction = directions.up; };
    Player.prototype.moveDown	= function(t) { this.tileTo[1]+=1; this.timeMoved = t; this.direction = directions.down; };
    
    // Helper fucntion to find tile widths since this is customizable 
    function toIndex(x, y){
        return((y * gridWidth) + x);
    }
}

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
function Sprite(spriteWidth, spriteHeight, posTileX, posTileY, spriteSheetIndex){
    this.spriteWidth = spriteWidth;
    this.spriteHeight = spriteHeight;
    this.posTileX = posTileX;
    this.posTileY = posTileY;
    this.spriteSheetIndex = spriteSheetIndex;

    this.dimensions	= [spriteWidth,spriteHeight];
    this.position	= [posTileX*tileWidth,posTileY*tileHeight];
}

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
function KeyPrefs(up, left, down, right, pause, controlsMessage){
    this.KEY_UP= up;
    this.KEY_LEFT = left;
    this.KEY_DOWN = down;
    this.KEY_RIGHT = right;
    this.KEY_PAUSE = pause;
    this.controlsMessage = controlsMessage;
}



