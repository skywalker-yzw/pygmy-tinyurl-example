var Pygmy = {
  
  initialize: function() {
    Pygmy.setInputs();
  },
  
  setInputs: function() {
    $('input.focus').eq(0).focus();
    $('input.select').select();
  }
}

$(function(){
  Pygmy.initialize();
})