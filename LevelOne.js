	Technotip.LevelOne = function(game){};

	Technotip.LevelOne.prototype = 
	{
		preload : preload,
		create : create,
		update : update
	};

	function preload()
	{
		//  We need this because the assets are on github pages
		//  Remove the next 2 lines if running locally
		//this.load.baseURL = 'https://AnnaMGh.github.io/Super-Mario/';
		//this.load.crossOrigin = 'anonymous';
		//window.alert('In preload!');
		this.load.spritesheet('background_02', 'assets/background_02.png', 32,32);
		this.load.spritesheet('coin', 'assets/coins_32px.png', 32,32);
		this.load.spritesheet('star', 'assets/star_32px.png', 32,32);
		this.load.spritesheet('gmushroom', 'assets/green_mushroom_32px.png', 32,32);
		this.load.spritesheet('rmushroom', 'assets/red_mushroom_32px.png', 32,32);
		this.load.spritesheet('mario', 'assets/mario_32px.png', 32,32);
		this.load.spritesheet('mario_life', 'assets/mario_life_32px.png', 32,32);
		this.load.spritesheet('menu', 'assets/menu_32px.png', 32,32);
		this.load.spritesheet('menuoff', 'assets/menuoff_32px.png', 32,32);
		this.load.spritesheet('pause', 'assets/pause_btn_32px.png', 32,32);
		this.load.spritesheet('play', 'assets/play_btn_32px.png', 32,32);
		this.load.spritesheet('musicon', 'assets/musicon_btn_32px.png', 32,32);
		this.load.spritesheet('musicoff', 'assets/musicoff_btn_32px.png', 32,32);
		this.load.tilemap('level1','assets/levelOne.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.audio('background_music', ['audio/bmusic_01.mp3', 'audio/bmusic_01.ogg']);
		this.load.audio('coins_sound', 'audio/coins_sound.mp3');
		this.load.audio('squeeze_sound', 'audio/squish_sound.mp3');
		this.load.audio('life_sound', 'audio/life_sound.mp3');
		this.load.audio('win_sound', 'audio/win.mp3');
		this.load.audio('die_sound', 'audio/die.mp3');
		this.load.audio('pipe_sound', 'audio/pipe.mp3');
	}


	var map;
	var layer;
	var scoreText;	
	var lifeText;
	var score = 0;
	var bonus =0;
	var life = 1;
	var checkLife = true;
	var anime = false;
	var endAnim = false;

	function create() 
	{

		//window.alert('In create!');
		//resize
		Phaser.Canvas.setImageRenderingCrisp(game.canvas);
		game.scale.pageAlignHorizontally = true;
		game.scale.pageAlignVertically = true;
		game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		game.physics.startSystem(Phaser.Physics.ARCADE);
		//game.stage.backgroundColor = '#5c94fc';

		
		//add map with layers and collision
		map = game.add.tilemap('level1');
		map.addTilesetImage('background_02', 'background_02');
		map.setCollisionBetween(0,3000, true, 'solid');
		map.createLayer('background');
		layer =  map.createLayer('solid');
		layer.resizeWorld();

		
		//add music and sound
		music = game.add.audio('background_music');
		music.loop=true;
		music.play()
		coins_sound = game.add.audio('coins_sound');
		squeeze_sound = game.add.audio('squeeze_sound');
		squeeze_sound.volume = 1;
		life_sound = game.add.audio('life_sound');
		win_sound = game.add.audio('win_sound');
		die_sound = game.add.audio('die_sound');
		pipe_sound = game.add.audio('pipe_sound');
		


		//add coins
		coins = game.add.group();
		coins.enableBody = true;
		map.createFromTiles(1021, null, 'coin', 'stuff', coins);
		coins.callAll('animations.add', 'animations', 'spin', [0, 1, 2 ], 3, true);
		coins.callAll('animations.play', 'animations', 'spin');
	
		//add bonus
		stars = game.add.group();
		stars.enableBody = true;
		map.createFromTiles(1019, null, 'star', 'stuff', stars);
		stars.callAll('animations.add', 'animations', 'leftright', [0, 1, 2, 1], 3, true);
		stars.callAll('animations.play', 'animations', 'leftright');

		//add life
		mlife = game.add.group();
		mlife.enableBody = true;
		map.createFromTiles(1020, null, 'mario_life', 'stuff', mlife);
		mlife.callAll('animations.add', 'animations', 'anim', [0, 1, 2, 1], 3, true);
		mlife.callAll('animations.play', 'animations', 'anim');

		//add green mushrooms
		gmushrooms = game.add.group();
		gmushrooms.enableBody = true;
		map.createFromTiles(1022, null, 'gmushroom', 'stuff', gmushrooms);
		gmushrooms.callAll('animations.add', 'animations', 'walk', [0,1], 2, true);
		gmushrooms.callAll('animations.play', 'animations', 'walk');
		gmushrooms.setAll('body.bounce.x', 1);
		gmushrooms.setAll('body.velocity.x', -35);
		gmushrooms.setAll('body.gravity.y', 500);

		//add red mushrooms
		rmushrooms = game.add.group();
		rmushrooms.enableBody = true;
		map.createFromTiles(1023, null, 'rmushroom', 'stuff', rmushrooms);
		rmushrooms.callAll('animations.add', 'animations', 'walk', [0,1],
			2, true);
		rmushrooms.callAll('animations.play', 'animations', 'walk');
		rmushrooms.setAll('body.bounce.x', 1);
		rmushrooms.setAll('body.velocity.x', -25);
		rmushrooms.setAll('body.gravity.y', 500);

		//add player
		player = game.add.sprite(0, 250, 'mario');
		game.physics.arcade.enable(player);
		player.body.gravity.y = 350;
		player.body.collideWorldBounds = true;
		player.animations.add('walkRight', [ 1, 2, 3], 10, true);
		player.animations.add('walkLeft', [ 8, 9, 10], 10, true);
		player.animations.add('whenHitR', [1, 13, 2, 13, 3, 13], 10, true);
		player.animations.add('whenHitL', [8, 13,  9, 13, 10, 13], 10, true);
		player.animations.add('whenHitFront', [0, 13], 10, true);
		player.animations.add('whenWin', [5, 6], 2, true);
		player.anchor.x = 0.5;
		player.anchor.y = 0.5;
		player.goesRight = true;
		game.camera.follow(player);
		cursors = game.input.keyboard.createCursorKeys();

		map.createLayer('ground');

		//add score text
		scoreText = game.add.text(16, 16, 'Score: ' + score  +'		Bonus: '+ bonus +'		Life: ' + life, { font: "32px Arial", fill: "#ffffff", align: "center" });
		scoreText.fixedToCamera = true;
		scoreText.cameraOffset.setTo(16, 16);

		//add menu
		menu1 = game.add.sprite(1300,5, 'menu');
		menu1.fixedToCamera = true;
		menu1.cameraOffset.setTo(1300,5);
		menu1.inputEnabled = true;
		
		menu2 = game.add.sprite(1300,5, 'menuoff');
		menu2.fixedToCamera = true;
		menu2.cameraOffset.setTo(1300,5);
		menu2.inputEnabled = true;
		menu2.visible = false;
		
		pausebtn = game.add.sprite(1250, 5, 'pause');
		pausebtn.fixedToCamera = true;
		pausebtn.cameraOffset.setTo(1250, 5);
		pausebtn.inputEnabled = true;
		pausebtn.visible = false;

		play = game.add.sprite(1250,5, 'play');
		play.fixedToCamera = true;
		play.cameraOffset.setTo(1250,5);
		play.inputEnabled = true;
		play.visible = false;
		
		music2 = game.add.sprite(1200,5, 'musicoff');
		music2.fixedToCamera = true;
		music2.cameraOffset.setTo(1200,5);
		music2.inputEnabled = true;
		music2.visible = false;

		music1 = game.add.sprite(1200,5, 'musicon');
		music1.fixedToCamera = true;
		music1.cameraOffset.setTo(1200,5);
		music1.inputEnabled = true;
		music1.visible = false;
		
		menu1.events.onInputUp.add(checkbuttons);
	}

	function update() 
	{
		
		game.physics.arcade.collide(player, layer);
		game.physics.arcade.collide(rmushrooms, layer);
		game.physics.arcade.collide(gmushrooms, layer);
		checkPipes();
		checkFinish();
		
		if(checkLife == true)
		{
			game.physics.arcade.overlap(player, gmushrooms, mushroomOverlap);
			game.physics.arcade.overlap(player, rmushrooms, mushroomOverlap);
		}
		
		game.physics.arcade.overlap(player, coins, coinOverlap);
		game.physics.arcade.overlap(player, stars, starOverlap);
		game.physics.arcade.overlap(player, mlife, lifeOverlap);

		if (player.body.enable && endAnim==false)
		{
			player.body.velocity.x = 0;
			if (cursors.left.isDown)
			{
				if(checkLife==false)
				{
					player.body.velocity.x = -80;
					player.animations.play('whenHitL');
					player.goesRight = false;
				}
				else
				{	
					player.body.velocity.x = -130;
					player.animations.play('walkLeft');
					player.goesRight = false;
				}
			}
			else if (cursors.right.isDown) 
			{
				if(checkLife==false)
				{
					player.body.velocity.x = 80;
					player.animations.play('whenHitR');
					player.goesRight = true;
				}
				else
				{
					player.body.velocity.x = 130;
					player.animations.play('walkRight');
					player.goesRight = true;
				}
			}
			else
			{
				if (checkLife == false)
				{
					player.animations.play('whenHitFront');
				}
				else
				{
					player.animations.stop();
					player.frame = 0; 
				}
			}

			if (cursors.up.isDown && player.body.onFloor()) 
			{
				if(checkLife==false)
				{
					player.body.velocity.y = -150;
				}
				else
				{
					player.body.velocity.y = -220;
					player.animations.stop();
				}
			}

			if (player.body.velocity.y != 0) {
				if (player.goesRight && checkLife==true)
				{
						player.frame = 4; 
				}
				else if (player.goesRight==false && checkLife==true)
				{
						player.frame = 11;
				}
			}

		}
		else if(player.body.enable && endAnim == true)
		{
			player.body.velocity.x=-100;
		}


	}

	function checkbuttons()
	{
		if(game.paused == true) {play.visible=true; pausebtn.visible = false;}
		else {pausebtn.visible=true; play.visible= false;}
		
		if(game.sound.mute == true) {music1.visible=true; music2.visible = false;}
		else {music2.visible=true; music1.visible = false;}
		
		menu1.visible = false;
		menu2.visible = true;
		
		pausebtn.events.onInputUp.add(function(){game.paused = true; pausebtn.visible = false; play.visible = true;});
		play.events.onInputUp.add(function(){ game.paused = false; pausebtn.visible = true; 	play.visible = false;});
		music1.events.onInputUp.add(function(){ game.sound.mute = false; music2.visible = true; music1.visible=false;});
		music2.events.onInputUp.add(function(){ game.sound.mute = true; music1.visible = true; music2.visible=false;});
		menu2.events.onInputUp.add(function(){ pausebtn.visible=false; play.visible = false; 
		music1.visible=false; music2.visible=false; menu2.visible=false; menu1.visible = true;});
	}
	
	function checkFinish()
	{
		if(player.x<6048 && player.x>5920 && player.y<224 && player.y>128)
		{
			//player.reset(0,0);
			//player.velocity.y = 50;
			player.animations.play('whenWin');
			music.stop();
			if(endAnim==false)win_sound.play();
			endAnim = true;
			game.time.events.add(Phaser.Timer.SECOND * 5, function() {game.paused = true;});
			player.body.velocity.x=0;
		}
	}

	function checkPipes()
	{

		if(player.x > 600 && player.x < 624 && player.y < 288 && player.y > 256)
			{pipe_sound.play(); player.x = 1056; player.y = 96;}
		if(player.x > 1856 && player.x < 1888 && player.y < 384 && player.y > 336)
			{pipe_sound.play(); player.x = 2504; player.y = 5;}
		if(player.x > 2336 && player.x < 2368 && player.y < 192 && player.y > 128)
			{pipe_sound.play(); player.x = 2504; player.y = 5;}
		if(player.x > 4240 && player.x < 4272 && player.y < 256 && player.y > 208)
			{pipe_sound.play(); player.x = 5280; player.y = 336;}
		if(player.x > 4484 && player.x < 4496 && player.y < 256 && player.y > 208)
			{pipe_sound.play(); player.x = 4496; player.y = 64;}
		if(player.x > 4864 && player.x < 4896 && player.y < 96 && player.y > 48)
			{pipe_sound.play(); player.x = 5280; player.y = 336;}
		
	}		

	function coinOverlap(player, coin) {
		coins_sound.play();
		score += 1;
		scoreText.text = 'Score: ' + score + '		Bonus: '+ bonus +'		Life: ' + life;
		coin.kill();
	}
	
	function starOverlap(player, star) {
		life_sound.play();
		bonus += 1;
		scoreText.text = 'Score: ' + score + '		Bonus: '+ bonus +'		Life: ' + life;
		star.kill();
	}

	function lifeOverlap(player, mlife)
	{
		life_sound.play();
		life++;
		scoreText.text = 'Score: ' + score + '		Bonus: '+ bonus +'		Life: ' + life;
		mlife.kill();
	}

	function mushroomOverlap(player, mushroom)
	{
		if (player.body.touching.down) {
			mushroom.animations.stop();
			squeeze_sound.play();
			mushroom.frame = 2;
			mushroom.body.enable = false;
			player.body.velocity.y = -80;
			bonus += 2;
			scoreText.text = 'Score: ' + score + '		Bonus: '+ bonus +'		Life: ' + life;
			game.time.events.add(Phaser.Timer.SECOND, function() {
				mushroom.kill();
			});
		} 
		else if(player.body.touching.down==false && life>0)
		{
				life--;
				scoreText.text = 'Score: ' + score + '		Bonus: '+ bonus +'		Life: ' + life;
				checkLife = false;
				
				game.time.events.add(Phaser.Timer.SECOND * 3, function() {checkLife=true;});
		}
		else if(player.body.touching.down==false && life==0)
		{
				checkLife==false;
				scoreText.text = 'Score: ' + score + '		Bonus: '+ bonus +'		Life: ' + life + '\n\tYOU DIED!';
				life--;
				music.stop();
				player.frame = 7;
				player.body.enable = false;
				player.animations.stop();
				die_sound.play();
				game.time.events.add(Phaser.Timer.SECOND * 3, function() {game.paused = true; });
		}
		
	}