import Hero from "../Hero";

export default class Game extends Phaser.State{
    public static curLevel=1;

    private hero:Hero=null;
    private map:Phaser.Tilemap=null;
    private mapLayerFloor:Phaser.TilemapLayer=null;
    private exitKey:Phaser.Key=null;
    private door:Phaser.Sprite=null;
    private stoneGroup:Phaser.Group=null;

    public preload(){
        this.game.load.spritesheet("hero",require("assets/images/hero.png"),16,31,11);
        this.game.load.spritesheet("heroball",require("assets/images/heroball.png"),16,16,4);
        this.game.load.spritesheet("flyman",require("assets/images/flyman2.png"),24,20,4);
        this.game.load.tilemap("map",require("assets/tilemaps/mapCSV_lv"+Game.curLevel+".csv"),null,Phaser.Tilemap.CSV);
        this.game.load.image("tiles",require("assets/images/map.png"));
        this.game.load.json("mapjson",require("assets/tilemaps/Level_lv"+Game.curLevel+".json"));
        this.game.load.image("door",require("assets/images/door.png"));
        this.game.load.image("stone",require("assets/images/stone.png"));
        this.game.load.spritesheet("stone_gibs",require("assets/images/stone_gibs.png"),8,8,4);
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
        
        this.createObject();
    }

    private createObject() {
        let mapJson = this.game.cache.getJSON("mapjson");

        let doorPos = new Phaser.Point(Number(mapJson.level.objects.ExitDoor.x),Number(mapJson.level.objects.ExitDoor.y));
        this.door = this.game.add.sprite(doorPos.x,doorPos.y,"door");

        this.stoneGroup = this.game.add.group();
        let stoneArr = mapJson.level.objects.Stone;
        for (const iterator of stoneArr) {
            let stone= this.game.add.sprite(Number(iterator.x),Number(iterator.y),"stone");
            this.game.physics.enable(stone,Phaser.Physics.ARCADE);
            stone.body.immovable =true;

            let emitter = this.game.add.emitter(stone.x, stone.y, 250);
            emitter.makeParticles('stone_gibs', [0, 1, 2, 3], 4, false, false);
            emitter.minParticleSpeed.setTo(80, -80);
            emitter.maxParticleSpeed.setTo(-80, 0);
            emitter.gravity.y = 200;
            emitter.bounce.setTo(0.5, 0.5);
            emitter.angularDrag = 30;
            stone["emitter"] =emitter;

            this.stoneGroup.add(stone);
        }

        let heroJsonPos = mapJson.level.objects.Hero;
        let heropos = new Phaser.Point(Number(heroJsonPos.x),Number(heroJsonPos.y)-32);
        let heroSprite = this.game.add.sprite(heropos.x, heropos.y, "hero");
        let ballSprite = this.game.add.sprite(heropos.x, heropos.y, "heroball");
        let flymanSprite = this.game.add.sprite(heropos.x, heropos.y, "flyman");
        this.hero = new Hero(this.game, heroSprite, ballSprite, flymanSprite,this.mapLayerFloor);
    }

    public update(){
        let self=this;
        let heros = [this.hero.Sprite,this.hero.SpriteBall,this.hero.SpriteFlyman];

        for(let i=0;i<heros.length;i++){
            this.game.physics.arcade.collide(heros[i], this.mapLayerFloor);
        }
        this.game.physics.arcade.collide(this.hero.Sprite, this.stoneGroup);
        this.game.physics.arcade.collide(this.hero.SpriteBall, this.stoneGroup,function(ball,stone){
            if(stone["emitter"]!=null){
                stone["emitter"].start(true, 2000,null,4); 
            }
            stone.kill();
            
        });
        this.game.physics.arcade.collide(this.hero.SpriteFlyman, this.stoneGroup);

        this.hero.update();

        if(this.exitKey.justDown){
            console.log("exit key down");
            this.game.pendingDestroy = true;
            window.location.replace('../index.html');
        }
    }
}