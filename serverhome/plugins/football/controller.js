const request = require('sync-request');

class FootballController {
    
    constructor(io){
            this.io = io;
    }

    getView(req, res){
             var dataView = {
                   "type" : "Football"
             };
             res.end(JSON.stringify(dataView));
    }

    postAction(req, res){
        var today = formatDate();

        switch(req.params.actionId){
            case "today":
                var today = formatDate(0);
                console.log(" Today ...."+today);
                var requestUrl="https://apifootball.com/api/?action=get_events&from="+today+"&to="+today+"&league_id=109,127,62,69,79,117&APIkey=4775edf0762587eae1b3350c7fdeac88361107dcf511eb2b6b83f3f1b8f4824e";
                var footReq = request('GET', requestUrl,{cache:'file'});
                var response = JSON.parse(footReq.getBody('utf8'));
                res.end(JSON.stringify({resultText: response}));
            break;
            case "tomorrow":
                var tomorrow = formatDate(1);
                console.log(" Tomorrow ...."+tomorrow );
                var requestUrl="https://apifootball.com/api/?action=get_events&from="+tomorrow+"&to="+tomorrow+"&league_id=109,127,62,69,79,117&APIkey=4775edf0762587eae1b3350c7fdeac88361107dcf511eb2b6b83f3f1b8f4824e";
                var footReq = request('GET', requestUrl,{cache:'file'});
                var response = JSON.parse(footReq.getBody('utf8'));
                res.end(JSON.stringify({resultText: response}));
            break;
            case "ligue":
                var tomorrow = formatDate(2);
                console.log(" league ...."+tomorrow );
                var requestUrl="https://apifootball.com/api/?action=get_events&from="+tomorrow+"&to="+tomorrow+"&league_id=109&APIkey=4775edf0762587eae1b3350c7fdeac88361107dcf511eb2b6b83f3f1b8f4824e";
                var footReq = request('GET', requestUrl,{cache:'file'});
                var response = JSON.parse(footReq.getBody('utf8'));
                res.end(JSON.stringify({resultText: response}));
            break;
            case "default":
                var tomorrow = formatDate(0);
                console.log(" Tomorrow ...."+tomorrow );
                var requestUrl="https://apifootball.com/api/?action=get_events&from="+tomorrow+"&to="+tomorrow+"&league_id=109,127,62,69,79,11&APIkey=4775edf0762587eae1b3350c7fdeac88361107dcf511eb2b6b83f3f1b8f4824e";
                var footReq = request('GET', requestUrl,{cache:'file'});
                var response = JSON.parse(footReq.getBody('utf8'));
                res.end(JSON.stringify({resultText: response}));
            break;
            default:
                res.end(JSON.stringify({}));
                break;
                }
    }
}

function formatDate(day){
        var toDay = new Date();

        var today = new Date();
        var dd = today.getDate()+day;
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();

        if (dd < 10) {
          dd = '0' + dd;
        }

        if (mm < 10) {
          mm = '0' + mm;
        }
        today = yyyy + '-' + mm + '-' + dd;
        return today;
}
module.exports = FootballController;