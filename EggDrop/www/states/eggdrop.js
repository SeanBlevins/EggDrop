var eggdrop = function(game) {
	screenDims = null;
	gameScale = null;

	///Display objects
	//Collides
	catcher = null;
	floor = null;
	egg_group = null;

	//UI
	strikes_group = null;
	egg_carton_group = null;
	egg_carton_slots = null;

	//labels
	carton_label = null;
	score_label = null;
	combo_label = null;
	
	stat_box = null;

	pause_label = null;
	pause_box = null;
	
	//buttons
	pause_button = null;

	//Game settings
	cur_gravity = 150;
	game_settings = {
		egg_catch_percent: 0,
		egg_catch_percent_perfect: 0,
		drop_rate: 0,
		max_drop_rate: 0,
		drop_change_rate: 0,
	};

	//Game counters
	eggs_lost = 0;
	eggs_in_carton = 0;
	carton_count = 1;
	combo_count = 0;
    golden_eggs = 0;
    
    gold_egg_gone = false;

	//Strings
	pad = "00000000";
	score_string = null;

	//Game variables
	catcher_cur_vel = null;
	egg_cur_vel = null;

	//Emitters
	catch_emitter = null;
	combo_emitter = null;
	crack_emitter = null;

	//Timers
	drop_timer = null;

	//score
	high_score = {
		points : 0,
		eggs : 0,
		max_combo : 0
	};

	//sounds
	egg_crack = null;
	pickup = null;
}

