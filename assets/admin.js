$(document).ready(function() {
    var facility_id = $('#facility_id').val();
    $('.weekDays-selector input[type=text]').ptTimeSelect();

    $('#monday_from').hide();
    $('#monday_to').hide();
    $('#tuesday_from').hide();
    $('#tuesday_to').hide();
    $('#wednesday_from').hide();
    $('#wednesday_to').hide();
    $('#thursday_from').hide();
    $('#thursday_to').hide();
    $('#friday_from').hide();
    $('#friday_to').hide();
    $('#saturday_from').hide();
    $('#saturday_to').hide();
    $('#sunday_from').hide();
    $('#sunday_to').hide();
    $('#login-rights').hide();
    $('#chkBoxList').hide();
    $('#user_profile').hide();
    $("[data-widget='remove']").click(function() {
        $('.reminder').slideToggle("slow");
    });

    //Initialize Select2 Elements
    $('.select2').select2();

    //departments drop down
    $(function() {
        var facility_id = $('#facility_id').val();
        $.ajax({
            url: "operation/getDepartmentsDropDown.php",
            method: "POST",
            data: { facility_id: facility_id },
            dataType: "json",
            success: function(result) {
                $("#user_department").attr('disabled', false);
                $("#user_rights").attr('disabled', false);
                $.each(result, function(i) {
                    $('#user_department').append($('<option></option>').attr("value", result[i].id).text(result[i].department_name));
                });
                $.each(result, function(i) {
                    $('#user_rights').append($('<option></option>').attr("value", result[i].id).text(result[i].department_name));
                });
                $.each(result, function(i) {
                    $('#sec_user_rights').append($('<option></option>').attr("value", result[i].id).text(result[i].department_name));
                });
                $.each(result, function(i) {
                    $("#edit_user_department").append($("<option>").attr('value', result[i].id).text(result[i].department_name));
                });
            },
            failure: function() {
                alert("Error");
            }
        });
    });
    //locations drop down
    $(function() {
        var facility_id = $('#facility_id').val();
        $.ajax({
            url: "operation/getLocationsDropDown.php",
            method: "POST",
            data: { facility_id: facility_id },
            dataType: "json",
            success: function(result) {
                $("#user_location").attr('disabled', false);
                $.each(result, function(i) {
                    $('#user_location').append($('<option></option>').attr("value", result[i].id).text(result[i].name));
                });
            },
            failure: function() {
                alert("Error");
            }
        });
    });

    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function(e) {
                $('#user_profile').attr('src', e.target.result);
            }
            reader.readAsDataURL(input.files[0]); // convert to base64 string
        }
    }

    $("#uploaded_file").change(function() {
        $('#user_profile').slideToggle("slow");
        readURL(this);
    });

    //Listed Users
    $('#users-table').DataTable({
        "pageLength": 10,
        'paging': true,
        'lengthChange': true,
        'searching': true,
        'ordering': true,
        'info': true,
        'autoWidth': false,
        "ajax": {
            data: { facility_id: facility_id },
            url: "operation/getAllUsers.php",
            type: "POST"
        },
        aoColumns: [
            { sWidth: '20%' },
            { sWidth: '10%' },
            { sWidth: '30%' },
            { sWidth: '15%' },
            { sWidth: '10%' }
        ]
    });
    //Services table
    $('#services-table').DataTable({
        "pageLength": 10,
        'paging': false,
        'lengthChange': false,
        'searching': false,
        'ordering': false,
        'info': false,
        'autoWidth': false,
        "ajax": {
            data: { facility_id: facility_id },
            url: "operation/getAllServices.php",
            type: "POST"
        },
        aoColumns: [
            { sWidth: '30%' },
            { sWidth: '10%' },
            { sWidth: '10%' },
            { sWidth: '10%' }
        ]
    });
    //Departments table
    $('#departments-table').DataTable({
        "pageLength": 10,
        'paging': false,
        'lengthChange': false,
        'searching': false,
        'ordering': false,
        'info': false,
        'autoWidth': false,
        "ajax": {
            data: { facility_id: facility_id },
            url: "operation/getAllDepartments.php",
            type: "POST"
        },
        aoColumns: [
            { sWidth: '50%' },
            { sWidth: '20%' },
            { sWidth: '10%' }
        ]
    });
    //Locations table
    $('#locations-table').DataTable({
        "pageLength": 10,
        'paging': false,
        'lengthChange': false,
        'searching': false,
        'ordering': false,
        'info': false,
        'autoWidth': false,
        "ajax": {
            data: { facility_id: facility_id },
            url: "operation/getAllLocations.php",
            type: "POST"
        },
        aoColumns: [
            { sWidth: '30%' },
            { sWidth: '60%' },
            { sWidth: '10%' }
        ]
    });

    $(document).on('click', '#weekday-mon', function() {
        $('#monday_from').slideToggle("slow");
        $('#monday_to').slideToggle("slow");
    });
    $(document).on('click', '#weekday-tue', function() {
        $('#tuesday_from').slideToggle("slow");
        $('#tuesday_to').slideToggle("slow");
    });
    $(document).on('click', '#weekday-wed', function() {
        $('#wednesday_from').slideToggle("slow");
        $('#wednesday_to').slideToggle("slow");
    });
    $(document).on('click', '#weekday-thu', function() {
        $('#thursday_from').slideToggle("slow");
        $('#thursday_to').slideToggle("slow");
    });
    $(document).on('click', '#weekday-fri', function() {
        $('#friday_from').slideToggle("slow");
        $('#friday_to').slideToggle("slow");
    });
    $(document).on('click', '#weekday-sat', function() {
        $('#saturday_from').slideToggle("slow");
        $('#saturday_to').slideToggle("slow");
    });
    $(document).on('click', '#weekday-sun', function() {
        $('#sunday_from').slideToggle("slow");
        $('#sunday_to').slideToggle("slow");
    });

    var input = document.querySelector("#user_phone"),
        errorMsg = document.querySelector("#error-msg"),
        validMsg = document.querySelector("#valid-msg");
    var errorMap = ["Invalid number", "Invalid country code", "Too short", "Too long", "Invalid number"];
    var iti = window.intlTelInput(input, {
        allowDropdown: true,
        formatOnDisplay: true,
        geoIpLookup: function(callback) {
            $.get("http://ipinfo.io", function() {}, "jsonp").always(function(resp) {
                var countryCode = (resp && resp.country) ? resp.country : "";
                callback(countryCode);
            });
        },
        hiddenInput: "full_number",
        nationalMode: true,
        placeholderNumberType: "MOBILE",
        preferredCountries: ['KE', 'UG', 'TZ', 'SO', 'RW'],
        separateDialCode: true,
        utilsScript: "assets/bundles/countrycode/build/js/utils.js?1603274336113",
    });

    var reset = function() {
        input.classList.remove("error");
        errorMsg.innerHTML = "";
        errorMsg.classList.add("hide");
        validMsg.classList.add("hide");
    };

    // on blur: validate
    input.addEventListener('blur', function() {
        reset();
        if (input.value.trim()) {
            if (iti.isValidNumber()) {
                validMsg.classList.remove("hide");
            } else {
                input.classList.add("error");
                var errorCode = iti.getValidationError();
                errorMsg.innerHTML = errorMap[errorCode];
                errorMsg.classList.remove("hide");
            }
        }
    });

    // on keyup / change flag: reset
    input.addEventListener('change', reset);
    input.addEventListener('keyup', reset);

    $('#user_type').on('change', function() {
        if (this.value == 'Sec') {
            $("#login-rights").show(500);
        } else {
            $("#login-rights").hide(500);
        }
    });

});

