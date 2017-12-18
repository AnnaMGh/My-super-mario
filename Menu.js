var Technotip = {};
 
Technotip.Menu = function(game){
    var text1;
	var text2;
	var myImage;
};
 
Technotip.Menu.prototype = {
	
	preload: function()
	{
		this.load.image('background', 'assets/background_01.png');
	},	
	create: function()
	{
		game.scale.pageAlignHorizontally = true;
		game.scale.pageAlignVertically = true;
		myImage=game.add.sprite(0,0,'background');
		myImage.width = window.innerWidth;
		myImage.height = window.innerHeight;
		
		text1 = game.add.text(window.innerWidth/2-70, window.innerHeight/2+10, 'LEVEL I', { font: "40px Arial", fill: "#ffffff", align: "center" });
		text2 = game.add.text(window.innerWidth/2-75, window.innerHeight/2+60, 'LEVEL II', { font: "40px Arial", fill: "#ffffff", align: "center"  });
		text1.inputEnabled = true;
		text1.events.onInputDown.add(this.startLevelOne, this);
		text2.inputEnabled = true;
		text2.events.onInputDown.add(this.startLevelTwo, this);
   
   },
   
    startLevelOne: function()
    {
	   this.state.start('LevelOne');
	   
	},
	 startLevelTwo: function()
    {
	   this.state.start('LevelTwo');
	   
	}
};
