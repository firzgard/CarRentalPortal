$(document).ready(() => {
	$('input[name="NganLuong.PaymentMethod"]').change(function(evt){
		$('.payment-type-detail').removeClass('active');
		if(this.value == "ATM_ONLINE")
			$('#ATM_ONLINE_Detail').addClass('active');
		else if(this.value == "VISA")
			$('#VISA_Detail').addClass('active');
		else if(this.value == "NL")
			$('#NL_Detail').addClass('active');
	})

	bookingForm = $('#bookingForm');
	$('#payBtn').click(() => {
		bookingForm.find('#Action').val('pay')
		bookingForm.submit();
	})
	$('#deleteBtn').click(() => {
		bookingForm.find('#Action').val('delete')
		bookingForm.submit();
	})
	$('#changeBtn').click(() => {
		bookingForm.find('#Action').val('change')
		bookingForm.submit();
	})
});