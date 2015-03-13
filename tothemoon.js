

	

	function ToTheMoon() {

		this.init = function() {

			var ttm = this;
		

			if (window.top !== window.self) { 
				window.top.location.replace(window.self.location.href);
			}

			this.max_speed = 40;
			this.minspeed = 4;
			
			this.max_bullet_size = 40;
			this.min_bullet_size = 10;
			this.maxfireinterval = 20;
			this.minfireinterval = 3;
			this.bullet_forwardspeed = 20;
			
			this.resource_loaded 	= 0;
			this.total_resource 	= 6;
			
			this.control_direction 	= [];
			this.timerinterval 		= 20;
			
			this.player = {}
			this.player.width = 128;
			this.player.height = 128;
			this.bullets = [];
			this.maxbullet = 200;
			this.enemies = [];
			this.maxenemy = 100;
			this.explosion = [];
			this.maxexplosion = 100;
			this.explosionindex = 0;
			this.bonuses = [];
			this.maxbonus = 10;
			this.bonusindex = 0;
			this.valdump = [];
			this.explosion_queue = [];
			this.winningcriteria = 50000000.0;





			this.canvas = document.getElementById("cv");
			this.ctxt 	= this.canvas.getContext('2d');

			this.imgbgstars = new Image();
			this.imgbgstars.src = 'images/bgstars.png';
			this.imgbgstars.addEventListener('load', function() {

				ttm.loadcomplete();

			}, false);
			


			this.imgrocket = new Image();
			this.imgrocket.src = 'images/rocket.png';
			this.imgrocket.addEventListener('load', function() {
				
				ttm.loadcomplete();
				
			}, false);
			
			this.imgdoge = new Image();
			this.imgdoge.src = 'images/doge_40.png';
			this.imgdoge.addEventListener('load', function() {
				
				ttm.loadcomplete();
				
			}, false);
			
			this.imgrocketfire = new Image();
			this.imgrocketfire.src = 'images/rocketfire.png';
			this.imgrocketfire.addEventListener('load', function() {
				
				ttm.loadcomplete();
				
			}, false);
			


			this.imgaltcoin = new Image();
			this.imgaltcoin.src = 'images/altcoin_64.png';
			this.imgaltcoin.addEventListener('load', function() {
				
				ttm.loadcomplete();
				
			}, false);

			this.imgexplosion = new Image();
			this.imgexplosion.src = 'images/explosion.png';
			this.imgexplosion.addEventListener('load', function() {
				
				ttm.loadcomplete();
				
			}, false);
			

			this.wavwow 			= new Audio('sounds/wow.wav');
			this.wavexplosion 		= new Audio('sounds/explosion.wav');
			this.wavcollect 		= new Audio('sounds/collect.wav');
			this.mp3bgmusic 		= new Audio('sounds/bgmusicfull.mp3');
			this.sndMariofire 		 = new Audio("sounds/mariofire.wav");
			this.sndRapidfire 		= new Audio("sounds/rapidfire.wav");

		


			this.mp3bgmusic.loop 	= true;
			this.wavgameover 		= new Audio('sounds/gameover.wav');	


			this.tick 				= 1;
			this.ctxt.fillStyle 	= "white";
	  		this.ctxt.font 			= "12px Helvetica";

	  		for ( i = 0 ; i < this.maxbullet ; i++ ) {
	  			this.bullets[i] = { x : 0 , y : 0 , active: 0, owner: 0 , vx:0, vy:0 , size: this.min_bullet_size};
	  		}

	  		for ( i = 0 ; i < this.maxenemy ; i++ ) {
	  			this.enemies[i] = { 
	  							x: 0, 
	  							y: 0, 
	  							active: 0 , 
	  							type : this.rand(15),
	  							tx: 0,
	  							ty: 0,
	  							holdposition: 0,
	  							holdfire :0
	  						};
	  		}

	  		for ( i = 0 ; i < this.maxexplosion ; i++ ) {
	  			this.explosion[i] = {x:0,y:0,active:0,frame:0};
	  		}

	  		for ( i = 0 ; i < this.maxbonus ; i++ ) {
	  			this.bonuses[i] = { x:0, y:0 , active:0, type:0 };
	  		}

	  		document.addEventListener("keydown" , function( evt ) {
				ttm.keyDownEvent(evt);
			}, false );	

			
			document.addEventListener("keyup"   , function( evt ) {
				ttm.keyUpEvent(evt);
			}, false );	

			this.loading_screen();
		
		}





		//----
		this.addHP = function(x){

			this.player.hp += x;
			if ( this.player.hp > 800 ) {
				this.player.hp = 800;
			}
		}


		//------------
		this.addpower = function( x ) {

			if ( this.hyperon == 1 ) {

				this.valdump[1] += x;
				if ( this.valdump[1] > this.max_bullet_size ) {
					this.valdump[1] = this.max_bullet_size;	
				}
				if ( this.valdump[1] < this.min_bullet_size ) {
					this.valdump[1] = this.min_bullet_size;
				}
			} else {
				
				
				this.bullet_size += x;
				if ( this.bullet_size > this.max_bullet_size ) {
					this.bullet_size = this.max_bullet_size;	
				}
				if ( this.bullet_size < this.min_bullet_size ) {
					this.bullet_size = this.min_bullet_size;
				}
		
			}					
		}



		//---------
		this.addspeed = function( x ) {

			if ( this.hyperon == 1 ) {

				this.valdump[0] += x;
				if ( this.valdump[0] > this.max_speed ) {
					this.valdump[0] = this.max_speed;
				}
				if ( this.valdump[0] < this.minspeed ) {
					this.valdump[0] = this.minspeed;
				}

			} else {
				this.speed += x;
				if ( this.speed > this.max_speed ) {
					this.speed = this.max_speed;
				}
				if ( this.speed < this.minspeed ) {
					this.speed = this.minspeed;
				}			
			}
		}


		//----
		this.addrapidfire = function(x) {

			if ( this.autorapidfire > 0 ) {

				this.valdump[2] -= x;
				if ( this.valdump[2] > this.maxfireinterval) {
					this.valdump[2] = this.maxfireinterval;
				}
				if ( this.valdump[2] < this.minfireinterval ) {
					this.valdump[2] = this.minfireinterval;
				}

	 		} else {
	 			this.autofireinterval -= x;
				if ( this.autofireinterval > this.maxfireinterval) {
					this.autofireinterval = this.maxfireinterval;
				}
				if ( this.autofireinterval < this.minfireinterval ) {
					this.autofireinterval = this.minfireinterval;
				}			
			}
		}



		//-------
		this.animate_bonuses = function() {

			// Eat bonus
			for ( i = 0 ; i < this.maxbonus ; i++ ) {

				if ( this.bonuses[i].active > 0 ) {
					
					this.bonuses[i].active -= 1;
					this.bonuses[i].y += 2;

					// Eat bonus
					if ( this.checkBonusCollisionWithPlayers( i ) == 1 ) {

						if ( this.bonuses[i].type == 0 ) {
							
							this.addspeed(1);
						
						} else if ( this.bonuses[i].type == 1 ) {
							
							this.addpower(1);

						
						} else if ( this.bonuses[i].type == 2 ) {
							
							
							
							if ( this.hyperon <= 0 ) {
								
								this.valdump[0] = this.speed;
								this.valdump[1] = this.bullet_size;

								this.speed = this.max_speed;
								this.bullet_size = this.max_bullet_size;

							}
							this.hyperon = 600;
								


						} else if ( this.bonuses[i].type == 3 ) {

							if ( this.autorapidfire <= 0 ) {
								this.valdump[2] = this.autofireinterval;
								this.autofireinterval = 3;
							}
							this.autorapidfire = 1000;
							
						
						} else if ( this.bonuses[i].type == 4 ) {
							
							this.addrapidfire(1);

						}  else if ( this.bonuses[i].type == 5 ) {
							
							this.addHP( 100 );

						}

						
						this.bonuses[i].active = 0;
						this.wavcollect.play();

					}
				}

			}
		}



		//-----------------
		this.animate_bullets = function() {
			
			for ( i = 0 ; i < this.maxbullet ; i++ ) {
				
				if ( this.bullets[i].active == 1 ) {
					
					if ( this.bullets[i].owner == 0 ) {


						this.bullets[i].y -= this.bullet_forwardspeed;
						
						if  ( this.bullets[i].y < -100 ) {
							this.bullets[i].active = 0;
						

						// hit enemy
						} else if ( ( enemy_i = this.checkBulletCollisionWithEnemies(i) ) != -1 ) {

							this.bullets[i].active = 0;
							this.createexplosion( this.bullets[i].x, this.bullets[i].y);
							
							this.enemies[enemy_i].life -=  this.bullet_size + 1;

							if ( this.enemies[enemy_i].life <= 0 ) {
								
								this.enemies[enemy_i].active = 0;
								
								if (this.enemies[enemy_i].isboss == 1 ) {

									this.coinval += Math.pow( this.enemies[enemy_i].type, 5 ) * 5 + 40000;

									var t = 0.0;
									var r = 0.0;
									for ( var k = 0 ; k < 20 ; k++ ) {

										this.explosion_queue.push( {
											x: this.enemies[enemy_i].x + r * Math.cos(t), 
											y:  this.enemies[enemy_i].y + r * Math.sin(t),
											tick: 1
										});
														
										t += 0.5;
										r += 5.0;
									}
								
								} else {
									this.coinval += Math.pow( this.enemies[enemy_i].type, 3 ) * 5 + 10000;
								
								}

								// reward bonus when enemies die
								if ( this.rand(10) < 4 ) { 
									
									this.createbonuses( this.bullets[i].x, this.bullets[i].y, this.rand(2) );
								
								} else if ( this.rand(25) < 1 ) { 
									this.createbonuses( this.bullets[i].x, this.bullets[i].y, 4 );
								
								} else if ( this.rand(30) < 1 ) { 
									this.createbonuses( this.bullets[i].x, this.bullets[i].y, 2 );
								
								} else if ( this.rand(30) < 1 ) { 
									this.createbonuses( this.bullets[i].x, this.bullets[i].y, 3 );
								
								} 

								if ( this.rand( this.player.hp ) < 1 ) { 
									this.createbonuses( this.bullets[i].x, this.bullets[i].y, 5 );
								}
							}
						}
					

					} else { 
						
						// Enemy bullets
						this.bullets[i].y += this.bullets[i].vy;
						this.bullets[i].x += this.bullets[i].vx;


						if  ( this.bullets[i].y > this.canvas.height + 100  || 
							  this.bullets[i].y < -100 || 
							  this.bullets[i].x > this.canvas.width + 100 || 
							  this.bullets[i].x < -100  ) {

							this.bullets[i].active = 0;
						
						} else if ( this.checkBulletCollisionWithPlayer(i)  ) {
							
							this.createexplosion( this.player.x , this.player.y );
							this.player_take_hit( 2 );
							this.bullets[i].active = 0;
						
						}	

					}

				} 
			}
		}

		//--------
		this.animate_enemies = function() {

			for ( i = 0 ; i < this.maxenemy ; i++ ) {

				if ( this.enemies[i].active == 1 ) {
					
					this.animate_enemies_shooting(i);	
					this.move_enemies(i);

					if ( this.enemies[i].type == 17 ) {
						this.enemies[i].frame = (this.enemies[i].frame + 1 )% 6;
					}
					
					// CRASH
					if ( this.checkEnemiesCollisionWithPlayers(i) == 1 ) {
						

						this.createexplosion(this.player.x, this.player.y);
						this.enemies[i].active = 0;
						this.addpower(-1);
						this.addspeed(-1);
						this.addrapidfire(-1);
						

					}

					
				}
			}
		}

		//---------
		this.animate_enemies_shooting = function(i) {

			if ( this.enemies[i].active == 1 && this.enemies[i].isboss == 1 && this.enemies[i].type != 17 ) {
				
				if ( this.enemies[i].holdfire > 0 ) {
					this.enemies[i].holdfire -= 1;
				
				} else {

					if ( this.enemies[i].type < 9 ) {
						var firing_type = this.enemies[i].type ;
					} else {
						var firing_type = this.rand(9);
					}


					if ( firing_type == 0 ) {
						
						if ( this.tick % 20 == 0 ) {	
							
							this.bullets[this.bulletindex].x =  this.enemies[i].x;
							this.bullets[this.bulletindex].y =  this.enemies[i].y;
							this.bullets[this.bulletindex].vx = 0 ;
							this.bullets[this.bulletindex].vy = 5 ;
							this.bullets[this.bulletindex].active = 1;
							this.bullets[this.bulletindex].owner = 1;
							this.bullets[this.bulletindex].size = this.min_bullet_size;
							this.bulletindex = (this.bulletindex + 1) % this.maxbullet ;

							
						
						} 
					
					} else if (firing_type == 1 ) {


						if ( this.tick % 40 == 0 ) {	
							
							for ( k = 0 ; k < 3 ; k++ ) {	
							
								this.bullets[this.bulletindex].x =  this.enemies[i].x;
								this.bullets[this.bulletindex].y =  this.enemies[i].y;
								this.bullets[this.bulletindex].vx = ( k * 5 ) - 5; 
								this.bullets[this.bulletindex].vy = 15 ;
								this.bullets[this.bulletindex].active = 1;
								this.bullets[this.bulletindex].owner = 1;
								this.bullets[this.bulletindex].size = this.min_bullet_size;
								this.bulletindex = (this.bulletindex + 1) % this.maxbullet ;
								
							}
						} 

					} else if ( firing_type == 2 ) {


						if ( this.tick % 40 == 0 ) {	
							
							var t = 0;

							for ( k = 0 ; k < 8 ; k++ ) {	
							
								this.bullets[this.bulletindex].x =  this.enemies[i].x;
								this.bullets[this.bulletindex].y =  this.enemies[i].y;
								
								this.bullets[this.bulletindex].vx = 5 * Math.sin(t); 
								this.bullets[this.bulletindex].vy = 5 * Math.cos(t);
								
								this.bullets[this.bulletindex].active = 1;
								this.bullets[this.bulletindex].owner = 1;
								this.bullets[this.bulletindex].size = this.min_bullet_size;
								this.bulletindex = (this.bulletindex + 1) % this.maxbullet ;
								
								t += 0.8;
							}

							if ( this.enemies[i].holdposition == 0 ) {
								this.enemies[i].holdposition = 80;
							}

						} 


					} else if ( firing_type == 3 ) {


						if ( this.tick % 5 == 0 ) {	
							
							if ( this.rand(2) % 2 == 0 ) {
								this.bullets[this.bulletindex].x =  this.enemies[i].x;
								this.bullets[this.bulletindex].y =  this.enemies[i].y;
								this.bullets[this.bulletindex].vx = 0 ;
								this.bullets[this.bulletindex].vy = 5 ;
								this.bullets[this.bulletindex].active = 1;
								this.bullets[this.bulletindex].owner = 1;
								this.bullets[this.bulletindex].size = this.min_bullet_size;
								this.bulletindex = (this.bulletindex + 1) % this.maxbullet ;
							}
						} 

					


					} else if ( firing_type == 4 ) {


						if ( this.tick % 30 == 0 ) {	
							
							var t = 0;

							for ( k = 0 ; k < 16 ; k++ ) {	
							
								this.bullets[this.bulletindex].x =  this.enemies[i].x;
								this.bullets[this.bulletindex].y =  this.enemies[i].y;
								
								this.bullets[this.bulletindex].vx = 5 * Math.sin(t); 
								this.bullets[this.bulletindex].vy = 5 * Math.cos(t);
								
								this.bullets[this.bulletindex].active = 1;
								this.bullets[this.bulletindex].owner = 1;
								this.bullets[this.bulletindex].size = this.min_bullet_size;
								this.bulletindex = (this.bulletindex + 1) % this.maxbullet ;
								
								t += 0.4;
							}

							if ( this.enemies[i].holdposition == 0 ) {
								this.enemies[i].holdposition = 80;
							}

						} 
						
					} else if ( firing_type == 5 ) {


						if ( this.tick % 20 == 0 ) {	
							
							for ( k = 0 ; k < 5 ; k++ ) {	
							
								this.bullets[this.bulletindex].x =  this.enemies[i].x;
								this.bullets[this.bulletindex].y =  this.enemies[i].y;
								this.bullets[this.bulletindex].vx = ( k * 5 ) - 12; 
								this.bullets[this.bulletindex].vy = 15 ;
								this.bullets[this.bulletindex].active = 1;
								this.bullets[this.bulletindex].owner = 1;
								this.bullets[this.bulletindex].size = this.min_bullet_size;
								this.bulletindex = (this.bulletindex + 1) % this.maxbullet ;
								
							}

							if ( this.enemies[i].holdposition == 0 ) {
								this.enemies[i].holdposition = 80;
							}
						} 	


					} else if ( firing_type == 6 ) {


						if ( this.tick % 10 == 0 ) {	
							
							
							
							this.bullets[this.bulletindex].x =  this.enemies[i].x;
							this.bullets[this.bulletindex].y =  this.enemies[i].y;
							this.bullets[this.bulletindex].vx = ( this.player.x - this.enemies[i].x ) / 40 ; 
							this.bullets[this.bulletindex].vy = ( this.player.y - this.enemies[i].y ) / 40 ; 
							this.bullets[this.bulletindex].active = 1;
							this.bullets[this.bulletindex].owner = 1;
							this.bullets[this.bulletindex].size = this.min_bullet_size;
							this.bulletindex = (this.bulletindex + 1) % this.maxbullet ;
							
							
							if ( this.enemies[i].holdposition == 0 ) {
								this.enemies[i].holdposition = 100;
							}
						} 		

					

					} else if ( firing_type == 7 ) {


							
						if ( this.tick % 5 == 0 ) {	
							
							this.bullets[this.bulletindex].x =  this.enemies[i].x;
							this.bullets[this.bulletindex].y =  this.enemies[i].y;
							this.bullets[this.bulletindex].vx = 0 ;
							this.bullets[this.bulletindex].vy = 5 ;
							this.bullets[this.bulletindex].active = 1;
							this.bullets[this.bulletindex].owner = 1;
							this.bullets[this.bulletindex].size = this.min_bullet_size;
							this.bulletindex = (this.bulletindex + 1) % this.maxbullet ;

							
						
						} 							
								


					} else if ( firing_type == 8 ) {


						if ( this.tick % 10 == 0 ) {	
							
							var t = 0;

							for ( k = 0 ; k < 8 ; k++ ) {	
							
								this.bullets[this.bulletindex].x =  this.enemies[i].x;
								this.bullets[this.bulletindex].y =  this.enemies[i].y;
								
								this.bullets[this.bulletindex].vx = 5 * Math.sin(t); 
								this.bullets[this.bulletindex].vy = 5 * Math.cos(t);
								
								this.bullets[this.bulletindex].active = 1;
								this.bullets[this.bulletindex].owner = 1;
								this.bullets[this.bulletindex].size = this.min_bullet_size;
								this.bulletindex = (this.bulletindex + 1) % this.maxbullet ;
								
								t += 0.8;
							}

							if ( this.enemies[i].holdposition == 0 ) {
								this.enemies[i].holdposition = 280;
							}

						} 

					
					
	

					}

				}
				
			}
			
			
		}


		//----
		this.animate_explosions = function() {

			for ( i = 0 ; i < this.maxexplosion ; i++ ) {
				if ( this.explosion[i].active == 1 ) {
					
					if ( this.tick % 2 == 1 ) {
					
						this.explosion[i].frame += 1;
						if ( this.explosion[i].frame >= 15 ) {
							this.explosion[i].active = 0;
						}
					}
				}
			}
		}

		//-------
		this.animate_player = function() {

			var capmovement_speed = this.speed;
			if ( capmovement_speed > 18 ) {
				capmovement_speed = 18;
			}


			if ( this.tick % this.autofireinterval == 1 ) {
				if ( this.fireon == 1 ) {
					this.firebullet();

					if (this.autofireinterval < 5 ) {
						this.sndRapidfire.play();
					} else {
						this.sndMariofire.play();
					}
				}	
			}


			if ( this.control_direction[0] == 1  ) {
				
				if ( this.player.x > 0 ) {
					this.player.x -= capmovement_speed;
				}


			
			} else if ( this.control_direction[2] == 1  ) {
				
				if ( this.player.x < this.canvas.width ) {
					this.player.x += capmovement_speed;
				}
				
			}

			if ( this.control_direction[1] == 1  ) {
				
				if ( this.player.y > 0 ) {
					this.player.y -= capmovement_speed;
				}

			} else if ( this.control_direction[3] == 1  ) {
				
				if ( this.player.y <  this.canvas.height ) {
					this.player.y += capmovement_speed;
				}
			}
		}




		//-------------------------
		this.animate_release_enemies = function() {

			if ( this.tick % 3000 == 0 ) {
			
				this.release_enemies(15);
				this.enemytypeupgrade = (this.enemytypeupgrade + 1) % 17;


			} else if ( this.tick % 2700 == 0 ) {
			
				this.release_enemies(10);

			} else if ( this.tick % 2600  == 0 ) {

				//Boss
				this.createenemies( this.rand( this.canvas.width),  this.rand(20) , this.enemytypeupgrade , 1) ;

			} else if ( this.tick % 1800 == 0 ) {

				this.release_enemies(5);

			} else if ( this.tick % 1000 == 0 ) {
				
				this.release_enemies(3);

				if ( this.enemytypeupgrade < 12 ) {
					this.createenemies( this.rand( this.canvas.width),  this.rand(20) , this.rand(3) + this.enemytypeupgrade , 0) ;
				}

			} else if( this.tick % 650 == 0 ) {
				this.release_enemies(2);

			} else if( this.tick % 250 == 0 ) {
				this.release_enemies(1);
		
			}

			if ( this.tick % 6666 == 0 ) { 
				this.release_nyancat(1);
			}
		}



		//-----
		this.checkBulletCollisionWithEnemies = function( bi ) {

			for (var i = 0 ; i < this.maxenemy ; i++ ) {

				if ( this.enemies[i].active == 1 ) {
				
					var diffx = this.enemies[i].x - this.bullets[bi].x ;
					var diffy = this.enemies[i].y - this.bullets[bi].y ;

					if ( diffx * diffx + diffy * diffy < 1024 ) {
						return i;
					}
				}
			}
			return -1;

		}

		//-----
		this.checkBulletCollisionWithPlayer = function( bi ) {

			var diffx = this.player.x - this.bullets[bi].x ;
			var diffy = this.player.y - this.bullets[bi].y ;

			if ( diffx * diffx + diffy * diffy < 2500 ) {
				return 1;
			}
			return 0;

		}

		//----------
		this.player_take_hit = function( damage ) {

			this.player.hp -= damage ;
			if ( this.player.hp <= 0 ) {
			
				this.player.hp = 0;
				this.mp3bgmusic.pause();
				this.wavgameover.play();

				var t = 0.0;
				var r = 1.0;
				
				for ( var i = 0 ; i < 40 ; i++ ) {

					this.createexplosion( this.player.x + this.rand(50) - 25 , this.player.y + this.rand(50) - 25  );
					this.explosion_queue.push( {
						x:this.player.x + r * Math.cos(t), 
						y:this.player.y + r * Math.sin(t),
						tick: this.rand(2)
					});
							
					t += 0.5;
					r += 5.0;
				}

			}

		}

		//---
		this.checkEnemiesCollisionWithPlayers = function( ei ) {

			var diffx = this.enemies[ei].x - this.player.x;
			var diffy = this.enemies[ei].y - this.player.y;
			if ( diffx * diffx + diffy * diffy < 2304 ) {

				this.player_take_hit(   10 + ( this.enemies[ei].type * 1.8 >> 0 )   );

				return 1;
			}
			return 0;
		}

		//----
		this.checkBonusCollisionWithPlayers = function( bi ) {

			var diffx = this.bonuses[bi].x - this.player.x;
			var diffy = this.bonuses[bi].y - this.player.y;
			if ( diffx * diffx + diffy * diffy < 3304 ) {
				return 1;
			}
			return 0;
		}


		//--
		this.createbonuses = function( x,y,type) {

			this.bonuses[this.bonusindex].x = x;
			this.bonuses[this.bonusindex].y = y;
			this.bonuses[this.bonusindex].type = type;
			this.bonuses[this.bonusindex].active = 250;

			this.bonusindex = (this.bonusindex + 1) % this.maxbonus;
		}



		//---
		this.createenemies = function( x,y, type , isboss ) {

			this.enemies[this.enemyindex].x = x;
			this.enemies[this.enemyindex].y = y;
			this.enemies[this.enemyindex].type = type;
			this.enemies[this.enemyindex].active = 1;
			this.enemies[this.enemyindex].tx = this.rand( this.canvas.width );
			this.enemies[this.enemyindex].isboss = isboss;
			this.enemies[this.enemyindex].ty = this.rand( this.canvas.height - 200 );
			this.enemies[this.enemyindex].frame = 0;
			

			if ( type > 13 ) {
				this.enemies[this.enemyindex].life = type * 11;
			} else if ( type > 10 ) {
				this.enemies[this.enemyindex].life = type * 8 ;
			} else if ( type > 5 ) {
				this.enemies[this.enemyindex].life = type * 9 ;
			} else {
				this.enemies[this.enemyindex].life = type * 8 ;
			}

			if ( isboss	 == 1 ) {
				this.enemies[this.enemyindex].life *= 8;
				this.enemies[this.enemyindex].life += 300;
				
			}

				
			this.enemyindex = (this.enemyindex + 1) % this.maxenemy;
		}



		//------
		this.createexplosion = function( x,y ) {

			this.explosion[this.explosionindex].x = x;
			this.explosion[this.explosionindex].y = y;
			this.explosion[this.explosionindex].active = 1;
			this.explosion[this.explosionindex].frame = 0;
			
			this.explosionindex = ( this.explosionindex + 1 )  % this.maxexplosion;
			this.wavexplosion.play();
		}

		//--------
		this.firebullet = function() {

			this.bullets[this.bulletindex].x = this.player.x;
			this.bullets[this.bulletindex].y = this.player.y + 30;
			this.bullets[this.bulletindex].active = 1;
			this.bullets[this.bulletindex].owner = 0;
			this.bullets[this.bulletindex].size = this.bullet_size;

			this.bulletindex = (this.bulletindex + 1) % this.maxbullet ;
		}

		//--------
		this.getenemysrcx = function( type ) {

			return [4,3,1,0, 9,8,7,6,  5,5,4,3,  2,1,0,0, 6, 0][type];
		}

		this.getenemysrcy = function( type ) {

			return [1,1,1,1, 0,0,0,0,  0,1,0,0,  0,0,0,0, 1, 2][type];
		}

		
		this.int_div = function( x , y ) {
			return Math.floor( x / y );
		}


		//----
		this.keyDownEvent = function(evt) {
	    	
	    	var keyCode = evt.which?evt.which:evt.keyCode; 
			
			if ( keyCode >= 37 && keyCode <= 40 ) {
				this.control_direction[ keyCode - 37 ] = 1;
			
			} else if ( keyCode == 80 ) {

				this.reinit_game();

			} else if ( keyCode == 90 ) {
				this.sndMariofire.play();
				this.fireon = 1;
			}
		}


		//----
		this.keyUpEvent = function(evt) {

	   		var keyCode = evt.which?evt.which:evt.keyCode; 
			
			if ( keyCode >= 37 && keyCode <= 40 ) {
				
				this.control_direction[ keyCode - 37 ] = 0;
			
			} else if ( keyCode == 77 ) {

				if ( this.mp3bgmusic.paused ) {
					this.mp3bgmusic.play();
				} else {
					this.mp3bgmusic.pause();
				}
			
			} else if ( keyCode == 90 ) {

				if ( this.player.hp > 0 ) {
					this.firebullet();
					this.fireon = 0;
				}
			} 
		}



		//-------
		this.loadcomplete = function() {

			var ttm = this;
			this.resource_loaded += 1;
			
			if ( this.resource_loaded == this.total_resource ) {

				this.reinit_game();
				this.mp3bgmusic.play();

				setTimeout( function() {
					ttm.onTimer();
				}, this.timerinterval );
			
			} else {
				this.loading_screen();
			}
		}



		//------	
		this.loading_screen = function() {


			var percent_complete = (this.resource_loaded * 100.0 / this.total_resource).toFixed(2);
			
			this.ctxt.clearRect( 0,0,this.canvas.width,this.canvas.height );

			this.ctxt.fillText( "Loading Resources . " + percent_complete + "% loaded" , this.canvas.width / 2 - 100, this.canvas.height / 2 );
			
		}


		//---
		this.move_enemies = function(i) {

			var offy  = this.enemies[i].ty - this.enemies[i].y;
			var offx  = this.enemies[i].tx - this.enemies[i].x;

			if ( offx * offx + offy * offy > 1600 ) {

				if ( this.enemies[i].holdposition > 0 ) {
					this.enemies[i].holdposition -= 1;

					if ( this.enemies[i].holdposition == 0 ) {
						this.enemies[i].holdfire = 90;
					}

				} else {
					this.enemies[i].x += offx / 40;
					this.enemies[i].y += offy / 40;	
				}
			} else {

				this.enemies[i].tx = this.rand(this.canvas.width + 40 ) - 20;
				this.enemies[i].ty = this.rand(this.canvas.height + 40 ) - 20;	
			}	

		}




		//----
		this.onDraw = function() {

			var offset_y = this.altitude % this.canvas.height;


			for ( i = -3 ; i < this.canvas.height / 200 + 1 ; i++ ) {
				for ( j = 0 ; j < this.canvas.width / 200 + 1 ; j++ ) {

					this.ctxt.drawImage( 
							this.imgbgstars , 
								this.speed > 14 ? 200 : 0  , 
								0 , 
						200 , 200 , 
							j * 200  , 
							i * 200 + offset_y , 
						200 ,200 );
				}
			}


			if ( this.player.hp > 0 ) {

				this.ctxt.drawImage( this.imgrocketfire , 
						( this.tick % 3 ) * 100, 
						0 , 
						100 , 
						150 ,

					this.player.x - this.player.width /2.8 , 
					this.player.y + this.player.height/4, 
						100 , 
						150 );



				this.ctxt.drawImage( this.imgrocket , 
						0 , 0 , 
						this.player.width , 
						this.player.height , 
					this.player.x - this.player.width/2, 
					this.player.y - this.player.height/2, 
						this.player.width, this.player.height );


			
				
				
				for ( i = 0 ; i < this.maxbullet ; i++ ) {
					
					if ( this.bullets[i].active == 1 ) {
						
						if ( this.bullets[i].owner == 0 ) {
							this.ctxt.drawImage( this.imgdoge, 
									0,0,40,40,
								this.bullets[i].x - this.bullet_size/2, 
								this.bullets[i].y - this.bullet_size/2, 
								this.bullets[i].size,
								this.bullets[i].size   );
						
						} else {
						
								this.ctxt.drawImage( this.imgaltcoin,
								   64 * 7,
								   64 * 1,
								   64,64,
								this.bullets[i].x - this.bullet_size/2, 
								this.bullets[i].y - this.bullet_size/2, 
								this.bullets[i].size,
								this.bullets[i].size  ); 

						}	

					}
				}

				for ( i = 0 ; i < this.maxenemy ; i++ ) {

					if ( this.enemies[i].active == 1 ) {
						
						var isboss = this.enemies[i].isboss;
						var size = isboss? 64 :32  ;
						var halfsize = size/2 ;

						this.ctxt.drawImage( this.imgaltcoin, 
							( this.getenemysrcx( this.enemies[i].type) + this.enemies[i].frame) * 64,
							this.getenemysrcy( this.enemies[i].type) * 64,
							64,
							64,
							this.enemies[i].x - halfsize, 
							this.enemies[i].y - halfsize, 
							size,
							size   );

					
					}
				}

				



				
		  		this.ctxt.font = "14px Comic Sans MS";
		  		
		  		// Draw floating bonuses
				for ( i = 0 ; i < this.maxbonus ; i++ ) {

					if ( this.bonuses[i].active > 0 ) {
						
						if ( this.bonuses[i].type == 0 ) {
							
							this.ctxt.fillStyle = "#00ffff";
							this.ctxt.fillText( "Such speed" , this.bonuses[i].x, this.bonuses[i].y);
						
						} else if  ( this.bonuses[i].type == 1 ) {
							
							this.ctxt.fillStyle = "#00ffff";
							this.ctxt.fillText( "Much power" , this.bonuses[i].x, this.bonuses[i].y);
						
						} else if ( this.bonuses[i].type == 2 ) {

							this.ctxt.fillStyle = "#00ff00";
							this.ctxt.fillText( "So Hyper" , this.bonuses[i].x, this.bonuses[i].y);
							
						} else if ( this.bonuses[i].type == 3 ) {

							this.ctxt.fillStyle = "#ff00bb";
							this.ctxt.fillText( "So Auto" , this.bonuses[i].x, this.bonuses[i].y);

						} else if ( this.bonuses[i].type == 4 ) {

							this.ctxt.fillStyle = "#ffff00";
							this.ctxt.fillText( "Very Rapid" , this.bonuses[i].x, this.bonuses[i].y);
						
						} else if ( this.bonuses[i].type == 5 ) {

							this.ctxt.fillStyle = "#ff0000";
							this.ctxt.fillText( "Wow HP" , this.bonuses[i].x, this.bonuses[i].y);
							
						}					

					}
				}

			} else {

				this.ctxt.fillStyle = "white";
				this.ctxt.font = "20px Comic Sans MS";
				this.ctxt.fillText( "Press P to play again!" , this.canvas.width/ 2 - 100 , this.canvas.height / 2 );

			}


			for ( i = 0 ; i < this.maxexplosion ; i++ ) {

				if ( this.explosion[i].active == 1 ) {
					
					this.ctxt.drawImage( this.imgexplosion, 
						(this.explosion[i].frame % 6) * 64,
						( Math.floor( this.explosion[i].frame / 6) ) * 64,
						64,
						64,
						this.explosion[i].x - 32, 
						this.explosion[i].y - 32, 
						64,
						64   );

				}
			}

			if ( this.explosion_queue.length > 0 ) {

				this.explosion_queue[0].tick -= 1;
				if ( this.explosion_queue[0].tick <= 0 ) {
					var explosion = this.explosion_queue.shift();
					this.createexplosion( explosion.x , explosion.y );
				}
			}



			this.ctxt.fillStyle = "white";
	  		this.ctxt.font = "12px Comic Sans MS";
	  		// text


			if ( this.autorapidfire > 0 ) {
				this.ctxt.fillText( "Rapid Fire : " + this.autorapidfire  , this.canvas.width - 120, this.canvas.height - 100);
			
			}
			if ( this.hyperon > 0 ) {
				this.ctxt.fillText( "Hyper Mode : " +  this.hyperon  , this.canvas.width - 120, this.canvas.height - 85);
			
			}

			this.ctxt.fillStyle = "#ff00a2";

			this.ctxt.fillText( "HP: " + this.player.hp , this.canvas.width - 120 , this.canvas.height - 70 );
			this.ctxt.fillStyle = "white";

			this.ctxt.fillText( "Fire Rate : " +  (1000/ this.autofireinterval).toFixed(2)  , this.canvas.width - 120, this.canvas.height - 55);
			this.ctxt.fillText( "Power : " +  this.bullet_size ,   this.canvas.width - 120, this.canvas.height - 40);
			this.ctxt.fillText( "Speed : " +  this.speed  ,   this.canvas.width - 120, this.canvas.height - 25);
			
			if ( this.coinval < this.winningcriteria ) {
				this.ctxt.fillText( "$ : " +  ( this.coinval / 10000000.0 ).toFixed(8) ,  this.canvas.width - 120, this.canvas.height - 10);
			} else {
				this.ctxt.fillText( "You won. You can stop anytime now! "  ,   this.canvas.width - 250, this.canvas.height - 10);
			}

		

		}





		//----
		this.onTimer = function() {

			var ttm = this;
			
			if ( this.player.hp > 0 ) {
			
				this.animate_player();
				this.animate_release_enemies();

				
				// occasional bonus
				if ( this.tick % 4000 == 0 ) {
					this.createbonuses( this.rand(this.canvas.width), -100, 3 );
				}
				this.animate_bullets();
				this.animate_enemies();
				
				this.animate_bonuses();		

				if ( this.hyperon > 0 ) {
					this.hyperon -= 1 ;
					if ( this.hyperon <= 0 ) {
						this.speed = this.valdump[0];
						this.bullet_size = this.valdump[1];
					}
				}

				if ( this.autorapidfire > 0 ) {
					this.autorapidfire -= 1;
					if ( this.autorapidfire <= 0 ) {
						this.autofireinterval = this.valdump[2];
					}
				}
			}

			this.animate_explosions();	
				
			var capspeed = this.speed * 4;
			if ( capspeed > 18 ) {
				capspeed = 18;
			}

			this.altitude += capspeed;
			this.coinval += this.speed * 4;
			this.tick += 1;
		

			this.onDraw();
			
			setTimeout( function() {
				ttm.onTimer(); 
			}, this.timerinterval );
		}

		//------
		this.rand = function( x ) {

			return Math.floor( Math.random() * x );

		}


		//-------
		this.reinit_game = function( x ) {

			this.player.hp = 100;
			
			this.player.x = 300;
			this.player.y = 500;
			this.player.vx = 0;
			this.player.vy = 0;

			this.hyperon = 0;
			this.fireon = 0;
			this.autofireinterval = 20;
			this.autorapidfire = 0;

			this.altitude = 0;
			this.coinval  = 0;
			this.speed = this.minspeed;
			this.bulletindex = 0;	
			
			this.bullet_size = this.min_bullet_size;
			this.enemyindex = 0;
			this.enemytypeupgrade = 0;
			



			this.mp3bgmusic.currentTime = 0;
			this.mp3bgmusic.play();


			for ( i = 0 ; i < this.maxbullet ; i++ ) {
	  			this.bullets[i].active = 0;
	  		}

	  		for ( i = 0 ; i < this.maxenemy ; i++ ) {
	  			this.enemies[i].active = 0;
	  		}
	  		for ( i = 0 ; i < this.maxexplosion ; i++ ) {
	  			this.explosion[i].active = 0;
	  		}

	  		for ( i = 0 ; i < this.maxbonus ; i++ ) {
	  			this.bonuses[i].active = 0;
	  		}

		}



		//---
		this.release_enemies = function( n) {

			for ( var i = 0 ; i < n && i < this.maxenemy; i++ ) {

				var enemytype = this.enemytypeupgrade;
				if ( this.enemytypeupgrade > 15 ) {
					enemytype = this.rand(15);
				}

				this.createenemies( this.rand( this.canvas.width), 0 , enemytype , 0 ) ;
				
			}

		}

		this.release_nyancat = function( n ) { 

			for ( var i = 0 ; i < n && i < this.maxenemy; i++ ) {

				this.createenemies( 0, this.rand(400) , 17 , 1 ) ;
				var nyancatindex = (this.enemyindex + this.maxenemy) % this.maxenemy - 1;
				this.enemies[nyancatindex].ty = this.enemies[nyancatindex].y;
				this.enemies[nyancatindex].tx = 680;

			}
		}
	

	}


	//-----------------
	function main() {

		var ttm = new ToTheMoon();
		ttm.init();
	}
