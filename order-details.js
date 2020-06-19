$(document).ready(function () {
    var base_url = localStorage.getItem('base_url');
    var access_token = localStorage.getItem("access_token");
    $('#deliveryUserName').html('<h1>Hi, '+localStorage.getItem("f_name") +'<\h1>');
    var order_id = localStorage.getItem('order_id');
    
    if (order_id) {
        orderDetails(order_id);
    }
    else {
        console.warn("Order id not found");
    }
    function orderDetails(order_id) {
        $.ajax({
            method: 'GET',
            url: base_url + "/api/delivery/order/details/" + order_id,
            dataType: 'json',
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
                var i = 0, subtotal = 0, delcharges = 0, kmDelCharges = 0;
                $('.orderConf').append(' <button type="button" class="orderConfBtn btn btn-sm btn-warning m-1 float-right" data-order-id="' + data.orderDetails[0].order_id + '">Confirm</button> ');
                $('.order-id').text(data.orderDetails[0].order_id);
                $('.order-date').append('<strong>Order date: </strong>' + data.orderDetails[0].order_date);
                $('.name').text(data.orderDetails[0].f_name + ' ' + data.orderDetails[0].s_name);
                $("#place_name").text(data.orderDetails[0].place_name + ',\n' + data.orderDetails[0].select_city);
                $("#phone").text(data.orderDetails[0].phone + '/' + data.orderDetails[0].alt_phone);
                $('.orders-details').show();
                $('.spinner-btn').hide();
                $('.orderConf-spinner-btn').hide();
                $('.orders').hide();
                for (var count = 0; count < data.orderDetails.length; count++) {
                    if (i != data.orderDetails[count].order_id) {

                        i = data.orderDetails[count].order_id;
                        delcharges = parseInt(data.orderDetails[count].delivery_charges, 10);
                        kmDelCharges = parseInt(data.orderDetails[count].delivery_km_charges, 10);
                    }
                    if (data.orderDetails[count].order_stat == 2) {
                        var cost = '';
                        var price = '';
                        if (data.orderDetails[count].offers > 0) {
                            price = data.orderDetails[count].sell_price_after_offer;
                            cost = data.orderDetails[count].sell_price_after_offer * data.orderDetails[count].qty;
                        }
                        else {
                            price = data.orderDetails[count].sell_price;
                            cost = data.orderDetails[count].sell_price * data.orderDetails[count].qty;
                        }
                        subtotal = subtotal + cost;
                        $('#order-details-table').append('<tr class="order' + data.orderDetails[count].product_id + '">'
                            + '<th>' + data.orderDetails[count].product_name + '</th>'
                            + '<td>' + price + '</td>'
                            + '<td>' + data.orderDetails[count].qty + '</td>'
                            + '<td>' + cost + '</td>'
                            + '<td class="rtn">'
                            + '<button type="button" class="rtnBtn btn btn-outline-warning btn-sm" '
                            + ' data-product-id="' + data.orderDetails[count].product_id + '" data-order-id="' + data.orderDetails[count].order_id + '">Return</button></td>'
                            + '</tr>');
                    }
                }
                //Delivery Charges on Amount
                if (delcharges == 0) {
                    $('.deliveryAmount').text("Free");
                }
                else {
                    $('.deliveryAmount').text(delcharges);
                }
                //Delivery Charges on KM
                if (kmDelCharges == 0) {
                    $('.deliverykm').text("Free");
                }
                else {
                    $('.deliverykm').text(kmDelCharges);
                }
                total = subtotal + delcharges + kmDelCharges;
                // $('.subtotal').append('Sub total: <span>'+subtotal+'</span>');
                // $('.delivery').append('Delivery Charges: <span>'+delivery+'</span>');
                // $('.total').append('Total: <span>'+total+'</span>');
                $('.subtotal').text(subtotal);
                $('.total').text(total);

            },//ajax success end
            error: function (badRes) {
                console.warn(badRes);
                if (badRes.status > 200) {
                    orderDetails(order_id);
                }
            }//ajax error end
        });//ajax end
    }//orderDetails Function end

    $(document).on('click', '.rtnBtn', function  () {
        $('.spiner-details').show();
        $('#order-details-table tbody').empty();
        var order_id = $(this).data('order-id');
        var product_id = $(this).data('product-id');
        var itemInfo = [order_id , product_id];
        retunItem(itemInfo);
    });

    function retunItem(itemInfo){
        var order_id = itemInfo[0];
        var product_id = itemInfo[1];
        var itemInfo = [order_id , product_id];
        $.ajax({
            method: 'GET',
            url: base_url + "/api/delivery/order/return/" + order_id + "/" +product_id ,
            dataType: 'json',
            processData: false,
            cache: false,
            contentType: false,
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                'Accept': 'application/json',
                "Authorization": "Bearer " + access_token
            },
            success: function (data) {
                // orderDetails(order_id);
                $('.spiner-details').hide();
                $('.rtnBtn').show();
                var i = 0, subtotal = 0, delcharges = 0, kmDelCharges = 0;
                console.log(data);
                if (data.returnOrder.length == 0) {
                    window.location = "dashboard.html";
                }
                for (var count = 0; count < data.returnOrder.length; count++) {
                    if (i != data.returnOrder[count].order_id) {
        
                        i = data.returnOrder[count].order_id;
                        delcharges = parseInt(data.returnOrder[count].delivery_charges, 10);
                        kmDelCharges = parseInt(data.returnOrder[count].delivery_km_charges, 10);
                    }
        
                    if (data.returnOrder[count].order_stat == 2) {
                        var cost = '';
                        var price = '';
                        if (data.returnOrder[count].sell_price_after_offer > 0) {
                            price = data.returnOrder[count].sell_price_after_offer;
                            cost = data.returnOrder[count].sell_price_after_offer * data.returnOrder[count].qty;
                        }
                        else {
                            price = data.returnOrder[count].sell_price;
                            cost = data.returnOrder[count].sell_price * data.returnOrder[count].qty;
                        }
                        if (data.returnOrder[count].order_stat == -1) {
                            $('.rtnBtn').hide();
                            $('.rtnBtnD').show();
                        }
                        subtotal = subtotal + cost;
                        $('#order-details-table').append('<tr>'
                            + '<th>' + data.returnOrder[count].product_name + '</th>'
                            + '<td>' + price + '</td>'
                            + '<td>' + data.returnOrder[count].qty + '</td>'
                            + '<td>' + cost + '</td>'
                            + '<td class="rtn">'
                            +'<button type="button" class="rtnBtn btn btn-outline-warning btn-sm"'
                                +'data-product-id="' + data.returnOrder[count].product_id + '" data-order-id="' + data.returnOrder[count].order_id + '"> Return'
                            +'</button ></td > '+
        
                        '</tr>');
                    } 
                }
                //Delivery Charges on Amount
                if (delcharges == 0) {
                    $('.deliveryAmount').text("Free");
                }
                else {
                    $('.deliveryAmount').text(delcharges);
                }
                //Delivery Charges on KM
                if (kmDelCharges == 0) {
                    $('.deliverykm').text("Free");
                }
                else {
                    $('.deliverykm').text(kmDelCharges);
                }
                    total = subtotal + delcharges + kmDelCharges;
                    $('.subtotal').text(subtotal);
                    $('.total').text(total);
                },//ajax success end
                error: function (badRes) {
                    console.warn(badRes);
                    if(badRes.status > 200){
                        retunItem(itemInfo);
                    }
                }//ajax error end 
        });//ajax end
    }//Return Item function End

    /*Confirm Order Start*/
    $(document).on('click','.orderConfBtn',function (event){
        event.preventDefault()
        $('.orderConfBtn').hide();
        $('.orderConf-spinner').show();
        let order_id = $(this).data('order-id');
        confirmOrder(order_id);  
    });

    function confirmOrder(order_id){
        $.ajax({
            type:'GET',
            url:base_url+"/api/delivery/order/confirm/"+order_id,
            dataType: 'json',
            processData: false,
            cache: false,
            contentType: false,
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                'Accept': 'application/json',
                "Authorization": "Bearer " + access_token
            },
            success:function(data){
               console.log(data);
                if(data.success == 1){
                    window.location = "dashboard.html";
                }       
            },
            error:function(badRes){
                console.warn(badRes);
                if(badRes.status > 200){
                    confirmOrder(order_id);
                }
            }
        });
    }
    /*Confirm Order End*/

});