$(document).ready(function () {        
    

    localStorage.setItem("base_url", "http://192.168.10.100/admin/grofie-business-portal-admin")
    var base_url = localStorage.getItem('base_url');

    var access_token = localStorage.getItem("access_token");
    if(!access_token){
        window.location.href = "login.html"
    }
    else{
        $.ajax({
            method:"GET",
            url:base_url+"/api/delivery/details",
            dataType: "json",
            processData: false,
            contentType: false,
            cache: false,
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                "Authorization":"Bearer "+access_token
            },
            success:function(res){
                console.log(res);
                $("#dashboard").load('dashboard2.html #x');
                //window.location.href = "dashboard.html"
            },//ajax success end
            error:function(badRes){
                console.log(badRes);
            }//ajax error end 
        });//ajax end 
    }
    
});