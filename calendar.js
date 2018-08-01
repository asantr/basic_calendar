var d = new Date();
var day = d.getDate();
var month = d.getMonth();
var year = d.getUTCFullYear();
var m = new Month(year, month);
var logged_in_user = null;
var token = null;
var edit_event = null;
var first_time = true;
var num_cals = 0;

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function updateView(){
        updateSideBar();
    var weeks = m.getWeeks();
    
    var txt_month = monthNames[m.month];
    var txt_year = m.year;
    document.getElementById("month_display").innerHTML = txt_month + " " + txt_year;
    
    var cal = document.getElementById("cal_view");
    if(logged_in_user != null){
        var div = document.getElementsByClassName("right_top");
        
        document.getElementById("login_button").style.visibility = "hidden";
        document.getElementById("register_button").style.visibility = "hidden";
        
        var user_node = document.getElementById("user_b");
        user_node.innerHTML = '';
        var user_text = document.createTextNode(logged_in_user + "   ");
        user_node.append(user_text);

        document.getElementById("logout_btn").style.visibility = "visible";
        document.getElementById("user_b").style.visibility = "visible"; 
        
        document.getElementById("logout_btn").addEventListener("click", logoutUser, false);
        

    }
    if(logged_in_user == null){
        document.getElementById("logout_btn").style.visibility = "hidden";
        document.getElementById("user_b").style.visibility = "hidden"; 
        document.getElementById('event_button').style.visibility = 'hidden';
        document.getElementById('calendar_button').style.visibility = 'hidden';
        document.getElementById('shared_calendar_button').style.visibility = 'hidden';
    }
    
    
    while (cal.firstChild) {
        cal.removeChild(cal.firstChild);
    }
    for(var w =0; w < weeks.length; w++){
        var tr_node = document.createElement("tr");
        var days = weeks[w].getDates();
        for(var d =0; d < days.length; d++){
            var td_node = document.createElement("td");
            
            if(days[d].getMonth() != m.month){
            }else {
                var get_day = days[d].getFullYear()+"-"+("0" + (days[d].getMonth()+1)).slice(-2)+"-"+("0" + days[d].getDate()).slice(-2);
                var date_node = document.createElement("h1");
                var text_node = document.createTextNode(days[d].getDate());
                date_node.appendChild(text_node);
                td_node.appendChild(date_node);
                getEventsForDay(get_day, td_node);
            }
            tr_node.appendChild(td_node);
        }
        
        cal.appendChild(tr_node);
    }

    getUsers();
}

function foo(event) {
    document.getElementById("prev_month").addEventListener("click", getPrevMonth, false);
    document.getElementById("next_month").addEventListener("click", getNextMonth, false);
    document.getElementById("login_btn").addEventListener("click", loginAjax, false);
    document.getElementById("create_user").addEventListener("click", createUserAjax, false);
    document.getElementById("update_button").addEventListener("click", updateSideBar, false);
    document.getElementById("create_event").addEventListener("click", createEvent, false);
    document.getElementById("new_cal_btn").addEventListener("click", newCalendar, false);
    document.getElementById("share_cal_btn").addEventListener("click", newSharedCalendar, false);
    document.getElementById('editEvent').addEventListener("click", submitEdit, false);
    document.getElementById('deleteEvent').addEventListener("click", deleteEvent, false);
    
    updateView();
    setup_popups();
}

function getPrevMonth(event){
    m = m.prevMonth();
    updateView();
}

function getNextMonth(event){
    m = m.nextMonth();
    updateView();
}


document.addEventListener("DOMContentLoaded", foo, false);

