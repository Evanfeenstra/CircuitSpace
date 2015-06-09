var game = new Phaser.Game(888, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {

    game.stage.backgroundColor = '#ffffff';
  
    //game.load.image('platform', '/assets/platform.png');
    game.load.image('star', '/assets/star.png');
    game.load.spritesheet('player', '/assets/dudesprite.png', 32, 48);

    game.load.image('learn', '/img/learn.png');
    game.load.image('code', '/img/code.png');
    game.load.image('to', '/img/to.png');

}


var player;
var platforms;
var cursors;
var jumpButton;
var stars;

var score=12;
var scoreText;

function create() {

    player = game.add.sprite(100, 200, 'player');

    game.physics.arcade.enable(player);

    player.body.collideWorldBounds = true;
    player.body.gravity.y = 500;
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    platforms = game.add.physicsGroup();

    //platforms.create(500, 150, 'platform');
    //platforms.create(-200, 300, 'platform');
    //platforms.create(400, 450, 'platform');
    platforms.create(20,150, 'learn');
    platforms.create(450,448, 'code');
    platforms.create(441,306, 'to');

    platforms.setAll('body.immovable', true);

    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

  stars = game.add.group();

    stars.enableBody = true;

    //  Here we'll create 12 of them evenly spaced apart
    for (var i = 0; i < 12; i++)
    {
        //  Create a star inside of the 'stars' group
        var star = stars.create(i * 70 + 28, 0, 'star');

        //  Let gravity do its thing
        star.body.gravity.y = 300;
        star.body.collideWorldBounds = true;

        //  This just gives each star a slightly random bounce value
        star.body.bounce.y = 0.7 + Math.random() * 0.2;
    }
  
  scoreText = game.add.text(16, 16, 'stars left: 12', { fontSize: '18px', fill: '#000' });
}


function update () {

    game.physics.arcade.collide(player, platforms);

    player.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        player.body.velocity.x = -250;
      player.animations.play('left');
    }
    else if (cursors.right.isDown)
    {
        player.body.velocity.x = 250;
      player.animations.play('right');
    }
    else
    {
        //  Stand still
        player.animations.stop();

        player.frame = 4;
    }

    if (jumpButton.isDown && (player.body.onFloor() || player.body.touching.down))
    {
        player.body.velocity.y = -400;
    }
  
  game.physics.arcade.collide(stars, platforms);
  game.physics.arcade.overlap(player, stars, collectStar, null, this);
}


function collectStar (player, star) {

    // Removes the star from the screen
    star.kill();
    score -= 1;
    scoreText.text = 'stars left: ' + score;
  if (score==0) {
   scoreText.text = 'Sign up to make your own game!';
   scoreText.fontSize = '50px';
  }

}