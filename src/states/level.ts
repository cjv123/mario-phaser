import Game from "./game";

export default class Level extends Phaser.State{
    public preload(){
        this.game.load.bitmapFont('nokia', 
            require('assets/fonts/nokia.png'), 
            require('assets/fonts/nokia.fnt'));
    }

    public create(){
        let text = this.game.add.bitmapText(this.game.width/2,this.game.height/2,"nokia","LEVEL"+Game.curLevel);
        text.anchor.set(0.5);
        text.fontSize=16;

        if(Game.curLevel>28){
            Game.curLevel=1;
            text.fontSize=16;
            text.text="Congratulations on \npassing all levels";
            let self = this;
            let time = this.game.time.events.add(1500, function () {
                self.state.start("home");
            });
        }else{
            let self = this;
            let time = this.game.time.events.add(1500, function () {
                self.state.start("game");
            });
        }


    }


}