function checkNotifications(logged_in_doc_id, permission) {

    if (permission == "granted") {
        $.ajax({
            url: "operation/checkNotification.php",
            method: "POST",
            data: { doctor_id: logged_in_doc_id },
            dataType: 'json',
            success: function(data) {

                if (data.new_notification) {
                    
                    if(data.appt_notifications.status) {
                        
                        if (data.appt_notifications.count > 1) {
                            
                            appt_notification = new Notification(
                                "You Have New Appointments.",
                                {
                                    body: `You received bookings for ${data.appt_notifications.count} new appointments while you away.\nClick here to view them.`,
                                });
                        } else {
                            appt_notification = new Notification(
                                "You Have A New Appointment.",
                                {
                                    body: `Appointment with ${data.appt_notifications.newest_notif.patient_name} booked for ${data.appt_notifications.newest_notif.date} from ${data.appt_notifications.newest_notif.start.split(':').slice(0,-1).join(':')} to ${data.appt_notifications.newest_notif.end.split(':').slice(0,-1).join(':')}`,
                                });
                        }
                        
                        appt_notification.addEventListener("click", function() {
                                window.location.pathname = "/upcoming-appointments"
                            });
                    }
                    
                    if (data.ref_notifications.status) {
                        if (data.ref_notifications.count > 1) {
                            ref_notification = new Notification (
                                "You Have New Referrals.",
                                {
                                    body: `You received ${data.ref_notifications.count} new referrals while you were away.\nClick here to view them.`,
                                });
                        } else {
                            ref_notification = new Notification (
                                "You Have A New Referral.",
                                {
                                    body: `You received a new patient referral from ${data.ref_notifications.newest_notif.referrer_name}.`,
                                });
                        }
                        
                        ref_notification.addEventListener("click", function() {
                                window.location.pathname = "/my_referrals"
                            });
                    }
                    
                    if (data.nw_chat_notifications.status) {
                        if (data.nw_chat_notifications.count > 1) {
                            nw_chat_notification = new Notification(
                                "You Have New Messages.",
                                {
                                    body: `You received ${data.nw_chat_notifications.count} new messages in your network chat while you away.\nClick here to view them.`,
                                });
                        } else {
                            nw_chat_notification = new Notification (
                                "You Have A New Message.",
                                {
                                    body: `You have a new message from ${data.nw_chat_notifications.newest_notif.chat_sender_name}.`,
                                });
                        }
                        
                        nw_chat_notification.addEventListener("click", function() {
                                window.location.pathname = "/network_chat"
                            });
                    }
                    
                    // CLICK ACTIONS NOT SET FOR pat_chat_notifications and telemed_pat_ready_notifications
                    
                    if (data.pat_chat_notifications.status) {
                        if (data.pat_chat_notifications.count > 1) {
                            pat_chat_notification = new Notification(
                                "You Have New Messages.",
                                {
                                    body: `You received ${data.pat_chat_notifications.count} new messages in your network chat while you away.\nClick here to view them.`,
                                });
                        } else {
                            pat_chat_notification = new Notification (
                                "You Have A New Message.",
                                {
                                    body: `You have a new message from ${data.pat_chat_notifications.newest_notif.chat_sender_name}.`,
                                });
                        }
                        
                        // pat_chat_notification.addEventListener("click", function() {
                        //         window.location.pathname = "/network_chat"
                        //     });
                    }
                    
                    if (data.telemed_pat_ready_notifications.status) {
                        telemed_pat_ready_notification = new Notification (
                            "Patient Ready For Telemed Appointment.",
                            {
                               body: `${data.telemed_pat_ready_notifications.newest_notif.patient_name} is ready for the telemedicine appointment scheduled for ${data.telemed_pat_ready_notifications.newest_notif.start.split(':').slice(0,-1).join(':')} to ${data.telemed_pat_ready_notifications.newest_notif.end.split(':').slice(0,-1).join(':')} on ${data.telemed_pat_ready_notifications.newest_notif.date}` 
                            });
                            
                        // telemed_pat_ready_notification.addEventListener("click", function() {
                        //         window.location.pathname = "/network_chat"
                        //     });
                    }
                }
            
            }
        });
    }
}

Notification.requestPermission(function(permission){
    var check_notifications = setInterval(function (){
        checkNotifications($('#doctorId').val(), permission);
    }, 5000);
    
});
