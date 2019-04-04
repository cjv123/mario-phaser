export default class GameOver extends Phaser.State{
    public preload(){
        this.game.load.bitmapFont('nokia', 
            require('assets/fonts/nokia.png'), 
            require('assets/fonts/nokia.fnt'));
    }

    public create(){
        let text = this.game.add.bitmapText(this.game.width/2,this.game.height/2,"nokia","GAME OVER");
        text.anchor.set(0.5);
        text.fontSize=16;

        let self=this;
        this.game.time.events.add(1500,function(){
            self.state.start("home");
        });
    }


}