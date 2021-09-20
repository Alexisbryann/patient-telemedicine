$(function () {
    const telemed_iframe = $("#telemed-iframe"),
        chat_app_settings = {
            user_type: telemed_iframe.data("user_type"),
            user_id: telemed_iframe.data("user_id"),
            appointment_id: telemed_iframe.data("appointment_id"),
            recipient_id: telemed_iframe.data("recipient_id"),
            recipient_name: telemed_iframe.data("chat_recipient_name"),
            consultation_start_time: new Date().getTime(),
            error_messages: {
                0: "Something went wrong. Please try again.",
                1: "Something went wrong. Please try again.",
                2: "The request sent was incomplete. Please please ensure you entered the correct URL. Refreshing the page might clear the issue.",
                3: "One or more files uploaded was corrupted. Please try again.",
                4: "One or more files uploaded has an unsupported extension. Only documents and images are allowed.",
            },
            domain_name: "myhealthafrica.com/coldroom",
            mobile_screen: window.innerWidth < 758,
        };
    let uploaded_files = {
        notes: [],
        chat: []
    }, // for storing uploaded file objects for saving
        notes_settings = {
            operation: "add-new", // setting for whether to create new notes or update existing
            uploads_start_index: 0, // position to begin saving files
            note_id: undefined, // for continuous saving of doctor's notes during the session to the same notes record
        };

    $("#new-chat").on("input", function () {
        this.style.height = "auto";
        this.style.height = (this.scrollHeight) + "px";
    });

    $("#notes-file-input").on("change", function () {
        addFileUpload($(this), $("#attached-files-container"), uploaded_files.notes, $("#telemed-case-notes-error"));
    });

    $("#chat-upload-files").on("change", function () {
        addFileUpload($(this), $("#telemed-chat-files-container"), uploaded_files.chat, $("#telemed-chat-error"), "chat");
    });

    $(document).on("click", ".delete-file", function () {
        const file_designation = $(this).data("designation");
        removeFileUpload(uploaded_files[file_designation], $(this));
    });

    $("#save-notes-button").on("click", function () {
        const case_note_text = $("#notes-textarea").val(),
            appointment_id = chat_app_settings.appointment_id;

        saveCaseNotes(uploaded_files.notes, uploaded_files.notes.slice(notes_settings.uploads_start_index), case_note_text, appointment_id, $(this), notes_settings);
    });

    $(".display-toggler").on("click", function () {
        const target_id = $(this).attr("data-toggle"),
            target = $(target_id);

        toggleDisplay(target);
    });

    // get chat messages
    $.ajax({
        method: "GET",
        url: `MHAChat/operations.php?operation=getChatMessages&appointment_id=${chat_app_settings.appointment_id}&user_type=${chat_app_settings.user_type}&user_id=${chat_app_settings.user_id}`,
        dataType: "json",
        success: function (response) {
            if (response.error) {
                return false;
            }

            for (const i in response) {
                if (Object.hasOwnProperty.call(response, i)) {
                    const message = response[i],
                        chat_message = generateChatMessage(message.msg, message.msg_from === chat_app_settings.user_type, message.selectedfile, message.date_added, chat_app_settings.recipient_name, chat_app_settings.domain_name);

                    $("#chat-messages").append(chat_message);
                }
            }
        },
        error: function (error) {
            console.log(error);
        },
        complete: function () {

        }
    });

    // websocket connection and event handlers
    var conn = new WebSocket(`wss://https://${chat_app_settings.domain_name}:8080?user_type=${chat_app_settings.user_type}&id=${chat_app_settings.user_id}&appointment_id=${chat_app_settings.appointment_id}`);

    // conn.onopen = function (e) {
    // };

    conn.onmessage = function (e) {
        const data = JSON.parse(e.data);

        const timestamp = new Date(),
            message_time = `${(`0${timestamp.getDate()}`).slice(-2)}/${(`0${timestamp.getMonth() + 1}`).slice(-2)} ${(`0${timestamp.getHours()}`).slice(-2)}:${(`0${timestamp.getMinutes()}`).slice(-2)}`,
            message_bubble = generateChatMessage(data.message, false, data.file_paths.split("#?#"), message_time, chat_app_settings.recipient_name, chat_app_settings.domain_name);

        $("#chat-messages").append(message_bubble).scrollTop($('#chat-messages')[0].scrollHeight);
    };

    // conn.onclose = function (e) {
    // };

    // conn.onerror = function (e) {
    // };

    $("#chat-send-message").on("click", function () {
        const message_field = $("#new-chat"),
            text = message_field.val().trim();

        let files_empty = true;
        uploaded_files.chat.forEach(file => { // check if there is any non-empty item in the files list
            if (file) {
                files_empty = false;
                return;
            }
        });

        if (text || !files_empty) sendMessage(message_field, uploaded_files, chat_app_settings, conn);
    });

    $(".modal-button.stay").on("click", function () {
        $("#leave-room-modal").modal("hide");
    });

    $(".modal-button.leave").on("click", function () {
        leaveVirtualRoom(chat_app_settings);
    });

    if (chat_app_settings.mobile_screen) {
        $("#notes-btn-container-desktop").remove();
    } else {
        $("#notes-btn-container").remove();
    }
});

