$(document).ready(() => {
    $('#first').delay(1500).fadeIn(1000)
    $('#second').delay(3000).fadeIn(1000)
    $('#third').delay(4500).fadeIn(1000)
    $('#fourth').delay(6000).fadeIn(1000)
    $('#fifth').delay(7500).fadeIn(1000)
    $('#sixth').delay(9000).fadeIn(1000)
    $('#seventh').delay(10500).fadeIn(1000)
    $('#eigth').delay(12000).fadeIn(1000, function () {
        $('#nigth').delay(2000).fadeIn(1250)
        $('#buttons').delay(2000).show(10, () => {
            $('#nextBtn').fadeIn('fast')
            $('#nextBtn').click(() => {
                $('#title').slideUp('fast')
                $('#first').fadeOut('fast')
                $('#second').fadeOut('fast')
                $('#third').fadeOut('fast')
                $('#fourth').fadeOut('fast')
                $('#fifth').fadeOut('fast')
                $('#sixth').fadeOut('fast')
                $('#seventh').fadeOut('fast')
                $('#eigth').fadeOut('fast')
                $('#nigth').fadeOut('fast')
                $('#nextBtn').fadeOut('fast', () => {
                    $('#tenth').slideDown(2000, () => {
                        $('#choicePicker').slideDown(15, () => {
                            $('#choicePicker').css('display', 'inline-flex')
                        })
                    })
                })
            })
        })

    })
})
