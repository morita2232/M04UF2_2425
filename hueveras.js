let canvas_w = 800;
let canvas_h = 450;

let config = {

width: canvas_w,
height: canvas_h,

 physics: {
    default: 'arcade',
    arcade: {
     debug: true,
	 gravity: { y: 0}
    }
  },

scene: {
	preload: preload,
	create: create,
	update: update
}

};

let game = new Phaser.Game(config);

let huevera_b, huevera_m, huevera_d;

let huevo_b, huevo_m, huevo_d;

let sprite_scale = .5;

let x_huevera = 100;

let y_huevo = 250;

let B_inZone = false;
let M_inZone = false;
let D_inZone = false;

let countdown = 60;
let countdown_text;
let countdown_interval;

function preload ()
{

this.load.image('huevera', 'huevera.png');

this.load.image('huevo', 'huevo.png');

this.load.image('background', 'farm.jpg');

this.load.image('hay', 'Hay.png');

this.load.audio('backgroundMusic', 'apple_cider.mp3');

this.load.audio('grabs', 'mouseclick.mp3');

this.load.audio('correct', 'correct.mp3');

this.load.audio('incorrect', 'bad.mp3');

this.load.audio('gameover', 'GameOver.mp3');

}

function create ()
{

this.add.image(400, 225, 'background');

this.backgroundMusic = this.sound.add('backgroundMusic', { loop: true });
this.backgroundMusic.play();

hay = this.add.image(x_huevera, 185, 'hay');
hay.setScale(sprite_scale);

secondHay = this.add.image(x_huevera, 325, 'hay');
secondHay.setScale(sprite_scale);

let dorado = Phaser.Display.Color.GetColor(188, 195, 0);
let marron = Phaser.Display.Color.GetColor(192, 128, 16);

huevera_d = this.add.image(x_huevera, 390, 'huevera');
huevera_d.setScale(sprite_scale);
huevera_d.setTint(dorado);
huevera_d.preFX.addGlow(0xBCC300, 1);

huevera_m = this.add.image(x_huevera, y_huevo, 'huevera');
huevera_m.setScale(sprite_scale);
huevera_m.setTint(marron);

huevera_b = this.add.image(x_huevera, 110, 'huevera');
huevera_b.setScale(sprite_scale);

this.physics.world.enable(huevera_d);
this.physics.world.enable(huevera_m);
this.physics.world.enable(huevera_b);

huevo_shadow = this.add.image(-10000, -10000, 'huevo');
huevo_shadow.setTint("#000000");
huevo_shadow.alpha = .5;
huevo_shadow.setScale(1.3);

countdown_text = this.add.text(70, 5, countdown, { "fontSize": 48, "fontStyle": "bold"  }); 

//this.add.text(90, 20, time, {font: '"Press Start 2P"', strokeThickness: 1  });

this.grabsSound = this.sound.add('grabs');

this.correctSound = this.sound.add('correct');

this.incorrectSound = this.sound.add('incorrect');

this.gameoverMusic = this.sound.add('gameover');

let eggTime = this.time.addEvent({
	delay: 1000,
	callback: generateEgg,
	callbackScope: this,
	loop: true
});

countdown_interval = setInterval(function () {

countdown--;

countdown_text.text = countdown;

if (countdown <= 0) {

console.log("Game Over!");
this.backgroundMusic.stop();
this.gameoverMusic.play();
clearInterval(countdown_interval);
eggTime.remove();
}

}.bind(this), 1000);

}