// Get the modal
function  setup_popups() {
        
    var modal = document.getElementById('loginPopUp');
    
    // Get the button that opens the modal
    var btn = document.getElementById("login_button");
    
    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];
    
    // When the user clicks the button, open the modal 
    btn.onclick = function() {
        modal.style.display = "block";
    };
    
    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
    };
    
    // When the user clicks anywhere outside of the modal, close it
   
    
    var reg_btn = document.getElementById("register_button");
    var reg_modal = document.getElementById('RegisterPopUp');
    
    reg_btn.onclick = function() {
        reg_modal.style.display = "block";
    };
    
    var span_two = document.getElementsByClassName("close")[1];
    
    // When the user clicks on <span> (x), close the modal
    span_two.onclick = function() {
       reg_modal.style.display = "none";
    };
    
    // When the user clicks anywhere outside of the modal, close it
    
    var event_btn = document.getElementById("event_button");
    var event_modal = document.getElementById('EventPopUp');
    var event_submit = document.getElementById('create_event');
    var edit_submit = document.getElementById('editEvent');
    var delete_submit = document.getElementById('deleteEvent');

    if (first_time){
        var place = document.getElementById("event_add_place");
        /*<input type="date" id="event_date" name="event_date" required/>
         <input type="time" id="event_time" name="event_time" required />*/
        
        var dinput = document.createElement("input");
        dinput.type = "date";
        dinput.id = "event_date";
        dinput.name = "event_date";
        
        var tinput = document.createElement("input");
        tinput.type = "time";
        tinput.id = "event_time";
        tinput.name = "event_time";
        
        place.appendChild(dinput);
        place.appendChild(tinput);
        
        var col_input = document.createElement('input');
        col_input.type = "color";
        col_input.id = "cal_color";
        col_input.value = "#6b9488";
        var col_place = document.getElementById("col_input_p");
        col_place.appendChild(col_input);
        
        var share_col_input = document.createElement('input');
        share_col_input.type = "color";
        share_col_input.id = "share_cal_color";
        share_col_input.value = "#6b9488";
        var share_col_place = document.getElementById("share_col_input_p");
        share_col_place.appendChild(share_col_input);
        first_time = false;
    }
    
    
    event_submit.style.visibility = "visible";
    edit_submit.style.visibility = "hidden";
    delete_submit.style.visibilty = "hidden";    
    event_btn.onclick = function() {
        var event_submit = document.getElementById('create_event');
        var edit_submit = document.getElementById('editEvent');
        var delete_submit = document.getElementById('deleteEvent');
        event_submit.style.visibility = "visible";
        edit_submit.style.visibility = "hidden";
        delete_submit.style.visibility = "hidden";
        event_modal.style.display = "block";
    };
    
    var span_three = document.getElementsByClassName("close")[2];
    
    // When the user clicks on <span> (x), close the modal
    span_three.onclick = function() {
       event_modal.style.display = "none";
    };
    
    // When the user clicks anywhere outside of the modal, close it
    
    var cal_btn = document.getElementById("calendar_button");
    var cal_modal = document.getElementById('NewCalPopUp');

    
    cal_btn.onclick = function() {
        cal_modal.style.display = "block";
    };
    
    var span_cal = document.getElementsByClassName("close")[3];
    
    // When the user clicks on <span> (x), close the modal
    span_cal.onclick = function() {
       cal_modal.style.display = "none";
    };
    
    // When the user clicks anywhere outside of the modal, close it

    
    var share_cal_btn = document.getElementById("shared_calendar_button");
    var share_cal_modal = document.getElementById('SharedCalPopUp');

    
    share_cal_btn.onclick = function() {
        share_cal_modal.style.display = "block";
    };
    
    var span_share_cal = document.getElementsByClassName("close")[4];
    
    // When the user clicks on <span> (x), close the modal
    span_share_cal.onclick = function() {
       share_cal_modal.style.display = "none";
    };
    
    // When the user clicks anywhere outside of the modal, close it

}

async function loginAjax(event) {
    const username = document.getElementById("username_input").value; // Get the username from the form
    const password = document.getElementById("password_input").value; // Get the password from the form
    
    // Make a URL-encoded string for passing POST data:
    var body = new FormData();
    body.append("username", username);
    body.append("password", password);
    var logged_in = false;
    
    let fetchData = {method: 'POST',
            body: body,
            //body: JSON.stringify(data),
            header: "Content-Type: application/json"
        };
        logged_in = await (fetch("user_login.php", fetchData))
        .then(response => response.json())
        .then(function(data){ return data; }  );        
        
        if(logged_in.success){
            logged_in_user = username;
            token = logged_in.token;
            var modal = document.getElementById('loginPopUp');
            modal.style.display = "none";
            updateView();
            document.getElementById('event_button').style.visibility = 'visible';
            document.getElementById('calendar_button').style.visibility = 'visible';
            document.getElementById('shared_calendar_button').style.visibility = 'visible';
            setup_popups();
        }else{
            alert("Incorrect password");
        }
    return;
}

