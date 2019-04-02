export default class StoneHidden extends Phaser.Sprite{
    private _movey=0;

    public constructor(game: Phaser.Game, x: number, y: number, key?: string | Phaser.RenderTexture | Phaser.BitmapData | PIXI.Texture, frame?: string | number){
        super(game,x,y,key,frame);
        
        game.physics.enable(this,Phaser.Physics.ARCADE);
        this.loadTexture("stone");
        this.visible = false;
        this.body.immovable = true;
    }

    update(){
        if(this.body.blocked.down) {
            this.visible=true;
        }
    }
}