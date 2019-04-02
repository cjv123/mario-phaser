
enum Faceing{
    left=0,
    right=1
}

export enum HeroStatus{
    man=0,
    ball=1,
    fly=2,
    die=3
}

export default class Hero {
    private _sprite:Phaser.Sprite;
    private _spriteBall:Phaser.Sprite;
    private _spriteFlayMan:Phaser.Sprite;
    private _mapLayer:Phaser.TilemapLayer;
    private game:Phaser.Game;
    private _gv=420;
    private _moveSpeed=120;
    private _jumpPower=225;
    private _facing:Faceing=Faceing.right;
    private _hitWall:boolean=false;
    private _curStatus:HeroStatus = HeroStatus.man;

    private _leftKeyCode = Phaser.KeyCode.LEFT;
    private _rightKeyCode = Phaser.KeyCode.RIGHT;
    private _upKeyCode = Phaser.KeyCode.UP;
    private _downKeyCode = Phaser.KeyCode.DOWN;
    private _aKeyCode = Phaser.KeyCode.J;
    private _bKeyCode = Phaser.KeyCode.K;
    private _leftKey = null;
    private _rightKey = null;
    private _upKey = null;
    private _downKey = null;
    private _aKey = null;
    private _bKey = null;
    private _ballSpring=0;

    

    public set Sprite(sprite:Phaser.Sprite){
        this._sprite=sprite;
    }
    public get Sprite(){
        return this._sprite;
    }
    public get SpriteBall(){
        return this._spriteBall;
    }
    public get SpriteFlyman(){
        return this._spriteFlayMan;
    }
    public get CurHeroStatus(){
        return this._curStatus;
    }

    private setupKey(){
        this._leftKey=this.game.input.keyboard.addKey(this._leftKeyCode);
        this._rightKey=this.game.input.keyboard.addKey(this._rightKeyCode);
        this._upKey=this.game.input.keyboard.addKey(this._upKeyCode);
        this._downKey=this.game.input.keyboard.addKey(this._downKeyCode);
        this._aKey=this.game.input.keyboard.addKey(this._aKeyCode);
        this._bKey=this.game.input.keyboard.addKey(this._bKeyCode);
        this.game.input.keyboard.addKeyCapture([
            this._leftKeyCode,
            this._rightKeyCode,
            this._upKey,
            this._downKeyCode,
            this._aKey,
            this._bKey,
        ]);
    }

    public constructor(
        game:Phaser.Game,
        sprite:Phaser.Sprite,
        spriteBall:Phaser.Sprite,
        spriteFlyMan:Phaser.Sprite,
        mapLayer:Phaser.TilemapLayer
        ){
        this._sprite=sprite;
        this._spriteBall=spriteBall;
        this._spriteFlayMan=spriteFlyMan;
        this._mapLayer=mapLayer;
        this.game=game;
        this.setupKey();

        this._sprite.anchor.x=0.5;

        this.game.physics.enable(this._sprite,Phaser.Physics.ARCADE);
        this.game.physics.enable(this._spriteBall,Phaser.Physics.ARCADE);
        this.game.physics.enable(this._spriteFlayMan,Phaser.Physics.ARCADE);

        this._sprite.body.acceleration.y=this._gv;
        this._sprite.body.maxVelocity.x= this._moveSpeed;
        this._sprite.body.maxVelocity.y=this._jumpPower*1.2;
        this._sprite.body.drag.x = this._moveSpeed*8;
        this._sprite.body.offset.x=-1; 

        this._spriteBall.body.acceleration = this._sprite.body.acceleration.clone();
        this._spriteBall.body.maxVelocity = this._sprite.body.maxVelocity.clone();
        this._spriteBall.body.drag = this._sprite.body.drag.clone();
        this._spriteBall.anchor.x=0.5;

        this._spriteFlayMan.body.acceleration.set(0);
        this._spriteFlayMan.body.maxVelocity = this._sprite.body.maxVelocity.clone();
        this._spriteFlayMan.body.drag = this._sprite.body.drag.clone();
        this._spriteFlayMan.anchor.x=0.5;

        this._sprite.animations.add("move", [2, 3, 4, 5], 5);
        this._sprite.animations.add("stand",[0],0);
        this._sprite.animations.add("stand2",[1],0);
        this._sprite.animations.add("jump_down",[7],0);
        this._sprite.animations.add("jump_up",[6],0);
        this._sprite.animations.add("hitwall",[8],0);
        this._sprite.animations.add("die",[9,10],8,true);

        this._spriteBall.animations.add("stand",[0]);
        let ballMoveFrames=[3,2,1,0]
        this._spriteBall.animations.add("move",ballMoveFrames,16);
        this._spriteBall.animations.add("jump_up",ballMoveFrames,16);
        this._spriteBall.animations.add("jump_down",ballMoveFrames,16);
    ;

        this._spriteFlayMan.animations.add("move",[0,1],20);
        this._spriteFlayMan.animations.add("stand",[2,3],10);


        this.changeToMan();

        this.apply();
    }

