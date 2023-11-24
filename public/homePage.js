google.setOnLoadCallback(getMyFeed);

var feedUrl = "http://www.google.com/calender/feeds/default/public/full";

function setUpMyService() {
    var myService = new google.gdata.calendar.CalendarService('habitual-buy-1')
    return myService;
}

function getMyFeed() {
    myService = setUpMyService();

    myService.getEventsFeed(feedUrl, handleMyFeed, handleError);
}

function handleMyFeed(myResultsFeedRoot) {
    alert("This feeds title is:" + myResultsFeedRoot)
}

function handleError(e) {
    alert('there was an error');
    alert(e.cause ? e.cause.statusText : e.message);
}