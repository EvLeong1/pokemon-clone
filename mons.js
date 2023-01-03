const blitzImg = new Image()
blitzImg.src = './assets/images/embySprite.png'

const ChunkImg = new Image()
ChunkImg.src = './assets/images/draggleSprite.png'

const monsters = {
    Blitz: {
        position: {
            x: 300,
            y: 350
        },
        image: {
            src: './assets/images/embySprite.png'
        },
        frames: {
            max:4,
            hold: 30
        },
        animate:true,
        name: 'Blitz',
        attacks: [attacks.Tackle, attacks.Flare]
    },
    Chunk: {
        position: {
            x: 650,
            y: 225
        },
        image: {
            src: './assets/images/draggleSprite.png'
        },
        frames: {
            max:4,
            hold: 45
        },
        animate:true,
        isEnemy:true,
        name: 'Chunk',
        attacks: [attacks.Tackle, attacks.Flare]
    }
}
