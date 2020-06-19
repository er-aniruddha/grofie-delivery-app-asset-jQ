$(document).ready(function () {
    var base_url = localStorage.getItem('base_url');
    var access_token = localStorage.getItem("access_token");
    $('#deliveryUserName').html('<h1>Hi, '+localStorage.getItem("f_name") +'<\h1>');
    var order_id = localStorage.getItem('order_id');
    
    if (order_id) {
        deliveryDetails(order_id);
    }
    else {
        console.warn("Order id not found");
    }
    function deliveryDetails(order_id) {
        $.ajax({
            method: 'GET',
            url: base_url + "/api/delivery/all/delivered/details/" + order_id,
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
                console.log(data);
                $('.preload').hide();
                var i = 0, subtotal = 0, delcharges = 0, kmDelCharges = 0;
                $('.order-id').text(data.deliveryDetails[0].order_id);
                $('.order-date').append('<strong>Order date: </strong>' + data.deliveryDetails[0].order_date);
                $('.name').text(data.deliveryDetails[0].f_name + ' ' + data.deliveryDetails[0].s_name);
                $("#place_name").text(data.deliveryDetails[0].place_name + ',\n' + data.deliveryDetails[0].select_city);
                $("#phone").text(data.deliveryDetails[0].phone + '/' + data.deliveryDetails[0].alt_phone);
                $('.orders-details').show();
                $('.spinner-btn').hide();
                $('.orderConf-spinner-btn').hide();
                $('.orders').hide();
                for (var count = 0; count < data.deliveryDetails.length; count++) {
                    if (i != data.deliveryDetails[count].order_id) {

                        i = data.deliveryDetails[count].order_id;
                        delcharges = parseInt(data.deliveryDetails[count].delivery_charges, 10);
                        kmDelCharges = parseInt(data.deliveryDetails[count].delivery_km_charges, 10);
                    }
                    if (data.deliveryDetails[count].order_stat == 3) {
                        var cost = '';
                        var price = '';
                        if (data.deliveryDetails[count].offers > 0) {
                            price = data.deliveryDetails[count].sell_price_after_offer;
                            cost = data.deliveryDetails[count].sell_price_after_offer * data.deliveryDetails[count].qty;
                        }
                        else {
                            price = data.deliveryDetails[count].sell_price;
                            cost = data.deliveryDetails[count].sell_price * data.deliveryDetails[count].qty;
                        }
                        subtotal = subtotal + cost;
                        $('#order-details-table').append('<tr class="order' + data.deliveryDetails[count].product_id + '">'
                            + '<th>' + data.deliveryDetails[count].product_name + '</th>'
                            + '<td>' + price + '</td>'
                            + '<td>' + data.deliveryDetails[count].qty + '</td>'
                            + '<td>' + cost + '</td>'
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
                    deliveryDetails(order_id);
                }
            }//ajax error end
        });//ajax end
    }//deliveryDetails Function end

    

    
});