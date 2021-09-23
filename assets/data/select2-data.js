function format(state) {
    if (!state.id) return state.text; 
    return state.text;
}

$(document).ready(function() {
var placeholder = "Select a State";
$('.select2, .select2-multiple').select2({
	theme: "bootstrap",
    placeholder: placeholder,
});
$("#selitemIcon").select2({
	theme: "bootstrap",
	templateResult: format,
    formatSelection: format,
    escapeMarkup: function(m) {
        return m;
    }
});

$("#category").select2({
	theme: "bootstrap",
	templateResult: format,
    formatSelection: format,
    escapeMarkup: function(m) {
        return m;
    }
});
$("#admin_doc").select2({
	theme: "bootstrap",
	templateResult: format,
    formatSelection: format,
    escapeMarkup: function(m) {
        return m;
    }
});
$("#doc_loc").select2({
	theme: "bootstrap",
	templateResult: format,
    formatSelection: format,
    escapeMarkup: function(m) {
        return m;
    }
});
$("#specialty").select2({
	theme: "bootstrap",
	templateResult: format,
    formatSelection: format,
    escapeMarkup: function(m) {
        return m;
    }
});
$("#group_doc").select2({
	theme: "bootstrap",
	templateResult: format,
    formatSelection: format,
    escapeMarkup: function(m) {
        return m;
    }
});
$("#group_loc").select2({
	theme: "bootstrap",
	templateResult: format,
    formatSelection: format,
    escapeMarkup: function(m) {
        return m;
    }
});

$("#group_specialty").select2({
	theme: "bootstrap",
	templateResult: format,
    formatSelection: format,
    escapeMarkup: function(m) {
        return m;
    }
});

$("#reallocateDocService").select2({
	theme: "bootstrap",
	templateResult: format,
    formatSelection: format,
    dropdownParent: $('#reallocateBooking'),
    escapeMarkup: function(m) {
        return m;
    }
});

$("#reallocateDoc").select2({
	theme: "bootstrap",
	templateResult: format,
    formatSelection: format,
    dropdownParent: $('#reallocateBooking'),
    escapeMarkup: function(m) {
        return m;
    }
});





$('.select2-allow-clear').select2({
	theme: "bootstrap",
    allowClear: true,
    placeholder: placeholder
});

});