function addFileUpload(files_field, files_display_container, uploaded_files, error_message_container, file_designation = "notes") {
    /**
     * Displays uploaded files in the doctors notes section, validates for illegal extensions and adds them to array of uploaded file objects
     * 
     * @param jQuery files_field files input field element
     * @param jQuery files_display_container container to append new file(s)
     * @param array uploaded_files array of file objects that have been uploaded so far
     * 
     * @return void
     */

    const files = files_field[0].files, // files from input
        file_placeholder = (file_name, index) => `
        <span class="notes-attachment-container p-2" title="${file_name}">
            <i class="fa fa-file-text"></i><span class="notes-file-name mx-2">${file_name.slice(0, 7)}...</span>
            <span class="delete-file" title="Remove upload" data-file_index = ${index} data-designation=${file_designation}></span>
        </span>`,
        uploaded_file_timestamps = uploaded_files.map(file_object => { file_object.name, file_object.lastModified }),
        uploaded_file_names = uploaded_files.map(file_object => file_object.name);

    let extension_errors = false;

    [...files].forEach(file => {
        const file_name = file.name,
            file_index = uploaded_files.length,
            file_errors = validateFile(file);

        if (file_errors.extension_error) {
            extension_errors = true;
            return false;
        }

        if (uploaded_file_names.includes(file_name) && uploaded_file_timestamps[file_name] == file.created) return false; // skip file if the same file has already been uploaded

        files_display_container.append(file_placeholder(file_name, file_index));

        uploaded_files[file_index] = file;
    });

    if (extension_errors) {
        error_message_container.text("Could not add one or more files with an invalid extension.").show();

        setTimeout(() => {
            error_message_container.hide(150).empty();
        }, 3000);
    }
}

function removeFileUpload(uploaded_files, clicked_element) {
    /**
     * Removes an uploaded file from the list of displayed files and sets its value to an empty array in the list of uploaded files
     * 
     * @param array uploaded_files list of uploaded file objects
     * @param jQuery clicked_element element clicked to delete file
     * 
     * @return void
     */

    const file_index = clicked_element.data('file_index');

    clicked_element.closest(".notes-attachment-container").remove();

    uploaded_files[file_index] = [];
}

