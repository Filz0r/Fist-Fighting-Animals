
$('#animalBar').width('100%')
$('#userBar').width('100%')
function fight(action) {
    const animal = {
        name: $('#animalName').html(),
        level: + $('#animalLevel').html().substring(4).replace(/,/g, ''),
        attack: + $('#animalAttack').html().replace(/,/g, ''),
        defense: + $('#animalDefense').html().replace(/,/g, ''),
        hp: + $('#animalHP').html().replace(/,/g, ''),
        fixHP: + $('#animalHpFixed').html().substring(1).replace(/,/g, '')
    }
    const user = {
        name: $('#userName').html(),
        level: + $('#userLevel').html().substring(4).replace(/,/g, ''),
        attack: + $('#userAttack').html().replace(/,/g, ''),
        defense: + $('#userDefense').html().replace(/,/g, ''),
        hp: + $('#userHP').html().replace(/,/g, ''),
        fixHP: + $('#userHpFixed').html().substring(1).replace(/,/g, '')
    }
    function hpPercent(val, user){
        const result = (val * 100) / user.fixHP
        return `${result}%`
    }
    if (action == 'attack') {
        animal.hp = Math.round(animal.hp - (user.attack * 0.65 + animal.defense * 0.35))
        user.hp = Math.round(user.hp - (user.defense * 0.05 + animal.attack * 0.95))
        if(animal.hp <= 0 && user.hp > 0) {
            $('#animalHP').html('0')
            $('#userHP').html(user.hp)
            $('#animalBar').width('0%')
            $('#userBar').width(hpPercent(user.hp, user))
            $('#winModal').show()
        } else if (animal.hp > 0 && user.hp > 0) {
            $('#animalHP').html(animal.hp)
            $('#animalBar').width(hpPercent(animal.hp, animal))
            $('#userBar').width(hpPercent(user.hp, user))
            $('#userHP').html(user.hp)
        } else if (animal.hp > 0 && user.hp <= 0) {
            $('#animalHP').html(animal.hp)
            $('#userHP').html('0')
            $('#animalBar').width('0%')
            $('#userBar').width(hpPercent(user.hp, user))
            $('#lossModal').show()
        } else if ( animal.hp<= 0 && user.hp <= 0) {
            $('#animalHP').html('0')
            $('#userHP').html('0')
            $('#animalBar').width('0%')
            $('#userBar').width('0%')
            $('#lossModal').show()
        }    
    } else if (action == 'defend') {
        animal.hp = Math.round(animal.hp - (user.defense * 0.45 + animal.defense * 0.55))
        user.hp = Math.round(user.hp - (user.defense * 0.05 + animal.attack * 0.95))
        if(animal.hp <= 0 && user.hp > 0) {
            $('#animalHP').html('0')
            $('#userHP').html(user.hp)
            $('#animalBar').width('0%')
            $('#userBar').width(hpPercent(user.hp, user))
            $('#winModal').show()
        } else if (animal.hp > 0 && user.hp > 0) {
            $('#animalHP').html(animal.hp)
            $('#animalBar').width(hpPercent(animal.hp, animal))
            $('#userBar').width(hpPercent(user.hp, user))
            $('#userHP').html(user.hp)
        } else if (animal.hp > 0 && user.hp <= 0) {
            $('#animalHP').html(animal.hp)
            $('#userHP').html('0')
            $('#animalBar').width('0%')
            $('#userBar').width(hpPercent(user.hp, user))
            $('#lossModal').show()
        } else if ( animal.hp<= 0 && user.hp <= 0) {
            $('#animalHP').html('0')
            $('#userHP').html('0')
            $('#animalBar').width('0%')
            $('#userBar').width('0%')
            $('#lossModal').show()
        } 
    }
}