    public changeToMan(){
        if(this._curStatus==HeroStatus.ball){
            let map = this._mapLayer.map;
            if(
                map.getTile(Math.floor(this._spriteBall.x/16),Math.floor(this._spriteBall.y/16)-1,this._mapLayer).index>0 ||
				map.getTile(Math.floor((this._spriteBall.x+7)/16),Math.floor(this._spriteBall.y/16)-1,this._mapLayer).index>0
			){
				return;
			}
			
			if(
				map.getTile(Math.floor(this._spriteBall.x/16)+1,Math.floor(this._spriteBall.y/16),this._mapLayer).index>0 &&
				map.getTile(Math.floor(this._spriteBall.x/16)-1,Math.floor(this._spriteBall.y/16),this._mapLayer).index>0
			){
				return;
			}
        }

        this._sprite.visible=true;
        this._spriteBall.visible=false;
        this._spriteFlayMan.visible=false;

        if(this._curStatus==HeroStatus.ball){
            this._sprite.position = this._spriteBall.position.clone();
        }else if(this._curStatus==HeroStatus.fly){
            this._sprite.position = this._spriteFlayMan.position.clone();
        }

        this._spriteFlayMan.body.velocity.set(0);
        this.game.camera.follow(this._sprite);

        this._curStatus = HeroStatus.man;
    }
    

    public changeToBall(){
        this._sprite.visible=false;
        this._spriteBall.visible=true;
        this._spriteFlayMan.visible=false;

        this._spriteBall.position = this._sprite.position.clone();

        this._curStatus = HeroStatus.ball;
        this.game.camera.follow(this._spriteBall);
    }

    public changeToFlayMan(){
        this._sprite.visible=false;
        this._spriteBall.visible=false;
        this._spriteFlayMan.visible=true;
        this._curStatus = HeroStatus.fly;
        this._spriteFlayMan.position = this._sprite.position.clone();
        this.game.camera.follow(this._spriteFlayMan);
    }

    private apply(){
    }

    public getCurSprite(){
        let sprite = this._sprite;
        if(this._curStatus==HeroStatus.man){
            sprite = this._sprite;
        }else if(this._curStatus==HeroStatus.ball){
            sprite = this._spriteBall;
        }else if(this._curStatus==HeroStatus.fly){
            sprite = this._spriteFlayMan;
        }
        return sprite;
    }

