var howto = function (game) {
    screenDims = null;
    gameScale = null;

    graphics = null;

    //label
    info1 = null;
    info2 = null;
    info3 = null;

}

howto.prototype = {
    init: function () {        
    },

    create: function () {
        screenDims = Utils.ScreenUtils.screenMetrics;
        gameScale = screenDims.gamePixScale;

        //Background
        var bg = this.game.add.sprite(this.world.centerX, this.world.centerY, 'bg');
        bg.anchor.setTo(0.5, 0.5);
        bg.scale.setTo(gameScale, gameScale);

        //text background
        graphics = this.game.add.graphics(0, 0);
        graphics.beginFill(0xffffff, 0.5);
        graphics.lineStyle(0, 0xffffff, 0.5);
        graphics.drawRect(0, 0, this.game.world.width, this.game.world.height);

        info1_string = "Catch as many\neggs as you can!";

        info1 = this.game.add.bitmapText(0, 0, 'arcfont', info1_string, screenDims.fontSize.large);
        info1.align = 'center';
        info1.anchor.setTo(0.5, 0.5);
        info1.x = this.game.world.centerX;
        info1.y = this.game.world.height * 0.1;

        info2_string = "Match the\nspeed of the\nfalling eggs to\ncatch them";

        info2 = this.game.add.bitmapText(0, 0, 'arcfont', info2_string, screenDims.fontSize.medium);
        info2.align = 'left';
        info2.anchor.setTo(0, 0.5);
        info2.x = this.game.world.width * 0.05;
        info2.y = this.game.world.height * 0.4;

        info3_string = "With every\nfull carton\nthe speed\nwill increase!";

        info3 = this.game.add.bitmapText(0, 0, 'arcfont', info3_string, screenDims.fontSize.medium);
        info3.align = 'right';
        info3.anchor.setTo(1, 0.5);
        info3.x = this.game.world.width * 0.95;
        info3.y = this.game.world.height * 0.8;

        catcher = this.game.add.sprite(this.game.world.width * 0.8, this.game.world.height * 0.3, 'hand', 0);
        catcher.anchor.setTo(0.5, 0.5);
        catcher.scale.setTo(gameScale, gameScale);

        egg = this.game.add.sprite(this.game.world.width * 0.8, this.game.world.height * 0.2, 'egg', 0);
        egg.anchor.setTo(0.5, 1);
        egg.scale.setTo(gameScale, gameScale);

        this.game.add.tween(catcher).to({ y: this.game.world.height * 0.5 }, 650, Phaser.Easing.Default, true, 250, -1).repeatDelay(500);
        this.game.add.tween(egg).to({ y: this.game.world.height * 0.5 }, 650, Phaser.Easing.Default, true, 250, -1).repeatDelay(500);

        full_carton = this.game.add.sprite(this.game.world.width * 0.25, this.game.world.height * 0.8, 'full_carton', 0);
        full_carton.anchor.setTo(0.5, 0.5);
        full_carton.scale.setTo(gameScale, gameScale);

        this.game.input.onDown.add(this.start_game, this);
    },

    start_game: function () {
        this.game.state.start("EggDrop");
    }
}