$(document).ready(function() {
    $('#user_type').on('change', function() {
        if (this.value == 'Doctor') {
            $("#chkBoxList").show(500);
        } else {
            $("#chkBoxList").hide(500);
        } 
        if (this.value == 'Admin') {
            $("#chkBoxList").show(500);
        }else{
            $("#chkBoxList").hide(500);
        }
    });
}); 


//View user details modal
$(document).on('click', '.view_user', function() {
    var view_user_id = $(this).attr("id");
    $.ajax({
        url: "operation/adminCrudOperations.php",
        method: "POST",
        data: { view_user_id: view_user_id },
        dataType: "json",
        success: function(data) {
            $('#viewUser').modal('show');
            $('#username').html(data.username);
            $('#user-email').html(data.email);
            $('#user-phone').html(data.phone);
            $('#user-service').html(data.service);
            $('#user-department').html(data.department);
            $('#user-role').html(data.role);
        }
    });
    $('#user-services-table').DataTable({
        "pageLength": 10,
        'paging': false,
        'lengthChange': false,
        'searching': false,
        'ordering': false,
        'info': false,
        'autoWidth': false,
        "language": {
            "emptyTable": "No services were found"
        },
        "ajax": {
            data: { view_user_id: view_user_id },
            url: "operation/getUserServices.php",
            type: "POST"
        },
        aoColumns: [
            { sWidth: '50%' },
            { sWidth: '15%' }
        ]
    });
});
//edit user details modal
$(document).on('click', '.edit_user', function() {
    var view_user_id = $(this).attr("id");
    $.ajax({
        url: "operation/adminCrudOperations.php",
        method: "POST",
        data: { view_user_id: view_user_id },
        dataType: "json",
        success: function(data) {
            $('#editUser').modal('show');
            $('#edit_user_id').val(view_user_id);
            $('#edit_user_location').val(data.location);
            document.getElementById('edit_user_department').value = data.department_id;
            document.getElementById('edit_user_type').value = data.role;
            $('#edit_username').val(data.username);
            $('#edit_user_email').val(data.email);
            $('#edit_user_phone').val(data.phone);
        }
    });
    $('#edit_user_services_table').DataTable({
        "pageLength": 10,
        'paging': false,
        'lengthChange': false,
        'searching': false,
        'ordering': false,
        'info': false,
        'autoWidth': false,
        "language": {
            "emptyTable": "No services were found"
        },
        "ajax": {
            data: { view_user_id: view_user_id },
            url: "operation/getUserServices.php",
            type: "POST"
        },
        aoColumns: [
            { sWidth: '60%' },
            { sWidth: '15%' },
            { sWidth: '15%' }
        ]
    });
});