eggdrop.prototype = {
	init: function() {
		//Game settings
		game_settings = JSON.parse(localStorage.getItem('game_settings'));
		cur_gravity = 150;
		
		screenDims = Utils.ScreenUtils.screenMetrics;
		gameScale = screenDims.gamePixScale;
	
		//Game counters
		eggs_lost = 0;
		eggs_in_carton = 0;
		carton_count = 1;
		combo_count = 0;
		
		//Score objects
		score = {};
		score.points = 0;
		score.eggs = 0;
		score.max_combo = 0;
	},
	
	create: function() {
		//Setup
		this.game.physics.startSystem(Phaser.Physics.ARCADE);

		this.game.physics.arcade.gravity.y = Math.round(cur_gravity * (screenDims.heightScale));
		//console.log("gravity : " + this.game.physics.arcade.gravity.y);
		
		//Sounds
		egg_crack = this.game.add.audio('egg_crack');
		pickup = this.game.add.audio('pickup', 0.1);

		//Background layer
		bg = this.game.add.sprite(this.world.centerX, this.world.centerY, 'bg');
    	bg.anchor.setTo(0.5, 0.5);
    	bg.scale.setTo(gameScale, gameScale);

		//Floor
		floor = this.game.add.sprite(this.world.centerX, this.game.world.height*0.9125, 'pole');
		floor.anchor.setTo(0.5, 1);
		floor.scale.setTo(gameScale, gameScale);
		floor.width = this.world.width;
		floor.enableBody = true;
		this.game.physics.arcade.enable(floor);
		floor.body.allowGravity = 0;
		floor.body.immovable = true;
		
		pause_button = this.game.add.button(this.game.world.width * 0.995, this.game.world.height * 0.995, 'pause_up', this.pauseGame, this, 0, 0, 1, 0);
		pause_button.anchor.setTo(1, 1);
		pause_button.scale.setTo(gameScale, gameScale);

		this.game.input.onDown.add(this.unpauseGame, this);

		//Egg carton
		egg_carton_group = this.game.add.group();
		egg_carton_group.scale.setTo(gameScale, gameScale);
		egg_carton_group.x = this.game.world.width * 0.005;
		egg_carton_group.y = this.game.world.height * 0.9125;
		egg_carton_slots = this.game.add.group();

		var egg_carton = egg_carton_group.create(this.game.world.width * 0.0125 * screenDims.pixRatio, this.game.world.width * 0.0125 * screenDims.pixRatio, 'egg_carton');
		egg_carton.visible = true;
		egg_carton_group.create(0, 0, 'egg_carton');

		egg_carton_group.add(egg_carton_slots);
		egg_carton_slots.x = egg_carton.width*0.125;
		egg_carton_slots.y = -(egg_carton.height*0.075);
		
		empty_slot = this.game.add.sprite(0,0,'empty_slot')
		egg_carton_slots.add(empty_slot);
		for (var x = 0; x < 3; x++) {
			for (var y = 0; y < 2; y++) {
				egg_carton_slots.create((x * (empty_slot.width*1.125)), (y * (empty_slot.height/1.5)), 'empty_slot');
			}
		}
		empty_slot.destroy();
        
        catcher = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'hand');
		catcher.anchor.set(0.5, 1.5);
		catcher.scale.setTo(gameScale, gameScale);
		catcher.enableBody = true;

		var c_body_width = (catcher.width * 0.8) / gameScale;
		var c_body_height = (catcher.height * 0.55) / gameScale;

		this.game.physics.arcade.enable(catcher);
		catcher.body.setSize(c_body_width, c_body_height, (catcher.width - c_body_width) / 2, catcher.height - c_body_height);
		catcher.body.allowGravity = 0;
		catcher.body.immovable = true;

		//Emitters
		catch_emitter = this.game.add.emitter(0, 0, 1);
		catch_emitter.setYSpeed(-100, -100);
		catch_emitter.setXSpeed(0);
		catch_emitter.minRotation = 0;
		catch_emitter.maxRotation = 0;
		catch_emitter.scale.setTo(gameScale, gameScale);

		combo_emitter = this.game.add.emitter(0, 0, 1);
		combo_emitter.setYSpeed(-100, -100);
		combo_emitter.setXSpeed(0);
		combo_emitter.minRotation = 0;
		combo_emitter.maxRotation = 0;
		combo_emitter.makeParticles('comboplus');
		combo_emitter.scale.setTo(gameScale, gameScale);

		crack_emitter = this.game.add.emitter(0, 0, 2);
		crack_emitter.minRotation = 5;
		crack_emitter.maxRotation = 25;
		crack_emitter.scale.setTo(gameScale, gameScale);

		//Labels
		carton_label = this.game.add.bitmapText(this.game.world.width * 0.3125, this.game.world.height * 0.935, 'arcfont', 'x' + carton_count, screenDims.fontSize.small);
		carton_label.visible = true;

		combo_label = this.game.add.bitmapText(0, this.game.world.height * 0.05, 'arcfont', combo_count + ' x\nCOMBO!', screenDims.fontSize.small);
		combo_label.align = 'center';
		combo_label.x = this.game.width / 2 - combo_label.textWidth / 2;
		combo_label.visible = false;

		//Eggs
		egg_group = this.game.add.group();
		//egg_group.scale.setTo(gameScale, gameScale);
		egg_group.enableBody = true;
		egg_group.physicsBodyType = Phaser.Physics.ARCADE;
		egg_group.x = 0;
		egg_group.y = 0;
		
		//pause background
		pause_box = this.game.add.graphics(0, 0);
    	pause_box.beginFill(0x4C79CC);
    	pause_box.lineStyle(0, 0x0000FF, 1);
    	pause_box.drawRect(0, this.game.world.height * 0.45, this.game.world.width, this.game.world.height * 0.1);
		pause_box.visible = false;
		
		pause_label = this.game.add.bitmapText((this.game.world.width / 2), (this.game.world.height / 2), 'arcfont', 'Paused', screenDims.fontSize.large);
    	pause_label.align = 'center';
    	pause_label.anchor.setTo(0.5, 0.5);
        pause_label.x = this.game.world.centerX;
        pause_label.y = this.game.world.centerY;
        pause_label.visible = false;
		
		//stats background
		stat_box = this.game.add.graphics(0, 0);
    	stat_box.beginFill(0x4C79CC);
    	stat_box.lineStyle(0, 0x0000FF, 1);
    	stat_box.drawRect(0, 0, this.game.world.width, this.game.world.height * 0.05);
		
		score_string = (pad + score.points).slice(-pad.length);
		score_label = this.game.add.bitmapText(this.game.world.width, 0, 'arcfont', 'Score : ' + score_string, screenDims.fontSize.small);
		score_label.x = (this.game.world.width*0.95) - score_label.textWidth;
		score_label.y = (this.game.world.height*0.025) - score_label.textHeight/2;
		
		//Strikes
		strikes_group = this.game.add.group();
		strikes_group.scale.setTo(gameScale, gameScale);
		strikes_group.x = this.game.world.width*0.01;
		strikes_group.y = this.game.world.height*0.01;
		
		var strike = this.game.add.sprite(0,0,'strike')
		strikes_group.add(strike);
		for (var x = 1; x < 3; x++) {
			strikes_group.create(x * (strike.width*1.1), 0, 'strike');
		}

		this.game.physics.arcade.enable(egg_group, true);

		drop_timer = this.game.time.create(false);
		drop_timer.loop(game_settings.drop_rate, this.set_egg, this);
		drop_timer.start();

	},

    //Pause game
	pauseGame: function () {

	    this.game.paused = true;

	    pause_button.loadTexture('pause_down');
	    pause_box.visible = true;
	    pause_label.visible = true;

	},
	
	//Unpause game
	unpauseGame: function () {

	    if (this.game.paused) {

	        this.game.paused = false;

	        pause_button.loadTexture('pause_up');
	        pause_box.visible = false;
	        pause_label.visible = false;
	    }	    

	},

	//Game update
	update: function() {
		this.game.physics.arcade.collide(catcher, egg_group, this.catch_egg, this.check_speeds, this);
		this.game.physics.arcade.collide(floor, egg_group, this.lose_egg, this.check_speeds, this);

		
		if(this.game.input.activePointer.y < this.game.world.height && this.game.input.activePointer.y > this.game.world.height * 0.2)
		{
	
			var pointDist = this.game.physics.arcade.distanceToPointer(catcher, this.game.input.activePointer);
			if (pointDist > 2)
    		{
        		this.game.physics.arcade.moveToPointer(catcher, (10*pointDist));
    		}
    		else
    		{
        		catcher.body.velocity.set(0);
    		}
		}
		else
		{
			catcher.body.velocity.set(0);
		}
	},

	//check speeds of catcher and egg before collision.
	check_speeds: function (catcher_obj, egg_obj) {
		catcher_cur_vel = Math.round(catcher_obj.body.velocity.y / screenDims.heightScale);
		egg_cur_vel = Math.round(egg_obj.body.velocity.y / screenDims.heightScale);

        //Catching egg from above. Set catcher vel to 0
		if (egg_obj.getBounds().y > catcher_obj.getBounds().y) {
		    catcher_cur_vel = 0;
		}

		var catch_percent = Math.round((catcher_cur_vel / egg_cur_vel) * 100);
		
		return true;
	},

	//Egg collides with catcher
	catch_egg: function(catcher_obj, egg_obj) {
	
		var good_catch = false;

		var catch_percent = Math.round((catcher_cur_vel / egg_cur_vel)*100);
	
		catch_percent = catch_percent < 0 ? 0 : catch_percent;
	
		//Reset catch_emmiter and position to catcher
		catch_emitter.removeAll(true, true);
		catch_emitter.x = catcher.x / gameScale;
		catch_emitter.y = (catcher.y / gameScale) - (catcher.height / gameScale);
	
		//Position combo_emmiter 25 pixels below catcher
		combo_emitter.x = catcher.x  / gameScale;
		combo_emitter.y = (catcher.y  / gameScale) - (catcher.height  / gameScale) + 50;

    
		//Three different catch status: Perfect, Good, Bad  (Perfects add to combo)
		if (catch_percent >= game_settings.egg_catch_percent_perfect) {
			//perfect
		
			catch_emitter.makeParticles('perfect');
			combo_count++;
			combo_label.text = combo_count + ' x\nCOMBO!';
		
			if(combo_count > score.max_combo) {
				score.max_combo = combo_count;
			}
			
			score.points += 25;
			good_catch = true;
		}
		else if (catch_percent >= game_settings.egg_catch_percent) {
			//good
			
			catch_emitter.makeParticles('good');
			combo_count = 0;
			combo_label.text = combo_count + ' x\nCOMBO!';
			combo_label.visible = false;
			
			good_catch = true;
		}
		else {
			//bad
			
			//Code for egg break animation and break sound
			this.lose_egg(catcher_obj, egg_obj);
			
			catch_emitter.makeParticles('bad');
		
		}
	
	
		if (good_catch) {
			//Good catch
			var child = egg_carton_slots.getAt(eggs_in_carton);
			
			child.loadTexture('egg_slot');
			
			score.eggs++;
			eggs_in_carton++;
			
			if (combo_count > 1) {
				score.points += (combo_count * 10);
				combo_label.visible = true;

				combo_emitter.explode(1000, 1);
			}
			else {
				score.points += 10;
			}
            
            if(egg_obj.key == "gold_egg") {
				eggs_lost = eggs_lost > 0 ? eggs_lost - 1 : 0;
				
				var child = strikes_group.getAt(eggs_lost);
				child.tint = 0xFFFFFF;
				
				
				score.points += 100;
				golden_eggs++;
			}
			
			if((score.eggs > 0) && (score.eggs % 6) == 0) {
				carton_count++;
				eggs_in_carton = 0;
				carton_label.text = 'x' + carton_count;
                
                gold_egg_gone = false;
				
				game_settings.drop_rate = game_settings.drop_rate > game_settings.max_drop_rate ? game_settings.drop_rate - game_settings.drop_change_rate : game_settings.drop_rate;
				
				this.update_timer();
			
				this.reset_carton();
				
				//fifty bonus points for completing a carton
				score.points += 50;
			}
			
			score_string = (pad+score.points).slice(-pad.length);
			
			score_label.text = "Score : " + score_string;
			egg_obj.kill();
			
			pickup.play();
		}
		
		catch_emitter.explode(1000, 1);
	
	},

	lose_egg: function (catcher_obj, egg_obj) {
		var child = strikes_group.getAt(eggs_lost);
		child.tint = 0xFF0000;	
		
		//Code for egg break animation and break sound
		egg_crack.play();
		
		crack_emitter.removeAll(true, true);
		//crack_emitter.y = egg_obj.y;
		crack_emitter.x = egg_obj.x / gameScale;
		crack_emitter.y = egg_obj.y / gameScale;
		
		if (egg_obj.key == "gold_egg") {
			crack_emitter.makeParticles(['gold_crack_r', 'gold_crack_l']);
		} else {
			crack_emitter.makeParticles(['crack_r', 'crack_l']);
		}
		crack_emitter.start(true, 500, 2, 2);
		
		eggs_lost++;
		combo_count = 0;
		combo_label.text = combo_count + ' x\nCOMBO!';
		combo_label.visible = false;
		
    	egg_obj.destroy();
    	
    	if (eggs_lost >= 3) {
    		//Game over
    		timer = this.game.time.create(true);
			timer.add(750, this.gameover, this);
			timer.start();
    		
    	}
    	
	},
	
	gameover: function() {
    	this.game.state.start("GameOver", true, false, score);		
	},
	
	set_egg: function() {
	   var new_egg;
		
		if(!gold_egg_gone && Math.random() < (1/6)) {
			new_egg = egg_group.create(Math.floor(Math.random() * (this.game.world.width * 0.9)) + (this.game.world.width * 0.1), 5, 'gold_egg');
			gold_egg_gone = true;
		} else {
			new_egg = egg_group.create(Math.floor(Math.random() * (this.game.world.width * 0.9)) + (this.game.world.width * 0.1), 5, 'egg');
		}
		
		new_egg.enableBody = true;
	
		this.game.physics.arcade.enable(new_egg);
		new_egg.body.setSize(new_egg.width*gameScale, new_egg.height*gameScale, 0, 0);
		
		this.game.physics.arcade.enable(egg_group, true);
		
		new_egg.anchor.set(0.5, 0.5);
		new_egg.scale.setTo(gameScale, gameScale);
		new_egg.body.angularVelocity += Math.floor(Math.random() * 400) - 200;
		
	},
	
	reset_carton: function() {
		if(carton_count == 2) {
			var child = egg_carton_group.getAt(0);
			child.visible = true;
			carton_label.visible = true;
		}
		
		egg_carton_slots.forEach(function(item) {
			item.loadTexture('empty_slot');
		});
	},

	update_timer: function() {
		drop_timer.removeAll();
	    drop_timer.loop(game_settings.drop_rate, this.set_egg, this);
	    drop_timer.start();

	}
}