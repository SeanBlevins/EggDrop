var preload = function(game){
	loadingBar = null;
}

preload.prototype = {
	preload: function(){ 
		var screenDims = Utils.ScreenUtils.screenMetrics;
		var size = screenDims.gameSize;
    	
        loadingBar = this.game.add.sprite(this.world.centerX, this.world.centerY, "loading");
        loadingBar.anchor.setTo(0,0);
        loadingBar.x = this.world.width * 0.1;
        loadingBar.width = this.world.width * 0.9;
        this.load.setPreloadSprite(loadingBar);
    
    	this.game.load.image('bg','assets/images/'+size+'/bg.jpg');
        
		this.game.load.image('egg', 'assets/images/'+size+'/egg.png');
		this.game.load.image('hand', 'assets/images/'+size+'/hand.png');
        
        this.game.load.image('gold_egg', 'assets/images/'+size+'/egg_gold.png');

		this.game.load.image('pole', 'assets/images/'+size+'/pole.png');

		this.game.load.image('strike', 'assets/images/'+size+'/strike.png');
		
		this.game.load.image('crack_l', 'assets/images/'+size+'/crack_left.png');
		this.game.load.image('crack_r', 'assets/images/'+size+'/crack_right.png');
		
		this.game.load.image('gold_crack_l', 'assets/images/'+size+'/gold_crack_left.png');
		this.game.load.image('gold_crack_r', 'assets/images/'+size+'/gold_crack_right.png');
		
		this.game.load.image('egg_carton', 'assets/images/'+size+'/egg_carton.png');
		this.game.load.image('empty_slot', 'assets/images/'+size+'/empty_slot.png');
		this.game.load.image('egg_slot', 'assets/images/'+size+'/egg_slot.png');
		
		this.game.load.image('full_carton', 'assets/images/'+size+'/egg_carton_full.png');
	
		this.game.load.image('bad', 'assets/images/'+size+'/bad.png');
		this.game.load.image('good', 'assets/images/'+size+'/good.png');
		this.game.load.image('perfect', 'assets/images/'+size+'/perfect.png');
		this.game.load.image('comboplus', 'assets/images/'+size+'/comboplus.png');
		
		var audio_format = (this.game.device.iOS) ? "m4a" : "ogg";
		this.game.load.audio('egg_crack', 'assets/audio/egg_crack.' + audio_format);
		this.game.load.audio('pickup', 'assets/audio/pickup.' + audio_format);
	    
	    if(size == 'xsmall') {
	    	this.game.load.spritesheet('start_button', 'assets/images/'+size+'/start_button.png', 126, 48);
			this.game.load.spritesheet('delete_button', 'assets/images/'+size+'/delete_button.png', 100, 39);
	    } else if(size == 'small') {
	    	this.game.load.spritesheet('start_button', 'assets/images/'+size+'/start_button.png', 190, 72);
			this.game.load.spritesheet('delete_button', 'assets/images/'+size+'/delete_button.png', 149, 59);
	    } else if(size == 'medium') {
	    	this.game.load.spritesheet('start_button', 'assets/images/'+size+'/start_button.png', 253, 96);
			this.game.load.spritesheet('delete_button', 'assets/images/'+size+'/delete_button.png', 199, 79);
	    } else if(size == 'large') {
	    	this.game.load.spritesheet('start_button', 'assets/images/'+size+'/start_button.png', 379, 144);
			this.game.load.spritesheet('delete_button', 'assets/images/'+size+'/delete_button.png', 299, 119);
	    } else if(size == 'xlarge') {
	    	this.game.load.spritesheet('start_button', 'assets/images/'+size+'/start_button.png', 506, 193);
			this.game.load.spritesheet('delete_button', 'assets/images/'+size+'/delete_button.png', 399, 159);
	    } else {
	    	console.log("Unknown game size");
	    }

		this.game.load.image('pause_up', 'assets/images/'+size+'/pause_up.png');
		this.game.load.image('pause_down', 'assets/images/'+size+'/pause_down.png');
	
		this.game.load.bitmapFont('arcfont', 'assets/font/arc.png', 'assets/font/arc.xml');
	},
	
  	create: function(){
  		var tween = this.add.tween(loadingBar).to({ alpha: 0 }, 800, Phaser.Easing.Linear.None, true);
        tween.onComplete.add(this.startMainMenu, this);
		
	},
	
	startMainMenu: function(){
        this.game.state.start("Menu");
	}
}