function logoutUser(event){
    logged_in_user = null;
    let fetchData = {method: 'POST',
            header: "Content-Type: application/json"
        };
        fetch("logout.php", fetchData)
        .then(response => response.json())
        .then(function(data){ console.log(data.success); });
        
        
    if(logged_in_user == null){
        var div = document.getElementsByClassName("right_top");
        //div[0].innerHTML = '';
               //<input type="button" id="login_button" value="Login"/>
               //<input type="button" id="register_button" value="Register New User"/>
        document.getElementById("login_button").style.visibility = "visible";
        document.getElementById("register_button").style.visibility = "visible";
        document.getElementById("logout_btn").style.visibility = "hidden";
        document.getElementById("user_b").style.visibility = "hidden";
        
        setup_popups();
    }
    updateSideBar();
    document.getElementById('event_button').style.visibility = 'hidden';
    document.getElementById('calendar_button').style.visibility = 'hidden';
    document.getElementById('shared_calendar_button').style.visibility = 'hidden';
    updateView();

}

async function createUserAjax(event){
    const username = document.getElementById("reg_username_input").value; // Get the username from the form
    const password = document.getElementById("reg_password_input").value; // Get the password from the form
    const password_confirm = document.getElementById("password_input_confirm").value; // Get the password from the form

    // Make a URL-encoded string for passing POST data:
    var body = new FormData();
    body.append("username", username);
    body.append("password", password);
    body.append("password_confirm", password_confirm);
    var user_made = false;
    
    let fetchData = {method: 'POST',
            body: body,
            //body: JSON.stringify(data),
            header: "Content-Type: application/json"
        };
    user_made = await (fetch("create_user.php", fetchData))
    .then(response => response.json())
    .then(function(data){ return data.success; }  );
        
    if(user_made){
        logged_in_user = username;
        var modal = document.getElementById('loginPopUp');
        modal.style.display = "none";
        updateView();
        updateSideBar();
        document.getElementById('event_button').style.visibility = 'visible';
        document.getElementById('calendar_button').style.visibility = 'visible';
        document.getElementById('shared_calendar_button').style.visibility = 'visible';
        setup_popups();
    }else{
        alert("Could not create user. Please Try again");
    }
    
    var reg_modal = document.getElementById('RegisterPopUp');
    reg_modal.style.display = "none";
    return;
}

async function updateSideBar(){
    var username = logged_in_user;
    var body = new FormData();
    body.append("username", username);
    
    let fetchData = {method: 'POST',
        body: body,
        header: "Content-Type: application/json"
    };
    var d = document.getElementsByClassName("calendars")[0];
    var cal_sel = document.getElementById("calendar_options");
    await(fetch("return_calendars.php", fetchData))
    .then(response => response.json())
    .then(function(data) {
        d.innerHTML = '';
        var index = cal_sel.length;
        for(var j = 0; j <index; j++) {
             cal_sel.remove(cal_sel.j);
        }
        num_cals = data.calendars.length;
        for (var i = 0; i < data.calendars.length; i++) {
            
            var listItem = document.createElement('p');
            var checkbx = document.createElement("input");
            checkbx.type = "checkbox";
            checkbx.id = "check_"+i;
            checkbx.value = data.calendars[i].cal_name;
            checkbx.checked = true;
            checkbx.onclick = function (){
                var cal = event.target.value;
                var events = document.getElementsByName(cal);
    
                if(event.target.checked){
                    for(var i=0; i < events.length; i++){
                        events[i].style.display = "block";
                    }
                }else{
                    for(var j=0; j < events.length; j++){
                        events[j].style.display = "none";
                    }
                }
            };
                /*
            changeEventView(data.calendars[i].cal_name, checkbx);*/ 
            var listbtn = document.createElement('button');
            listbtn.value = data.calendars[i].cal_name;
            var ctxt = document.createTextNode(data.calendars[i].cal_name);
            listbtn.appendChild(ctxt);
            listbtn.style.background = '#'+data.calendars[i].cal_color;
            listItem.appendChild(checkbx);
            listItem.appendChild(listbtn);
            d.appendChild(listItem);
            
            var opt = document.createElement('option');
            opt.id = data.calendars[i].cal_name;
            opt.value = data.calendars[i].cal_name;
            var opt_text = document.createTextNode(data.calendars[i].cal_name);
            opt.appendChild(opt_text);
            cal_sel.appendChild(opt);
        }
        if(logged_in_user == null){
            d.innerHTML = '';
        }
    }  );
}
async function createEvent(event){
    var username = logged_in_user;
    var event_name = document.getElementById("event_name_input").value;
    var cal_name = document.getElementById("calendar_options").value;
    var event_date = document.getElementById("event_date").value;
    var event_time = document.getElementById("event_time").value;
    
    var body = new FormData();
    body.append("username", username);
    body.append("cal_name", cal_name);
    body.append("event_name", event_name);
    body.append("event_date", event_date);
    body.append("event_time", event_time);
    
    let fetchData = {method: 'POST',
        body: body,
        header: "Content-Type: application/json"
    };
    
    await(fetch("new_event.php", fetchData))
    .then(response => response.json());
    
    updateView();
    var event_modal = document.getElementById('EventPopUp');
    event_modal.style.display = "none";
    resetEdit();
}

