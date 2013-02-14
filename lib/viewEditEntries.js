$(document).ready(function()
{
	// Global variables
	var formGood = true;
	var startPoint = new Date();
	var endPoint = new Date();
	var midnight = new Date();
	midnight.setTime($('#pTodaysMidnight').val());
	var isCurrentlyEditing = false;
	var pageNum = 1;
	
	$('#pageContent').on('change', '#pStartTime, #pEndTime', function()
	{
		// Set respective global variable to new value
		if ($(this).attr('id') === 'pStartTime')
			startPoint.setTime($(this).val()*1000);
		else
			endPoint.setTime($(this).val()*1000);
		
		// If startPoint > endPoint, endPoint = startPoint
		if (startPoint > endPoint) setGlobalPointsEqual();
	});
	
	$('#pageContent').on('change', '#pStartDate, #pEndDate', function()
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
	
	function setGlobalPointsEqual()
	{
		endPoint.setTime(startPoint.getTime());
		
		$('#pEndDate').val($('#pStartDate').val());
		
		$('#pEndTime').html($('#pStartTime').html());
		$('#pEndTime').val($('#pStartTime').val());
	}
	
	$('#pageContent').on('click', '.next, .previous', function()
	{
		if (isCurrentlyEditing) return false;
		if ($(this).hasClass('disabled')) return false;
		
		pageNum = ($(this).hasClass('next')) ? pageNum + 1 : pageNum - 1;
		
		$.post('timeclock.api.tpl', { apiCommand: 'displayTimeclockEntries', personID: $('#pPersonID').val(), pageNumber: pageNum }, function(data)
		{
			$('#timeclockEntries').fadeOut('fast', function()
			{
				$('#timeclockEntries').html(data);
				$('#timeclockEntries').fadeIn('fast');
			});
		});
	});
	
	$('#pageContent').on('click', 'tr', function()
	{
		var timID = $(this).attr('id');
		
		if (isCurrentlyEditing || timID === 'tableHeader')
			return false; // don't do anything
		
		var rowContentsForRevert = $(this).html();
		var editingRowID = '#' + timID;
		var personEditingID = $('#pLoggedInID').val();
		
		// Retrieve editable content
		$(editingRowID).fadeOut('fast', function()
		{
			$.post('timeclock.api.tpl', { apiCommand: "getEditableEntry", timID: timID }, function(data)
			{
				isCurrentlyEditing = true;
				$(editingRowID).html(data);
				
				startPoint.setTime($('#pStartTime').val()*1000);
				endPoint.setTime($('#pEndTime').val()*1000);
				
				$(editingRowID).fadeIn('fast');
				
				$('#pStartDate, #pEndDate').datepicker({ dateFormat: "mm/dd/yy", maxDate: midnight });
				$('.dropdown-toggle').dropdown();
				
				// Add event handlers
				$('#pageContent').on('click', '#submit', { timID: timID, editingRowID: editingRowID }, function()
				{
					// Insert form validation code here 

					$(editingRowID).fadeOut('fast', function()
					{
						$.post('timeclock.api.tpl', $('#editTimeclockEntry').serialize(), function(data)
						{
							$(editingRowID).children('button').each().off('click');
							$(editingRowID).html(data);
							$(editingRowID).fadeIn('fast');

							isCurrentlyEditing = false;
						})
						.error(function()
						{
							displayMessage('error', 'There was a server error while updating your timeclock entry. Please try again.', 'Server Error While Updating Entry');
						});
					});

					return false;
				});

				$('#pageContent').one('click', '#cancel', { editingRowID: editingRowID, rowContentsForRevert: rowContentsForRevert }, function()
				{
					isCurrentlyEditing = false;
					$(editingRowID).children('button').each().off('click');
					$(editingRowID).fadeOut('fast', function()
					{
						$(editingRowID).html(rowContentsForRevert);
						$(editingRowID).fadeIn('fast');
					});
				
					return false;
				});
				
				$('#pageContent').on('click', '#delete', { timID: timID, editingRowID: editingRowID }, function()
				{
					$('#modal').modal();
				});

				$('#modal').on('click', 'a.btn-danger', { timID: timID, editingRowID: editingRowID }, function()
				{
					$('#modal').modal('hide');

					$.post('timeclock.api.tpl', { apiCommand: 'removeEntry', timID: timID }, function(data)
					{
						if ($.trim(data) === 'OK')
						{
							isCurrentlyEditing = false;
							$(editingRowID).fadeOut('fast', function()
							{
								$(editingRowID).remove();
								displayMessage('info', 'The entry has been deleted from your timeclock. This action cannot be undone.', 'Deleted Entry');
							});
						}
						else
						{
							displayMessage('error', 'Server reported this error:' + data, 'Could Not Delete Entry');
						}
					})
					.error(function()
					{
						displayMessage('error', 'The request to delete the entry had an unexpected error. Please try again.', 'Server Error While Deleting Entry');
					});

					return false;
				});
			})
			.error(function()
			{
				displayMessage('error', 'There was an unexpected problem retrieving the editable content you requested. Please try again.', 'Server Error While Retrieving Editable Entry');
				return false;
			});
		});
		
		return false;
	});
	
	$('#pPersonID').change(function()
	{
		if (isCurrentlyEditing) return false;
		
		pageNum = 1;
		$.post('timeclock.api.tpl', { apiCommand: 'displayTimeclockEntries', personID: $('#pPersonID').val(), pageNumber: pageNum }, function(data)
		{
			$('#timeclockEntries').fadeOut('fast', function()
			{
				$('#timeclockEntries').html(data);
				$('#timeclockEntries').fadeIn('fast');
			});
		});
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