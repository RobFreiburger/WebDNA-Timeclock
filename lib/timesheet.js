$(document).ready(function()
{
	$('#starting_date, #ending_date').datepicker({ dateFormat: "mm/dd/yy" });
	
	$('#rangeSubmit').click(function()
	{
		$('#timesheetContent').hide();
		$.post('timeclock.api.tpl', $('#timesheetRange').serialize(), function(data)
		{
			$('#timesheetContent').html($.trim(data));
			$('#timesheetContent').fadeIn('fast');
		})
		.error(function()
		{
			displayMessage('error', 'Timesheet could not be generated', 'Server Error While Generating Timesheet');
		});
		
		return false;
	});
	
	$('#rangePrint').click(function()
	{
		$('#timesheetContent').hide();
		$.post('timeclock.api.tpl', $('#timesheetRange').serialize(), function(data)
		{
			$('#timesheetContent').html($.trim(data));
			$('#timesheetContent').fadeIn('fast', function()
			{
				window.print();
			});
		})
		.error(function()
		{
			displayMessage('error', 'Timesheet could not be generated', 'Server Error While Generating Timesheet');
		});
		
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
});