//revoke user rights
$(document).on('click', '.revoke', function() {
    var revoke_user_id = $(this).attr("id");
    swal({
        title: "Sure to Revoke?",
        text: "User will no longer have access to this department ",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, Revoke",
        cancelButtonText: "No",
        closeOnConfirm: false,
        closeOnCancel: true
    }, function(isConfirm) {
        if (isConfirm) {
            $.ajax({
                url: "operation/adminCrudOperations.php",
                method: "POST",
                data: { revoke_user_id: revoke_user_id },
                dataType: "json",
                success: function(data) {
                    if (data == 200) {
                        $('#userRights').modal('hide');
                        swal({
                            title: "Revoked",
                            text: "Privilege successfully revoked",
                            type: "success",
                            timer: 4000,
                            showConfirmButton: false
                        });
                    } else {
                        swal({
                            title: "Error",
                            text: "Something went wrong, please try again.",
                            type: "error",
                            timer: 4000,
                            showConfirmButton: false
                        });
                    }

                }

            })
        }
    });
});

//remove user service
$(document).on('click', '.remove_service', function() {
    var remove_service_id = $(this).attr("id");
    var user_id = $('#edit_user_id').val();
    swal({
        title: "Sure to Remove?",
        text: "The service will be removed for this user ",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, Remove",
        cancelButtonText: "No",
        closeOnConfirm: false,
        closeOnCancel: true
    }, function(isConfirm) {
        if (isConfirm) {
            $.ajax({
                url: "operation/adminCrudOperations.php",
                method: "POST",
                data: { user_id: user_id, remove_service_id: remove_service_id },
                dataType: "json",
                success: function(data) {
                    if (data == 200) {
                        $('#editUser').modal('hide');
                        swal({
                            title: "Removed",
                            text: "Service successfully removed",
                            type: "success",
                            timer: 4000,
                            showConfirmButton: false
                        });
                    } else {
                        swal({
                            title: "Error",
                            text: "Something went wrong, please try again.",
                            type: "error",
                            timer: 4000,
                            showConfirmButton: false
                        });
                    }

                }

            })
        }
    });
});

//add user rights modal
$(document).on('click', '.add_privileges', function() {
    var view_user_id = $(this).attr("id");
    $.ajax({
        url: "operation/adminCrudOperations.php",
        method: "POST",
        data: { view_user_id: view_user_id },
        dataType: "json",
        success: function(data) {
            $('#userRights').modal('show');
            $('#sec_user_id').val(view_user_id);
            $('#sec_user_type').val(data.role);
            $('#sec_name').val(data.username);
        }

    });
    $('#privileges-table').DataTable({
        "pageLength": 10,
        'paging': false,
        'lengthChange': false,
        'searching': false,
        'ordering': false,
        'info': false,
        'autoWidth': false,
        "ajax": {
            data: { view_user_id: view_user_id },
            url: "operation/getAllPrivileges.php",
            type: "POST"
        },
        aoColumns: [
            { sWidth: '60%' },
            { sWidth: '15%' }
        ]
    });
});

$('#userRights').on('hidden.bs.modal', function() {
    $('#privileges-table').dataTable().fnDestroy();
});
$('#viewUser').on('hidden.bs.modal', function() {
    $('#user-services-table').dataTable().fnDestroy();
});
$('#editUser').on('hidden.bs.modal', function() {
    $('#edit_user_services_table').dataTable().fnDestroy();
});

