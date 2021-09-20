 <div class="modal fade" id="callback" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content waiting">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            </div>
            <div class="modal-body"> 
                <h5 style="margin: auto;">Your Waiting Time Is <span class="time">10:00 min</span></h5>
                <p id="permission-body">Apologies for waiting too long, all our doctors are currently attending to other patients. Please select one of the options below to either continue waiting in the queue or reschedule your appointment.</p>
                <div id="callback-error" class="alert alert-danger"></div>
            </div>
            <div class="modal-footer">
                <button id="continue-waiting">Continue Waiting</button>
                <button id="reschedule-appointment">Reschedule Appointment</button>
            </div>
            <div class="callback-success" style="display: none;"> 
                <h3><i class="fa fa-check" aria-hidden="true"></i></h3>
                <h5 id="message"></h5>
            </div>
        </div>
        <div class="modal-content reschedule-appointment" style="display: none;">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            </div>
            <div class="modal-body"> 
                <h5 style="margin: auto;">Reschedule Your Appointment</h5>
                <p id="permission-body">Please select date and time to reschedule your appointment</p>
                <input id="datetimepicker" type="text" onkeydown="return false" class="form-control validate" required/>
                <div id="reschedule-error" class="alert alert-danger"></div>
            </div>
            <div class="modal-footer">
                <button id="reschedule" disabled="disabled">Reschedule Appointment</button>
            </div>
        </div>
    </div>
</div> 
<!-- end modal -->