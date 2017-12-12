var Technotip = {};
 
Technotip.Menu = function(game){
    var text1;
	var myImage;
};
 
Technotip.Menu.prototype = {
	
	preload: function()
	{
		this.load.image('background', 'assets/background_00.png');
		this.load.image('button', 'assets/playButton.png');
		
	},	
	create: function()
	{
		game.scale.pageAlignHorizontally = true;
		game.scale.pageAlignVertically = true;
		myImage=game.add.sprite(0,0,'background');
		myImage.width = window.innerWidth;
		myImage.height = window.innerHeight;
		
		playButton = game.add.sprite(window.innerWidth/2-130, window.innerHeight/2-50, 'button')
		
		playButton.inputEnabled = true;
        playButton.events.onInputDown.add(this.startGame, this);
    },
   
    startGame: function()
    {
	   this.state.start('LevelOne');
	}
};