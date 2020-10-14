const errorHandler = (errNum) => {
    $(`#err${errNum}`).slideDown('slow')
    setTimeout(function() { 
        $(`#err${errNum}`).slideUp('slow') 
    }, 4000)
}
$(document).ready(() => {
    const ogAttack = parseInt($('#userAttack').attr('value'))
    const ogDefense = parseInt($('#userDefense').attr('value'))
    const ogHP = parseInt($('#userHP').attr('value'))
    let points = parseInt($('#userPoints').attr('value'))
    let attack = parseInt($('#userAttack').attr('value'))
    let defense = parseInt($('#userDefense').attr('value'))
    let hp = parseInt($('#userHP').attr('value'))
    //handles the attack
    $('#attack .fa-plus').click(() => {
        if (points <= 0) return errorHandler(0)
        attack += 1
        points -= 1
        $('#userAttack').attr('value', attack)
        $('#userPoints').attr('value', points)
    })
    $('#attack .fa-minus').click(() => {
        if (attack <= ogAttack) return errorHandler(1)
        attack -= 1
        points += 1
        $('#userAttack').attr('value', attack)
        $('#userPoints').attr('value', points)
    })
    // handles the defense
    $('#defense .fa-plus').click(() => {
        if (points <= 0) return $('#err0').show()
        defense += 1
        points -= 1
        $('#userDefense').attr('value', defense)
        $('#userPoints').attr('value', points)
    })
    $('#defense .fa-minus').click(() => {
        if (defense <= ogDefense) return errorHandler(1)
        defense -= 1
        points += 1
        $('#userDefense').attr('value', defense)
        $('#userPoints').attr('value', points)
    })
    // handles the hp
    $('#hp .fa-plus').click(() => {
        if (points <= 0) return errorHandler(0)
        if (points - 5 < 0) return errorHandler(2)
        hp += 5
        points -= 5
        $('#userHP').attr('value', hp)
        $('#userPoints').attr('value', points)
    })
    $('#hp .fa-minus').click(() => {
        if (hp <= ogHP) return errorHandler(1)
        hp -= 5
        points += 5
        $('#userHP').attr('value', hp)
        $('#userPoints').attr('value', points)
    })

})
