$(document).ready(function()
{
	// Global variables
	var formGood = true;
	var startPoint = new Date($('#pStartTime').val()*1000);
	var endPoint = new Date($('#pEndTime').val()*1000);
	
	// Midnight global variable
	var midnight = new Date(endPoint.getTime());
	midnight.setHours(23);
	midnight.setMinutes(59);
	
	$('#pStartTime, #pEndTime').change(function()
	{
		// Set respective global variable to new value
		if ($(this).attr('id') === 'pStartTime')
			startPoint.setTime($(this).val()*1000);
		else
			endPoint.setTime($(this).val()*1000);
		
		// If startPoint > endPoint, endPoint = startPoint
		if (startPoint > endPoint) setGlobalPointsEqual();
	});
	
	$('#pStartDate, #pEndDate').datepicker({ dateFormat: "mm/dd/yy", maxDate: midnight });
	
	$('#pStartDate, #pEndDate').change(function()
	{
		var parentDivID = $(this).parent('div').attr('id');
		var testID = $(this).attr('id');
		var testValue = $.trim($(this).val());
		var testDate = null;
		
		// Validate input
		if (testValue === 'today' || testValue === 'Today')
			testDate = new Date();
		else
		{
			testValue = Date.parse(testValue);
			
			if (!isNaN(testValue))
				testDate = new Date(testValue);
			else
			{
				formGood = false;
				displayMessage('error', "Date must be in MM/DD/YYYY format or set to 'today'.", 'Invalid Date');
				return false;
			}
		}
		
		// Input valid enough to set global variable and input field
		var refPoint = (testID === 'pStartDate') ? startPoint : endPoint;
		testDate.setHours(refPoint.getHours());
		testDate.setMinutes(refPoint.getMinutes());
		refPoint.setTime(testDate.getTime());
		
		var dateString = '';
		dateString += ((refPoint.getMonth() + 1) < 10) ? '0' + (refPoint.getMonth() + 1) : (refPoint.getMonth() + 1);
		dateString += '/';
		dateString += (refPoint.getDate() < 10) ? '0' + refPoint.getDate() : refPoint.getDate();
		dateString += '/' + refPoint.getFullYear();
		
		$(this).val(dateString);
		
		// Future dates won't be accepted
		if (testDate > midnight)
		{
			formGood = false;
			displayMessage('warning', "Date cannot be in the future.", 'Invalid Date');
			return false;
		}
		
		// Change time option tags (times use Unix Epoch in seconds)
		if (testID === 'pStartDate')
			var timeID = '#pStartTime';
		else
			var timeID = '#pEndTime';
		
		$(timeID).empty();
		
		for (var i = 0; i <= 23; i++)
		{
			testDate.setHours(i);
			
			for (var j = 0; j <= 45; j += 15)
			{
				testDate.setMinutes(j);
				var tagValue = parseInt((testDate.getTime() / 1000), 10);
				var tagText = '';

				if (i === 0 || i === 12)
					tagText += '12';
				else
					tagText += ((i % 12) < 10) ? '0' + (i % 12) : (i % 12);

				tagText += ':';
				tagText += (j === 0) ? '00' : j;
				tagText += (i < 12) ? ' AM' : ' PM';
				
				if (testDate.getTime() === refPoint.getTime())
					var tagString = '<option selected value="' + tagValue + '">' + tagText + '</option>';
				else
					var tagString = '<option value="' + tagValue + '">' + tagText + '</option>';
					
				$(timeID).append(tagString);
			}
		}
		
		// If startPoint > endPoint, endPoint = startPoint
		if (startPoint > endPoint) setGlobalPointsEqual();
	});
	
	$('#formSubmit').click(function()
	{
		$('#addEntry').submit();
		return false;
	});
	
	$('#addEntry').submit(function()
	{
		// Test form
		formGood = true;
		$('#pStartDate').change();
		$('#pEndDate').change();
		
		if (formGood)
		{
			$.post('timeclock.api.tpl', $('#addEntry').serialize(), function(data)
			{
				if ($.trim(data) === 'OK') displayMessage('success', 'Your entry has been added to the timeclock.', 'Added Entry');
				else displayMessage('error', 'There was a server problem while adding your entry to the timeclock.<br>' + $.trim(data), 'Error While Adding Entry');
			})
			.error(function()
			{
				displayMessage('error', 'There was a problem contacting the server while adding your entry to the timeclock. Please try again.', 'Error While Adding Entry');
			});
		}
		else displayMessage('info', 'There are errors with your entry. Please correct them then try again.', 'Errors in Entry');
		
		return false;
	});
	
	$('#message').on('click', 'a.close', function()
	{
		$('#message').fadeOut('fast');
	});

	function displayMessage (alertType, message, header)
	{
		// Header is an optional parameter.
		if (typeof header === 'undefined' || header === null)
			var header = '';

		$('#message').fadeOut('fast', function()
		{
			// Set #message class
			if (alertType === 'info') 
				$('#message').attr('class', 'alert alert-info');
			else
			if (alertType === 'warning') 
				$('#message').attr('class', 'alert');
			else
			if (alertType === 'error') 
				$('#message').attr('class', 'alert alert-error');
			else
			if (alertType === 'success') 
				$('#message').attr('class', 'alert alert-success');

			var messageString = '<a class="close">x</a><h4 class="alert-heading">' + header + '</h4> ' + message;
			$('#message').html(messageString);

			$('#message').fadeIn('fast');
		});
	}
	
	function setGlobalPointsEqual()
	{
		endPoint.setTime(startPoint.getTime());
		
		$('#pEndDate').val($('#pStartDate').val());
		
		$('#pEndTime').html($('#pStartTime').html());
		$('#pEndTime').val($('#pStartTime').val());
	}
});