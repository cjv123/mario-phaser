import Hero from "../Hero";

export default class Game extends Phaser.State{
    private hero:Hero=null;
    private map:Phaser.Tilemap=null;
    private mapLayerFloor:Phaser.TilemapLayer=null;
    private exitKey:Phaser.Key=null;

    public preload(){
        this.game.load.spritesheet("hero",require("assets/images/hero.png"),16,31,11);
        this.game.load.spritesheet("heroball",require("assets/images/heroball.png"),16,16,4);
        this.game.load.spritesheet("flyman",require("assets/images/flyman2.png"),24,20,4);
        this.game.load.tilemap("map",require("assets/tilemaps/mapCSV_lv1.csv"),null,Phaser.Tilemap.CSV);
        this.game.load.image("tiles",require("assets/images/map.png"));
    }

    private setupKey(){
        this.exitKey = this.game.input.keyboard.addKey(Phaser.KeyCode.ESC);
        this.game.input.keyboard.addKeyCapture(Phaser.KeyCode.ESC);
    }

    public create(){
        this.setupKey();
        this.stage.setBackgroundColor('rgb(168,224,248)');

        this.map = this.game.add.tilemap("map",16,16);
        this.map.addTilesetImage("tiles");
        this.map.setCollisionBetween(1,9);

        let layer = this.map.createLayer(0);
        layer.resizeWorld();
        this.mapLayerFloor=layer;

        let heropos = new Phaser.Point(50,this.world.height-100);
        let heroSprite= this.game.add.sprite(heropos.x,heropos.y,"hero");
        let ballSprite= this.game.add.sprite(heropos.x,heropos.y,"heroball");
        let flymanSprite= this.game.add.sprite(heropos.x,heropos.y,"flyman");

        this.hero = new Hero(this.game,heroSprite,ballSprite,flymanSprite);

    }

    public update(){
        this.game.physics.arcade.collide(this.hero.Sprite,this.mapLayerFloor,
            this.onCollideMap.bind(this));
        this.game.physics.arcade.collide(this.hero.SpriteBall,this.mapLayerFloor,
            this.onCollideMap.bind(this));
        this.game.physics.arcade.collide(this.hero.SpriteFlyman,this.mapLayerFloor,
            this.onCollideMap.bind(this));

        this.hero.update();

        if(this.exitKey.justDown){
            console.log("exit key down");
            this.game.pendingDestroy = true;
            window.location.replace('../launcher.html');
        }
    }

    private onCollideMap(heroSp:Phaser.Sprite,floor:Phaser.Tile,a){
        // console.log("hero.x="+heroSp.x+" floor.x="+floor.worldX);
        


    }
}