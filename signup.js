$(document).ready(function () {
    var base_url = localStorage.getItem('base_url');
    /*Sign UP Start */
    $("#_SignUpBtn").click(function (event) {
        event.preventDefault();
        var postData = new FormData($("#_signUpForm")[0]);
        $('.d-loader').show();
        $('#_SignUpBtn').hide();
        $('#fName-error').html("");
        $('#sName-error').html("");
        $('#phone-error').html("");
        $('#email-error').html("");
        $('#pin-error').html("");
        $('#pin-confirm-error').html("");
        $.ajax({
            type: 'POST',
            url: base_url + "/api/delivery/register",
            data: postData,
            dataType: "json",
            processData: false,
            contentType: false,
            cache: false,
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function (data) {
                $('.d-loader').hide();
                $('#_SignUpBtn').show();
                if (data.errors) {
                    if (data.errors.f_name) {
                        $('#fName-error').html(data.errors.f_name);
                    }
                    if (data.errors.s_name) {
                        $('#sName-error').html(data.errors.s_name);
                    }
                    if (data.errors.phone) {
                        $('#phone-error').html(data.errors.phone);
                    }
                    if (data.errors.email) {
                        $('#email-error').html(data.errors.email);
                    }
                    if (data.errors.pin) {
                        $('#pin-error').html(data.errors.pin);
                    }
                }//data.errors if end
            },//ajax success end
            error: function (badRes) {
                console.log(badRes);
                $('.d-loader').hide();
                $('#_SignUpBtn').show();
            }

        });

    });
    /*Sign UP End */
    /*Login Mobile Start */
    $("#_loginForm").on('click', '#_loginBtn', function (event) {
        event.preventDefault();
        var postData = new FormData($("#_loginForm")[0]);
        $('.d-loader').show();
        $('#_loginBtn').hide();
        $('#phone-error').text("");
        $.ajax({
            type: 'POST',
            url: base_url + "/api/delivery/mlogin",
            data: postData,
            dataType: "json",
            processData: false,
            contentType: false,
            cache: false,
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function (data) {
                console.log(data);
                if (data.success == "OK") {
                    $('.loginPhoneToggle').hide();
                    $('.PINChkToggle').show();
                    $('.d-loader').hide();
                    $('#_loginBtn').show();
                }
                if (data.errors) {
                    $('.d-loader').hide();
                    $('#_loginBtn').show();
                    if (data.errors.phone) {
                        $('#phone-error').text(data.errors.phone);
                    }
                }//data.errors if end
            },//ajax success end
            error: function (badRes) {
                console.log(badRes)
                $('.d-loader').hide();
                $('#_loginBtn').show();
            },//ajax error end
        });///ajax end

    });
    /*Login Mobile End */












});//Document Ready Function End 