let canvas_w = 800;
let canvas_h = 450;

let config = {

width: canvas_w,
height: canvas_h,

 physics: {
    default: 'arcade',
    arcade: {
     debug: false,
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

let score = 0;
let scoreText;
let countdown = 60;
let countdown_text;
let countdown_interval;
let gameOver = false;
let gameOverText;

let totalEggs = 10;
let huevo_shadow;

let B_inZone = false;
let M_inZone = false;
let D_inZone = false;


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
this.add.image(canvas_w / 2, canvas_h / 2, 'background');

this.backgroundMusic = this.sound.add('backgroundMusic', { loop: true });
this.backgroundMusic.play();

hay = this.add.image(x_huevera, 185, 'hay');
hay.setScale(sprite_scale);
secondHay = this.add.image(x_huevera, 325, 'hay');
secondHay.setScale(sprite_scale);

let dorado = Phaser.Display.Color.GetColor(188, 195, 0);
let marron = Phaser.Display.Color.GetColor(192, 128, 16);

huevera_b = this.add.image(x_huevera, 110, 'huevera');
huevera_b.setScale(sprite_scale);

huevera_m = this.add.image(x_huevera, y_huevo, 'huevera');
huevera_m.setScale(sprite_scale);
huevera_m.setTint(marron);

huevera_d = this.add.image(x_huevera, 390, 'huevera');
huevera_d.setScale(sprite_scale);
huevera_d.setTint(dorado);
huevera_d.preFX.addGlow(0xBCC300, 1);

this.physics.world.enable(huevera_d);
this.physics.world.enable(huevera_m);
this.physics.world.enable(huevera_b);

huevo_shadow = this.add.image(-10000, -10000, 'huevo');
huevo_shadow.setTint("#000000");
huevo_shadow.alpha = .5;
huevo_shadow.setScale(1.3);

scoreText = this.add.text(canvas_w - 200, 10, score, { "fon    tSize": 48 });

countdown_text = this.add.text(70, 5, countdown, { "fontSize": 48, "fontStyle": "bold"  }); 

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

if (countdown <= 0 || totalEggs <= 0 || gameOver) {

console.log("Game Over!");
this.backgroundMusic.stop();
this.gameoverMusic.play();
clearInterval(countdown_interval);
eggTime.remove();
endGame.call(this);
}

}.bind(this), 1000);

}

function generateEgg() {
if (totalEggs <= 0 || gameOver) return;

let eggTypes = ['huevo_b', 'huevo_m', 'huevo_d'];
let randomType = Phaser.Math.RND.pick(eggTypes);

let x = Phaser.Math.Between(200, canvas_w - 100);
let y = 0;

let dorado = Phaser.Display.Color.GetColor(188, 195, 0);
let marron = Phaser.Display.Color.GetColor(192, 128, 16);


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
		scoreText.text =score += 100;

		}
		else
		{
		this.incorrectSound.play();
		scoreText.text =score -= 100;
		if (score < 0) {scoreText.text = score = 0;} 
		egg.destroy();

		}

	huevo_shadow.x = -10000;
	huevo_shadow.y = -10000;
	
	totalEggs--;

	}.bind(this));


this.physics.add.overlap(egg, huevera_m, function(){
	if (randomType === 'huevo_m'){
		egg.destroy();

		this.correctSound.play();

		console.log("Huevo marron detectado + 250 puntos");
		countdown_text.text = countdown += 5;
		scoreText.text =score += 250;
		}
		else
		{
		this.incorrectSound.play();
		scoreText.text =score -= 250;
		if (score < 0) {scoreText.text = score = 0;} 
		egg.destroy();
		}

	huevo_shadow.x = -10000;
	huevo_shadow.y = -10000;
	
	totalEggs--;

	}.bind(this));

this.physics.add.overlap(egg, huevera_d, function(){
	if (randomType === 'huevo_d'){
		egg.destroy();

		this.correctSound.play();

		console.log("Huevo dorado detectado + 500 puntos");
		countdown_text.text = countdown += 10;
		scoreText.text =score += 500;

		}
		else
		{
		this.incorrectSound.play();
		scoreText.text =score -= 500;
		if (score < 0) {scoreText.text = score = 0;} 
		egg.destroy();
		}

	huevo_shadow.x = -10000;
	huevo_shadow.y = -10000;
	
	totalEggs--;

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
	if (
            !Phaser.Geom.Intersects.RectangleToRectangle(huevera_b.getBounds(), object.getBounds()) &&
            !Phaser.Geom.Intersects.RectangleToRectangle(huevera_m.getBounds(), object.getBounds()) &&
            !Phaser.Geom.Intersects.RectangleToRectangle(huevera_d.getBounds(), object.getBounds())
        ) {
           
            this.incorrectSound.play(); 
            score -= 100;
            countdown -= 5; 
            scoreText.text = 'Puntos: ' + score;
            countdown_text.text = countdown;

            object.destroy();
            totalEggs--;
        }
    }.bind(this));
}

function endGame() {
gameOver = true;
gameOverText = this.add.text(canvas_w / 2, canvas_h / 2, 'GAME OVER...\nPuntuacion: ' + score, { "fontSize": 48, "fontStyle": "bold", "align":     "center" }).setOrigin(0.5);

this.physics.pause();
this.input.off('drag');
this.input.off('dragend');
this.input.off('pointerdown');
}

function update ()
{

}



function endGame() {
gameOver = true;
gameOverText = this.add.text(canvas_w / 2, canvas_h / 2, 'GAME OVER...\nPuntuacion: ' + score, { "fontSize": 48, "fontStyle": "bold", "align": "center" }).setOrigin(0.5);

this.physics.pause();
this.input.off('drag');
this.input.off('dragend');
}

function update ()
{

}























