
enum Faceing{
    left=0,
    right=1
}

export default class Hero {
    private _sprite:Phaser.Sprite
    private game:Phaser.Game;
    private _gv=420;
    private _moveSpeed=120;
    private _jumpPower=225;
    private _facing:Faceing=Faceing.right;
    private _hitWall:boolean=false;

    private _leftKeyCode = Phaser.KeyCode.LEFT;
    private _rightKeyCode = Phaser.KeyCode.RIGHT;
    private _upKeyCode = Phaser.KeyCode.UP;
    private _downKeyCode = Phaser.KeyCode.DOWN;
    private _aKeyCode = Phaser.KeyCode.J;
    private _bKeyCode = Phaser.KeyCode.K;
    

    public set Sprite(sprite:Phaser.Sprite){
        this._sprite=sprite;
    }
    public get Sprite(){
        return this._sprite;
    }

    public constructor(game:Phaser.Game,sprite:Phaser.Sprite){
        this._sprite=sprite;
        this.game=game;

        this._sprite.anchor.x=0.5;

        this.game.physics.enable(this._sprite,Phaser.Physics.ARCADE);
        this._sprite.body.acceleration.y=this._gv;
        this._sprite.body.maxVelocity.x= this._moveSpeed;
        this._sprite.body.maxVelocity.y=this._jumpPower*1.2;
        this._sprite.body.drag.x = this._moveSpeed*8;

        this.changeToMan();

        this.apply();
    }

    public changeToMan(){
        this._sprite.animations.add("move",[2,3,4,5],5);
        this._sprite.animations.add("stand",[0],0);
        this._sprite.animations.add("stand2",[1],0);
        this._sprite.animations.add("jump_down",[7],0);
        this._sprite.animations.add("jump_up",[6],0);
        this._sprite.animations.add("hitwall",[8],0);
        this._sprite.animations.add("die",[9,10],8);
    }

    public changeToBall(){

    }

    private apply(){
    }

    public update(){
        let body = this._sprite.body;
        body.acceleration.x=0;
        body.acceleration.y=400;


        if(this.game.input.keyboard.isDown(this._leftKeyCode)){
            body.acceleration.x -=body.drag.x;
            this._facing = Faceing.left;
        }else if(this.game.input.keyboard.isDown(this._rightKeyCode)){
            body.acceleration.x +=body.drag.x;
            this._facing = Faceing.right;
        }

        if(this.game.input.keyboard.isDown(this._aKeyCode)){
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

        if(this._hitWall){
            body.velocity.y*=0.6;
        }

        if(body.velocity.y!=0 && body.onFloor()==false){
            if(this._hitWall){
                this._sprite.animations.play("hitwall");
            }else{
                if(body.velocity.y<0){
                    this._sprite.animations.play("jump_up");
                }else{
                    this._sprite.animations.play("jump_down");
                }
            }

        }else if(body.velocity.x==0){
            this._sprite.animations.play("stand");
        }else{
            this._sprite.animations.play("move");
        }

        this._hitWall=false;

        this.updateFaceing();
    }

    private updateFaceing(){
        if(this._facing==Faceing.right){
            this._sprite.scale.x=1;
        }else{
            this._sprite.scale.x=-1;
        }
    }

    public kill(){
        this._sprite.kill();
    }

    public hitLeft(contact){
        // console.log("hitleft");
        this._hitWall=true;
    }
    public hitRight(contact){
        // console.log("hitright");
        this._hitWall=true;
    }
    public hitBottom(contact){
        // console.log("hitbottom");
    }
    public hitTop(contact){
        // console.log("hittop");
    }
}