async function newCalendar(event){
    var username = logged_in_user;
    var cal_name = document.getElementById("cal_name_input").value;
    var cal_color = document.getElementById("cal_color").value;
    
    if( cal_color.charAt( 0 ) === '#' )
        cal_color = cal_color.slice( 1 );
    
    var body = new FormData();
    body.append("username", username);
    body.append("cal_name", cal_name);
    body.append("cal_color", cal_color);
    
    let fetchData = {method: 'POST',
        body: body,
        header: "Content-Type: application/json"
    };
    
    await(fetch("new_calendars.php", fetchData))
    .then(response => response.json());
    
    updateView();
    var cal_modal = document.getElementById('NewCalPopUp');
    cal_modal.style.display = "none";
}

async function getEventsForDay(day_to_get, day_field){
    
    var username = logged_in_user;

    var body = new FormData();
    body.append("username", username);
    body.append("day_to_get", day_to_get);

    
    let fetchData = {method: 'POST',
        body: body,
        header: "Content-Type: application/json"
    };
    
    await(fetch("get_events.php", fetchData))
    .then(response => response.json())
    .then(function(data) {
        //var events_for_day = [];
        for(var i = 0; i < data.events.length; i++){
            if( !$.isArray(data.events) ||  !data.events.length ) {
            }else{
                var ebtn = document.createElement("button");
                ebtn.name = htmlEntities(data.events[i].cal_name);
                ebtn.id = htmlEntities(data.events[i].id);
                var etxt = document.createTextNode(htmlEntities(data.events[i].event_time + "  "+ data.events[i].event_name));
                ebtn.value = htmlEntities(data.events[i].event_name+","+data.events[i].event_time + ","+data.events[i].event_date+","+data.events[i].cal_name);
                ebtn.style.background = '#'+data.color[i].cal_color;
                ebtn.appendChild(etxt);
                day_field.appendChild(ebtn);
                
                document.getElementById(data.events[i].id).addEventListener("click", editButton, false);
            } 
        }
        return;
    });
    return;
}

function editButton(event){
    var event_submit = document.getElementById('create_event');
    var edit_submit = document.getElementById('editEvent');
    var delete_submit = document.getElementById('deleteEvent');
    event_submit.style.visibility = "hidden";
    edit_submit.style.visibility = "visible";
    delete_submit.style.visibility = "visible";
    
    var id = event.target.id;
    var need_to_parse = document.getElementById(id).value;
    var name_field =  document.getElementById("event_name_input");
    var time_field =  document.getElementById("event_time");
    var date_field =  document.getElementById("event_date");
    var cal_field = document.getElementById("calendar_options");
    
    var parsed = need_to_parse.split(",");
    
    edit_event = id;
    
    name_field.value = parsed[0];
    time_field.value = parsed[1];
    date_field.value = parsed[2];
    cal_field.value = parsed[3];
    
    var event_modal = document.getElementById('EventPopUp');
    
    event_modal.style.display = "block";
}