    public update(){
        let body = this.getCurSprite().body;

        body.acceleration.x=0;
        body.acceleration.y=400;

        if(this._curStatus==HeroStatus.die){
            return;
        }


        // let curSprite = this.getCurSprite();
        // if(false == curSprite.inCamera && curSprite.body.velocity.y>0){
        //     this.die();
        // }

        if(this._curStatus==HeroStatus.fly){
            this._spriteFlayMan.body.acceleration.y=0;
            this._spriteFlayMan.body.drag.set(this._moveSpeed);
            if(this._leftKey.isDown){
                this._facing=Faceing.left
                this._spriteFlayMan.body.acceleration.x -= this._moveSpeed;
            }else if(this._rightKey.isDown){
                this._facing=Faceing.right
                this._spriteFlayMan.body.acceleration.x += this._moveSpeed;
            }

            if(this._upKey.isDown){
                this._spriteFlayMan.body.acceleration.y -= this._moveSpeed;
            }else if(this._downKey.isDown){
                this._spriteFlayMan.body.acceleration.y += this._moveSpeed;
            }

            if(
                this._spriteFlayMan.body.velocity.x !=0 ||
                this._spriteFlayMan.body.velocity.y !=0 
                ){
                this._spriteFlayMan.animations.play("move");
            }else{
                this._spriteFlayMan.animations.play("stand");
            }

            if (
                this._spriteFlayMan.body.blocked.up ||
                this._spriteFlayMan.body.blocked.down ||
                this._spriteFlayMan.body.blocked.left ||
                this._spriteFlayMan.body.blocked.right
            ) {
                this.onFlyHitBlock();
            }
            return;
        }

        
        if(this._leftKey.isDown){
            body.acceleration.x -=body.drag.x;
            this._facing = Faceing.left;
        }else if(this._rightKey.isDown){
            body.acceleration.x +=body.drag.x;
            this._facing = Faceing.right;
        }

        if(this._bKey.justDown){
            if(this._hitWall || this._sprite.body.onFloor()){
                body.velocity.y = -this._jumpPower;
                if(this._hitWall){
                    body.velocity.y = -this._jumpPower*2;
                    if(this._facing==Faceing.left){
                        body.velocity.x = 130*2;
                    }else{
                        body.velocity.x=-130*2;
                    }
                }
            }
        }

        if(this._aKey.justDown){
            if(this._curStatus==HeroStatus.man){
                this.changeToBall();
                // this.changeToFlayMan();
            }else if(this._curStatus==HeroStatus.ball){
                this.changeToMan();
            }
        }

        if(this._hitWall){
            body.velocity.y*=0.6;
        }

        if(body.velocity.y!=0 && body.onFloor()==false){
            if(this._hitWall){
                this._sprite.animations.play("hitwall");
            }else{
                if(body.velocity.y<0){
                    this.getCurSprite().animations.play("jump_up");
                }else{
                    this.getCurSprite().animations.play("jump_down");
                }
            }

        }else if(body.velocity.x==0){
            this.getCurSprite().animations.play("stand");
        }else{
            this.getCurSprite().animations.play("move");
        }

        this._hitWall=false;

        this.updateFaceing();
        this.updateTouch();
    }

    private updateTouch(){
        if(this.Sprite.body.blocked.left){
           this.onHitLeftBlock();
        }
        if(this.Sprite.body.blocked.right){
           this.onHitRightBlock();
        }

        if(this.Sprite.body.blocked.up){
           this.onHitTopBlock();
        }
        if(this.Sprite.body.blocked.down){
           this.onHitBottomBlock();
        }

        // if(this._spriteBall.body.velocity.y>0){
        //     this._ballSpring = -this._spriteBall.body.velocity.y * 0.3;
        // }

        // if(this._spriteBall.body.blocked.down){
        //     this.onBallHitBottomBlick();
        // }
    }

    private updateFaceing(){
        if(this._facing==Faceing.right){
            this.getCurSprite().scale.x=1;
        }else{
            this.getCurSprite().scale.x=-1;
        }

    }

    public kill(){
        // this._sprite.kill();
    }

    public die(){
        this.changeToMan();
        this._sprite.body.velocity.y = -this._jumpPower;
        // this._sprite.body.enable =false;
        this._sprite.animations.play("die");
        this._curStatus= HeroStatus.die;
    }

    public onHitLeftBlock(){
        // console.log("hitleft");
        if(this._curStatus==HeroStatus.man){
            this._hitWall = true;
        }

    }
    public onHitRightBlock(){
        // console.log("hitright");
        if(this._curStatus==HeroStatus.man){
            this._hitWall = true;
        }
    }
    public onHitBottomBlock(){
        // console.log("hitbottom");
    }
    public onHitTopBlock(){
        // console.log("hittop");
    }

    public onFlyHitBlock(){
        this.changeToMan();
    }
    
    public onBallHitBottomBlick(){
        if(this._ballSpring<0){
            this._spriteBall.body.velocity.y=this._ballSpring;
            this._ballSpring=0;
        }
    }
}