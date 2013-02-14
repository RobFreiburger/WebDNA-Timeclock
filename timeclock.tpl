[text]null=
	<!-- HAS_WEBDNA_TAGS -->
	[include file=include/timeclock.funcs.dna]

	// Parse displayPage command and set variables to corresponding page contents
	[text]requestedPage=[/text]
	[formvariables name=displayPage]
		[text]requestedPage=[url][value][/url][/text]
	[/formvariables]

	[switch value=[requestedPage]]
		[case value=adminViewProjectHours]	[text]actualPage=[requestedPage][/text]	[/case]
		[case value=adminEditProjects]			[text]actualPage=[requestedPage][/text]	[/case]
		[case value=viewEditEntries]				[text]actualPage=[requestedPage][/text]	[/case]
		[case value=timesheet]							[text]actualPage=[requestedPage][/text]	[/case]
		[default]														[text]actualPage=addEntry[/text]				[/default]
	[/switch]

	[text]jsFile=lib/[actualPage].js[/text]
[/text]
<!DOCTYPE HTML>
<html>
	<head>
		<title>Timeclock</title>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<link href="lib/jquery-ui.custom.css" rel="stylesheet">
		<link rel="stylesheet" href="lib/bootstrap.min.css" type="text/css">
		<style type="text/css">
			body {
				padding-top: 60px;
				padding-bottom: 40px;
			}
		</style>
		<link rel="stylesheet" href="lib/bootstrap-responsive.min.css" type="text/css">
		<link rel="stylesheet" href="lib/print.css" media="print">
	</head>
	<body>
		<div class="navbar navbar-fixed-top">
			<div class="navbar-inner">
				<div class="container-fluid">
					<a class="brand" href="[thisurl]">Timeclock</a>
				</div>
			</div>
		</div>
		
		<div class="container-fluid">
			<div class="row-fluid">
				<div id="pageContent" class="span9">
					[getPageContent [actualPage]]
				</div>
				<div class="span3">
					<div class="well">
						<ul class="nav nav-list">
							<li class="nav-header">Timeclock</li>
							<li [showif [actualPage]=addEntry]class="active"[/showif]><a href="[thisurl]?displayPage=addEntry">Add Entry</a></li>
							<li [showif [actualPage]=viewEditEntries]class="active"[/showif]><a href="[thisurl]?displayPage=viewEditEntries">View/Edit Entries</a></li>
							<li [showif [actualPage]=timesheet]class="active"[/showif]><a href="[thisurl]?displayPage=timesheet">Timesheet</a></li>
							<li class="nav-header">Administration</li>
							<li [showif [actualPage]=adminViewProjectHours]class="active"[/showif]><a href="[thisurl]?displayPage=adminViewProjectHours">View Project Hours</a></li>
							<li [showif [actualPage]=adminEditProjects]class="active"[/showif]><a href="[thisurl]?displayPage=adminEditProjects">Edit Projects</a></li>
						</ul>
					</div>
				</div>
			</div>
		</div>
		<script type="text/javascript" src="lib/jquery.js"></script>
		<script type="text/javascript" src="lib/jquery-ui.custom.js"></script>
		<script type="text/javascript" src="lib/bootstrap.min.js"></script>
		<script type="text/javascript" src="[jsFile]"></script>
	</body>
</html>