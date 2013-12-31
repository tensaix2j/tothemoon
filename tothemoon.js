



	var ctxt;

	var maxspeed = 40;
	var minspeed = 4;
	var max_bullet_size = 40;
	var min_bullet_size = 10;
	var maxfireinterval = 20;
	var minfireinterval = 3;


	var resource_loaded = 0;
	var total_resource = 9;

	var imgbgstars = [];
	var imgrocket;
	var imgrocketfire = [];
	var mp3bgmusic;
	var wavwow ;
	var wavexplosion;
	var wavcollect;
	var control_direction = [];
	var imgdoge = [];
	var imgaltcoin;
	var imgexplosion;

	var timerinterval = 20;
	var altitude = 0;
	var coinval  = 0;
	var player_x = 300;
	var player_y = 500;
	var player_vx = 0;
	var player_vy = 0;
	var player_width = 150;
	var player_height = 150;

	
	var hyperon = 0;
	var fireon = 0;
	var autofireinterval = 20;
	var autorapidfire = 0;


	var speed = minspeed;
	var bullets = [];
	var maxbullet = 13;
	var bulletindex = 0;	
	var bullet_forwardspeed = 20;
	var bullet_size = min_bullet_size;


	var enemies = [];
	var maxenemy = 40;
	var enemyindex = 0;
	var enemytypeupgrade = 0;


	var explosion = [];
	var maxexplosion = 20;
	var explosionindex = 0;
	
	var bonuses = [];
	var maxbonus = 10;
	var bonusindex = 0;

	var valdump = [];


	//------
	function addpower( x ) {

		if ( hyperon == 1 ) {

			valdump[1] += x;
			if ( valdump[1] > max_bullet_size ) {
				valdump[1] = max_bullet_size;	
			}
			if ( valdump[1] < min_bullet_size ) {
				valdump[1] = min_bullet_size;
			}
		} else {
			
			
			bullet_size += x;
			if ( bullet_size > max_bullet_size ) {
				bullet_size = max_bullet_size;	
			}
			if ( bullet_size < min_bullet_size ) {
				bullet_size = min_bullet_size;
			}
	
		}					
	}



	//---------
	function addspeed( x ) {

		if ( hyperon == 1 ) {

			valdump[0] += x;
			if ( valdump[0] > maxspeed ) {
				valdump[0] = maxspeed;
			}
			if ( valdump[0] < minspeed ) {
				valdump[0] = minspeed;
			}

		} else {
			speed += x;
			if ( speed > maxspeed ) {
				speed = maxspeed;
			}
			if ( speed < minspeed ) {
				speed = minspeed;
			}			
		}
	}


	//----
	function addrapidfire(x) {

		if ( autorapidfire > 0 ) {

			valdump[2] -= x;
			if ( valdump[2] > maxfireinterval) {
				valdump[2] = maxfireinterval;
			}
			if ( valdump[2] < minfireinterval ) {
				valdump[2] = minfireinterval;
			}

 		} else {
 			autofireinterval -= x;
			if ( autofireinterval > maxfireinterval) {
				autofireinterval = maxfireinterval;
			}
			if ( autofireinterval < minfireinterval ) {
				autofireinterval = minfireinterval;
			}			
		}
	}



	//-----
	function checkCollisionWithEnemies( bi ) {

		for (var i = 0 ; i < maxenemy ; i++ ) {

			if ( enemies[i]["active"] == 1 ) {
			
				var diffx = enemies[i]["x"] - bullets[bi]["x"] ;
				var diffy = enemies[i]["y"] - bullets[bi]["y"] ;

				if ( diffx * diffx + diffy * diffy < 1024 ) {
					return i;
				}
			}
		}
		return -1;

	}

	//---
	function checkCollisionWithPlayers( ei ) {

		var diffx = enemies[ei]["x"] - player_x;
		var diffy = enemies[ei]["y"] - player_y;
		if ( diffx * diffx + diffy * diffy < 2304 ) {
			return 1;
		}
		return 0;
	}

	//----
	function checkBonusCollisionWithPlayers( bi ) {

		var diffx = bonuses[bi]["x"] - player_x;
		var diffy = bonuses[bi]["y"] - player_y;
		if ( diffx * diffx + diffy * diffy < 3304 ) {
			return 1;
		}
		return 0;
	}


	//--
	function createbonuses( x,y,type) {

		bonuses[bonusindex]["x"] = x;
		bonuses[bonusindex]["y"] = y;
		bonuses[bonusindex]["type"] = type;
		bonuses[bonusindex]["active"] = 250;

		bonusindex = (bonusindex + 1) % maxbonus;
	}



	//---
	function createenemies( x,y, type , isboss ) {

		enemies[enemyindex]["x"] = x;
		enemies[enemyindex]["y"] = y;
		enemies[enemyindex]["type"] = type;
		enemies[enemyindex]["active"] = 1;
		enemies[enemyindex]["tx"] = rand(600);
		enemies[enemyindex]["isboss"] = isboss;
		enemies[enemyindex]["ty"] = rand(400);
		enemies[enemyindex]["frame"] = 0;
		

		if ( type > 13 ) {
			enemies[enemyindex]["life"] = type * 11 ;
		} else if ( type > 10 ) {
			enemies[enemyindex]["life"] = type * 8 ;
		} else if ( type > 5 ) {
			enemies[enemyindex]["life"] = type * 9 ;
		} else {
			enemies[enemyindex]["life"] = type * 8 ;
		}

		if ( isboss	 == 1 ) {
			enemies[enemyindex]["life"] *= 10;
		
		} 


			
		enemyindex = (enemyindex + 1) % maxenemy;
	}



	//------
	function createexplosion( x,y ) {

		explosion[explosionindex]["x"] = x;
		explosion[explosionindex]["y"] = y;
		explosion[explosionindex]["active"] = 1;
		explosion[explosionindex]["frame"] = 0;
		
		explosionindex = ( explosionindex + 1 )  % maxexplosion;
		wavexplosion.play();
	}

	//--------
	function firebullet() {

		bullets[bulletindex]["x"] = player_x;
		bullets[bulletindex]["y"] = player_y + 30;
		bullets[bulletindex]["active"] = 1;
		bulletindex = (bulletindex + 1) % maxbullet ;
	}

	//--------
	function getenemysrcx( type ) {

		return [4,3,1,0, 9,8,7,6,  5,5,4,3,  2,1,0,0, 6, 0][type];
	}

	function getenemysrcy( type ) {

		return [1,1,1,1, 0,0,0,0,  0,1,0,0,  0,0,0,0, 1, 2][type];
	}

	
	//----
	function init() {


		var canvas = document.getElementById("cv");
		ctxt = canvas.getContext('2d');

		imgbgstars[0] = new Image();
		imgbgstars[0].src = 'images/bgstars.jpg';
		imgbgstars[0].addEventListener('load', function() {

			loadcomplete();

		}, false);
		

		imgbgstars[1] = new Image();
		imgbgstars[1].src = 'images/bgstarshyper.jpg';
		imgbgstars[1].addEventListener('load', function() {
		
			loadcomplete();
			
		}, false);
				

		imgrocket = new Image();
		imgrocket.src = 'images/rocket_100.png';
		imgrocket.addEventListener('load', function() {
			loadcomplete();
			
		}, false);
		
		imgdoge[0] = new Image();
		imgdoge[0].src = 'images/doge_40.png';
		imgdoge[0].addEventListener('load', function() {
			loadcomplete();
			
		}, false);
		

		imgrocketfire[0] = new Image();
		imgrocketfire[0].src = 'images/rocketfire.png';
		imgrocketfire[0].addEventListener('load', function() {
			loadcomplete();
			
		}, false);
		
		imgrocketfire[1] = new Image();
		imgrocketfire[1].src = 'images/rocketfire2.png';
		imgrocketfire[1].addEventListener('load', function() {
			loadcomplete();
			
		}, false);
		
		imgrocketfire[2] = new Image();
		imgrocketfire[2].src = 'images/rocketfire3.png';
		imgrocketfire[2].addEventListener('load', function() {
			loadcomplete();
			
		}, false);


		imgaltcoin = new Image();
		imgaltcoin.src = 'images/altcoin_64.png';
		imgaltcoin.addEventListener('load', function() {
			loadcomplete();
			
		}, false);

		imgexplosion = new Image();
		imgexplosion.src = 'images/explosion.png';
		imgexplosion.addEventListener('load', function() {
			loadcomplete();
			
		}, false);
		



		wavwow = new Audio('sounds/wow.wav');
		wavexplosion = new Audio('sounds/explosion.wav');
		wavcollect = new Audio('sounds/collect.wav');

							
		mp3bgmusic = new Audio('sounds/bgmusicfull.mp3');
		mp3bgmusic.loop = true;
		


		tick = 1;

		ctxt.fillStyle = "white";
  		ctxt.font = "12px Helvetica";

  		for ( i = 0 ; i < maxbullet ; i++ ) {
  			bullets[i] = { x : 0 , y : 0 , active: 0};
  		}

  		for ( i = 0 ; i < maxenemy ; i++ ) {
  			enemies[i] = { 
  							x: 0, 
  							y: 0, 
  							active: 0 , 
  							type : rand(15),
  							tx: 0,
  							ty: 0 
  						};
  		}

  		for ( i = 0 ; i < maxexplosion ; i++ ) {
  			explosion[i] = {x:0,y:0,active:0,frame:0};
  		}

  		for ( i = 0 ; i < maxbonus ; i++ ) {
  			bonuses[i] = { x:0, y:0 , active:0, type:0 };
  		}


  		loading_screen();
  		
		

	}


	function int_div( x , y ) {
		return Math.floor( x / y );
	}


	//----
	function keyDownEvent(evt) {
    	
    	//var eType = evt.type; 
		var keyCode = evt.which?evt.which:evt.keyCode; 
		
		//var eCode = 'keyCode is ' + keyCode;
		//var eChar = 'charCode is ' + String.fromCharCode(keyCode); // or evt.charCode
		//console.log("Captured Event (type=" + eType + ", key Unicode value=" + eCode + ", ASCII value=" + eChar + ")");
		if ( keyCode >= 37 && keyCode <= 40 ) {
			control_direction[ keyCode - 37 ] = 1;
		
		} else if ( keyCode == 90 ) {

			fireon = 1;

		}

		
	}


	//----
	function keyUpEvent(evt) {

   		//var eType = evt.type; 
   		var keyCode = evt.which?evt.which:evt.keyCode; 
		
		//var eCode = 'keyCode is ' + keyCode;
		//var eChar = 'charCode is ' + String.fromCharCode(keyCode); // or evt.charCode
		//console.log("Captured Event (type=" + eType + ", key Unicode value=" + eCode + ", ASCII value=" + eChar + ")");
		
		if ( keyCode >= 37 && keyCode <= 40 ) {
			control_direction[ keyCode - 37 ] = 0;
		
		} else if ( keyCode == 77 ) {

			if ( mp3bgmusic.paused ) {
				mp3bgmusic.play();
			} else {
				mp3bgmusic.pause();
			}
		
		} else if ( keyCode == 90 ) {

			wavwow.play();
			firebullet();

			fireon = 0;
		} 

		

	}

	//-------
	function loadcomplete() {

		resource_loaded += 1;
		
		if ( resource_loaded == total_resource ) {

			mp3bgmusic.play();
			setTimeout( onTimer, timerinterval );
		} else {
			loading_screen();
		}
	}

	//--
	function loading_screen() {

		var percent_complete = (resource_loaded * 100.0 / total_resource).toFixed(2);
		ctxt.clearRect( 0,0,600,600 );
		ctxt.fillText( "Loading Resources . " + percent_complete + "% loaded" , 200, 300);
		
	}


	//---
	function move_enemies(i) {

		var offy  = enemies[i]["ty"] - enemies[i]["y"];
		var offx  = enemies[i]["tx"] - enemies[i]["x"];

		if ( offx * offx + offy * offy > 1600 ) {

			enemies[i]["x"] += offx / 40;
			enemies[i]["y"] += offy / 40;	
		
		} else {

			enemies[i]["tx"] = rand(640) - 20;
			enemies[i]["ty"] = rand(640) - 20;	
		}

	}




	//----
	function onDraw() {

		offset_y = altitude % 600;


		for ( i = -3 ; i < 4 ; i++ ) {
			for ( j = 0 ; j < 3 ; j++ ) {

				ctxt.drawImage( imgbgstars[ speed > 14 ? 1: 0 ] , 0 , 0 , 200 , 200 , 
					j * 200  , i * 200 + offset_y , 200 ,200 );
			}
		}



		ctxt.drawImage( imgrocketfire[tick % 3 ] , 0 , 0 , 100 , 150 , 
			player_x - player_width /3.4 , player_y + player_height/4, 100,100 );



		ctxt.drawImage( imgrocket , 0 , 0 , player_width , player_height , 
			player_x - player_width/2, player_y - player_height/2, player_width, player_height );


		



		// text
		if ( autorapidfire > 0 ) {
			ctxt.fillText( "Rapid Fire : " + autorapidfire , 480, 515);
		
		}
		if ( hyperon > 0 ) {
			ctxt.fillText( "Hyper Mode : " +  hyperon , 480, 530);
		
		}

		
		ctxt.fillText( "Fire Rate : " +  (1000/ autofireinterval).toFixed(2)  , 480, 545);
		ctxt.fillText( "Power : " +  bullet_size , 480, 560);
		ctxt.fillText( "Speed : " +  speed  , 480, 575);
		
		if ( coinval < 10000000.0 ) {
			ctxt.fillText( "$ : " +  ( coinval / 10000000.0 ).toFixed(8) , 480, 590);
		} else {
			ctxt.fillText( "You won. You can stop anytime now! "  , 350, 590);
		}





		
		for ( i = 0 ; i < maxbullet ; i++ ) {
			
			if ( bullets[i]["active"] == 1 ) {
				
				ctxt.drawImage( imgdoge[0], 0,0,40,40,
					bullets[i]["x"] - bullet_size/2, 
					bullets[i]["y"] - bullet_size/2, 
					bullet_size,
					bullet_size   );

			}
		}

		for ( i = 0 ; i < maxenemy ; i++ ) {

			if ( enemies[i]["active"] == 1 ) {
				
				var isboss = enemies[i]["isboss"];
				var size = isboss? 64 :32  ;
				var halfsize = size/2 ;

				ctxt.drawImage( imgaltcoin, 
					(getenemysrcx( enemies[i]["type"]) + enemies[i]["frame"]) * 64,
					getenemysrcy( enemies[i]["type"]) * 64,
					64,
					64,
					enemies[i]["x"] - halfsize, 
					enemies[i]["y"] - halfsize, 
					size,
					size   );

			
			}
		}

		for ( i = 0 ; i < maxexplosion ; i++ ) {

			if ( explosion[i]["active"] == 1 ) {
				
				ctxt.drawImage( imgexplosion, 
					(explosion[i]["frame"] % 6) * 64,
					( Math.floor( explosion[i]["frame"] / 6) ) * 64,
					64,
					64,
					explosion[i]["x"] - 32, 
					explosion[i]["y"] - 32, 
					64,
					64   );

			}
		}



		
  		ctxt.font = "14px Helvetica";
  		

		for ( i = 0 ; i < maxbonus ; i++ ) {

			if ( bonuses[i]["active"] > 0 ) {
				
				if ( bonuses[i]["type"] == 0 ) {
					
					ctxt.fillStyle = "#00ffff";
					ctxt.fillText( "Such speed" , bonuses[i]["x"], bonuses[i]["y"]);
				
				} else if  ( bonuses[i]["type"] == 1 ) {
					
					ctxt.fillStyle = "#00ffff";
					ctxt.fillText( "Much power" , bonuses[i]["x"], bonuses[i]["y"]);
				
				} else if ( bonuses[i]["type"] == 2 ) {

					ctxt.fillStyle = "#00ff00";
					ctxt.fillText( "So Hyper" , bonuses[i]["x"], bonuses[i]["y"]);
					
				} else if ( bonuses[i]["type"] == 3 ) {

					ctxt.fillStyle = "#ff00bb";
					ctxt.fillText( "So Auto" , bonuses[i]["x"], bonuses[i]["y"]);

				} else if ( bonuses[i]["type"] == 4 ) {

					ctxt.fillStyle = "#ffff00";
					ctxt.fillText( "Very Rapid" , bonuses[i]["x"], bonuses[i]["y"]);
				}				

			}
		}

		ctxt.fillStyle = "white";
  		ctxt.font = "12px Helvetica";
  			

	}


	//----
	function onTimer() {

		var capmovement_speed = speed;
		if ( capmovement_speed > 18 ) {
			capmovement_speed = 18;
		}


		if ( tick % autofireinterval == 1 ) {
			if ( fireon == 1 ) {
				wavwow.play();
				firebullet();
			}	
		}


		if ( control_direction[0] == 1  ) {
			
			if ( player_x > 0 ) {
				player_x -= capmovement_speed;
			}


		
		} else if ( control_direction[2] == 1  ) {
			
			if ( player_x < 600 ) {
				player_x += capmovement_speed;
			}
			
		}

		if ( control_direction[1] == 1  ) {
			
			if ( player_y > 0 ) {
				player_y -= capmovement_speed;
			}

		} else if ( control_direction[3] == 1  ) {
			
			if ( player_y < 600 ) {
				player_y += capmovement_speed;
			}
		}



		if ( tick % 3000 == 0 ) {
		
			release_enemies(15);
			enemytypeupgrade = (enemytypeupgrade + 1) % 16;


		} else if ( tick % 2700 == 0 ) {
		
			release_enemies(10);

		} else if ( tick % 2600  == 0 ) {

			//Boss
			createenemies( rand(600),  rand(20) , enemytypeupgrade , 1) ;

		} else if ( tick % 1800 == 0 ) {

			release_enemies(5);

		} else if ( tick % 1000 == 0 ) {
			
			release_enemies(3);

			if ( enemytypeupgrade < 12 ) {
				createenemies( rand(600),  rand(20) , rand(3) + enemytypeupgrade , 0) ;
			}

		} else if( tick % 650 == 0 ) {
			release_enemies(2);

		} else if( tick % 250 == 0 ) {
			release_enemies(1);
	
		}

		if ( tick % 6666 == 0 ) { 
			release_nyancat(1);
		}


		// occasional bonus
		if ( tick % 4000 == 0 ) {
			createbonuses( bullets[i]["x"], bullets[i]["y"], 3 );
		}



		for ( i = 0 ; i < maxbullet ; i++ ) {
			
			if ( bullets[i]["active"] == 1 ) {
				
				bullets[i]["y"] -= bullet_forwardspeed;
				
				if  ( bullets[i]["y"] < -100 ) {
					bullets[i]["active"] = 0;
				

				// hit enemy
				} else if ( ( enemy_i = checkCollisionWithEnemies(i) ) != -1 ) {

					bullets[i]["active"] = 0;
					createexplosion( bullets[i]["x"], bullets[i]["y"]);
					
					enemies[enemy_i]["life"] -=  bullet_size + 1;

					if ( enemies[enemy_i]["life"] <= 0 ) {
						
						enemies[enemy_i]["active"] = 0;
						
						if (enemies[enemy_i]["isboss"] == 1 ) {

							coinval += Math.pow( enemies[enemy_i]["type"], 5 ) * 5 + 40000;
						
						} else {
							coinval += Math.pow( enemies[enemy_i]["type"], 3 ) * 5 + 10000;
						
						}

						// reward bonus
						if ( rand(10) < 4 ) { 
							
							createbonuses( bullets[i]["x"], bullets[i]["y"], rand(2) );
						
						} else if ( rand(25) < 1 ) { 
							createbonuses( bullets[i]["x"], bullets[i]["y"], 4 );
						
						} else if ( rand(30) < 1 ) { 
							createbonuses( bullets[i]["x"], bullets[i]["y"], 2 );
						
						} else if ( rand(30) < 1 ) { 
							createbonuses( bullets[i]["x"], bullets[i]["y"], 3 );
						}
					}
				}

			} 
		}
		

		for ( i = 0 ; i < maxenemy ; i++ ) {

			if ( enemies[i]["active"] == 1 ) {
				
				move_enemies(i);

				if ( enemies[i]["type"] == 17 ) {
					enemies[i]["frame"] = (enemies[i]["frame"] + 1 )% 6;
				}
				
				// CRASH
				if ( checkCollisionWithPlayers(i) == 1 ) {
					

					coinval = coinval /  (int_div(enemies[i]["type"],2)  + 1 )  ;
		
					createexplosion(player_x, player_y);
					enemies[i]["active"] = 0;
				
					addpower(-1);
					addspeed(-1);
					addrapidfire(-1);
					

				}

				
			}
		}

		if ( tick % 2 == 1 ) {
			for ( i = 0 ; i < maxexplosion ; i++ ) {

				if ( explosion[i]["active"] == 1 ) {
					
					explosion[i]["frame"] += 1;
					if ( explosion[i]["frame"] >= 15 ) {
						explosion[i]["active"] = 0;
					}
				}
			}

			// Eat bonus
			for ( i = 0 ; i < maxbonus ; i++ ) {

				if ( bonuses[i]["active"] > 0 ) {
					
					bonuses[i]["active"] -= 1;
					bonuses[i]["y"] += 2;

					// Eat bonus
					if ( checkBonusCollisionWithPlayers( i ) == 1 ) {

						if ( bonuses[i]["type"] == 0 ) {
							
							addspeed(1);
						
						} else if ( bonuses[i]["type"] == 1 ) {
							
							addpower(1);

						
						} else if ( bonuses[i]["type"] == 2 ) {
							
							
							
							if ( hyperon <= 0 ) {
								
								valdump[0] = speed;
								valdump[1] = bullet_size;

								speed = maxspeed;
								bullet_size = max_bullet_size;

							}
							hyperon = 600;
								


						} else if ( bonuses[i]["type"] == 3 ) {

							if ( autorapidfire <= 0 ) {
								valdump[2] = autofireinterval;
								autofireinterval = 3;
							}
							autorapidfire = 1000;
							
						
						} else if ( bonuses[i]["type"] == 4 ) {
							
							addrapidfire(1);

						} 

						
						bonuses[i]["active"] = 0;
						wavcollect.play();

					}
				}

			}			
		}	

		if ( hyperon > 0 ) {
			hyperon -= 1 ;
			if ( hyperon <= 0 ) {

				speed = valdump[0];
				bullet_size = valdump[1];
			}
		}

		if ( autorapidfire > 0 ) {
			autorapidfire -= 1;
			if ( autorapidfire <= 0 ) {
				autofireinterval = valdump[2];
			}
		}

		capspeed = speed * 4;
		if ( capspeed > 18 ) {
			capspeed = 18;
		}
		altitude += capspeed;
		coinval += speed * 4;


		tick += 1;

		onDraw();
		setTimeout( onTimer , timerinterval );
	}

	//------
	function rand( x ) {

		return Math.floor( Math.random() * x );

	}


	//---
	function release_enemies( n) {

		for ( var i = 0 ; i < n && i < maxenemy; i++ ) {

			var enemytype = enemytypeupgrade;
			if ( enemytypeupgrade > 15 ) {
				enemytype = rand(15);
			}

			createenemies( rand(600), 0 , enemytype , 0 ) ;
			
		}

	}

	function release_nyancat( n ) { 

		for ( var i = 0 ; i < n && i < maxenemy; i++ ) {

			createenemies( 0, rand(400) , 17 , 1 ) ;
			var nyancatindex = (enemyindex + maxenemy) % maxenemy - 1;
			enemies[nyancatindex]["ty"] = enemies[nyancatindex]["y"];
			enemies[nyancatindex]["tx"] = 680;

		}
	}



