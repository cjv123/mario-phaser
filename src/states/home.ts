export default class Home extends Phaser.State{
    private startKey:Phaser.Key=null;
    private exitKey:Phaser.Key=null;
    private bgm:Phaser.Sound;

    public preload(){
        this.game.load.image("title",require("assets/images/home_en.png"));
        this.game.load.image("bg",require("assets/images/bg_non.png"));
        this.game.load.bitmapFont('nokia', 
            require('assets/fonts/nokia.png'), 
            require('assets/fonts/nokia.fnt'));

        this.game.load.audio("bgm",require("assets/audio/home.wav"));
    }

    public create(){
        this.startKey = this.game.input.keyboard.addKey(Phaser.KeyCode.ENTER);
        this.exitKey = this.game.input.keyboard.addKey(Phaser.KeyCode.ESC);
        this.game.input.keyboard.addKeyCapture(Phaser.KeyCode.ESC);
        this.game.input.keyboard.addKeyCapture(Phaser.KeyCode.ENTER);

        this.stage.setBackgroundColor('rgb(168,224,248)');
        let bg = this.game.add.image(0,this.game.height/2,"bg");

        let title =this.game.add.image(this.game.width/2,this.game.height/2,"title");
        title.anchor.set(0.5);
        title.scale.set(0.7);

        let self = this;
        let moveFun = function(){
            bg.x = -400;
            bg.y = -70;
            let move = self.game.add.tween(bg).to({ x:self.game.width }, 10000);
            move.start();
            move.onComplete.add(moveFun);
        }
        moveFun();

        let text = this.game.add.bitmapText(this.game.width/2,this.game.height-40,"nokia","PRESS START TO PLAY");
        text.fontSize = 8;
        text.anchor.set(0.5);
        let showFun = function(){
            text.visible=!text.visible;
            self.game.time.events.add(300,showFun);
        }
        this.game.time.events.add(300,showFun);

        let copyright = this.game.add.bitmapText(this.game.width/2,this.game.height-7,"nokia","@ZF TEAM COPY RIGHT,BUILD BY PHASER");
        copyright.fontSize=6;
        copyright.anchor.set(0.5);

        this.bgm= this.game.add.audio("bgm",1,true);
        this.bgm.play();
    }

    public update(){
        if(this.startKey.justDown){
            this.state.start("level");
        }

        if(this.exitKey.justDown){
            console.log("exit key down");
            this.game.pendingDestroy = true;
            window.location.replace('exit.html');
            
            // if(typeof nw != "undefined"){
            //     nw.App.closeAllWindows();
            // }
        }
    }

    public shutdown(){
        this.bgm.stop();
    }


}