$(document).ready(function () {
    var base_url = localStorage.getItem('base_url');
    /*Prevent from back Start */
    if (window.history && window.history.pushState) {
        window.history.pushState('', null, './login.html');        
        $(window).on('popstate', function() {
            // alert('Back button was pressed.');
            document.location.href = "#";
        });
    }
    /*Prevent from back End*/

    /* IF Local Storage has value */
    localGetItem();
    /* IF Local Storage has value */
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
                if (data.success == "OK") {
                    $('.d-loader').hide();
                    $('#_loginBtn').show();
                    $('.loginPhoneToggle').hide();
                    $('.PINChkToggle').show();                   
                    localStorage.setItem('f_name', data.deliveryUser.f_name);
                    localStorage.setItem('phone', data.deliveryUser.phone);                    
                    localGetItem();
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
    function localGetItem(){
        var f_name = localStorage.getItem("f_name");
        var phone = localStorage.getItem("phone");
        if(f_name && phone){
            $('.head-title').html('Hi, ' +f_name);
            $("#valid_phone").val(phone);
            $('.loginPhoneToggle').hide();
            $('.PINChkToggle').show();   
        }
        else{
            $('.loginPhoneToggle').show();
            $('.PINChkToggle').hide(); 
        }
        
    }
    
    /*Login PIN Start */
    $("#_loginPinChkForm").on('click', '#_loginPINBtn', function (event) {
        event.preventDefault();
        var postData = new FormData($("#_loginPinChkForm")[0]);
        $('.d-loader').show();
        $('#_loginPINBtn').hide();
        $('#pin-error').text("");
        $.ajax({
            type: 'POST',
            url: base_url + "/api/delivery/plogin",
            data: postData,
            dataType: "json",
            processData: false,
            contentType: false,
            cache: false,
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function (data) {
                if (data.success == "OK") {
                    $('.d-loader').hide();
                    $('#_loginPINBtn').show();
                    window.location.href="dashboard.html";
                    localStorage.setItem('s_name', data.user.s_name);
                    localStorage.setItem('phone', data.user.phone);
                    localStorage.setItem('email', data.user.email);
                    localStorage.setItem('access_token', data.access_token);
                }
                if (data.errors) {
                    $('.d-loader').hide();
                    $('#_loginPINBtn').show();
                    if (data.errors.pin) {
                        $('#pin-error').text(data.errors.pin);
                    }
                }//data.errors if end
            },//ajax success end
            error: function (badRes) {
                console.log(badRes)
                $('.d-loader').hide();
                $('#_loginPINBtn').show();
            },//ajax error end
        });///ajax end
    });
    /*Login PIN End */
   
    
});