async function submitEdit(event){
    var username = logged_in_user;
    var event_name = document.getElementById("event_name_input").value;
    var cal_name = document.getElementById("calendar_options").value;
    var event_date = document.getElementById("event_date").value;
    var event_time = document.getElementById("event_time").value;
    
    var body = new FormData();
    body.append("id", edit_event);
    body.append("username", username);
    body.append("cal_name", cal_name);
    body.append("event_name", event_name);
    body.append("event_date", event_date);
    body.append("event_time", event_time);
    body.append("token", token);
    
    let fetchData = {method: 'POST',
        body: body,
        header: "Content-Type: application/json"
    };
    
    await(fetch("edit_event.php", fetchData))
    .then(response => response.json());
    var event_submit = document.getElementById('create_event');
    var edit_submit = document.getElementById('editEvent');
    var delete_submit = document.getElementById('deleteEvent');
    event_submit.style.visibility = "visible";
    edit_submit.style.visibility = "hidden";
    delete_submit.style.visibility = "hidden";
    updateView();
    
    
    var event_modal = document.getElementById('EventPopUp');
    event_modal.style.display = "none";
    resetEdit();
}
async function deleteEvent(event){
    var username = logged_in_user;
    var event_name = document.getElementById("event_name_input").value;
    var cal_name = document.getElementById("calendar_options").value;
    var event_date = document.getElementById("event_date").value;
    var event_time = document.getElementById("event_time").value;
    
    var body = new FormData();
    body.append("id", edit_event);
    body.append("username", username);
    body.append("cal_name", cal_name);
    body.append("event_name", event_name);
    body.append("event_date", event_date);
    body.append("event_time", event_time);
    body.append("token", token);
    
    let fetchData = {method: 'POST',
        body: body,
        header: "Content-Type: application/json"
    };
    
    await(fetch("delete_event.php", fetchData))
    .then(response => response.json());
    var event_submit = document.getElementById('create_event');
    var edit_submit = document.getElementById('editEvent');
    var delete_submit = document.getElementById('deleteEvent');
    event_submit.style.visibility = "visible";
    edit_submit.style.visibility = "hidden";
    delete_submit.style.visibility = "hidden";
    updateView();

    var event_modal = document.getElementById('EventPopUp');
    event_modal.style.display = "none";    
}

async function getUsers(){
    var username = logged_in_user;
    
    let fetchData = {method: 'POST',
        header: "Content-Type: application/json"
    };
    var user_sel = document.getElementById("user_options");
    await(fetch("return_users.php", fetchData))
    .then(response => response.json())
    .then(function(data) {
        var index = user_sel.length;
        for(var j = 0; j <index; j++) {
             user_sel.remove(user_sel.j);
        }
        
        for (var i = 0; i < data.users.length; i++) {
            if( data.users[i].username != username ){
                var opt = document.createElement('option');
                opt.id = data.users[i].username;
                opt.value = data.users[i].username;
                var opt_text = document.createTextNode(data.users[i].username);
                opt.appendChild(opt_text);
                user_sel.appendChild(opt);
            }
        }
        if(logged_in_user == null){
            d.innerHTML = '';
        }
    });
}

async function newSharedCalendar(event){
    var username = logged_in_user;
    var username_two = document.getElementById("user_options").value;
    var cal_name = document.getElementById("share_cal_name_input").value;
    var cal_color = document.getElementById("share_cal_color").value;
    
    if( cal_color.charAt( 0 ) === '#' )
        cal_color = cal_color.slice( 1 );
    
    var body = new FormData();
    body.append("username", username);
    body.append("username_two", username_two);
    body.append("cal_name", cal_name);
    body.append("cal_color", cal_color);
    
    let fetchData = {method: 'POST',
        body: body,
        header: "Content-Type: application/json"
    };
    
    await(fetch("share_calendar.php", fetchData))
    .then(response => response.json());
    
    updateView();
    var cal_modal = document.getElementById('SharedCalPopUp');
    cal_modal.style.display = "none";
}

function resetEdit() {
   document.getElementById("event_name_input").value = '';
   document.getElementById("event_time").value = '';
   document.getElementById("event_date").value = '';
   document.getElementById("calendar_options").value = '';
}


// from https://css-tricks.com/snippets/javascript/htmlentities-for-javascript/
function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}