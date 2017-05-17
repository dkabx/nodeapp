$(document).ready(function(){
  $('.loginContainer').hide();

  $("#loginlink").click(function(){

    $(".registerContainer").hide();
      $(".loginContainer").show();
  });

    $("#registerlink").click(function(){
      $(".loginContainer").hide();
      $(".registerContainer").show();
    });

})