function saveCaseNotes(all_uploads, new_files, case_note_text, appointment_id, clicked_element, notes_settings) {
    /**
     * Sends case notes data to backend, and returns the response from the backend. If notes were saved successfully, it should update the case notes ID for updating the notes record with subsequent saving instead of creating new notes records
     * 
     * @param array new_files list of file objects for uploaded files
     * @param string case_note_text text entered in the case notes field
     * @param int appointment_id appointment id for the current appointment
     * @param jQuery clicked_element button clicked to trigger function
     * @param Object notes_settings settings for notes upload operation and starting index for uploads
     * 
     * @return void
     */

    let case_note_form_data = new FormData();
    $("#notes-textarea")[0].setCustomValidity("");

    if (case_note_text.trim().length === 0) {
        $("#notes-textarea")[0].setCustomValidity("Please fill out this field");
        $("#notes-textarea")[0].reportValidity();
        return false;
    }

    clicked_element.html("Saving&nbsp;<i class='fa fa-spinner'></i>").prop("disabled", true);

    // populate case notes form data with case notes text, appointment id and uploaded files
    case_note_form_data.append("conclusion", case_note_text);
    case_note_form_data.append("appointment_id", appointment_id);
    case_note_form_data.append("operation", notes_settings.operation);
    if (notes_settings.note_id) case_note_form_data.append("note_id", notes_settings.note_id);

    new_files.forEach(file => {
        if (!Array.isArray(file)) case_note_form_data.append("file_attachments[]", file, file.name);
    });

    $.ajax({
        url: "../../operation/addCaseNotes.php",
        method: "POST",
        data: case_note_form_data,
        processData: false,
        contentType: false,
        dataType: "json",
        success: function (response) {
            if (!response.error) {
                clicked_element.html("Saved&nbsp;<i class='fa fa-check'></i>").toggleClass("btn-primary").toggleClass("btn-success");
                $(".delete-file").remove();

                notes_settings.uploads_start_index = all_uploads.length;
                notes_settings.operation = "update";
                notes_settings.note_id = response.note_id;

                setTimeout(() => {
                    clicked_element.html("Update").toggleClass("btn-primary").toggleClass("btn-success").prop("disabled", false);
                }, 1500);
            } else {
                $("#telemed-case-notes-error").text("There was a problem saving your notes. Please try again.").show();

                setTimeout(() => {
                    $("#telemed-case-notes-error").hide(150).empty();
                }, 3000);
            }
        },
        error: function (response) {
            setTimeout(() => {
                clicked_element.html("Save").addClass("btn-primary").removeClass("btn-success").prop("disabled", false);
            }, 1500);
        },
        complete: function () {
        }
    });
}

function toggleDisplay(target) {
    target.toggleClass("d-none").find(".scroll-section").scrollTop($('#chat-messages')[0].scrollHeight);
    if (target[0].id == "notes-input-container") $("#notes-btn-container-desktop").toggleClass("d-none");
}

function generateChatMessage(message, owns, files, timestamp, recipient_name, domain_name) {
    /**
     * Appends new message to chat area
     * 
     * @param string message message
     * @param boolean owns true if the message was sent by the user
     * @param Array files list of file names for sent files
     * @param string timestamp date and time for message
     * @param string recipient_name recipient_name
     * 
     * @return string html for message
    */

    const received_message = (message, timestamp, file_names) => `
                <div class="d-flex flex-row px-3 py-2">
                    <span class="chat-initials">${generateInitials(recipient_name)}</span>
                    <div class="chat ml-2 px-3 py-2"><span>${message}</span>
                    ${chatFilePlaceholders(file_names, domain_name)}
                    <p class="chat-time">${timestamp}</p>
                    </div>
                </div>`,
        sent_message = (message, timestamp, file_names) => `
                <div class="d-flex flex-row p-2">
                    <div class="bg-white ml-auto mr-2 px-3 py-2">
                        <span class="text-muted">${message}</span>
                        ${chatFilePlaceholders(file_names, domain_name)}
                        <p class="chat-time">${timestamp}</p>
                    </div>
                </div>`;

    return owns ? sent_message(message, timestamp, files) : received_message(message, timestamp, files);
}

