import Hero, { HeroStatus } from "../Hero";
import StoneHidden from "../StoneHidden";
import StoneMove from "../StoneMove";

export default class Game extends Phaser.State{
    public static curLevel=1;
    public static life = 5;

    private hero:Hero=null;
    private map:Phaser.Tilemap=null;
    private mapLayerFloor:Phaser.TilemapLayer=null;
    private exitKey:Phaser.Key=null;
    private door:Phaser.Sprite=null;
    private stoneGroup:Phaser.Group=null;
    private stabGroup:Phaser.Group=null;
    private fanGroup:Phaser.Group=null;
    private getKey:boolean=false;
    private keyObj:Phaser.Sprite=null;
    private flyObj:Phaser.Sprite=null;
    private bgm:Phaser.Sound=null;

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
        this.game.load.image("stab",require("assets/images/stab_tile.png"));
        this.game.load.image("key",require("assets/images/key.png"));
        this.game.load.image("keyflag",require("assets/images/haskey.png"));
        this.game.load.image("flyobj",require("assets/images/flyobj.png"));
        this.game.load.image("head",require("assets/images/headsmall.png"));
        this.game.load.spritesheet("fanObj",require("assets/images/fan.png"),32,32,4);

        this.game.load.audio("bgm",require("assets/audio/bgm.wav"));
        this.game.load.audio("jump",require("assets/audio/jump.wav"));
        this.game.load.audio("eat",require("assets/audio/eat.wav"));
        this.game.load.audio("die",require("assets/audio/dead.wav"));
        this.game.load.audio("bomb",require("assets/audio/dingstone.wav"));
    }

    private setupKey(){
        this.exitKey = this.game.input.keyboard.addKey(Phaser.KeyCode.ESC);
        this.game.input.keyboard.addKeyCapture(Phaser.KeyCode.ESC);
    }

    public create(){
        this.getKey=false;
        this.setupKey();
        this.stage.setBackgroundColor('rgb(168,224,248)');

        this.map = this.game.add.tilemap("map",16,16);
        this.map.addTilesetImage("tiles");
        this.map.setCollisionBetween(1,9);

        let layer = this.map.createLayer(0);
        layer.resizeWorld();
        this.mapLayerFloor=layer;
        
        this.createObject();

        for(let i=0;i<Game.life;i++){
            let head = this.game.add.image(2,2,"head");
            head.x = i*(head.width+2)+2;
            head.fixedToCamera=true;
        }

        this.bgm = this.game.add.audio("bgm",1,true);
        this.bgm.play();

        this.game.add.sound("jump");
        this.game.add.sound("eat");
        this.game.add.sound("die");
        this.game.add.sound("bomb");
    }

    private createObject() {
        
        let mapJson = this.game.cache.getJSON("mapjson");

        let doorPos = new Phaser.Point(Number(mapJson.level.objects.ExitDoor.x),Number(mapJson.level.objects.ExitDoor.y));
        this.door = this.game.add.sprite(doorPos.x,doorPos.y,"door");

        this.stoneGroup = this.game.add.group();
        let stoneArr = mapJson.level.objects.Stone;
        if(stoneArr && stoneArr.length>0){
            for (const iterator of stoneArr) {
                let stone = this.game.add.sprite(Number(iterator.x), Number(iterator.y), "stone");
                this.game.physics.enable(stone, Phaser.Physics.ARCADE);
                stone.body.immovable = true;

                let emitter = this.game.add.emitter(stone.x, stone.y, 250);
                emitter.makeParticles('stone_gibs', [0, 1, 2, 3], 4, false, false);
                emitter.minParticleSpeed.setTo(80, -80);
                emitter.maxParticleSpeed.setTo(-80, 0);
                emitter.gravity.y = 200;
                emitter.bounce.setTo(0.5, 0.5);
                emitter.angularDrag = 30;
                stone["emitter"] = emitter;

                this.stoneGroup.add(stone);
            }
        }

        let stoneHidden = mapJson.level.objects.StoneHidden;       
        if(stoneHidden){
            let self =this;
            let addStoneHidden=function(x,y){
                let stoneHiddenSp = new StoneHidden(
                    self.game,x,y
                );
                self.stage.add(stoneHiddenSp);
                self.stoneGroup.add(stoneHiddenSp);
            }

            if(stoneHidden.length>0){
                for (const iterator of stoneHidden) {
                    addStoneHidden(Number(iterator.x),Number(iterator.y));
                }
            }else{
                addStoneHidden(Number(stoneHidden.x),Number(stoneHidden.y));
            }
        }

        let stoneMove = mapJson.level.objects.StoneMove;
        if(stoneMove){
            let self=this;
            let addStoneMove=function(x,y){
                let stoneMove = new StoneMove(self.game,x,y);
                self.stage.add(stoneMove);
                self.stoneGroup.add(stoneMove);
            }

            if(stoneMove.length>0){
                for (const iterator of stoneMove) {
                    addStoneMove(Number(iterator.x),Number(iterator.y));
                } 
            }else{
                addStoneMove(Number(stoneMove.x),Number(stoneMove.y));
            }
        }


        let stabArr= mapJson.level.objects.Stab;
        if(stabArr){
            this.stabGroup = this.game.add.group();
            for (const iterator of stabArr) {
                let stab = this.game.add.sprite(Number(iterator.x), Number(iterator.y), "stab");
                this.game.physics.enable(stab, Phaser.Physics.ARCADE);
                stab.body.immovable = true;
                this.stabGroup.add(stab);
            }

        }

        let keyPos = mapJson.level.objects.KeyObj;
        if(keyPos){
            this.keyObj = this.game.add.sprite(Number(keyPos.x),Number(keyPos.y),"key");
            this.game.physics.enable(this.keyObj,Phaser.Physics.ARCADE);
        }

        let flyPos = mapJson.level.objects.FlyObj;
        if(flyPos){
            this.flyObj = this.game.add.sprite(Number(flyPos.x),Number(flyPos.y),"flyobj");
            this.game.physics.enable(this.flyObj,Phaser.Physics.ARCADE);
        }

        this.fanGroup = this.game.add.group();
        let fanObjs = mapJson.level.objects.Fan;
        if(fanObjs && fanObjs.length && fanObjs.length>0){
            for (const iterator of fanObjs) {
                let fanObj = this.game.add.sprite(Number(iterator.x),Number(iterator.y),"fanObj");
                this.fanGroup.add(fanObj);
                fanObj.animations.add("run",[0,1,2,3],50,true);
                fanObj.animations.play("run");
            }
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

        if(this.hero.CurHeroStatus!=HeroStatus.die){
            for (let i = 0; i < heros.length; i++) {
                this.game.physics.arcade.collide(heros[i], this.mapLayerFloor);
                this.game.physics.arcade.overlap(heros[i],self.keyObj,function(hero,keyobj:Phaser.Sprite){
                    keyobj.kill();
                    self.getKey=true;
                    let keyflag = self.game.add.sprite(self.game.width/2,6,"keyflag");
                    keyflag.anchor.set(0.5);
                    keyflag.fixedToCamera=true;
                    self.game.sound.play("eat");
                });

                this.game.physics.arcade.overlap(heros[i],self.flyObj, function (hero, flyObj: Phaser.Sprite) {
                    flyObj.kill();
                    self.hero.changeToFlayMan();
                });

                for (const iterator of this.fanGroup.getAll()) {
                    if(heros[i].x >= iterator.x && heros[i].x<=iterator.x+iterator.width 
                        && iterator.y-heros[i].y <210*2) {
                        heros[i].body.velocity.y -=20*2;
                    }
                }
            }

            this.game.physics.arcade.collide(this.hero.Sprite, this.stoneGroup, function (sprite, stone) {
                if (self.hero.CurHeroStatus == HeroStatus.man && self.hero.Sprite.body.touching.up) {
                    if (stone["emitter"] != null) {
                        stone["emitter"].start(true, 2000, null, 4);
                    }
                    stone.kill();
                    self.game.sound.play("bomb");
                }
            });
            this.game.physics.arcade.collide(this.hero.SpriteBall, this.stoneGroup, function (ball, stone) {
                if (self.hero.CurHeroStatus == HeroStatus.ball) {
                    if (stone["emitter"] != null) {
                        stone["emitter"].start(true, 2000, null, 4);
                    }
                    stone.kill();
                    self.game.sound.play("bomb");
                }
            });
            this.game.physics.arcade.collide(this.hero.SpriteFlyman, this.stoneGroup, function () {
                if (self.hero.CurHeroStatus == HeroStatus.fly) {
                    self.hero.changeToFlayMan();
                }
            });

            this.game.physics.arcade.collide(this.hero.SpriteBall, this.stabGroup);
            this.game.physics.arcade.collide(this.hero.Sprite, this.stabGroup, function (sprite, stab) {
                if (self.hero.CurHeroStatus == HeroStatus.man && self.hero.Sprite.body.touching.down) {
                    self.hero.die();
                }
            });
            this.game.physics.arcade.collide(this.hero.SpriteFlyman, this.stabGroup, function (sprite, stab) {
                if (self.hero.CurHeroStatus == HeroStatus.fly && self.hero.Sprite.body.touching.down) {
                    self.hero.die();
                }
            });
        }

        this.hero.update();
        if(this.getKey==true){
            this.hero.updateExit(this.door);
        }


        if(this.exitKey.justDown){
            console.log("exit key down");
            this.game.pendingDestroy = true;
            window.location.replace('exit.html');
            // if(typeof nw != "undefined"){
                // nw.App.closeAllWindows();
            // }
        }
    }

    public shutdown(){
        this.bgm.stop();
    }
}