//Delete user details
$(document).on('click', '.delete_user', function() {
    var delete_user_id = $(this).attr("id");
    swal({
        title: "Sure to Delete?",
        text: "This user will be permanently removed",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, Delete",
        cancelButtonText: "No",
        closeOnConfirm: false,
        closeOnCancel: true
    }, function(isConfirm) {
        if (isConfirm) {
            $.ajax({
                url: "operation/adminCrudOperations.php",
                method: "POST",
                data: { delete_user_id: delete_user_id },
                dataType: "json",
                success: function(data) {
                    if (data == 200) {
                        swal({
                            title: "Deleted",
                            text: "User successfully deleted from your users",
                            type: "success",
                            timer: 4000,
                            showConfirmButton: false
                        }, function (isConfirm) {
                            if (isConfirm) window.location.reload();
                        });
                        $('#users-table').DataTable().ajax.reload();
                    } else {
                        swal({
                            title: "Error",
                            text: "Something went wrong, please try again.",
                            type: "error",
                            timer: 4000,
                            showConfirmButton: false
                        });
                    }

                }

            })
        }
    });
});
//add user service modal
$(document).on('click', '.add_user_service', function() {
    var add_service_user_id = $(this).attr("id");
    var facility_id = $('#facility_id').val();
    $.ajax({
        url: "operation/getServicesDropDown.php",
        method: "POST",
        data: { facility_id: facility_id },
        dataType: "json",
        success: function(result) {
            $('#addUserService').modal('show');
            $('#user_id').val(add_service_user_id);
            $("#user_service").attr('disabled', false);
            $("#user_service").empty();
            $.each(result, function(i) {
                $('#user_service').append($('<option></option>').attr("value", result[i].id).text(result[i].name));
            });
        }

    });
    $.ajax({
        url: "operation/getLocationsDropDown.php",
        method: "POST",
        data: { facility_id: facility_id },
        dataType: "json",
        success: function(result) {
            $("#service_location").attr('disabled', false);
            $("#service_location").empty();
            $.each(result, function(i) {
                $('#service_location').append($('<option></option>').attr("value", result[i].id).text(result[i].name));
            });
        },
        failure: function() {
            alert("Error");
        }
    });
});

//edit service details modal
$(document).on('click', '.edit_service', function() {
    var edit_service_id = $(this).attr("id");
    $.ajax({
        url: "operation/adminCrudOperations.php",
        method: "POST",
        data: { edit_service_id: edit_service_id },
        dataType: "json",
        success: function(data) {
            $('#editService').modal('show');
            $('#service_id').val(edit_service_id);
            $('#edit_service_name').val(data.name);
            $('#edit_service_currency').val(data.currency);
            $('#edit_service_price').val(data.price);
            $('#edit_service_duration').val(data.duration);
        }

    })
});
//edit department details modal
$(document).on('click', '.edit_department', function() {
    var edit_department_id = $(this).attr("id");
    $.ajax({
        url: "operation/adminCrudOperations.php",
        method: "POST",
        data: { edit_department_id: edit_department_id },
        dataType: "json",
        success: function(data) {
            $('#editDepartment').modal('show');
            $('#department_id').val(edit_department_id);
            $('#edit_department_name').val(data.department);
        }

    })
});
//edit location details modal
$(document).on('click', '.edit_location', function() {
    var edit_location_id = $(this).attr("id");
    $.ajax({
        url: "operation/adminCrudOperations.php",
        method: "POST",
        data: { edit_location_id: edit_location_id },
        dataType: "json",
        success: function(data) {
            $('#editLocation').modal('show');
            $('#location_id').val(edit_location_id);
            $('#edit_location_name').val(data.name);
            $('#edit_address').val(data.address);
            $('#edit_street').val(data.street);
            $('#edit_district').val(data.district);
            $('#edit_city').val(data.city);
            $('#edit_state').val(data.province);
            $('#edit_country').val(data.country);
        }

    })
});
//delete service
$(document).on('click', '.delete_service', function() {
    var delete_service_id = $(this).attr("id");
    swal({
        title: "Sure to Delete?",
        text: "This service will be permanently removed",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, Delete",
        cancelButtonText: "No",
        closeOnConfirm: false,
        closeOnCancel: true
    }, function(isConfirm) {
        if (isConfirm) {
            $.ajax({
                url: "operation/adminCrudOperations.php",
                method: "POST",
                data: { delete_service_id: delete_service_id },
                dataType: "json",
                success: function(data) {
                    if (data == 200) {
                        swal({
                            title: "Deleted",
                            text: "Service successfully deleted from your list",
                            type: "success",
                            timer: 4000,
                            showConfirmButton: false
                        });
                        $('#services-table').DataTable().ajax.reload();
                    } else {
                        swal({
                            title: "Error",
                            text: "Something went wrong, please try again.",
                            type: "error",
                            timer: 4000,
                            showConfirmButton: false
                        });
                    }

                }

            })
        }
    });
});
//delete department
$(document).on('click', '.delete_department', function() {
    var delete_department_id = $(this).attr("id");
    swal({
        title: "Sure to Delete?",
        text: "This department will be permanently removed",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, Delete",
        cancelButtonText: "No",
        closeOnConfirm: false,
        closeOnCancel: true
    }, function(isConfirm) {
        if (isConfirm) {
            $.ajax({
                url: "operation/adminCrudOperations.php",
                method: "POST",
                data: { delete_department_id: delete_department_id },
                dataType: "json",
                success: function(data) {
                    if (data == 200) {
                        swal({
                            title: "Deleted",
                            text: "Department successfully deleted from your list",
                            type: "success",
                            timer: 4000,
                            showConfirmButton: false
                        });
                        $('#departments-table').DataTable().ajax.reload();
                    } else {
                        swal({
                            title: "Error",
                            text: "Something went wrong, please try again.",
                            type: "error",
                            timer: 4000,
                            showConfirmButton: false
                        });
                    }

                }

            })
        }
    });
});
//delete location
$(document).on('click', '.delete_location', function() {
    var delete_location_id = $(this).attr("id");
    swal({
        title: "Sure to Delete?",
        text: "This location will be permanently removed",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, Delete",
        cancelButtonText: "No",
        closeOnConfirm: false,
        closeOnCancel: true
    }, function(isConfirm) {
        if (isConfirm) {
            $.ajax({
                url: "operation/adminCrudOperations.php",
                method: "POST",
                data: { delete_location_id: delete_location_id },
                dataType: "json",
                success: function(data) {
                    if (data == 200) {
                        swal({
                            title: "Deleted",
                            text: "Location successfully deleted from your list",
                            type: "success",
                            timer: 4000,
                            showConfirmButton: false
                        });
                        $('#locations-table').DataTable().ajax.reload();
                    } else {
                        swal({
                            title: "Error",
                            text: "Something went wrong, please try again.",
                            type: "error",
                            timer: 4000,
                            showConfirmButton: false
                        });
                    }

                }

            })
        }
    });
});

