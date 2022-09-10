const musicVol = 0.1
const effectsvol = 0.5

const audio = {
    Map: new Howl({
        src: './assets/audio/map.mp3',
        html5:true,
        volume: musicVol
    }),
    initBattle: new Howl({
        src: './assets/audio/battle.mp3',
        html5:true,
        volume: musicVol
    }),
    tackle: new Howl({
        src: './assets/audio/tackle.wav',
        html5:true,
        volume: effectsvol
    }),
    initFireBall: new Howl({
        src: './assets/audio/flareShoot.wav',
        html5:true,
        volume: effectsvol
    }),
    fireBallHit: new Howl({
        src: './assets/audio/flareHit.wav',
        html5:true,
        volume: effectsvol
    }),
    win: new Howl({
        src: './assets/audio/victory.mp3',
        html5:true,
        volume: musicVol
    }),
    thud: new Howl({
        src: './assets/audio/thud.mp3',
        html5:true,
        volume: effectsvol
    })
}