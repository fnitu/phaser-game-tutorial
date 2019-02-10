// Create our only scene called mainScene, in the game.js file
class mainScene {

    preload() {
        // This method is called once at the beginning
        // It will load all the assets, like sprites and sounds
        // Parameters: name of the sprite, path of the image
        this.load.image('player', 'assets/player.png');
        this.load.image('coin', 'assets/coin.png');
    }

    create() {
        // This method is called once, just after preload()
        // It will initialize our scene, like the positions of the sprites

        //crete the players
        this.player1 = this.createPlayer(100, 100, 0xFA8072);
        this.player2 = this.createPlayer(600, 100, 0x98FB98);

        //create the coin
        this.coin = this.physics.add.sprite(300, 300, 'coin');

        // Store the scores in a variable, initialized at 0
        this.score1 = 0;
        this.score2 = 0;


        // Display the scores in the top left corner and the top right corner
        this.scoreText1 = this.createScoreText(this.score1, 20, 20, '#FA8072', 'WASD / Gamepad 1');
        this.scoreText2 = this.createScoreText(this.score2, 500, 20, '#98FB98', 'Arrows / Gamepad 2');

        // player 1 will use WASD
        // the returned object will have the same properties as the cursor keys, so it's easier to work with them
        this.keys1 = this.input.keyboard.addKeys({
            'up': Phaser.Input.Keyboard.KeyCodes.W,
            'down': Phaser.Input.Keyboard.KeyCodes.S,
            'left': Phaser.Input.Keyboard.KeyCodes.A,
            'right': Phaser.Input.Keyboard.KeyCodes.D
        });

        // player 2 will use arrows
        this.keys2 = this.input.keyboard.createCursorKeys();

    }

    createPlayer(positionX, positionY, color) {
        // Parameters: x position, y position, name of the sprite
        let player = this.physics.add.sprite(positionX, positionY, 'player');
        player.setTint(color);
        player.setCollideWorldBounds(true);
        return player;
    }

    createScoreText(text, positionX, positionY, color, helpText) {
        let scoreText;
        // The style of the text
        // A lot of options are available, these are the most important ones
        let style = {font: '20px Arial', fill: color};
        // add help text
        this.add.text(positionX, positionY + 20, helpText, style);
        // Parameters: x position, y position, text, style
        scoreText = this.add.text(positionX, positionY, 'score: ' + text, style);
        return scoreText;

    }

    update() {
        // visit https://html5gamepad.com/ to check if the gamepads are working
        if (this.input.gamepad.total) {
            //player 1 uses first gamepad
            var pad1 = this.input.gamepad.getPad(0);
            //player 2 uses second gamepad
            var pad2 = this.input.gamepad.getPad(1);
        }

        this.updatePlayerPosition(this.player1, this.keys1, pad1);
        this.updatePlayerPosition(this.player2, this.keys2, pad2);

        // If the player 1 is overlapping with the coin
        if (this.physics.overlap(this.player1, this.coin)) {
            // Call the new hit() method
            this.hit(this.player1, this.score1, this.scoreText1);
        }

        // If the player 2 is overlapping with the coin
        if (this.physics.overlap(this.player2, this.coin)) {
            // Call the new hit() method
            this.hit(this.player2, this.score2, this.scoreText2);
        }
    }

    updatePlayerPosition(player, keys, pad) {
        var xAxis = pad ? pad.axes[0].getValue(0) : 0;
        var yAxis = pad ? pad.axes[1].getValue(0) : 0;

        // Handle horizontal movements
        if (keys.right.isDown || pad.right || xAxis > 0) {
            // If the right keys1 is pressed, move to the right
            player.x += 3;
        } else if (keys.left.isDown || pad.left || xAxis < 0) {
            // If the left keys1 is pressed, move to the left
            player.x -= 3;
        }

        // Do the same for vertical movements
        if (keys.down.isDown || pad.down || yAxis > 0) {
            player.y += 3;
        } else if (keys.up.isDown || pad.up || yAxis < 0) {
            player.y -= 3;
        }
    }

    hit(player, score, scoreText) {
        // Change the position x and y of the coin randomly
        this.coin.x = Phaser.Math.Between(100, 600);
        this.coin.y = Phaser.Math.Between(100, 300);

        // Increment the score by 10
        score += 10;

        // Display the updated score on the screen
        scoreText.setText('score: ' + score);

        // Create a new tween
        this.tweens.add({
            targets: player, // on the player
            duration: 200, // for 200ms
            scaleX: 1.2, // that scale vertically by 20%
            scaleY: 1.2, // and scale horizontally by 20%
            yoyo: true, // at the end, go back to original scale
        });
    }

}

new Phaser.Game({
    width: 700, // Width of the game in pixels
    height: 400, // Height of the game in pixels
    backgroundColor: '#3498db', // The background color (blue)
    scene: mainScene, // The name of the scene we created
    input: {
        gamepad: true  // add to enable gamepad input
    },
    // The physics engine to use
    physics: {
        default: 'arcade',
        arcade: {
            //debug: true
        }
    },
    parent: 'game', // Create the game inside the <div id="game">
});