//Submitting new location form
$(document).on('submit', '#newLocation', function(event) {
    event.preventDefault();
    var locName = $('#location_name').val();
    var locAddress = $('#location_address').val();
    var locStreet = $('#location_street').val();
    var locDistrict = $('#location_district').val();
    var locCity = $('#location_city').val();
    var locState = $('#location_state').val();
    var locCountry = $('#location_country').val();
    var locTimeZone = $('#location_timezone').val();

    if (locName !== '' && locAddress !== '' && locStreet !== '' && locDistrict !== '' && locCity !== '' && locState !== '' && locCountry !== '' && locTimeZone !== '') {
        $.ajax({
            url: "operation/addLocation.php",
            method: 'POST',
            data: new FormData(this),
            contentType: false,
            processData: false,
            success: function(data) {
                if (data == 200) {
                    $('#newLocation')[0].reset();
                    swal({
                        title: "Success",
                        text: "Location successfully added to your list.",
                        type: "success",
                        timer: 5000,
                        showConfirmButton: false
                    });
                    $('#locations-table').DataTable().ajax.reload();
                } else if (data == 500) {
                    swal({
                        title: "Error",
                        text: "Something went wrong, please try again.",
                        type: "error",
                        timer: 5000,
                        showConfirmButton: false
                    });
                }
            }
        });
    } else {
        $.toast({
            heading: 'Warning',
            text: 'Please fill all the fields.',
            icon: 'warning',
            position: 'bottom-right',
            showHideTransition: 'slide'
        })
    }
});

//Submitting new service form
$(document).on('submit', '#newService', function(event) {
    event.preventDefault();
    var name = $('#service_name').val();
    var currency = $('#service_currency').val();
    var price = $('#service_price').val();
    var duration = $('#service_duration').val();

    if (name !== '' && currency !== '' && price !== '' && duration !== '') {
        $.ajax({
            url: "operation/addService.php",
            method: 'POST',
            data: new FormData(this),
            contentType: false,
            processData: false,
            success: function(data) {
                if (data == 200) {
                    $('#newService')[0].reset();
                    swal({
                        title: "Success",
                        text: "Service successfully added to your list.",
                        type: "success",
                        timer: 5000,
                        showConfirmButton: false
                    });
                    $('#services-table').DataTable().ajax.reload();
                } else if (data == 500) {
                    swal({
                        title: "Error",
                        text: "Something went wrong, please try again.",
                        type: "error",
                        timer: 5000,
                        showConfirmButton: false
                    });
                } else if (data == 400) {
                    swal({
                        title: "Error",
                        text: "Kindly fill all the required inputs. If the error persist, try reloading the page",
                        type: "error",
                        timer: 5000,
                        showConfirmButton: false
                    });
                }
            }
        });
    } else {
        $.toast({
            heading: 'Warning',
            text: 'Please fill all the fields.',
            icon: 'warning',
            position: 'bottom-right',
            showHideTransition: 'slide'
        })
    }
});