function sendMessage(
    message_input,
    uploaded_files,
    chat_app_settings,
    socket_connection
) {
    /**
     * SAves any files uploaded and sends chat message to recipient via websocket connection
     * 
     * @param jQuery message_input text input field for message
     * @param Array uploaded_files uploaded files
     * @param Object chat_app_settings app settings
     * @param socket_connection connection to websocket
     * 
     * @return void
    */

    let form_data = new FormData(); // formdata object for sending files for storage

    uploaded_files.chat.forEach(file => {
        if (Array.isArray(file)) return false;

        form_data.append("chat-files[]", file);
    });

    form_data.append("", "saveFileUploads");

    $.ajax({
        method: "POST",
        url: `MHAChat/operations.php?operation=saveFileUploads&appointment_id=${chat_app_settings.appointment_id}&user_type=${chat_app_settings.user_type}`,
        data: form_data,
        processData: false,
        contentType: false,
        dataType: "json",
        success: function (response) {
            if (response.error) {
                $("#telemed-chat-error").text(chat_app_settings.error_messages[response.error_code]).show();

                setTimeout(() => {
                    $("#telemed-chat-error").hide(150).empty();
                }, 3000);

                if ([0, 1, 2].includes(response.error_code)) return false; // stop execution if error is not related to the files
            }

            const file_paths = response.file_paths ?? "";
            uploaded_files.chat = [];
            $("#telemed-chat-files-container").empty();

            message_input[0].setCustomValidity("");

            const message = message_input.val(),
                timestamp = new Date(),
                message_time = `${(`0${timestamp.getDate()}`).slice(-2)}/${(`0${timestamp.getMonth() + 1}`).slice(-2)} ${(`0${timestamp.getHours()}`).slice(-2)}:${(`0${timestamp.getMinutes()}`).slice(-2)}`,
                message_bubble = generateChatMessage(message, true, file_paths.split("#?#"), message_time, chat_app_settings.recipient_name, chat_app_settings.domain_name),
                data = {
                    user_type: chat_app_settings.user_type,
                    user_id: chat_app_settings.user_id,
                    recipient_id: chat_app_settings.recipient_id,
                    message: message_input.val(),
                    file_paths: file_paths,
                    appointment_id: chat_app_settings.appointment_id
                },
                chat_file_element = (file_name) => `
                    <div class="chat-file"><i class="fa fa-file"></i>&nbsp;<span>${file_name}</span></div>
                `;

            socket_connection.send(JSON.stringify(data));

            message_input.val("");
            $("#chat-messages").append(message_bubble).scrollTop($('#chat-messages')[0].scrollHeight);
        },
        error: function () {
            $("#telemed-chat-error").text("There was a problem sending your message. Please try again.").show();

            setTimeout(() => {
                $("#telemed-chat-error").hide(150).empty();
            }, 3000);
        }
    });
}

function generateInitials(recipient_name) {
    /**
     * Generates an icon with initials of recipient name to be displayed in chat messages
     * 
     * @param string recipient_name name of recipient
     * 
     * @return string html for placeholder element
     */

    const recipient_initials = recipient_name.split(" ").map(name => name[0].toUpperCase()).reduce((initials, letter) => initials += letter);
    return (recipient_initials);
}

function leaveVirtualRoom(settings) {
    /**
     * Handler for leaving virtual room, depending on user type. For doctor, redirect to queue. For patient, redirect to thank you page
     * 
     * @param settings chat settings object
     * 
     * @return void
     */

    const user_type = settings.user_type,
        redirect_url = user_type.toLowerCase() === "doc" ? "https://myhealthafrica.com/myonemedpro/telemedicine" : "https://myhealthafrica.com/psi-patient-thank-you-page",
        time = new Date().getTime(),
        consultation_start_time = settings.consultation_start_time,
        consultation_duration = Math.ceil((time - consultation_start_time) / (1000 * 60)),
        leave_room_text = user_type.toLowerCase() === "doc" ? "Redirecting you to your queue..." : `Thank you for trusting us with your healthcare!<br>Your doctor was ${settings.recipient_name}<br>The appointment lasted ${consultation_duration} min.<br>Leaving consultation...`;

    console.log({ time }, { consultation_start_time });
    $("#leave-room-text").html(leave_room_text);
    window.location.href = redirect_url;
}

