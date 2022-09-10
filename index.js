const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')



canvas.width = 1024
canvas.height = 576


const collisionsMap = []
for (let i = 0; i < collisions.length; i += 70) {
    collisionsMap.push(collisions.slice(i, 70 + i))
}

const battleZonesMap = []
for (let i = 0; i < battleZonesData.length; i += 70) {
    battleZonesMap.push(battleZonesData.slice(i, 70 + i))
}



const boundaries = []
const offset = {
    x:-2300,
    y:-1300
}

collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 1025)
            boundaries.push(new Boundary({
                position: {
                    x: j * Boundary.width + offset.x,
                    y: i * Boundary.height + offset.y
                }
            })
            )
    })
})

const battleZones = []

battleZonesMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 1025)
            battleZones.push(new Boundary({
                position: {
                    x: j * Boundary.width + offset.x,
                    y: i * Boundary.height + offset.y
                }
            })
            )
    })
})

const playerDownImage = new Image()
playerDownImage.src = './assets/images/playerDown.png'

const playerUpImage = new Image()
playerUpImage.src = './assets/images/playerUp.png'

const playerLeftImage = new Image()
playerLeftImage.src = './assets/images/playerLeft.png'

const playerRightImagge = new Image()
playerRightImagge.src = './assets/images/playerRight.png'

const image = new Image()
image.src = './assets/images/Pokemon map.png'

const foregroundImage = new Image()
foregroundImage.src = './assets/images/foregroundObjects.png'


const player = new Sprite({
    position: {
        x: canvas.width / 1.5 - 192 / 6.5, 
        y: canvas.height / 1.7 - 68 / 20,
    },
    image: playerDownImage,
    frames: {
        max: 4,
        hold:30
    },
    sprites: {
        up: playerUpImage,
        left: playerLeftImage,
        right: playerRightImagge,
        down: playerDownImage
    }
})

const background = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: image
})

const foreground = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: foregroundImage
})

const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    }
}

const walkspeed = 2.0

const movables = [background, ...boundaries, foreground,...battleZones]

function rectangularCollision({rect1, rect2}){
    return (
        rect1.position.x + rect1.width >= rect2.position.x && 
        rect1.position.x <= rect2.position.x + rect2.width &&
        rect1.position.y <= rect2.position.y + rect2.height &&
        rect1.position.y + rect1.height >= rect2.position.y
        )
}

const battle = {
    initiated:false
}