//Submitting new department form
$(document).on('submit', '#newDepartment', function(event) {
    event.preventDefault();
    var department = $('#department_name').val();

    if (department !== '') {
        $.ajax({
            url: "operation/addDepartment.php",
            method: 'POST',
            data: new FormData(this),
            contentType: false,
            processData: false,
            success: function(data) {
                if (data == 200) {
                    $('#newDepartment')[0].reset();
                    swal({
                        title: "Success",
                        text: "Department successfully added to your list.",
                        type: "success",
                        timer: 5000,
                        showConfirmButton: false
                    });
                    $('#departments-table').DataTable().ajax.reload();
                } else if (data == 500) {
                    swal({
                        title: "Error",
                        text: "Something went wrong, please try again.",
                        type: "error",
                        timer: 5000,
                        showConfirmButton: false
                    });
                }
            }
        });
    } else {
        $.toast({
            heading: 'Warning',
            text: 'Please enter name of department',
            icon: 'warning',
            position: 'bottom-right',
            showHideTransition: 'slide'
        })
    }
});

//Submitting new user form
$(document).on('submit', '#newUser', function(event) {
    event.preventDefault();
    var location = $('#user_location').val();
    var department = $('#user_department').val();
    var usertype = $('#user_type').val();
    var title = $('#user_title').val();
    var firstname = $('#user_firstname').val();
    var lastname = $('#user_lastname').val();
    var email = $('#user_email').val();
    var phone = $('#user_phone').val();
    var rights = $('#user_rights').val();
    var extension = $('#uploaded_file').val().split('.').pop().toLowerCase();
    if (extension !== '') {
        if (jQuery.inArray(extension, ['gif', 'png', 'jpg', 'jpeg']) === -1) {
            $.toast({
                heading: 'Error',
                text: 'The uploaded file is not supported file type. Only the following file types are supported: gif, png, jpg &.',
                icon: 'error',
                position: 'bottom-right',
                showHideTransition: 'slide'
            });
            $('#uploaded_file').val('');
            return false;
        }
    }
    if (usertype == 'Sec' && rights == '') {
        $.toast({
            heading: 'Warning',
            text: 'Front Office user must be granted login user rights.',
            icon: 'warning',
            position: 'bottom-right',
            showHideTransition: 'slide'
        })
    } else if (location !== '' && department !== '' && usertype !== '' && title !== '' && firstname !== '' && lastname !== '' && email !== '' && phone !== '') {
        $.ajax({
            url: "operation/addUser.php",
            method: 'POST',
            data: new FormData(this),
            contentType: false,
            processData: false,
            success: function(data) {
                if (data == 200) {
                    $('#newUser')[0].reset();
                    $('#add_user').modal('hide');
                    swal({
                        title: "Success",
                        text: "User successfully added to your list.",
                        type: "success",
                        timer: 5000,
                        showConfirmButton: true,
                        confirmButtonText: "Continue",
                    }, function (isConfirm) {
                        if (isConfirm) window.location.reload();
                    });
                    $('#users-table').DataTable().ajax.reload();
                } else if (data == 800) {
                    swal({
                        title: "Warning",
                        text: "A user already exist with the same email address given.",
                        type: "warning",
                        timer: 5000,
                        showConfirmButton: false
                    });
                } else if (data == 100) {
                    swal({
                        title: "Warning",
                        text: "You have reached maximum number (3) of users you can add. Kindly make payment first to unlock more slots for additional users",
                        type: "warning",
                        timer: 6000,
                        showConfirmButton: false
                    });
                } else if (data == 500) {
                    swal({
                        title: "Error",
                        text: "A problem occured while sending the form, please try again.",
                        type: "error",
                        timer: 5000,
                        showConfirmButton: false
                    });
                }
                
                location.reload();
            }
        });
    } else {
        $.toast({
            heading: 'Warning',
            text: 'Please fill all the fields.',
            icon: 'warning',
            position: 'bottom-right',
            showHideTransition: 'slide'
        })
    }
});

//updating user form
$(document).on('submit', '#edit-user', function(event) {
    event.preventDefault();
    var department = $('#edit_user_department').val();
    var user_type = $('#edit_user_type').val();
    var username = $('#edit_username').val();
    var email = $('#edit_user_email').val();
    var phone = $('#edit_user_phone').val();
    if (username !== '' && department !== '' && user_type !== '' && username !== '' && email !== '' && phone !== '') {
        $.ajax({
            url: "operation/addUser.php",
            method: 'POST',
            data: new FormData(this),
            contentType: false,
            processData: false,
            success: function(data) {
                if (data == 200) {
                    $('#edit-user')[0].reset();
                    $('#editUser').modal('hide');
                    swal({
                        title: "Success",
                        text: "User successfully updated.",
                        type: "success",
                        timer: 5000,
                        showConfirmButton: false
                    });
                    $('#users-table').DataTable().ajax.reload();
                } else if (data == 500) {
                    swal({
                        title: "Error",
                        text: "Something went wrong, please try again.",
                        type: "error",
                        timer: 5000,
                        showConfirmButton: false
                    });
                }
            }
        });
    } else {
        $.toast({
            heading: 'Warning',
            text: 'Please fill all the required fields',
            icon: 'warning',
            position: 'bottom-right',
            showHideTransition: 'slide'
        })
    }
});

