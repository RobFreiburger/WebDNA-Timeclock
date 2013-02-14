$(document).ready(function()
{
	var isCurrentlyEditing = false;
	var projectName = "";
	
	$('#editProjects').on('click', 'td', function()
	{
		if (isCurrentlyEditing) return false;
		if (!($(this).attr('id') === "editProjectName")) return false;
		
		isCurrentlyEditing = true;
		projectName = $(this).text();
		
		var htmlString = "";
		htmlString += "<div class='input-append'>"
		htmlString += "<input type='text' id='pEditProjectName' name='pEditProjectName' class='input-large' value='" + projectName + "'>";
		htmlString += "<button id='submitProjectName' class='btn btn-primary' type='submit'><i class='icon-pencil icon-white'></i> Save</button>";
		htmlString += "<button id='cancelProjectName' class='btn' type='button'><i class='icon-repeat'></i> Cancel</button>";
		htmlString += "</div>";
		
		$(this).html(htmlString);
				
		return false;
	});
	
	$('#editProjects').on('click', '#cancelProjectName', function()
	{
		isCurrentlyEditing = false;
		$(this).parents('td').text(projectName);
		return false;
	});
	
	$('#editProjects').on('click', '#submitProjectName', function()
	{
		var newProjectName = $('#pEditProjectName').val();
		var projectID = $(this).parents('tr').attr('id');
		
		$.post('timeclock.api.tpl', { apiCommand: 'editProjectName', pProjectID: projectID, pNewProjectName: newProjectName }, function(data)
		{
			if ($.trim(data) === "OK")
			{
				$('#' + projectID).children('#editProjectName').text(newProjectName);
				isCurrentlyEditing = false;
			}
			else
			{
				displayMessage("error", "The project name could not be edited. Reason: " + data, "Edit Not Saved");
			}
		})
		.error(function()
		{
			displayMessage("error", "There was an unexpected problem communicating with the server. Please try again.", "Edit Not Saved");
		});
		
		return false;
	});
	
	$('#editProjects').on('click', '.btn', function()
	{
		if (isCurrentlyEditing) return false;
		if (!(($(this).attr('id') === "adminOnly") || ($(this).attr('id') === "status"))) return false;
		
		var btnPointer = $(this);
		var projectID = $(this).parents('tr').attr('id');
		
		if ($(this).hasClass('btn-inverse'))
		{
			$.post('timeclock.api.tpl', { apiCommand: 'changeProjectProperty', pProjectID: projectID, pProjectProperty: btnPointer.attr('id'), pPropertyValue: '1=1'}, function(data)
			{
				if ($.trim(data) === "OK")
				{
					btnPointer.toggleClass('btn-inverse');
					if (btnPointer.attr('id') === "adminOnly") btnPointer.text('Everyone');
					if (btnPointer.attr('id') === "status") btnPointer.text('Active');
				}
				else
				{
					displayMessage("error", "Cannot update project property. Reason: " + data, "Property Not Saved");
				}
			});
		}
		else
		{
			$.post('timeclock.api.tpl', { apiCommand: 'changeProjectProperty', pProjectID: projectID, pProjectProperty: btnPointer.attr('id'), pPropertyValue: '1=0'}, function(data)
			{
				if ($.trim(data) === "OK")
				{
					btnPointer.toggleClass('btn-inverse');
					if (btnPointer.attr('id') === "adminOnly") btnPointer.text('Admins Only');
					if (btnPointer.attr('id') === "status") btnPointer.text('Inactive');
				}
				else
				{
					displayMessage("error", "Cannot update project property. Reason: " + data, "Property Not Saved");
				}
			});
		}
		
		return false;
	});
	
	$('#addProject').on('click', '#formReset', function()
	{
		$('#pProjectName').val('');
		$('.btn-group').children().removeClass('active');
		$('.btn-group :first-child').addClass('active');
	});
	
	$('#addProject').on('click', '#formSubmit', function()
	{
		var projectName = $('#pProjectName').val();
		var projectVisiblity = $('.btn-group').children('.active').text();
		
		$.post('timeclock.api.tpl', { apiCommand: "addProject", pProjectName: projectName, pAdminOnly: projectVisiblity }, function(data)
		{
			if ($.trim(data) === "OK")
				displayMessage("success", "Project has been created. If you need to change something, please refresh the page.", "Created Project");
			else
				displayMessage("error", "Project could not be created. Reason: " + data, "Project Not Created");
		})
		.error(function()
		{
			displayMessage("error", "Unexpected error happened while trying to create project. Please try again.", "Project Not Created");
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