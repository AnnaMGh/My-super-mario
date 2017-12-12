var game = new Phaser.Game(1350, 480, Phaser.CANVAS);

game.state.add('Menu', Technotip.Menu);
game.state.add('LevelOne', Technotip.LevelOne);

game.state.start('Menu');

//game.state.start('LevelOne');

//window.alert('After load');