$(document).ready(function(){

    /*Prevent from back Start */
    if (window.history && window.history.pushState) {
        window.history.pushState('', null, './account.html'); 
        $(window).on('popstate', function() {
            if($('#_chngPass').is(':visible')) {
                $("#_accountDetails").show();
                $("#_chngPass").hide();
            }
            else{
                window.location.href = "dashboard.html"
            }
        });
    }
    /*Prevent from back End */

    /*Back Button Click Start */
    $(document).on('click', '#backBtn', function(){
        if($('#_chngPass').is(':visible')) {
            $("#_accountDetails").show();
            $("#_chngPass").hide();
        }
        else{
            window.location.href = "dashboard.html"
        }
    });
    /*Back Button Click End */

    /*Prevent from back End*/
    var base_url = localStorage.getItem('base_url');
    var access_token = localStorage.getItem("access_token");
    var f_name = localStorage.getItem('f_name');
    var s_name = localStorage.getItem("s_name");
    var phone = localStorage.getItem("phone");
    var email = localStorage.getItem("email");

    $("#name").val(localStorage.getItem('f_name')+" "+ localStorage.getItem('s_name'));
    $("#phone").val(localStorage.getItem('phone'));
    $("#email").val(localStorage.getItem('email'));
   
    /*Account Toggle Start */
    $(document).on('click', '.chng-pass', function(){
        $("#_accountDetails").hide();
        $("#_chngPass").show();
    });
    /*Account Toggle End */
    
});