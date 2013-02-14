[text]null=
HAS_WEBDNA_TAGS
[include file=include/timeclock.funcs.dna]

[text multi=T]contentToReturn=&requestedCommand=[/text]

[formvariables name=apiCommand]
	[text]requestedCommand=[url][value][/url][/text]
[/formvariables]

[switch value=[requestedCommand]]
	[case value=addEntry]
		[text multi=T]personID=&projectID=&startDate=&startTime=&endDate=&endTime=[/text]
	
		[formvariables name=pPersonID]
			[text]personID=[url][value][/url][/text]
		[/formvariables]
	
		[formvariables name=pProjectID]
			[text]projectID=[url][value][/url][/text]
		[/formvariables]
	
		[formvariables name=pStartTime]
			[text]startPoint=[url][value][/url][/text]
		[/formvariables]
	
		[formvariables name=pEndTime]
			[text]endPoint=[url][value][/url][/text]
		[/formvariables]
	
		[text]contentToReturn=[addEditEntry personID=[personID]&projectID=[projectID]&startPoint=[startPoint]&endPoint=[endPoint]][/text]
	[/case]

	[case value=getEditableEntry]
		[text]timID=[/text]
	
		[formvariables name=timID]
			[text]timID=[url][value][/url][/text]
		[/formvariables]
	
		[text]contentToReturn=[getEditableEntry timeclockID=[timID]][/text]
	[/case]

	[case value=replaceEntry]
		[text multi=T]timeclockID=&personID=&projectID=&startDate=&startTime=&endDate=&endTime=[/text]
	
		[formvariables name=pTimeclockID]
			[text]timeclockID=[url][value][/url][/text]
		[/formvariables]
	
		[formvariables name=pPersonID]
			[text]personID=[url][value][/url][/text]
		[/formvariables]
	
		[formvariables name=pProjectID]
			[text]projectID=[url][value][/url][/text]
		[/formvariables]
	
		[formvariables name=pStartTime]
			[text]startPoint=[url][value][/url][/text]
		[/formvariables]
	
		[formvariables name=pEndTime]
			[text]endPoint=[url][value][/url][/text]
		[/formvariables]
	
		[text]contentToReturn=[replaceEntry timeclockID=[timeclockID]&personID=[personID]&projectID=[projectID]&startPoint=[startPoint]&endPoint=[endPoint]][/text]
	[/case]

	[case value=removeEntry]
		[text]timID=[/text]
	
		[formvariables name=timID]
			[text]timID=[url][value][/url][/text]
		[/formvariables]
	
		[text]contentToReturn=[removeEntry timeclockID=[timID]][/text]
	[/case]

	[case value=generateTimesheet]
		[text multi=T]personID=&startPoint=&endPoint=[/text]
	
		[formvariables name=pPersonID]
			[text]personID=[url][value][/url][/text]
		[/formvariables]
	
		[formvariables name=starting_date]
			[text]startPoint=[url][value][/url][/text]
		[/formvariables]
	
		[formvariables name=ending_date]
			[text]endPoint=[url][value][/url][/text]
		[/formvariables]
	
		[text]contentToReturn=[generateTimesheet personID=[personID]&startPoint=[startPoint]&endPoint=[endPoint]][/text]
	[/case]

	[case value=displayTimeclockEntries]
		[text multi=T]perID=&pageNum=[/text]
	
		[formvariables name=personID]
			[text]perID=[url][value][/url][/text]
		[/formvariables]
	
		[formvariables name=pageNumber]
			[text]pageNum=[url][value][/url][/text]
		[/formvariables]
	
		[text]contentToReturn=[displayTimeclockEntries personID=[perID]&pageNum=[pageNum]][/text]
	[/case]
	
	[case value=displayProjectHours]
		[text multi=T]projectID=&personID=&startDate=&endDate=[/text]
		
		[formvariables name=pProjectID]
			[text]projectID=[url][value][/url][/text]
		[/formvariables]
		
		[formvariables name=pPersonID]
			[text]personID=[url][value][/url][/text]
		[/formvariables]
		
		[formvariables name=pStartDate]
			[text]startDate=[url][value][/url][/text]
		[/formvariables]

		[formvariables name=pEndDate]
			[text]endDate=[url][value][/url][/text]
		[/formvariables]
		
		[text]contentToReturn=[displayProjectHours projectID=[projectID]&personID=[personID]&startDate=[startDate]&endDate=[endDate]][/text]
	[/case]
	
	[case value=editProjectName]
		[text multi=T]projectID=&projectName=[/text]
		
		[formvariables name=pProjectID]
			[text]projectID=[url][value][/url][/text]
		[/formvariables]
		
		[formvariables name=pNewProjectName]
			[text]projectName=[url][value][/url][/text]
		[/formvariables]
		
		[text]contentToReturn=[editProjectName projectID=[projectID]&projectName=[projectName]][/text]
	[/case]
	
	[case value=changeProjectProperty]
		[text multi=T]projectID=&projectProperty=&propertyValue=[/text]
		
		[formvariables name=pProjectID]
			[text]projectID=[url][value][/url][/text]
		[/formvariables]
		
		[formvariables name=pProjectProperty]
			[text]projectProperty=[url][value][/url][/text]
		[/formvariables]
		
		[formvariables name=pPropertyValue]
			[text]propertyValue=[url][value][/url][/text]
		[/formvariables]
		
		[text]contentToReturn=[changeProjectProperty projectID=[projectID]&projectProperty=[projectProperty]&propertyValue=[propertyValue]][/text]
	[/case]
	
	[case value=addProject]
		[text multi=T]projectName=&projectVisibility=[/text]
		
		[formvariables name=pProjectName]
			[text]projectName=[url][value][/url][/text]
		[/formvariables]
		
		[formvariables name=pAdminOnly]
			[text]projectVisibility=[url][value][/url][/text]
		[/formvariables]
		
		[text]contentToReturn=[addProject projectName=[projectName]&projectVisibility=[projectVisibility]][/text]
	[/case]
[/switch]

[/text][contentToReturn]