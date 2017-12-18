	Technotip.LevelTwo = function(game){};

	Technotip.LevelTwo.prototype = 
	{
		preload : preload,
		create : create,
		update : update
	};

	function preload()
	{
		//  We need this because the assets are on github pages
		//  Remove the next 2 lines if running locally
		//this.load.baseURL = 'https://annamgh.github.io/My-super-mario/';
		//this.load.crossOrigin = 'anonymous';
		
		//window.alert('In preload!');
		this.load.spritesheet('background_03', 'assets/background_03.png', 32,32);
		this.load.spritesheet('coin', 'assets/coins_32px.png', 32,32);
		this.load.spritesheet('star', 'assets/star_32px.png', 32,32);
		this.load.spritesheet('gmushroom', 'assets/green_mushroom_32px.png', 32,32);
		this.load.spritesheet('rmushroom', 'assets/red_mushroom_32px.png', 32,32);
		this.load.spritesheet('gomba', 'assets/gombas_32px.png', 32,32);
		this.load.spritesheet('mario', 'assets/mario_32px.png', 32,32);
		this.load.spritesheet('mario_life', 'assets/mario_life_32px.png', 32,32);
		this.load.spritesheet('menu', 'assets/menu_32px.png', 32,32);
		this.load.spritesheet('menuoff', 'assets/menuoff_32px.png', 32,32);
		this.load.spritesheet('pause', 'assets/pause_btn_32px.png', 32,32);
		this.load.spritesheet('play', 'assets/play_btn_32px.png', 32,32);
		this.load.spritesheet('musicon', 'assets/musicon_btn_32px.png', 32,32);
		this.load.spritesheet('musicoff', 'assets/musicoff_btn_32px.png', 32,32);
		this.load.tilemap('level2','assets/levelTwo.json', null, Phaser.Tilemap.TILED_JSON);
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
	var endAnim = false;
	var count =true;
	var lvlscore;
	var lvlbonus;
	var lvllife;

	function create() 
	{
		if((score!=0 || bonus !=0 || life !=1) && count==true )
		{
			count=false; endAnim=false; 
			lvlscore=score;
			lvlbonus=bonus;
			lvllife=life;
		}
		
		//resize
		Phaser.Canvas.setImageRenderingCrisp(game.canvas);
		game.scale.pageAlignHorizontally = true;
		game.scale.pageAlignVertically = true;
		game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		game.physics.startSystem(Phaser.Physics.ARCADE);
		//game.stage.backgroundColor = '#5c94fc';

		
		//add map with layers and collision
		map = game.add.tilemap('level2');
		map.addTilesetImage('background_03', 'background_03');
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
		map.createFromTiles(549, null, 'coin', 'stuff', coins);
		coins.callAll('animations.add', 'animations', 'spin', [0, 1, 2 ], 3, true);
		coins.callAll('animations.play', 'animations', 'spin');
	
		//add bonus
		stars = game.add.group();
		stars.enableBody = true;
		map.createFromTiles(547, null, 'star', 'stuff', stars);
		stars.callAll('animations.add', 'animations', 'leftright', [0, 1, 2, 1], 3, true);
		stars.callAll('animations.play', 'animations', 'leftright');

		//add life
		mlife = game.add.group();
		mlife.enableBody = true;
		map.createFromTiles(548, null, 'mario_life', 'stuff', mlife);
		mlife.callAll('animations.add', 'animations', 'anim', [0, 1, 2, 1], 3, true);
		mlife.callAll('animations.play', 'animations', 'anim');

		//add green mushrooms
		gmushrooms = game.add.group();
		gmushrooms.enableBody = true;
		map.createFromTiles(550, null, 'gmushroom', 'stuff', gmushrooms);
		gmushrooms.callAll('animations.add', 'animations', 'walk', [0,1], 2, true);
		gmushrooms.callAll('animations.play', 'animations', 'walk');
		gmushrooms.setAll('body.bounce.x', 1);
		gmushrooms.setAll('body.velocity.x', -40);
		gmushrooms.setAll('body.gravity.y', 500);

		//add red mushrooms
		rmushrooms = game.add.group();
		rmushrooms.enableBody = true;
		map.createFromTiles(551, null, 'rmushroom', 'stuff', rmushrooms);
		rmushrooms.callAll('animations.add', 'animations', 'walk', [0,1],
			2, true);
		rmushrooms.callAll('animations.play', 'animations', 'walk');
		rmushrooms.setAll('body.bounce.x', 1);
		rmushrooms.setAll('body.velocity.x', -30);
		rmushrooms.setAll('body.gravity.y', 500);
		
		//add dark gomba
		gombas = game.add.group();
		gombas.enableBody = true;
		map.createFromTiles(546, null, 'gomba', 'stuff', gombas);
		gombas.callAll('animations.add', 'animations', 'walk', [0,1],
			2, true);
		gombas.callAll('animations.play', 'animations', 'walk');
		gombas.setAll('body.bounce.x', 1);
		gombas.setAll('body.velocity.x', -50);
		gombas.setAll('body.gravity.y', 500);

		//add player
		player = game.add.sprite(96, 192, 'mario');
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

		map.createLayer('green');
		
		//add score image
		cn = game.add.sprite(16,16,'coin');
		mf = game.add.sprite(16,64,'mario_life');
		cn.fixedToCamera = true;
		cn.cameraOffset.setTo(16, 16);
		mf.fixedToCamera = true;
		mf.cameraOffset.setTo(16, 85);

		

		//add score text
		scoreText = game.add.text(16, 20, '				:						' + score  
		+'				\nbonus:	' + bonus 
		+'					\n:						' + life, { font: "26px Arial", fill: "#ffffff", align: "center" });
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
		game.physics.arcade.collide(gombas, layer);
		checkFinish();
		
		if(checkLife == true)
		{
			game.physics.arcade.overlap(player, gmushrooms, enemiesOverlap);
			game.physics.arcade.overlap(player, rmushrooms, enemiesOverlap);
			game.physics.arcade.overlap(player, gombas, enemiesOverlap);
			checkPipesAndGround();
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
			player.body.velocity.x=50;
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
		if(endAnim==false && player.x>6272 && player.x<6368 && player.y<160 && player.y>32)
		{
			var finalText = game.add.text(500,100,'LEVEL TWO COMPLETE', {fill:"#FFF"});
			finalText.fixedToCamera = true;
			finalText.cameraOffset.setTo(500,100);
			var finalText2 = game.add.text(280,200,'', {font:"30px Arial", fill:"#FFF"});
			finalText2.fixedToCamera = true;
			finalText2.cameraOffset.setTo(300,200);
			finalText2.cameraOffset.setTo(300,200);
			player.animations.play('whenWin');
			music.stop();
			win_sound.play();
			endAnim = true;
			game.time.events.add(Phaser.Timer.SECOND * 5, function() 
			{
				finalText2.text='CONGRATULATIONS, YOU FINISHED THE GAME!';
				//var result = confirm("Do you want to go to menu?");
				//if(result == true) game.state.start('Menu');
				
				game.paused = true;
			
			});
			player.body.velocity.x=0;
		}
	}

	function checkPipesAndGround()
	{
		//check pipes
		if(player.x > 4768 && player.x < 4800 && player.y < 416 && player.y > 360)
			{pipe_sound.play(); player.x = 2496; player.y = 376;}
		if(player.x > 4944 && player.x < 4976 && player.y < 352 && player.y > 304)
			{pipe_sound.play(); player.x = 4536; player.y = 320;}
		if(player.x > 5120 && player.x < 5152 && player.y < 416 && player.y > 352)
			{pipe_sound.play(); player.x = 5120; player.y = 192;}
		
		//check ground
		if(checkLife==true && player.x > 128 && player.x < 4320 && player.y < 480 && player.y > 460)
		{
			checkLife=false;
			life--;
			scoreText.text ='				:						' + score  
			+'				\nbonus:	' + bonus 
			+'					\n:						' + life;
			music.stop();
			player.frame = 7;
			player.body.enable = false;
			player.animations.stop();
			die_sound.play();
			game.time.events.add(Phaser.Timer.SECOND * 3, function() 
			{
				checkLife = true; endAnim = false;
				if(count==false) {life=lvllife; bonus=lvlbonus; score=lvlscore;}
				else {life=0; bonus=0; score=0;}
				this.game.state.restart(false,true);
				
			});
		}
	
	}		

	function coinOverlap(player, coin) 
	{
		coins_sound.play();
		score += 1;
		scoreText.text ='				:						' + score  
		+'				\nbonus:	' + bonus 
		+'					\n:						' + life;
		coin.kill();
	}
	
	function starOverlap(player, star) 
	{
		life_sound.play();
		bonus += 1;
		scoreText.text ='				:						' + score  
		+'				\nbonus:	' + bonus 
		+'					\n:						' + life;
		star.kill();
	}

	function lifeOverlap(player, mlife)
	{
		life_sound.play();
		life++;
		scoreText.text ='				:						' + score  
		+'				\nbonus:	' + bonus 
		+'					\n:						' + life;
		mlife.kill();
	}

	function enemiesOverlap(player, enemy)
	{
		if (player.body.touching.down) 
		{
			enemy.animations.stop();
			squeeze_sound.play();
			enemy.frame = 2;
			enemy.body.enable = false;
			player.body.velocity.y = -80;
			bonus += 2;
			scoreText.text ='				:						' + score  
			+'				\nbonus:	' + bonus 
			+'					\n:						' + life;
			game.time.events.add(Phaser.Timer.SECOND, function() {
				enemy.kill();
			});
		} 
		else if(player.body.touching.down==false && life>0)
		{
				life--;
				scoreText.text ='				:						' + score  
				+'				\nbonus:	' + bonus 
				+'					\n:						' + life;
				checkLife = false;
				
				game.time.events.add(Phaser.Timer.SECOND * 3, function() {checkLife=true;});
		}
		else if(player.body.touching.down==false && life==0)
		{
				checkLife=false;
				life--;
				scoreText.text ='				:						' + score  
				+'				\nbonus:	' + bonus 
				+'					\n:						' + life;
				music.stop();
				player.frame = 7;
				player.body.enable = false;
				player.animations.stop();
				die_sound.play();
				game.time.events.add(Phaser.Timer.SECOND * 3, function() 
				{
					checkLife = true; endAnim = false;
					if(count==false) {life=lvllife; bonus=lvlbonus; score=lvlscore;}
					else {life=0; bonus=0; score=0;}
					this.game.state.restart(false,true);
				});
		}
		
	}
