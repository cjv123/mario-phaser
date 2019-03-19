import Hero from "../Hero";

export default class Game extends Phaser.State{
    private hero:Hero=null;
    private map:Phaser.Tilemap=null;
    private mapLayerFloor:Phaser.TilemapLayer=null;

    public preload(){
        this.game.load.spritesheet("hero",require("assets/images/hero.png"),16,31,11);
        this.game.load.tilemap("map",require("assets/tilemaps/mapCSV_lv1.csv"),null,Phaser.Tilemap.CSV);
        this.game.load.image("tiles",require("assets/images/map.png"));
    }

    public create(){
        this.stage.setBackgroundColor('rgb(168,224,248)');

        this.map = this.game.add.tilemap("map",16,16);
        this.map.addTilesetImage("tiles");
        this.map.setCollisionBetween(1,9);

        let layer = this.map.createLayer(0);
        layer.resizeWorld();
        this.mapLayerFloor=layer;

        let heroSprite= this.game.add.sprite(50,this.world.height-100,"hero");
        this.hero = new Hero(this.game,heroSprite);

        this.camera.follow(this.hero.Sprite);
    }

    public update(){
        this.game.physics.arcade.collide(this.hero.Sprite,this.mapLayerFloor,
            this.onCollideMap.bind(this));

        this.hero.update();
    }

    private onCollideMap(heroSp:Phaser.Sprite,floor:Phaser.Tile,a){
        console.log("hero.x="+heroSp.x+" floor.x="+floor.worldX);
        if(heroSp.x>floor.worldX && (heroSp.x-floor.worldX)>=(Math.abs(heroSp.width)*heroSp.anchor.x+floor.width)){
           this.hero.hitLeft(floor);
        }
        if(heroSp.x<floor.worldX && (floor.worldX-heroSp.x)>=(Math.abs(heroSp.width)*(1-heroSp.anchor.x))){
           this.hero.hitRight(floor);
        }

        // console.log("hero.y="+heroSp.y+" floor.y="+floor.worldY);
        if(heroSp.y>floor.worldY && (heroSp.y-floor.worldY)>=floor.height){
           this.hero.hitTop(floor);
        }
        if(heroSp.y<floor.worldY && (floor.worldY-heroSp.y)>=heroSp.height){
           this.hero.hitBottom(floor);
        }


    }
}