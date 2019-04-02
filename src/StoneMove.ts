export default class StoneMove extends Phaser.Sprite{
    public constructor(game: Phaser.Game, x: number, y: number, key?: string | Phaser.RenderTexture | Phaser.BitmapData | PIXI.Texture, frame?: string | number){
        super(game,x,y,key,frame);
        
        game.physics.enable(this,Phaser.Physics.ARCADE);
        this.loadTexture("stone");
        this.body.immovable = true;

        game.add.tween(this).to({x:x+100},500,this.onMove.bind(this));
    }

    private onMove(){
        this.game.add.tween(this).to({ x: this.x - 100 }, 500, this.onMove.bind(this));
    }

    update(){
    }
}