const battleBackgroundImg = new Image()
battleBackgroundImg.src = './assets/images/pokeb-1.png'
const battleBackground = new Sprite({
    position: {
        x:0,
        y:0
    },
    image: battleBackgroundImg
})

//Create Monster Sprites
let chunk 
let blitz 
let renderedSprites
let queue

let battleAnimationId

function initBattle() {
    document.querySelector('#UI').style.display = 'block'
    document.querySelector('#dialogBox').style.display = 'none'
    document.querySelector('#enemyHealthBar').style.width = '100%'
    document.querySelector('#playerHealthBar').style.width = '100%'
    document.querySelector('#attacksBox').replaceChildren()

    
    chunk = new Monster(monsters.Chunk)
    blitz = new Monster(monsters.Blitz)
    renderedSprites  = [chunk, blitz]
    queue = []

    blitz.attacks.forEach(attack => {
        const button = document.createElement('button')
        button.innerHTML = attack.name
        document.querySelector('#attacksBox').append(button)
    })

    ///Event Listeners for Buttons (attacks)
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', (e) => {
            const selectedAttack = attacks[e.currentTarget.innerHTML]
            blitz.attack({
                attack: selectedAttack,
                recipient: chunk,
                renderedSprites
            })

            if (chunk.health <= 0) {
                queue.push(() => {
                    chunk.faint()
                })
                queue.push(() => {
                    gsap.to('#overlappingDiv', {
                        opacity:1,
                        onComplete: () => {
                            cancelAnimationFrame(battleAnimationId)
                            animate()
                            document.querySelector('#UI').style.display = 'none'

                            gsap.to('#overlappingDiv', {
                                opacity:0
                            })
                            battle.initiated = false
                            audio.win.stop()
                            audio.Map.play()
                        }
                    })
                })
            }

            ///Enemy Attacks here
            const randAtk = chunk.attacks[Math.floor(Math.random() * chunk.attacks.length)]
            queue.push(() => {
                chunk.attack({
                    attack: randAtk,
                    recipient: blitz,
                    renderedSprites
                })

                if (blitz.health <= 0) {
                    queue.push(() => {
                        blitz.faint()
                    })

                    queue.push(() => {
                        gsap.to('#overlappingDiv', {
                            opacity:1,
                            onComplete: () => {
                                cancelAnimationFrame(battleAnimationId)
                                animate()
                                document.querySelector('#UI').style.display = 'none'
    
                                gsap.to('#overlappingDiv', {
                                    opacity:0
                                })

                                battle.initiated = false
                                audio.win.stop()
                                audio.Map.play()
                            }
                        })
                    })
                }
            })
        })

        button.addEventListener('mouseenter', (e) => {
            const selectedAttack = attacks[e.currentTarget.innerHTML]
            document.querySelector('#attackType').innerHTML = selectedAttack.type
            document.querySelector('#attackType').style.color = selectedAttack.color
        })
    })
}


function animateBattle() {
    battleAnimationId = window.requestAnimationFrame(animateBattle)
    battleBackground.draw()

    renderedSprites.forEach((sprite) => {
        sprite.draw()
    })
}

animate()
// initBattle()
// animateBattle()





document.querySelector('#dialogBox').addEventListener('click', (e) => {
    if (queue.length > 0) {
        queue[0]()
        queue.shift()
    } else e.currentTarget.style.display = 'none'
})