//submitting user rights form
$(document).on('submit', '#add-privilege', function(event) {
    event.preventDefault();
    var granted_privileges = $('#sec_user_rights').val();
    if (granted_privileges !== '') {
        $.ajax({
            url: "operation/addUserPrivileges.php",
            method: 'POST',
            data: new FormData(this),
            contentType: false,
            processData: false,
            success: function(data) {
                if (data == 200) {
                    $('#add-privilege')[0].reset();
                    $('#userRights').modal('hide');
                    swal({
                        title: "Success",
                        text: "Right granted.",
                        type: "success",
                        timer: 5000,
                        showConfirmButton: false
                    });
                } else if (data == 500) {
                    swal({
                        title: "Error",
                        text: "Something went wrong, please try again.",
                        type: "error",
                        timer: 5000,
                        showConfirmButton: false
                    });
                }
            }
        });
    } else {
        $.toast({
            heading: 'Warning',
            text: 'Please add user rights',
            icon: 'warning',
            position: 'bottom-right',
            showHideTransition: 'slide'
        })
    }
});

//updating department form
$(document).on('submit', '#edit-department', function(event) {
    event.preventDefault();
    var department = $('#edit_department_name').val();
    if (department !== '') {
        $.ajax({
            url: "operation/addDepartment.php",
            method: 'POST',
            data: new FormData(this),
            contentType: false,
            processData: false,
            success: function(data) {
                if (data == 200) {
                    $('#edit-department')[0].reset();
                    $('#editDepartment').modal('hide');
                    swal({
                        title: "Success",
                        text: "Department successfully updated.",
                        type: "success",
                        timer: 5000,
                        showConfirmButton: false
                    });
                    $('#departments-table').DataTable().ajax.reload();
                } else if (data == 500) {
                    swal({
                        title: "Error",
                        text: "Something went wrong, please try again.",
                        type: "error",
                        timer: 5000,
                        showConfirmButton: false
                    });
                }
            }
        });
    } else {
        $.toast({
            heading: 'Warning',
            text: 'Please enter name of department',
            icon: 'warning',
            position: 'bottom-right',
            showHideTransition: 'slide'
        })
    }
});


//updating service form
$(document).on('submit', '#edit-service', function(event) {
    event.preventDefault();
    var name = $('#edit_service_name').val();
    var price = $('#edit_service_price').val();
    var duration = $('#edit_service_duration').val();
    if (name !== '' && price !== '' && duration !== '') {
        $.ajax({
            url: "operation/addService.php",
            method: 'POST',
            data: new FormData(this),
            contentType: false,
            processData: false,
            success: function(data) {
                if (data == 200) {
                    $('#edit-service')[0].reset();
                    $('#editService').modal('hide');
                    swal({
                        title: "Success",
                        text: "Service successfully updated.",
                        type: "success",
                        timer: 5000,
                        showConfirmButton: false
                    });
                    $('#services-table').DataTable().ajax.reload();
                } else if (data == 500) {
                    swal({
                        title: "Error",
                        text: "Something went wrong, please try again.",
                        type: "error",
                        timer: 5000,
                        showConfirmButton: false
                    });
                }
            }
        });
    } else {
        $.toast({
            heading: 'Warning',
            text: 'Please enter name of department',
            icon: 'warning',
            position: 'bottom-right',
            showHideTransition: 'slide'
        })
    }
});

//updating location form
$(document).on('submit', '#edit-location', function(event) {
    event.preventDefault();
    var locName = $('#edit_location_name').val();
    var locAddress = $('#edit_address').val();
    var locStreet = $('#edit_street').val();
    var locDistrict = $('#edit_district').val();
    var locCity = $('#edit_city').val();
    var locState = $('#edit_state').val();
    var locCountry = $('#edit_country').val();
    if (locName !== '' && locAddress !== '' && locStreet !== '' && locDistrict !== '' && locCity !== '' && locState !== '' && locCountry !== '') {
        $.ajax({
            url: "operation/addLocation.php",
            method: 'POST',
            data: new FormData(this),
            contentType: false,
            processData: false,
            success: function(data) {
                if (data == 200) {
                    $('#edit-location')[0].reset();
                    $('#editLocation').modal('hide');
                    swal({
                        title: "Success",
                        text: "Location successfully updated.",
                        type: "success",
                        timer: 5000,
                        showConfirmButton: false
                    });
                    $('#locations-table').DataTable().ajax.reload();
                } else if (data == 500) {
                    swal({
                        title: "Error",
                        text: "Something went wrong, please try again.",
                        type: "error",
                        timer: 5000,
                        showConfirmButton: false
                    });
                }
            }
        });
    } else {
        $.toast({
            heading: 'Warning',
            text: 'Please enter name of department',
            icon: 'warning',
            position: 'bottom-right',
            showHideTransition: 'slide'
        })
    }
});

