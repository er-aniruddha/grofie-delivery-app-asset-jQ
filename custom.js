$(document).ready(function () {
    /* Input Label Animation function Start*/
    $('.input1').each(function () {
        $(this).on('blur', function () {
            if ($(this).val().trim() != "") {
                $(this).addClass('has-val');
            }
            else {
                $(this).removeClass('has-val');
            }
        })
    })
    /* Input Label Animation function End*/
});//Document Ready Function End 