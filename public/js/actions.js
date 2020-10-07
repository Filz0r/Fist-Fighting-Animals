function fight(action) {
    const animal = {
        name: $('#animalName').html(),
        level: + $('#animalLevel').html().replace(/,/g, ''),
        attack: + $('#animalAttack').html().replace(/,/g, ''),
        defense: + $('#animalDefense').html().replace(/,/g, ''),
        hp: + $('#animalHP').html().replace(/,/g, '')
    }
    const user = {
        name: $('#userName').html(),
        level: + $('#userLevel').html().replace(/,/g, ''),
        attack: + $('#userAttack').html().replace(/,/g, ''),
        defense: + $('#userDefense').html().replace(/,/g, ''),
        hp: + $('#userHP').html().replace(/,/g, '')
    }
    if (action == 'attack') {
        animal.hp = Math.round(animal.hp - (user.attack * 0.65 + animal.defense * 0.35))
        user.hp = Math.round(user.hp - (user.defense * 0.05 + animal.attack * 0.95))
        if(animal.hp <= 0 && user.hp > 0) {
            $('#animalHP').html('0')
            $('#userHP').html(user.hp)
            $('#winModal').show()
            document.body.className = 'modal-open'
        } else if (animal.hp > 0 && user.hp > 0) {
            $('#animalHP').html(animal.hp)
            $('#userHP').html(user.hp)
        } else if (animal.hp > 0 && user.hp <= 0) {
            $('#animalHP').html(animal.hp)
            $('#userHP').html('0')
            $('#lossModal').show()
        }        
    } else if (action == 'defend') {
        animal.hp = Math.round(animal.hp - (user.defense * 0.45 + animal.defense * 0.55))
        user.hp = Math.round(user.hp - (user.defense * 0.05 + animal.attack * 0.95))
        if(animal.hp <= 0 && user.hp > 0) {
            $('#animalHP').html('0')
            $('#userHP').html(user.hp)
            $('#winModal').show()
            document.body.className = 'modal-open'
        } else if (animal.hp > 0 && user.hp > 0) {
            $('#animalHP').html(animal.hp)
            $('#userHP').html(user.hp)
        } else if (animal.hp > 0 && user.hp <= 0) {
            $('#animalHP').html(animal.hp)
            $('#userHP').html('0')
            $('#lossModal').show()
        }
    }
}