//submitting user service form
$(document).on('submit', '#service-form', function(event) {
    event.preventDefault();
    var location = $('#service_location').val();
    var service = $('#user_service').val();
    var mondayFrom = $('#mondayFrom').val();
    var mondayTo = $('#mondayTo').val();
    var tuesdayFrom = $('#tuesdayFrom').val();
    var tuesdayTo = $('#tuesdayTo').val();
    var wednesdayFrom = $('#wednesdayFrom').val();
    var wednesdayTo = $('#wednesdayTo').val();
    var thursdayFrom = $('#thursdayFrom').val();
    var thursdayTo = $('#thursdayTo').val();
    var fridayFrom = $('#fridayFrom').val();
    var fridayTo = $('#fridayTo').val();
    var saturdayFrom = $('#saturdayFrom').val();
    var saturdayTo = $('#saturdayTo').val();
    var sundayFrom = $('#sundayFrom').val();
    var sundayTo = $('#sundayTo').val();

    if (location !== '' && service !== '') {
        if ($('#weekday-mon')[0].checked || $('#weekday-tue')[0].checked || $('#weekday-wed')[0].checked || $('#weekday-thu')[0].checked || $('#weekday-fri')[0].checked || $('#weekday-sat')[0].checked || $('#weekday-sun')[0].checked) {
            if ($('#weekday-mon')[0].checked && (mondayFrom == '' || mondayTo == '')) {
                $.toast({
                    heading: 'Warning',
                    text: 'You selected Monday as working day, select time from and time to.',
                    icon: 'warning',
                    position: 'bottom-right',
                    showHideTransition: 'slide'
                })
            } else if ($('#weekday-tue')[0].checked && (tuesdayFrom == '' || tuesdayTo == '')) {
                $.toast({
                    heading: 'Warning',
                    text: 'You selected Tuesday as working day, select time from and time to.',
                    icon: 'warning',
                    position: 'bottom-right',
                    showHideTransition: 'slide'
                })
            } else if ($('#weekday-wed')[0].checked && (wednesdayFrom == '' || wednesdayTo == '')) {
                $.toast({
                    heading: 'Warning',
                    text: 'You selected Wednesday as working day, select time from and time to.',
                    icon: 'warning',
                    position: 'bottom-right',
                    showHideTransition: 'slide'
                })
            } else if ($('#weekday-thu')[0].checked && (thursdayFrom == '' || thursdayTo == '')) {
                $.toast({
                    heading: 'Warning',
                    text: 'You selected Thursday as working day, select time from and time to.',
                    icon: 'warning',
                    position: 'bottom-right',
                    showHideTransition: 'slide'
                })
            } else if ($('#weekday-fri')[0].checked && (fridayFrom == '' || fridayTo == '')) {
                $.toast({
                    heading: 'Warning',
                    text: 'You selected Friday as working day, select time from and time to.',
                    icon: 'warning',
                    position: 'bottom-right',
                    showHideTransition: 'slide'
                })
            } else if ($('#weekday-sat')[0].checked && (saturdayFrom == '' || saturdayTo == '')) {
                $.toast({
                    heading: 'Warning',
                    text: 'You selected Saturday as working day, select time from and time to.',
                    icon: 'warning',
                    position: 'bottom-right',
                    showHideTransition: 'slide'
                })
            } else if ($('#weekday-sun')[0].checked && (sundayFrom == '' || sundayTo == '')) {
                $.toast({
                    heading: 'Warning',
                    text: 'You selected Sunday as working day, select time from and time to.',
                    icon: 'warning',
                    position: 'bottom-right',
                    showHideTransition: 'slide'
                })
            } else {
                $.ajax({
                    url: "operation/addUserService.php",
                    method: 'POST',
                    data: new FormData(this),
                    contentType: false,
                    processData: false,
                    success: function(data) {
                        if (data == 200) {
                            $('#service-form')[0].reset();
                            $('#addUserService').modal('hide');
                            swal({
                                title: "Success",
                                text: "Service successfully added to the user's services.",
                                type: "success",
                                timer: 5000,
                                showConfirmButton: false
                            });
                            $('#users-table').DataTable().ajax.reload();
                        } else if (data == 500) {
                            swal({
                                title: "Error",
                                text: "An error occurred while sending the form, please try again.",
                                type: "error",
                                timer: 5000,
                                showConfirmButton: false
                            });
                        }
                    }
                });
            }
        } else {
            $.toast({
                heading: 'Warning',
                text: 'A doctor providing a service must have at least one working day.',
                icon: 'warning',
                position: 'bottom-right',
                showHideTransition: 'slide'
            })
        }

    } else {
        $.toast({
            heading: 'Warning',
            text: 'Please select a service',
            icon: 'warning',
            position: 'bottom-right',
            showHideTransition: 'slide'
        })
    }

});
 