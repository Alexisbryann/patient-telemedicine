<!DOCTYPE html>
<html lang="en">
<head>
	<title>Chat</title>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1">
	<link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet">
	<link type="text/css" rel="stylesheet" href="assets/fonts/font-awesome.min.css">
	<link rel="stylesheet" type="text/css" href="css/chat.css">
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
</head>
<body>
	<section id="demo">
	    <div class="vertical-align">
	        <div class="container">
	            <div class="row">
	                <div class="col-sm-6 col-sm-offset-3 col-xs-offset-0">
	                    <div class="card no-border">
							<div class="oktari d-flex flex-row justify-content-between p-3 adiv text-white"><span class="pb-3">OktariChat</span></div>
	                        <div id="chat" class="conv-form-wrapper">
	                            <form id="chat-data" method="post" class="hidden" enctype="multipart/form-data">
									<input type="text" data-conv-question="Hello Bonface. Oktari here, Tunza Clinic assistant. I'll be connecting you to the doctor in a few. But first, kindly help us with these information." data-no-answer="true">
									<select data-conv-question="Bonface, kindly select your medical concern from the options provided below. You can select multiple." name="first-question[]" multiple>
										<option value="Family Planning">Family Planning</option>
										<option value="Rhesus Factor">Rhesus Factor</option>
										<option value="Non-Communicable Dieses">Non-Communicable Dieses</option>
										<option value="Child Care">Child Care</option>
										<option value="Tuberculosis">Tuberculosis</option>
										<option value="HIV & Aids">HIV & Aids</option>
									</select>
									<select data-conv-question="Bonface, would you like to briefly describe your medical condition?" name="second-question">
										<option value="yes">Sure</option>
										<option value="no">Not now</option>
									</select>
									<div data-conv-fork="second-question">
	                                    <div data-conv-case="yes">
	                                        <input type="text" name="medical-condition-desc" data-conv-question="Kindly type the description.">
											<input type="text" data-conv-question="Got it. Will pass it to daktari in a few." data-no-answer="true">
	                                    </div>
	                                </div>
	                                <select name="third-question" data-conv-question="Would you like to share any recent medical files with our doctor?">
	                                    <option value="yes">Yes, I'd like to</option>
	                                    <option value="no">Not really</option>
	                                </select>
									<div data-conv-fork="third-question">
	                                    <div data-conv-case="yes">
	                                        <input type="file" name="medical-reports[]" accept=".png,.jpg.jpeg,.pdf,.docx" data-conv-question="Kindly upload the medical reports/scans." multiple>
	                                    </div>
	                                </div>
	                                <select name="fourth-question" data-conv-question="Bonface, are you currently taking any prescribed medication?">
	                                    <option value="yes">Yes</option>
	                                    <option value="no">No</option>
	                                </select>
									<div data-conv-fork="fourth-question">
	                                    <div data-conv-case="yes">
	                                        <input type="text" name="medication" data-conv-question="Kindly state the medication you're currently using.">
	                                    </div>
	                                </div>
									<select name="fifth-question" data-conv-question="Do you have any medical allergies?">
	                                    <option value="yes">Yes</option>
	                                    <option value="no">No</option>
	                                </select>
									<div data-conv-fork="fifth-question">
	                                    <div data-conv-case="yes">
	                                        <input type="text" name="allergies" data-conv-question="Kindly state the medical allergies.">
	                                    </div>
	                                </div>
									<input type="text" data-conv-question="Alright! Thank you for sharing this information with us." data-no-answer="true">
									<select name="proceed" data-conv-question="Kindly press the button below to proceed to waiting room.">
	                                    <option value="Thank you Oktari">Proceed</option>
	                                </select>
	                            </form>
	                        </div>
	                    </div>
	                </div>
	            </div>
	        </div>
	    </div>
	</section>
	<script type="text/javascript" src="assets/jquery/jquery.min.js"></script>
	<script type="text/javascript" src="assets/autosize.min.js"></script>
	<script type="text/javascript" src="assets/chat.js"></script>
	<script>
		jQuery(function($){
			convForm = $('#chat').convform({selectInputStyle: 'disable'});
		});
	</script>
</body>
</html>