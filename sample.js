//PAGE COMPONENTS
var resourceType = page.getComponent("Resource Type"); //Resource Type component
var resourceTypeJQ = resourceType.getElement(); //jQuery object

//Changes UserA
//Change 2 UserA
//changes added by saurabh jain line1
//changes added by saurabh jain line2
//changes added by saurabh jain line3
var bookFor = page.getComponent("Book For"); //Book For component
var bookForJQ = bookFor.getElement(); //jQuery object

var meetingRoom = page.getComponent("Meeting Room"); //Meeting Room component
var meetingRoomJQ = meetingRoom.getElement(); //jQuery object

var meetingDate = page.getComponent("Date"); //Meeting Date component
var meetingDateJQ = meetingDate.getElement(); // jQuery object

var startTime = page.getComponent("Start Time"); //Start Time component
var startTimeJQ = startTime.getElement(); //jQuery object

var endTime = page.getComponent("End Time"); //End Time component
var endTimeJQ = endTime.getElement(); //jQuery object

var summary = page.getComponent('Summary'); //Summary component
var summaryJQ = summary.getElement(); //jQuery object

var openedBy = page.getComponent('Opened By'); //Opened By component
var openedByJQ = openedBy.getElement(); //jQuery object

var bookButton = page.getComponent('Book'); //Book button component
var bookButtonJQ = bookButton.getElement(); //jQuery object

bookButton.disable();
bookFor.hide();
meetingRoom.hide();
meetingDate.hide();
startTime.hide();
endTime.hide();
summary.hide();
openedBy.hide();

resourceTypeJQ.on('change',function(){
  if(resourceType.get() != null || resourceType.get() != ''){
  bookFor.show();
  }
})

bookForJQ.on('change',function(){
  if(bookFor.get() != null || bookFor.get()!=''){
    meetingRoom.show();
  }
});

meetingRoomJQ.on('change',function(){
  if(meetingRoom.get() != null || meetingRoom.get()!=''){
    meetingDate.show();
    startTime.show();
    endTime.show();
    summary.show();
    openedBy.show();
  }
});

var now = moment(); //Current date & time
var currentDate1 = new Date();
var currentDate2 = new Date();

defaultMeetingStartTime = currentDate1.getHours() + 1; //Current time + 1 hour
defaultMeetingEndTime = currentDate2.getHours() + 2; //Current time + 2 hours

//Set Start Time & End Time initially, not working
currentDate1.setHours(defaultMeetingStartTime);
currentDate1.setMinutes(0);
currentDate1.setSeconds(0);
startTime.set(moment(currentDate1));

currentDate2.setHours(defaultMeetingEndTime);
currentDate2.setMinutes(0);
currentDate2.setSeconds(0);
endTime.set(moment(currentDate2));

if(navigator.userAgent.match(/Android/i)){
     meetingDateJQ.datepicker("option","minDate",(new Date()).valueOf());
  }
 else {
    meetingDateJQ.datepicker("option","minDate",new Date());
  }

//EVENTS

//Date is in the past
meetingDateJQ.blur(function() {
  if(meetingDate.get() != ''){
    if(meetingDate.get().isBefore(now,'day')){
	    alert("Meeting date cannot be in the past! Date reset to today, please select again");
		  meetingDate.set(now); //Reset to today
    }
  }
  else{
    bookButton.disable();
    console.log("Book disabled");
  }
});

startTimeJQ.blur(function(){
  if(startTime.get()!=''){
    if(meetingDate.get().isSame(now.get(),'day')){
      //Start time is same or before current time on same day
      if(startTime.get().isSameOrBefore(now,'hour')){
        alert("Start time cannot be before or same as the current time!");
        startTime.set(moment(currentDate1)); //Set to 1 hour ahead of current time
      }
      //Start time is after end time on same day
      else if(endTime.get() != '' && endTime.get().isBefore(startTime.get(),'minute')){
        alert("Start time cannot be after the end time!");
        startTime.set((moment(endTime.get())).subtract(1,'h'));
      }
    }
    //Start time is after end time on any day
    else if(endTime.get() != '' && startTime.get().isAfter(endTime.get(),'minute')){
      alert("Start time cannot be after the end time!");
      startTime.set((moment(endTime.get())).subtract(1,'h'));
    }
    // Start time is same as end time on any day
    else if(endTime.get() != '' && startTime.get().isSame(endTime.get(),'minute')){
      alert("Start time cannot be the same as the end time!");
      startTime.set((moment(endTime.get())).subtract(1,'h'));
      console.log("start time end time same test called");
    }

    //Start time is in intervals of 30 or 60 minutes
    if(startTime.get().minute() != 0 && startTime.get().minute() != 30){
      console.log("Start time minutes: " + startTime.get().minute());
      alert("Please select Start Time in intervals of 30 or 60 minutes!");
      startTime.set(startTime.get().minute(0));
    }
  }

  if(meetingDate.get() != '' && startTime.get() != '' && endTime.get() != ''
    && meetingDate.get().isValid() && summary.get() != '' &&
    startTime.get().isValid() && endTime.get().isValid()){
    bookButton.enable();
    console.log("Book enabled");
  }
  else{
    bookButton.disable();
    console.log("Book disabled");
  }
});

endTimeJQ.blur(function(){
  if(endTime.get()!=''){
    // End time is same as start time on any day
    if(startTime.get() != '' && endTime.get().isSame(startTime.get(),'minute')){
      alert("End time cannot be the same as the start time!");
      endTime.set((moment(startTime.get())).add(1,'h'));
      console.log("end time start time same test called");
    }
    // End time is before start time on any day
    else if(startTime.get() != '' && endTime.get().isBefore(startTime.get(),'minute')){
      alert("End time cannot be before the start time!");
      endTime.set((moment(startTime.get())).add(1,'h'));
      console.log("end time start time before test called");
    }
    //End time is same or before current time on same day
    else if(meetingDate.get().isSame(now.get(),'day')){
        if(endTime.get().isSameOrBefore(now,'hour')){
          alert("End time cannot be before or same as the current time!");
          startTime.set(moment(currentDate2)); //Set to 2 hours ahead of current time
        }
    }

    //End time is in intervals of 30 or 60 minutes
    if(endTime.get().minute() != 30 && endTime.get().minute() != 0){
      console.log("End time minutes: " + endTime.get().minute());
      alert("Please select End Time in intervals of 30 or 60 minutes!");
      endTime.set(endTime.get().minute(0));
    }
  }

  if(meetingDate.get() != '' && startTime.get() != '' && endTime.get() != ''
    && meetingDate.get().isValid() && summary.get() != '' &&
    startTime.get().isValid() && endTime.get().isValid()){
    bookButton.enable();
    console.log("Book enabled");
  }
  else{
    bookButton.disable();
    console.log("Book disabled");
  }
});
//Changes added by saurabh jain
summaryJQ.blur(function(){
  if(meetingDate.get() != '' && startTime.get() != '' && endTime.get() != ''
    && meetingDate.get().isValid() && summary.get() != '' &&
    startTime.get().isValid() && endTime.get().isValid()){
    bookButton.enable();
    console.log("Book enabled");
  }
  else{
    bookButton.disable();
    console.log("Book disabled");
  }
})
