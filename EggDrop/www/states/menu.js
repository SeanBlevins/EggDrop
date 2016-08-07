var menu = function(game){
    screenDims = null;
    gameScale = null;
	
	//buttons
	start_button = null;
	delete_button = null;
	
	high_score_exists = false;
	
	graphics = null;
	
	//label
	high_score_label = null;
	high_score_stats_label = null;
	
	info1 = null;
	info2 = null;
	info3 = null;
	
	//string
	high_score_string = null;
	
	//score
	high_score = {
		points : 0,
		eggs : 0,
		max_combo : 0
	};
	
	//game setting
	game_settings = {
		egg_catch_percent: 0,
		egg_catch_percent_perfect: 0,
		drop_rate: 0,
		max_drop_rate: 0,
		drop_change_rate: 0,
	};
	
	//GUI
	gui = null;
}
 
menu.prototype = {
	init: function(){
		high_score = JSON.parse(localStorage.getItem('high_score'));
		high_score_exists = true;
		
		if (!high_score || high_score.points == 0) {
			high_score_exists = false;
			high_score = {
				points : 0,
				eggs : 0,
				max_combo : 0
			};

			localStorage.setItem('high_score', JSON.stringify(high_score));
			high_score = JSON.parse(localStorage.getItem('high_score'));
		}
        
        game_settings = JSON.parse(localStorage.getItem('game_settings'));
		
		if (!game_settings) {
			game_settings = {
				egg_catch_percent : 45,
				egg_catch_percent_perfect : 75,
				drop_rate : 3000,
				max_drop_rate : 1000,
				drop_change_rate : 200
			};
	
			localStorage.setItem('game_settings', JSON.stringify(game_settings));
			game_settings = JSON.parse(localStorage.getItem('game_settings'));
		}
	},
	
  	create: function(){
  		screenDims = Utils.ScreenUtils.screenMetrics;
  		gameScale = screenDims.gamePixScale;
  		
  		//Background
    	var bg = this.game.add.sprite(this.world.centerX, this.world.centerY, 'bg');
    	bg.anchor.setTo(0.5, 0.5);
    	bg.scale.setTo(gameScale, gameScale);
    	
        //text background
		graphics = this.game.add.graphics(0, 0);
    	graphics.beginFill(0x4C79CC);
    	graphics.lineStyle(0, 0x0000FF, 1);
    	graphics.drawRect(0, this.game.world.height * 0.4, this.game.world.width, this.game.world.height * 0.3);
		graphics.visible = high_score_exists;
    	
  		high_score_label = this.game.add.bitmapText(0, 0, 'arcfont', 'High Score  : ' + high_score.points, screenDims.fontSize.medium);
		high_score_label.align = 'center';
		high_score_label.x = this.game.world.centerX - high_score_label.textWidth / 2;
		high_score_label.y = this.game.world.centerY - high_score_label.textHeight / 2;
		high_score_label.visible = high_score_exists;

		high_score_string = 'Eggs Saved : ' + high_score.eggs + '\n';
		high_score_string += 'Max Combo  : ' + high_score.max_combo + '\n';
		high_score_stats_label = this.game.add.bitmapText(0, 0, 'arcfont', high_score_string, screenDims.fontSize.small);
		high_score_stats_label.align = 'center';
		high_score_stats_label.x = this.game.world.centerX - high_score_stats_label.textWidth / 2;
		high_score_stats_label.y = high_score_label.y + high_score_label.textHeight;
		high_score_stats_label.visible = high_score_exists;
    	
    	start_button = this.game.add.button(this.game.world.centerX, this.world.height * 0.75, 'start_button', this.click_start, this, 0, 0, 1, 0);
    	start_button.anchor.setTo(0.5, 0);
    	start_button.scale.setTo(gameScale, gameScale);
    	
    	delete_button = this.game.add.button(this.game.world.centerX, this.world.height * 0.3, 'delete_button', this.delete_highscore, this, 0, 0, 1, 0);
    	delete_button.anchor.setTo(0.5, 0);
    	delete_button.scale.setTo(gameScale, gameScale);
    	delete_button.visible = high_score_exists;
    	
    	gui = new dat.GUI();
    	
    	gui.add(game_settings, 'egg_catch_percent', 10, 100).step(1);
    	gui.add(game_settings, 'egg_catch_percent_perfect', 10, 100).step(5);
    	gui.add(game_settings, 'drop_rate', 100, 5000).step(100);
    	gui.add(game_settings, 'max_drop_rate', 100, 5000).step(100);
    	gui.add(game_settings, 'drop_change_rate', 25, 1000).step(25);
    	gui.add(this, "reset_settings");

    	var style = {
    	    font: "16px Arial", fill: "#fff",
    	    align: "left", // the alignment of the text is independent of the bounds, try changing to 'center' or 'right'
    	    boundsAlignH: "left",
    	    boundsAlignV: "top",
    	    wordWrap: true, wordWrapWidth: 300
    	};

    	var ipsum = "bgHeight          : " + screenDims.bgHeight + "\n" +
                    "bgWidth           : " + screenDims.bgWidth + "\n" +
                    "bgHeightScale     : " + screenDims.bgHeightScale + "\n" +
                    "bgWidthScale      : " + screenDims.bgWidthScale + "\n" +
                    "windowAspect      : " + screenDims.windowAspect + "\n" +
                    "defaultGameHeight : " + screenDims.defaultGameHeight + "\n" +
                    "defaultGameWidth  : " + screenDims.defaultGameWidth + "\n" +
                    "fontSize          : " + screenDims.fontSize + "\n" +
                    "gamePixScale      : " + screenDims.gamePixScale + "\n" +
                    "gameSize          : " + screenDims.gameSize + "\n" +
                    "heightScale       : " + screenDims.heightScale + "\n" +
                    "pixRatio          : " + screenDims.pixRatio + "\n" +
                    "windowHeight      : " + screenDims.windowHeight + "\n" +
                    "windowWidth       : " + screenDims.windowWidth + "\n";

    	text = this.game.add.text(25, 25, ipsum, style);
    	
  	},
	
  	click_start: function () {
  	    localStorage.setItem('game_settings', JSON.stringify(game_settings));
  	    gui.closed = true;
        
		if(high_score_exists) {			
		    this.game.state.start("EggDrop");
		}
		else {
		    this.game.state.start("HowTo");
		}
		
	},
    
    reset_settings: function(){

        game_settings.egg_catch_percent = 45;
        game_settings.egg_catch_percent_perfect = 75;
        game_settings.drop_rate = 3000;
        game_settings.max_drop_rate = 1000;
        game_settings.drop_change_rate = 200;

        // Iterate over all controllers
        for (var i in gui.__controllers) {
            gui.__controllers[i].updateDisplay();
        }
    },
	
	delete_highscore: function(){
		high_score_exists = false;

		high_score.points = 0;
		high_score.eggs = 0;
		high_score.max_combo = 0;

		localStorage.setItem('high_score', JSON.stringify(high_score));
		high_score = JSON.parse(localStorage.getItem('high_score'));
		
		high_score_label.visible = high_score_exists;
		high_score_stats_label.visible = high_score_exists;
		delete_button.visible = high_score_exists;
		graphics.visible = high_score_exists;
	}
}