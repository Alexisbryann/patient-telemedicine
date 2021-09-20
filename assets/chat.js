var appointment_id = $('#appointment_id').val();
function chat_time() {
    var now = new Date(),
        time = [now.getHours(),':',('0'+now.getMinutes()).slice(-2)].join('');
        chat = '<p class="chat-time">'+time+'</p>';
    return chat;
}
function checkStatus() {
    $.ajax({
        url: "operation/checkStatus.php",
        method: "POST",
        data: {id: appointment_id},
        dataType: 'json',
        success: function(response) {
            if (response.status == 200) {
                window.location = response.redirect_url;
            } 
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
    return recipient_name.split(" ").map(name => name[0].toUpperCase()).reduce((initials, letter) => initials += letter);
}
function SingleConvState(input){
    this.input = input;
    this.answer = '';
    this.next = false;
    return this;
};
SingleConvState.prototype.hasNext = function(){
    return this.next;
};
function ConvState(wrapper, SingleConvState, form, params, originalFormHtml) {
    this.form = form;
    this.wrapper = wrapper;
    this.current = SingleConvState;
    this.answers = {};
    this.parameters = params;
    this.originalFormHtml = originalFormHtml;
    this.scrollDown = function() {
        $(this.wrapper).find('#messages').stop().animate({scrollTop: $(this.wrapper).find('#messages')[0].scrollHeight}, 500);
    }.bind(this);
};
ConvState.prototype.destroy = function(){
    if(this.originalFormHtml) {
        $(this.wrapper).html(this.originalFormHtml);
        return true;
    }
    return false;
};
ConvState.prototype.newState = function(options) {
    var input = $.extend(true, {}, {
        name: '',
        noAnswer: false,
        required: true,
        questions: [''],
        type: 'text',
        file: 'file',
        multiple: false,
        selected: "",
        answers: []
    }, options);
    input.element = $('<input type="text" name="'+input.name+'"/>');
    return new SingleConvState(input);
};
ConvState.prototype.next = function(){
    // if(this.current.input.hasOwnProperty('callback')) {
    //     if(typeof this.current.input.callback === 'string') {
    //         window[this.current.input.callback](this);
    //     } else {
    //         this.current.input.callback(this);
    //     }
    // }
    if(this.current.hasNext()){
        this.current = this.current.next;
        if(this.current.input.hasOwnProperty('fork') && this.current.input.hasOwnProperty('case')){
            if(this.answers.hasOwnProperty(this.current.input.fork) && this.answers[this.current.input.fork].value != this.current.input.case) {
                return this.next();
            }
            if(!this.answers.hasOwnProperty(this.current.input.fork)) {
                return this.next();
            }
        }
        return true;
    } else {
        return false;
    }
};
ConvState.prototype.printQuestion = function(){
    var questions = this.current.input.questions;
    var question = questions[Math.floor(Math.random() * questions.length)]; //get a random question from questions array
    var ansWithin = question.match(/\{(.*?)\}(\:(\d)*)?/g); // searches for string replacements for answers and replaces them with previous answers (warning: not checking if answer exists)
    for(var key in ansWithin){
        if(ansWithin.hasOwnProperty(key)){
            var ansKey = ansWithin[key].replace(/\{|\}/g, "");
            var ansFinalKey = ansKey;
            var index = false;
            if(ansKey.indexOf(':')!=-1){
                ansFinalKey = ansFinalKey.split(':')[0];
                index = ansKey.split(':')[1];
            }
            if(index!==false){
                var replacement = this.answers[ansFinalKey].text.split(' ');
                if(replacement.length >= index){
                    question = question.replace(ansWithin[key], replacement[index]);
                } else {
                    question = question.replace(ansWithin[key], this.answers[ansFinalKey].text);
                }
            } else {
                question = question.replace(ansWithin[key], this.answers[ansFinalKey].text);
            }
        }
    }
    var messageObj = $(this.wrapper).find('.message.typing');
    setTimeout(function(){
        messageObj.html(question+chat_time());
        messageObj.removeClass('typing').addClass('ready');
        if(this.current.input.type=="select"){
            this.printAnswers(this.current.input.answers, this.current.input.multiple);
        }
        this.scrollDown();
        if(this.current.input.hasOwnProperty('noAnswer') && this.current.input.noAnswer===true) {
            if(this.next()){
                setTimeout(function(){
                    var messageObj = $('<div style="display:inline-flex;"><span class="chat-initials">CB</span><div class="message to typing"><div class="typing_loader"></div></div></div>');
                    $(this.wrapper).find('#messages').append(messageObj);
                    this.scrollDown();
                    this.printQuestion();
                }.bind(this),400);
            } else {
                this.parameters.eventList.onSubmitForm(this);
            }
        }
        $(this.wrapper).find(this.parameters.inputIdHashTagName).focus();
    }.bind(this), 500);
};
ConvState.prototype.printAnswers = function(answers, multiple){
    var opened = false;
    if(this.wrapper.find('div.options').height()!=0) opened = true;
    this.wrapper.find('div.options div.option').remove();
    if(multiple){
        for(var i in answers){
            if(answers.hasOwnProperty(i)){
                var option = $('<div class="condition option">'+answers[i].text+'</div>')
                    .data("answer", answers[i])
                    .click(function(event){
                        if(!Array.isArray(this.current.input.selected)) this.current.input.selected = [];
                        var indexOf = this.current.input.selected.indexOf($(event.target).data("answer").value);
                        if(indexOf == -1){
                            this.current.input.selected.push($(event.target).data("answer").value);
                            $(event.target).addClass('selected');
                        } else {
                            this.current.input.selected.splice(indexOf, 1);
                            $(event.target).removeClass('selected');
                        }
                        this.wrapper.find(this.parameters.inputIdHashTagName).removeClass('error');
                        this.wrapper.find(this.parameters.inputIdHashTagName).val('');
                        if(this.current.input.selected.length > 0) {
                            this.wrapper.find('button.submit').addClass('glow');
                        } else {
                            this.wrapper.find('button.submit').removeClass('glow');
                        }
                    }.bind(this));
                this.wrapper.find('div.options').append(option);
                $(window).trigger('dragreset');
            }
        }
    } else {
        for(var i in answers){
            if(answers.hasOwnProperty(i)){
                var option = $('<div class="answer option">'+answers[i].text+'</div>')
                    .data("answer", answers[i])
                    .click(function(event){
                        this.current.input.selected = $(event.target).data("answer").value;
                        this.wrapper.find(this.parameters.inputIdHashTagName).removeClass('error');
                        this.wrapper.find(this.parameters.inputIdHashTagName).val('');
                        this.answerWith($(event.target).data("answer").text, $(event.target).data("answer"));
                        this.wrapper.find('div.options div.option').remove();
                    }.bind(this));
                this.wrapper.find('div.options').append(option);
                $(window).trigger('dragreset');
            }
        }
    }
    if(!opened) {
        var diff = $(this.wrapper).find('div.options').height();
        var originalHeight = $(this.wrapper).find('.wrapper-messages').height();
        $(this.wrapper).find('.wrapper-messages').data('originalHeight', originalHeight);
        //$(this.wrapper).find('.wrapper-messages').css({marginBottom: diff, maxHeight: originalHeight-diff});
    }
    if(this.parameters.selectInputStyle=='disable') {
        $(this.wrapper).find('#'+this.parameters.inputIdName).prop('disabled', true);
        $(this.wrapper).find('#'+this.parameters.inputIdName).attr('placeholder', this.parameters.selectInputDisabledText);
    } else if(this.parameters.selectInputStyle=='hide') {
        if(!this.current.input.multiple) {
            $(this.wrapper).find('#'+this.parameters.inputIdName).css({display: 'none'});
            $(this.wrapper).find('#oktari-chat-form button').css({display: 'none'});
        } else {
            $(this.wrapper).find('#'+this.parameters.inputIdName).prop('disabled', true);
            $(this.wrapper).find('#'+this.parameters.inputIdName).attr('placeholder', this.parameters.selectInputDisabledText);
        }
    }

};
ConvState.prototype.answerWith = function(answerText, answerObject) {
    //console.log('previous answer: ', answerObject);
    //puts answer inside answers array to give questions access to previous answers
    if(this.current.input.hasOwnProperty('name')){
        if(typeof answerObject == 'string') {
            if(this.current.input.type == 'tel')
                answerObject = answerObject.replace(/\s|\(|\)|-/g, "");
            this.answers[this.current.input.name] = {text: answerText, value: answerObject};
            this.current.answer = {text: answerText, value: answerObject};
            //console.log('previous answer: ', answerObject);
        } else {
            this.answers[this.current.input.name] = answerObject;
            this.current.answer = answerObject;
        }
        if(this.current.input.type == 'select' && !this.current.input.multiple) {
            $(this.current.input.element).val(answerObject.value).change();
        } else {
            $(this.current.input.element).val(answerObject).change();
        }
    }
    
    //prints answer within messages wrapper
    if(this.current.input.type == 'password')
        answerText = answerText.replace(/./g, '*');
    var message = $('<div style="float:right;"><div class="message from patient-msg">'+answerText+chat_time()+'</div></div>');
    if(this.current.input.type=='select' && this.parameters.selectInputStyle=='disable') {
        $(this.wrapper).find('#'+this.parameters.inputIdName).prop('disabled', false);
        $(this.wrapper).find('#'+this.parameters.inputIdName).attr('placeholder', this.parameters.placeHolder);
    } else if(this.current.input.type=='select' && this.parameters.selectInputStyle=='hide') {
        if(!this.current.input.multiple) {
            $(this.wrapper).find('#'+this.parameters.inputIdName).css({display: 'block'});
            $(this.wrapper).find('#oktari-chat-form button').css({display: 'block'});
        } else {
            $(this.wrapper).find('#'+this.parameters.inputIdName).prop('disabled', false);
            $(this.wrapper).find('#'+this.parameters.inputIdName).attr('placeholder', this.parameters.placeHolder);
        }
    }

    //removes options before appending message so scroll animation runs without problems
    $(this.wrapper).find("div.options div.option").remove();

    var diff = $(this.wrapper).find('div.options').height();
    var originalHeight = $(this.wrapper).find('.wrapper-messages').data('originalHeight');
    //$(this.wrapper).find('.wrapper-messages').css({marginBottom: diff, maxHeight: originalHeight});
    $(this.wrapper).find(this.parameters.inputIdHashTagName).focus();
    if (answerObject.hasOwnProperty('callback')) {
        this.current.input['callback'] = answerObject.callback;
    }
    setTimeout(function(){
        $(this.wrapper).find("#messages").append(message);
        this.scrollDown();
    }.bind(this), 100);

    $(this.form).append(this.current.input.element);
    var messageObj = $('<div style="display:inline-flex;"><span class="chat-initials">CB</span><div class="message to typing"><div class="typing_loader"></div></div></div>');
    setTimeout(function(){
        $(this.wrapper).find('#messages').append(messageObj);
        this.scrollDown();
    }.bind(this), 150);

    this.parameters.eventList.onInputSubmit(this, function(){
        //goes to next state and prints question
        if(this.next()){
            setTimeout(function(){
                this.printQuestion();
            }.bind(this), 300);
        } else {
            this.parameters.eventList.onSubmitForm(this);
        }
    }.bind(this));
};

(function($){
    $.fn.convform = function(options){
        var wrapper = this;
        var originalFormHtml = $(wrapper).html();
        $(this).addClass('conv-form-wrapper');

        var parameters = $.extend(true, {}, {
            placeHolder : 'Type Here',
            typeInputUi : 'input',
            timeOutFirstQuestion : 1500,
            buttonClassStyle : 'icon2-arrow',
            selectInputStyle: 'show',
            selectInputDisabledText: 'Select an option',
            eventList : {
                onSubmitForm : function(convState) {
                    var chat = convState.answers;
                    $.ajax({
                        url: "operation/updatePatientInfo.php",
                        method: 'POST',
                        data: { appointment_id, chat },
                        dataType: "json",
                        success: function(response) {
                            if (response == 200) {
                                setInterval(function(){
                                    checkStatus();
                                }, 5000);
                                $('.telemed-step-two').hide();
                                $('.logo, .telemed-step-three').show(500);
                                countdown('countdown', 10, 0);
                            }
                        },
                        async: false
                    });
                },
                onInputSubmit : function(convState, readyCallback) {
                    if(convState.current.input.hasOwnProperty('callback')) {
                        if(typeof convState.current.input.callback === 'string') {
                            window[convState.current.input.callback](convState, readyCallback);
                        } else {
                            convState.current.input.callback(convState, readyCallback);
                        }
                    } else {
                        readyCallback();
                    }
                }
            },
            formIdName : 'oktari-chat-form',
            inputIdName : 'userInput',
            loadSpinnerVisible : '',
            buttonText: '<i class="fa fa-paper-plane" aria-hidden="true"></i>',
            buttonFile: '<i class="fa fa-paperclip" aria-hidden="true"></i>',
            buttonIcon: ''
        }, options);

        /*
        * this will create an array with all inputs, selects found
        * inside the wrapper, in order of appearance
        */
        var inputs = $(this).find('input, select, input').map(function(){
            var input = {};
            if($(this).attr('name'))
                input['name'] = $(this).attr('name');
            if($(this).attr('data-no-answer'))
                input['noAnswer'] = true;
            if($(this).attr('required'))
                input['required'] = true;
            if($(this).attr('type'))
                input['type'] = $(this).attr('type');
            input['questions'] = $(this).attr('data-conv-question').split("|");
            if($(this).attr('data-pattern'))
                input['pattern'] = $(this).attr('data-pattern');
            if($(this).attr('data-callback'))
                input['callback'] = $(this).attr('data-callback');
            if($(this).is('select')) {
                input['type'] = 'select';
                input['answers'] = $(this).find('option').map(function(){
                    var answer = {};
                    answer['text'] = $(this).text();
                    answer['value'] = $(this).val();
                    if($(this).attr('data-callback'))
                        answer['callback'] = $(this).attr('data-callback');
                    return answer;
                }).get();
                if($(this).prop('multiple')){
                    input['multiple'] = true;
                    input['selected'] = [];
                } else {
                    input['multiple'] = false;
                    input['selected'] = "";
                }
            }
            if($(this).parent('div[data-conv-case]').length) {
                input['case'] = $(this).parent('div[data-conv-case]').attr('data-conv-case');
                input['fork'] = $(this).parent('div[data-conv-case]').parent('div[data-conv-fork]').attr('data-conv-fork');
            }
            input['element'] = this;
            $(this).detach();
            return input;
        }).get();

        if(inputs.length) {
            //hides original form so users cant interact with it
            var form = $(wrapper).find('form').hide();

            var inputForm;
            parameters.inputIdHashTagName = '#' + parameters.inputIdName;

            switch(parameters.typeInputUi) {
                case 'input':
                    inputForm = $(`<form id="${parameters.formIdName}" class="conv-form-dynamic"><div class="options drag-scroll"></div><input id="${parameters.inputIdName}" type="${parameters.placeHolder}" placeholder="${parameters.placeHolder}" class="userInputDynamic" />
                                <button type="submit" class="submit">${parameters.buttonText}</button><span class="clear"></span></form>`);
                    break;
                case 'textarea':
                    inputForm = $('<form id="' + parameters.formIdName + '" class="conv-form-dynamic"><div class="options drag-scroll"></div><textarea id="' + parameters.inputIdName + '" rows="1" placeholder="'+ parameters.placeHolder +'" class="convFormDynamic userInputDynamic"></textarea><button type="submit" class="submit">'+parameters.buttonText+'</button><span class="clear"></span></form>');
                    break;
                default :
                    console.log('typeInputUi must be input');
                    return false;
            }

            //appends messages wrapper and newly created form with the spinner load
            $(wrapper).append('<div class="wrapper-messages"><div class="spinLoader ' + parameters.loadSpinnerVisible + ' "></div><div id="messages"></div></div>');
            $(wrapper).append(inputForm);

            //creates new single state with first input
            var singleState = new SingleConvState(inputs[0]);
            //creates new wrapper state with first single state as current and gives access to wrapper element
            var state = new ConvState(wrapper, singleState, form, parameters, originalFormHtml);
            //creates all new single states with inputs in order
            for(var i in inputs) {
                if(i != 0 && inputs.hasOwnProperty(i)){
                    singleState.next = new SingleConvState(inputs[i]);
                    singleState = singleState.next;
                }
            }

            //prints first question
            setTimeout(function() {
                $.when($('div.spinLoader').addClass('hidden')).done(function() {
                    var messageObj = $('<div style="display:inline-flex;"><span class="chat-initials">CB</span><div class="message to typing"><div class="typing_loader"></div></div></div>');
                    $(state.wrapper).find('#messages').append(messageObj);
                    state.scrollDown();
                    state.printQuestion();
                });
            }, 3000);

            //binds enter to answer submit and change event to search for select possible answers
            $(inputForm).find(parameters.inputIdHashTagName).keypress(function(e){
                if(e.which == 13) {
                    var input = $(this).val();
                    e.preventDefault();
                    if(state.current.input.type=="select" && !state.current.input.multiple){
                        if(state.current.input.required) {
                            state.wrapper.find('#userInputBot').addClass('error');
                        } else {
                            var results = state.current.input.answers.filter(function (el) {
                                return el.text.toLowerCase().indexOf(input.toLowerCase()) != -1;
                            });
                            if (results.length) {
                                state.current.input.selected = results[0];
                                $(this).parent('form').submit();
                            } else {
                                state.wrapper.find(parameters.inputIdHashTagName).addClass('error');
                            }
                        }
                    } else if(state.current.input.type=="select" && state.current.input.multiple) {
                        if(input.trim() != "") {
                            var results = state.current.input.answers.filter(function(el){
                                return el.text.toLowerCase().indexOf(input.toLowerCase()) != -1;
                            });
                            if(results.length){
                                if(state.current.input.selected.indexOf(results[0].value) == -1){
                                    state.current.input.selected.push(results[0].value);
                                    state.wrapper.find(parameters.inputIdHashTagName).val("");
                                } else {
                                    state.wrapper.find(parameters.inputIdHashTagName).val("");
                                }
                            } else {
                                state.wrapper.find(parameters.inputIdHashTagName).addClass('error');
                            }
                        } else {
                            if(state.current.input.selected.length) {
                                $(this).parent('form').submit();
                            }
                        }
                    } else {
                        if(input.trim()!='' && !state.wrapper.find(parameters.inputIdHashTagName).hasClass("error")) {
                            $(this).parent('form').submit();
                        } else {
                            $(state.wrapper).find(parameters.inputIdHashTagName).focus();
                        }
                    }
                }
                autosize.update($(state.wrapper).find(parameters.inputIdHashTagName));
            }).on('input', function(e){
                if(state.current.input.type=="select"){
                    var input = $(this).val();
                    var results = state.current.input.answers.filter(function(el){
                        return el.text.toLowerCase().indexOf(input.toLowerCase()) != -1;
                    });
                    if(results.length){
                        state.wrapper.find(parameters.inputIdHashTagName).removeClass('error');
                        state.printAnswers(results, state.current.input.multiple);
                    } else {
                        state.wrapper.find(parameters.inputIdHashTagName).addClass('error');
                    }
                } else if(state.current.input.hasOwnProperty('pattern')) {
                    var reg = new RegExp(state.current.input.pattern, 'i');
                    if(reg.test($(this).val())) {
                        state.wrapper.find(parameters.inputIdHashTagName).removeClass('error');
                    } else {
                        state.wrapper.find(parameters.inputIdHashTagName).addClass('error');
                    }
                }
            });

            $(inputForm).find('button.submit').click(function(e){
                var input = $(state.wrapper).find(parameters.inputIdHashTagName).val();
                e.preventDefault();
                if(state.current.input.type=="select" && !state.current.input.multiple){
                    if(state.current.input.required && !state.current.input.selected) {
                        return false;
                    } else {
                        if (input == parameters.placeHolder) input = '';
                        var results = state.current.input.answers.filter(function (el) {
                            return el.text.toLowerCase().indexOf(input.toLowerCase()) != -1;
                        });
                        if (results.length) {
                            state.current.input.selected = results[0];
                            $(this).parent('form').submit();
                        } else {
                            state.wrapper.find(parameters.inputIdHashTagName).addClass('error');
                        }
                    }
                } else if(state.current.input.type=="select" && state.current.input.multiple) {
                    if(state.current.input.required && state.current.input.selected.length === 0) {
                        return false;
                    } else {
                        if (input.trim() != "" && input != parameters.placeHolder) {
                            var results = state.current.input.answers.filter(function (el) {
                                return el.text.toLowerCase().indexOf(input.toLowerCase()) != -1;
                            });
                            if (results.length) {
                                if (state.current.input.selected.indexOf(results[0].value) == -1) {
                                    state.current.input.selected.push(results[0].value);
                                    state.wrapper.find(parameters.inputIdHashTagName).val("");
                                } else {
                                    state.wrapper.find(parameters.inputIdHashTagName).val("");
                                }
                            } else {
                                state.wrapper.find(parameters.inputIdHashTagName).addClass('error');
                            }
                        } else {
                            if (state.current.input.selected.length) {
                                $(this).removeClass('glow');
                                $(this).parent('form').submit();
                            }
                        }
                    }
                } else {
                    if(input.trim() != '' && !state.wrapper.find(parameters.inputIdHashTagName).hasClass("error")){
                        $(this).parent('form').submit();
                    } else {
                        $(state.wrapper).find(parameters.inputIdHashTagName).focus();
                    }
                }
                autosize.update($(state.wrapper).find(parameters.inputIdHashTagName));
            });

            //binds form submit to state functions
            $(inputForm).submit(function(e){
                e.preventDefault();
                var answer = $(this).find(parameters.inputIdHashTagName).val();
                $(this).find(parameters.inputIdHashTagName).val("");
                if(state.current.input.type == 'select'){
                    if(!state.current.input.multiple){
                        state.answerWith(state.current.input.selected.text, state.current.input.selected);
                    } else {
                        state.answerWith(state.current.input.selected.join(', '), state.current.input.selected);
                    }
                } else {
                    state.answerWith(answer, answer);
                }
            });

            if(typeof autosize == 'function') {
                $textarea = $(state.wrapper).find(parameters.inputIdHashTagName);
                autosize($textarea);
            }

            return state;
        } else {
            return false;
        }
    }

    // $(document).on("change", "#medical-reports", function () {
    //     addFileUpload($(this), $("#message"), $(this).val(), $("#error"));
    // });

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
        const files = files_field[0].files; // files from input
        
        let extension_errors = false;
        [...files].forEach(file => {
            console.log("foo");
            const file_name = file.name,
                file_index = uploaded_files.length,
                file_errors = validateFile(file);
            if (file_errors.extension_error) {
                extension_errors = true;
                return false;
            }
    
            files_display_container.append(generateChatMessage("", true, file.name, "", "Chat Bot", "localhost"));
            uploaded_files[file_index] = file;
        });
        if (extension_errors) {
            error_message_container.text("Could not add one or more files with an invalid extension.").show();
            setTimeout(() => {
                error_message_container.hide(150).empty();
            }, 3000);
        }
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
                <img src = 'https://${domain_name}/${file_path}' alt = '${file_name}' title="${file_name}" class="chat-image-display" >
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
        const file_placeholder = (file_name) => `
            <span class="notes-attachment-container" title="${file_name}">
                <i class="fa fa-file-text"></i>&nbsp;<span class="notes-file-name mx-2">${file_name.slice(0, 10)}...</span>
            </span>`;
        sent_message = (message, timestamp, file_names) => `
                    <div style="display: inline-flex">
                        <div class="bg-white ml-auto mr-2 px-3 py-2">
                            <span class="text-muted">${message}</span>
                            ${file_placeholder(file_names, domain_name)}
                            <p class="chat-time">${timestamp}</p>
                        </div>
                    </div>`;
        return owns ? sent_message(message, timestamp, files) : received_message(message, timestamp, files);
    }
    
})( jQuery );
