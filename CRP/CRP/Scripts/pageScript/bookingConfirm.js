$(document).ready(() => {
	// payment method radio group
	$('input[name="PaymentMethod"]').change(function(evt){
		$('.payment-type-detail').removeClass('active');
		if(this.value == "ATM_ONLINE")
			$('#ATM_ONLINE_Detail').addClass('active');
		else if(this.value == "VISA")
			$('#VISA_Detail').addClass('active');
		else if(this.value == "NL")
			$('#NL_Detail').addClass('active');
	})

	// Submit buttons
	bookingForm = $('#bookingForm');
	$('#payBtn').click((evt) => {
		evt.preventDefault();
		evt.stopPropagation();

		bookingForm.find('#Action').val('pay')
		bookingForm.submit();
	})
	$('#deleteBtn').click((evt) => {
		evt.preventDefault();
		evt.stopPropagation();

		bookingForm.find('#Action').val('delete')
		bookingForm.submit();
	})
	$('#changeBtn').click((evt) => {
		evt.preventDefault();
		evt.stopPropagation();

		bookingForm.find('#Action').val('change')
		bookingForm.submit();
	})
});