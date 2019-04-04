import 'p2';
import 'pixi';
import 'phaser';

import * as WebFontLoader from 'webfontloader';

import Boot from './states/boot';
import Preloader from './states/preloader';
import Home from './states/home';
import Game from './states/game';
import Level from './states/level';
import GameOver from './states/gameover';
import Hero from './Hero';
import StoneHidden from './StoneHidden';
import StoneMove from './StoneMove';
import StoneMoveD from './StoneMoveD';

import * as Utils from './utils/utils';
import * as Assets from './assets';

class App extends Phaser.Game {
    constructor(config: Phaser.IGameConfig) {
        super (config);

        this.state.add('boot', Boot);
        this.state.add('preloader', Preloader);
        this.state.add('home',Home);
        this.state.add('game',Game);
        this.state.add('level',Level);
        this.state.add('gameover',GameOver);

        this.state.start('boot');
    }
}

function startApp(): void {
    let gameWidth: number = 320/2;//320
    let gameHeight: number = 240/2;//240

    // There are a few more options you can set if needed, just take a look at Phaser.IGameConfig
    let gameConfig: Phaser.IGameConfig = {
        width: gameWidth,
        height: gameHeight,
        renderer: Phaser.CANVAS,
        parent: '',
        resolution: 1
    };

    let app = new App(gameConfig);
}

window.onload = () => {
    startApp();
};