function storeFiles(files_field) {
    /**
     * Stores files added in the chat section to their folder and returns file paths for the respective files, to be stored with the chat message
     * 
     * @param jQuery files_field files upload field
     * 
     * @return String delimiter-separated list of file paths for uploaded files. delimiter used is '#?#'
     */

    const files = files_field[0].files,
        file_placeholder = (file_name, index) => `
        <span class="notes-attachment-container p-2" title="${file_name}">
            <i class="fa fa-file-text"></i><span class="notes-file-name mx-2">${file_name.slice(0, 7)}...</span>
            <span class="delete-file" title="Remove upload" data-file_index = ${index}></span>
        </span>`;
}

function validateFile(file) {
    /**
     * Validates uploaded files for illegal extensions upload of the same file
     * 
     * @param File uploaded file
     * 
     * @return Object list of errors encountered with the file
     */

    let extension_error = false,
        file_size_error = false;

    const file_extension = file.name.match(/\.([^\.]+)$/)[1].toLowerCase(),
        file_size = file.size / (1024 * 1024),
        allowed_extensions = ['txt', 'pdf', "doc", "docx", "jpg", "jpeg", "png", "gif", "odt"];

    extension_error = !allowed_extensions.includes(file_extension);

    return {
        "extension_error": extension_error,
        "file_size_error": file_size_error
    };
}

function chatFilePlaceholders(files, domain_name) {
    /**
     * Generates html for displaying files shared in chat
     * 
     * @param Array files list of file names sent with message
     * 
     * @return String string to be appended to message for files
     */

    const image_extensions = ["png", "jpg", "jpeg", "gif"],
        document_placeholder = (file_path, file_name) => `
            <div class="chat-file" title="${file_name}" onclick = "openChatFile('${file_path}', '${domain_name}')"><i class="fa fa - file"></i>&nbsp;<span>${file_name}</span></div>
        `,
        image_placeholder = (file_path, file_name) => `
            <img src = 'https://${domain_name}/${file_path}' alt = '${file_name}' title="${file_name}" class="chat-image-display" onClick = "chatImageDisplay('https://${domain_name}/${file_path}')" >
        `;
    let files_html = "";

    files.forEach(file_path => {
        if (!file_path) return false; // skip item if it's an empty string

        const file_name = file_path.substring(file_path.lastIndexOf("/") + 1),
            extension = file_name.split(".").pop().toLowerCase(),
            file_display_element = image_extensions.includes(extension) ? image_placeholder(file_path, file_name) : document_placeholder(file_path, file_name);

        files_html += file_display_element;
    });

    return files_html;
}

function chatImageDisplay(image_src) {
    /**
     * Displays image sent in chat in a modal window
     * 
     * @param String image_src src attribute of image clicked in the chat
     * 
     * @return void
     */

    $("#display-image-modal .modal-body img").attr("src", image_src);

    $("#display-image-modal").modal("show");
}

function openChatFile(file_path, domain_name) {
    /**
     * Opens a new tab to display/download the contents of the selected file
     * 
     * @param String file_path path to file in filesystem
     * @param String domain_name domain name
     * 
     * @return void
     */

    const file_params = file_path.split("/"),
        file_name = file_params.pop(),
        appointment_id = file_params.pop();

    window.open(`https://${domain_name}/myonemedpro/psi-telemedicine/view-chat-file.php?appointment_id=${appointment_id}&file_name=${file_name}`, "_blank");
}