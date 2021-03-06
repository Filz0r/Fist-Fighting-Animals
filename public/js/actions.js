
$('#animalBar').width('100%')
const userhp = $('#userBar').attr('aria-valuenow')
const userMaxHp = $('#userBar').attr('aria-valuemax')
$('#userBar').width(hpPercent(userhp, userMaxHp))
function hpPercent(val, fixHp){
    const result = (val * 100) / fixHp
    return `${result}%`
}
function fight(action, attackBuff, defenseBuff, consumableAttackBuff, consumableDefenseBuff) {
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
        attack: + $('#userAttack').html().replace(/,/g, '') + parseInt(attackBuff) + parseInt(consumableAttackBuff),
        defense: + $('#userDefense').html().replace(/,/g, '') + parseInt(defenseBuff) + parseInt(consumableDefenseBuff),
        hp: + $('#userHP').html().replace(/,/g, ''),
        fixHP: + $('#userHpFixed').html().substring(1).replace(/,/g, '')
    }
    if (action == 'attack') {
        animal.hp = Math.round(animal.hp - (user.attack * 0.90 - animal.defense * 0.10))
        user.hp = Math.round(user.hp - (animal.attack * 0.90 - user.defense * 0.10))
        console.log(user)
        if(animal.hp <= 0 && user.hp > 0) {
            $('#animalHP').html('0')
            $('#userHP').html(user.hp)
            $('input[name=currentHp]').val(`${user.hp}`)
            $('#animalBar').width('0%')
            $('#userBar').width(hpPercent(user.hp, user.fixHP))
            $('#winModal').show()
        } else if (animal.hp > 0 && user.hp > 0) {
            $('#animalHP').html(animal.hp)
            $('#animalBar').width(hpPercent(animal.hp, animal.fixHP))
            $('#userBar').width(hpPercent(user.hp, user.fixHP))
            $('#userHP').html(user.hp)
            $('input[name=currentHp]').val(`${user.hp}`)
        } else if (animal.hp > 0 && user.hp <= 0) {
            $('#animalHP').html(animal.hp)
            $('#userHP').html('0')
            $('#userBar').width('0%')
            $('input[name=currentHp]').val(`${user.hp}`)
            $('#animalBar').width(hpPercent(animal.hp, animal.fixHP))
            $('#lossModal').show()
        } else if ( animal.hp<= 0 && user.hp <= 0) {
            $('#animalHP').html('0')
            $('#userHP').html('0')
            $('input[name=currentHp]').val(`${user.hp}`)
            $('#animalBar').width('0%')
            $('#userBar').width('0%')
            $('#lossModal').show()
        }    
    } else if (action == 'defend') {
        animal.hp = Math.round(animal.hp - (user.attack * 0.40 - animal.defense * 0.60))
        user.hp = Math.round(user.hp - (animal.attack * 0.40))
        if(animal.hp <= 0 && user.hp > 0) {
            $('#animalHP').html('0')
            $('#userHP').html(user.hp)
            $('#animalBar').width('0%')
            $('#userBar').width(hpPercent(user.hp, user.fixHp))
            $('#winModal').show()
        } else if (animal.hp > 0 && user.hp > 0) {
            $('#animalHP').html(animal.hp)
            $('#animalBar').width(hpPercent(animal.hp, animal.fixHP))
            $('#userBar').width(hpPercent(user.hp, user.fixHP))
            $('#userHP').html(user.hp)
        } else if (animal.hp > 0 && user.hp <= 0) {
            $('#animalHP').html(animal.hp)
            $('#userHP').html('0')
            $('#animalBar').width('0%')
            $('#userBar').width(hpPercent(user.hp, user.fixHP))
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