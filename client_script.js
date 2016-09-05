 var socket = io();
 var chatter_id = false;
 $('#chat_msg_input').hide();
 $('#chatter').focus();

 function is_empty() {
  var validation;
  if (chatter_id == false)
   validation = document.getElementById("chatter").value;
  else
   validation = document.getElementById("message_inp").value;
  if (validation.trim() == "" || validation == 'null') {
   return false;
  };
 }
 
 $('form').submit(function() {
  if (chatter_id == false) {
   socket.emit('chatter_name', $('#chatter').val());
   chatter_id = $('#chatter').val();
   $('#chatter').val('');
   $('#header').hide();
   $('#name_input').hide();
   $('#chat_msg_input').show();
   $('#message_inp').focus();
   $.getJSON('/messages', function(data) {
    $.each(data, function(index, element) {
     $('#messages').append($('<li class="list-group-item"> <span class ="recvd_name">' + element.chat_name + '</span> <span class ="recvd_timestamp pull-right">' + element.timestmp + '</span><br><br><span class ="recvd_message">' + element.message + '</span> </li>'));
    });
   });
  } else {
   socket.emit('message', {
    name: chatter_id,
    msg: $('#message_inp').val()
   });
   $('#message_inp').val('');
  }
  return false;
 });
 socket.on('proc_message', function(recvd_packet) {
  $('#messages').append($('<li class="list-group-item"> <span class ="recvd_name">' + recvd_packet.name + '</span> <span class ="recvd_timestamp pull-right">' + recvd_packet.timestamp + '</span><br><br><span class ="recvd_message">' + recvd_packet.message + '</span> </li>'));
  scrollNewMessage();
  return false;
 });

 function scrollNewMessage() {
  $('html, body').animate({
   scrollTop: $(document).height() - $(window).height()
  }, 1000);
 }