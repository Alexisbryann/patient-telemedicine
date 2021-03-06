<!-- chat container -->
<div id="chat-container" class="d-flex flex-column">
    <!-- messages container -->
    <div id="chat-messages-container" class="d-none">
        <div class="container d-flex justify-content-center">
            <div class="card">
                <!-- <div id="chat-messages" class="scroll-section">
                    <div class="d-flex flex-row justify-content-between p-3 adiv text-white">
                        <span class="pb-3">Patient/Doctor Chat</span><i class="fas fa-times"></i>
                    </div> -->

                <!-- <div class="activity d-flex flex-row p-3"> <img src="assets/images/female-skin-type.png" width="30"
                            height="30">
                        <div id="status" class="chat ml-2 bubble">
                            <div class="typing typing-1"></div>
                            <div class="typing typing-2"></div>
                            <div class="typing typing-3"></div>
                        </div>
                    </div> -->
                <!-- </div> -->
                <!-- <div class="d-flex flex-row p-3 input justify-content-between mt-auto">
                    <textarea name="new-chat" id="new-chat" placeholder="Type a message" class="form-control mr-2"
                        rows=2></textarea>

                    <input type="file" id="chat-upload-files" style="display: none;" name="chat-upload-files[]"
                        multiple="multiple" accept="image/*,.pdf,.txt,.doc,.docx,.odt,.xls,.csv">
                    <div class="d-flex" id="chat-buttons-container">
                        <label for="chat-upload-files" class="notes-icon mr-1" id="chat-upload-file" title="Add file">
                            <i class="fa fa-paperclip" aria-hidden="true"></i>
                        </label>
                        <span class="notes-icon ml-1" id="chat-send-message" title="Send message">
                            <i class="fa fa-paper-plane" style="margin-left: -2;" aria-hidden="true"></i>
                        </span>
                    </div>
                </div>

                <span id="telemed-chat-error" class="px-2"></span>
                <div id="telemed-chat-files-container" class="pb-2"></div> -->

                <iframe sandbox="allow-forms allow-pointer-lock allow-same-origin allow-scripts allow-top-navigation allow-popups" src="https://www.myhealthafrica.com/wp-content/themes/enfold/patient/<?php echo $user_type == "Pat" ? 'chat_patient' : 'chat_doctor'?>.php?appo=<?php echo $appointment_id; ?>" style="width:100%; height:90vh; border:none;" scrolling="no"></iframe>
                <span class="py-2 display-toggler card-hide-btn" id="hide-chat"
                    data-toggle="#chat-messages-container">Hide</span>
            </div>
        </div>
    </div>
    <!-- chat button -->
    <span id="chat-btn-container" class="display-toggler" data-toggle="#chat-messages-container" title="Doctor/Patient Chat">
        <i class="fa fa-comments-o mt-auto"></i>
        <span class="mb-auto" id="chat-button-text">Chat</span>
    </span>
</div>
<div class="modal fade" id="display-image-modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header py-0">
                <!-- <div class="modal-title modal-title d-flex justify-content-center w-100">
                    <img src="../images/mha-psi-tunza.png" alt="My Health Africa - PSI - Tunza Clinics">
                </div> -->
                <button type="button" class="close pb-4 bg-white" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <img src="https://localhost/uploads/2832/MicrosoftTeams-image.png" class="w-100">
            </div>
        </div>
    </div>
</div>