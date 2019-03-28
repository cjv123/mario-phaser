
export default class Title extends Phaser.State {
    private heroSp:Phaser.Sprite=null
    private map:Phaser.Tilemap=null;
    private mapLayerFloor:Phaser.TilemapLayer=null;

    public preload():void{
        this.game.time.advancedTiming = true;

        this.game.load.spritesheet("hero",require("assets/images/hero.png"),16,31,11);
        this.game.load.tilemap("map",require("assets/tilemaps/mapCSV_lv1.csv"),null,Phaser.Tilemap.CSV);
        this.game.load.image("tiles",require("assets/images/map.png"));
    }

    public create(): void {

        this.map = this.game.add.tilemap("map",16,16);
        this.map.addTilesetImage("tiles");
        this.map.setCollisionBetween(1,9);

        let layer = this.map.createLayer(0);
        layer.resizeWorld();

        this.heroSp= this.game.add.sprite(50,this.world.height-100,"hero");
        this.heroSp.animations.add("stand",[0],10);
        this.heroSp.animations.add("walk",[2,3,4,5],4,true);
        this.heroSp.animations.play("walk");
        this.heroSp.anchor.x=0.5;

        this.camera.follow(this.heroSp);
        

        this.mapLayerFloor=layer;

        this.game.physics.enable(this.heroSp,Phaser.Physics.ARCADE);

    }

    public update(){
        this.game.physics.arcade.collide(this.heroSp,this.mapLayerFloor);

        this.heroSp.body.velocity.set(0);
        this.heroSp.body.velocity.y = 200;

        if(this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
            this.heroSp.body.velocity.x = 100;
            this.heroSp.scale.x=1;
        }else if(this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
            this.heroSp.body.velocity.x = -100;
            this.heroSp.scale.x=-1;
        }

        if(this.game.input.keyboard.isDown(Phaser.Keyboard.ESC)){
            window.location.replace('../../../index.html');
        } 

    }

    public render(){
        this.game.debug.text('FPS: ' + this.game.time.fps || 'FPS: --', 40, 40, "#00ff00");
    }
}