function animate() {
    const animationId = window.requestAnimationFrame(animate)
    background.draw()
    boundaries.forEach(boundary => {
        boundary.draw()
    })
    battleZones.forEach(battleZone => {
        battleZone.draw()
    })
    player.draw()
    foreground.draw()
    
    let moving = true
    player.animate = false

    if (battle.initiated) return

    //Activate a Battle
    if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
        for (let i = 0; i < battleZones.length; i++) {
            const battleZone = battleZones[i]
            const overlappingArea = (Math.min(player.position.x + player.width, battleZone.position.x + battleZone.width) - 
                Math.max(player.position.x, battleZone.position.x))  *
                (Math.min(player.position.y + player.height, battleZone.position.y + battleZone.height) -
                Math.max(player.position.y, battleZone.position.y))
            if (
                rectangularCollision({
                    rect1: player,
                    rect2: battleZone
                }) &&
                overlappingArea > (player.width * player.height) / 2 && Math.random() < 0.005
            ) {
                
                window.cancelAnimationFrame(animationId)
                audio.Map.stop()
                audio.initBattle.play()
                battle.initiated = true
                gsap.to('#overlappingDiv', {
                    opacity:1,
                    repeat:10,
                    yoyo:true,
                    duration:0.2,
                    onComplete() {
                        gsap.to('#overlappingDiv', {
                            opacity:1,
                            duration:0.2,
                            onComplete() {
                                //activate new animation loop
                                initBattle()
                                animateBattle()
                                gsap.to('#overlappingDiv', {
                                    opacity:0,
                                    duration:0.2,
                                })
                            }
                        })  
                    }
                })
                break
            }
        }
    }

    if (keys.w.pressed) {
        player.animate = true
        player.image = player.sprites.up

        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                rectangularCollision({
                    rect1: player,
                    rect2: {...boundary, position: {
                        x: boundary.position.x,
                        y: boundary.position.y + walkspeed
                    }}
                })
                ) {
                    if (!audio.thud.playing()) audio.thud.play()
                    moving = false
                    break
                }
        }


        if (moving){
            movables.forEach((movable) => {
                movable.position.y += walkspeed
            })}
        }
    else if (keys.a.pressed ) {
        player.animate = true
        player.image = player.sprites.left
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                rectangularCollision({
                    rect1: player,
                    rect2: {...boundary, position: {
                        x: boundary.position.x + walkspeed,
                        y: boundary.position.y
                    }}
                })
                ) {
                    if (!audio.thud.playing()) audio.thud.play()
                    moving = false
                    break
                }
        }
        if (moving){
        movables.forEach((movable) => {
            movable.position.x += walkspeed
        })}
    }
    
    else if (keys.s.pressed ) {
        player.animate = true
        player.image = player.sprites.down  
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                rectangularCollision({
                    rect1: player,
                    rect2: {...boundary, position: {
                        x: boundary.position.x,
                        y: boundary.position.y - walkspeed
                    }}
                })
                ) {
                    if (!audio.thud.playing()) audio.thud.play()
                    moving = false
                    break
                }
        }
        if (moving){
        movables.forEach((movable) => {
            movable.position.y -= walkspeed
        })}
    }
    else if (keys.d.pressed ) {
        player.animate = true
        player.image = player.sprites.right
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                rectangularCollision({
                    rect1: player,
                    rect2: {...boundary, position: {
                        x: boundary.position.x - walkspeed,
                        y: boundary.position.y
                    }}
                })
                ) {
                    
                    moving = false
                    break
                }
        }
        if (moving){
        movables.forEach((movable) => {
        movable.position.x -= walkspeed
    })}
    }
    
}
// animate()



let lastKey = ''
window.addEventListener('keydown', (e) => {
    switch(e.key)
    {
        case 'w':
            keys.w.pressed = true
            lastKey = 'w'
            break
        case 'a':
            keys.a.pressed = true
            lastKey = 'a'
            break

        case 's':
            keys.s.pressed = true
            lastKey = 's'
            break

        case 'd':
            keys.d.pressed = true
            lastKey = 'd'
            break
    }
})

window.addEventListener('keyup', (e) => {
    switch(e.key)
    {
        case 'w':
            keys.w.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break

        case 's':
            keys.s.pressed = false
            break

        case 'd':
            keys.d.pressed = false
            break
    }
})

let clicked = false
addEventListener('click', () => {
    if (!clicked) {
        audio.Map.play()
        clicked = true
    }
})
addEventListener('keydown', () => {
    if (!clicked) {
        audio.Map.play()
        clicked = true
    }
})

var slider = document.getElementById("myRange");


//Volume Slider
slider.oninput = function() {
    if (this.value <= 1){
        audio.Map.volume(0)
        audio.initBattle.volume(0)
        audio.tackle.volume(0)
        audio.initFireBall.volume(0)
        audio.fireBallHit.volume(0)
        audio.initFireBall.volume(0)
        audio.win.volume(0)
        audio.thud.volume(0)
    }
    else {
        const musicVols = 500
        const effectVols = 200
        audio.Map.volume(this.value / musicVols)
        audio.initBattle.volume(this.value / musicVols)
        audio.tackle.volume(this.value / effectVols)
        audio.initFireBall.volume(this.value / effectVols)
        audio.fireBallHit.volume(this.value / effectVols)
        audio.initFireBall.volume(this.value / effectVols)
        audio.win.volume(this.value / musicVols)
        audio.thud.volume(this.value / effectVols)
    }
    
}
