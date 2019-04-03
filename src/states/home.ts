export default class Home extends Phaser.State{
    public preload(){
        this.game.load.image("title",require("assets/images/home_en.png"));
        this.game.load.image("bg",require("assets/images/bg_non.png"));
    }

    public create(){
        this.stage.setBackgroundColor('rgb(168,224,248)');
        let bg = this.game.add.image(0,this.game.height/2,"bg");

        let title =this.game.add.image(this.game.width/2,this.game.height/2,"title");
        title.anchor.set(0.5);
        title.scale.set(0.7);

        let self = this;
        let moveFun = function(){
            bg.x = -100;
            bg.y = -70;
            let move = self.game.add.tween(bg).to({ x:self.game.width }, 5000);
            move.start();
            move.onComplete.add(moveFun);
        }
        moveFun();

        let text = this.game.add.text(this.game.width/2,this.game.height-36,"Press Start To Play");
        text.fontSize = 10;
        text.anchor.set(0.5);
        let showFun = function(){
            text.visible=false;
        }
    }

    public update(){

    }
}