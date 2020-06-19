
$(document).ready(function () {

    /*Menu Toggle Start */
    $('.menu-toggle').click(function () {
        $('.sidebar-left').toggleClass("open");
    });
    /*Menu Toggle End */
    
    /*Prevent from back Start */
    if (window.history && window.history.pushState) {
        window.history.pushState('', null, './dashboard.html');        
        $(window).on('popstate', function() {
            //alert('Back button was pressed.');
            document.location.href = "#";
        });
    }
    /*Prevent from back End*/
   
    var base_url = localStorage.getItem('base_url');
    var access_token = localStorage.getItem("access_token");
    $('#deliveryUserName').html('<h1>Hi, '+localStorage.getItem("f_name") +'<\h1>')
    /* Check whether user login or not */
    if (!access_token) {
        window.location.href = "login.html"
    }
    else {
       orders()
    }
    /* */
    function orders(){
        $.ajax({
            method: "GET",
            url: base_url + "/api/delivery/dashboard",
            dataType: "json",
            processData: false,
            contentType: false,
            cache: false,
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                'Accept': 'application/json',
                "Authorization": "Bearer " + access_token
            },
            success: function (data) {
                $('.preload').hide();
                var chkOrderId = 0;
                var i=0 ;
                for (count = 0; count < data.orderAssign.length; count++) {
                    if (chkOrderId != data.orderAssign[count].order_id) {
                        chkOrderId = data.orderAssign[count].order_id
                        $("#allOrders").append('<div class="orders">'
                            + '<div class="card mb-4">'
                            + '<div class="card-body">'
                            + '<div class="d-sm-flex align-item-sm-center flex-sm-nowrap">'
                            + '<div>'
                            + '<h6><a href="#">#' +(i = i+1 )+'. ' + data.orderAssign[count].f_name + ' ' + data.orderAssign[count].s_name + '</a></h6>'
                            + '<p class="ul-task-manager__font-date text-muted">Address: ' + data.orderAssign[count].place_name + '<br> ' + data.orderAssign[count].select_city + ' '
                            + '</p>'
                            + '<i class="ul-task-manager__fonts i-Telephone"></i> : <a href="">' + data.orderAssign[count].phone + '/' + data.orderAssign[count].alt_phone + '</a>'
                            + '</div>'
                            + '<ul class="list list-unstyled mb-0 mt-3 mt-sm-0 ml-auto">'
                            + '<li> <span class="ul-task-manager__font-date text-muted">Order Date : ' + data.orderAssign[count].order_date + '</span></li>'
                            + '<li class="dropdown">'
                            + '<span class="ul-task-manager__font-date text-muted">Status: &nbsp;</span>'
                            + '<p class="badge badge-warning">On Way</p>'
                            + '</li>'
                            + '<li class="dropdown">'
                            + '<span class="ul-task-manager__font-date text-muted">Location: </span > <a href="#">' + data.orderAssign[count].lat + ',' + data.orderAssign[count].long + ' </a>'
                            + '</li>'
                            + '<li class="dropdown">'
                            + '<span class="ul-task-manager__font-date text-muted">Distance:&nbsp;</span> ' + (data.orderAssign[count].distance / 2000).toFixed(2) + ' km '
                            + '</li>'
                            + '<li class="dropdown">'
                            + '<span class="ul-task-manager__font-date text-muted">Duration:&nbsp;</span> ' + (data.orderAssign[count].duration / 120).toFixed(2) + ' min'
                            + '</li >'
                            + '</ul >'
                            + '</div >'
                            + '</div >'
    
                            + '<div class="card-footer d-sm-flex justify-content-sm-between align-items-sm-center">'
    
                            + '<button type="button" '
                            + 'class="orders-detailsBtn btn btn-outline-dark btn-sm mb-3 float-right" data-order-id="' + data.orderAssign[count].order_id + '">'
                            + ' ' + data.orderAssign[count].order_id + ''
                            + '</button>'
    
                            + '</div>'
                            + '</div>'
                            + '</div>');
                    }//If condition to check dupliacte order assign
                }
    
            },//ajax success end
            error: function (badRes) {
                console.warn(badRes);
                if(badRes.status > 200){
                    orders();
                }
                if(badRes.status == 401){
                    localStorage.removeItem('access_token');
                    window.location.href = "login.html"
                }
            }//ajax error end 
        });//ajax end
    } 

    /* Orders Function End */
    $(document).on('click', '.orders-detailsBtn', function (event) {
        event.preventDefault();       
        var order_id = $(this).data('order-id');        
        localStorage.setItem('order_id', order_id);     
        window.location.href = "order-details.html";   
    });//Order Details Btn function end
    
    /*Logout Function Start */
    $(document).on('click', '#logout', function logout(){
        event.preventDefault();
        $.ajax({
            method: 'GET',
            url: base_url + "/api/delivery/logout",
            dataType: 'json',
            processData: false,
            contentType: false,
            cache: false,
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                'Accept': 'application/json',
                "Authorization": "Bearer " + access_token
            },
            success:function(data){
                if(data.logout == 1){
                    localStorage.removeItem('access_token');
                    window.location.href = "login.html";
                }
            },
            error:function(badRes){
                console.log(badRes);
                if(badRes.status > 401 && badRes.status <=500){
                    logout(event);
                }
            }
        });
    });
    /*Logout Function End */
});