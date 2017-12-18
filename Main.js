var game = new Phaser.Game(1350, 480, Phaser.CANVAS);

game.state.add('Menu', Technotip.Menu);
game.state.add('LevelOne', Technotip.LevelOne);
game.state.add('LevelTwo', Technotip.LevelTwo);

game.state.start('Menu');