function generateEgg() {

let eggTypes = ['huevo_b', 'huevo_m', 'huevo_d'];
let randomType = Phaser.Math.RND.pick(eggTypes);

let dorado = Phaser.Display.Color.GetColor(188, 195, 0);
let marron = Phaser.Display.Color.GetColor(192, 128, 16);

let x = Phaser.Math.Between(200, canvas_w - 100);
let y = 0;

let egg = this.add.image(x, y, 'huevo');
egg.setInteractive({ draggable:true });

egg.on('pointerdown', function() {
	this.grabsSound.play();
}.bind(this));

if (randomType === 'huevo_m') {
	egg.setTint(Phaser.Display.Color.GetColor(192, 128, 16));
	
	egg.on('pointerdown', function() {

		console.log("Huevo marron!");

		huevo_shadow.x = egg.x + 8;
		huevo_shadow.y = egg.y + 8;

		this.setScale(1.3);
	});

} else if (randomType === 'huevo_d') {
	egg.setTint(Phaser.Display.Color.GetColor(188, 195, 0));
	egg.preFX.addGlow(0xBCC300, 1);

	egg.on('pointerdown', function(){
		console.log("Huevo dorado!");

		huevo_shadow.x = egg.x + 8;
		huevo_shadow.y = egg.y + 8;

		this.setScale(1.3);
	});
} else {
	egg.on('pointerdown', function(){
		console.log("Huevo blanco!");

		huevo_shadow.x = egg.x + 8;
		huevo_shadow.y = egg.y + 8;

		this.setScale(1.3);
	});
}


this.physics.world.enable(egg);
egg.body.setVelocityY(100);

this.physics.add.overlap(egg, huevera_b, function(){
	if (randomType === 'huevo_b'){
		egg.destroy();

		this.correctSound.play();

		console.log("Huevo blanco detectado + 100 puntos");
		countdown_text.text = countdown += 1;
		}
		else
		{
		egg.destroy();

		this.incorrectSound.play();
		
		console.log("Huevera incorrecta >:(");
		countdown_text.text = countdown -= 1;
		}

	huevo_shadow.x = -10000;
	huevo_shadow.y = -10000;
	
	}.bind(this));


this.physics.add.overlap(egg, huevera_m, function(){
	if (randomType === 'huevo_m'){
		egg.destroy();

		this.correctSound.play();

		console.log("Huevo marron detectado + 250 puntos");
		countdown_text.text = countdown += 5;
		}
		else
		{
		egg.destroy();

		this.incorrectSound.play();
		
		console.log("Huevera incorrecta >:(");
		countdown_text.text = countdown -= 5;
		}

	huevo_shadow.x = -10000;
	huevo_shadow.y = -10000;

	}.bind(this));

this.physics.add.overlap(egg, huevera_d, function(){
	if (randomType === 'huevo_d'){
		egg.destroy();

		this.correctSound.play();

		console.log("Huevo dorado detectado + 500 puntos");
		countdown_text.text = countdown += 10;
		}
		else
		{
		egg.destroy();

		this.incorrectSound.play();
		
		console.log("Huevera incorrecta >:(");
		countdown_text.text = countdown -= 10;
		}

	huevo_shadow.x = -10000;
	huevo_shadow.y = -10000;

	}.bind(this));

this.input.on('drag', function (pointer, object, x, y) {
	object.x = x;
	object.y = y;

	huevo_shadow.x = object.x + 8;
	huevo_shadow.y = object.y + 8;

	if (Phaser.Geom.Intersects.RectangleToRectangle(huevera_b.getBounds(), object.getBounds())){
		console.log("Huevo dentro de huevera blanca!");

		}	

	if (Phaser.Geom.Intersects.RectangleToRectangle(huevera_d.getBounds(), object.getBounds())){
		console.log("Huevo dentro de huevera dorada!");
	}

	if (Phaser.Geom.Intersects.RectangleToRectangle(huevera_m.getBounds(), object.getBounds())){
		console.log("Huevo dentro de huevera marron!");
	}

});

this.input.on('dragend', function (pointer, object, x, y) {
	object.setScale(1);
	
	huevo_shadow.x = -10000;
    huevo_shadow.y = -10000;
});

}


function update ()
{

if( B_inZone && this.input.activePointer.isDown){
console.log("slay");
huevo_b.destroy();
}

if( M_inZone && this.input.activePointer.isDown){
console.log("slay");
huevo_m.destroy();
}

if( D_inZone && this.input.activePointer.isDown){
console.log("Slay");
huevo_d.destroy();
}

}

/*

countdown_interval = setInterval(function () {

countdown--;

countdown_text.text = countdown;

if (countdown <= 0) {

console.log("Game Over!");
this.backgroundMusic.stop();
this.gameoverMusic.play();
clearInterval(countdown_interval);

}

}.bind(this), 1000);

*/

//Como funcionan los timers de JS
/*
setTimeout(function (){ console.log("Holi") }, 2000);

function salta ()
{

console.log("boing!");

}

setTimeout(salta, 5000);

//setInterval(function (){ console.log("Intervalo!") }, 1000);

let tiempo = 10;

let interval_counter;

interval_counter = setInterval(function () { 

console.log("El tiempo es: " + tiempo);

if (tiempo <= 0) {
console.log("Sexo!!");
clearInterval(interval_counter);
//reutrn;
}

tiempo -= 1; 

}, 1000); 

*/






















