var gameover = function(game){

	//label
	gameover_label = null;
	high_score_label = null;
	high_score_stats_label = null;
	
	//string
	high_score_string = null;
	
	//font sizes
	small_font = 24;
	medium_font = 38;
	large_font = 52;
	
	//score
	score = {};
	score.points = 0;
	score.eggs = 0;
	score.max_combo = 0;
	
	high_score = {};
	high_score.points = 0;
	high_score.eggs = 0;
	high_score.max_combo = 0;
}
 
gameover.prototype = {
	init: function(score){
		this.score = score;
		
		high_score = JSON.parse(localStorage.getItem('high_score'));
		if (!high_score) {
			high_score = {};
			high_score.points = 0;
			high_score.eggs = 0;
			high_score.max_combo = 0;

			localStorage.setItem('high_score', JSON.stringify(high_score));
			high_score = JSON.parse(localStorage.getItem('high_score'));
		}
		
		if(score.points > high_score.points) {
			localStorage.setItem('high_score', JSON.stringify(score));
		}
		
	},
	
  	create: function(){    
  		screenDims = Utils.ScreenUtils.screenMetrics;
  		
  		//Background
    	var bg = this.game.add.sprite(this.world.centerX, this.world.centerY, 'bg');
    	bg.anchor.setTo(0.5, 0.5);
    	bg.scale.setTo(screenDims.gamePixScale, screenDims.gamePixScale);
    	
        //text background
		var graphics = this.game.add.graphics(0, 0);
    	graphics.beginFill(0x4C79CC);
    	graphics.lineStyle(0, 0x0000FF, 1);
    	graphics.drawRect(0, this.game.world.height * 0.4, this.game.world.width, this.game.world.height * 0.35);

  		var game_over_string = "Game Over";
  		
  		if(score.points > high_score.points) {
    		game_over_string += "\nNew High Score!!";
    	}
    	
    	gameover_label = this.game.add.bitmapText(this.world.centerX, (this.game.world.height / 2), 'arcfont', game_over_string, screenDims.fontSize.medium);
    	gameover_label.align = 'center';
    	gameover_label.x = this.world.centerX - gameover_label.textWidth / 2;
    	gameover_label.y = this.world.centerY - gameover_label.textHeight / 2;
    	
    	high_score_string =  'Score      : ' + score.points + '\n';
    	high_score_string += 'Eggs Saved : ' + score.eggs + '\n';
		high_score_string += 'Max Combo  : ' + score.max_combo + '\n';
    	
    	high_score_label = this.game.add.bitmapText(0, 0, 'arcfont', high_score_string, screenDims.fontSize.small);
		high_score_label.align = 'center';
		high_score_label.x = this.world.centerX - high_score_label.textWidth / 2;
		high_score_label.y = this.world.centerY + gameover_label.textHeight / 2;
    	
    	this.game.input.onTap.addOnce(this.play_game, this);
    	
	},
	
	play_game: function(){       
        
		this.game.state.start("Menu");
	}
}