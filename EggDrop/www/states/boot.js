var boot = function(game){
    screenDims = null
};
  
boot.prototype = {
	preload: function(){
	    screenDims = Utils.ScreenUtils.screenMetrics;
	    
	    //fill background
	    this.game.stage.backgroundColor = "#4C79CC";
        
        this.game.load.image('loading','assets/images/'+screenDims.gameSize+'/loading_bar.png');
	},
	
  	create: function(){
  		this.input.maxPointers = 1;
  		this.game.time.advancedTiming = true;
        this.game.time.desiredFps = 60;

        this.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        
        this.game.state.start("Preload");
        
	}
}