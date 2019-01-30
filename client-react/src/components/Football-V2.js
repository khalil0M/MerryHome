import React, { PropTypes, Component } from 'react'
import {isConfigured} from '../utils/authservice'
import { Form, FormGroup,FormControl, ControlLabel, Button, Glyphicon, Label, Panel } from 'react-bootstrap'
import SpeechRecognition from 'react-speech-recognition'
import {getExpressions, subscribeToEvent, emitEvent, sendRequest} from '../utils/serverhome-api'
import {searchRequest} from '../utils/voice-helper'
//import './Football.css';

const propTypes = {
  // Props injected by SpeechRecognition
  transcript: PropTypes.string,
  resetTranscript: PropTypes.func,
  browserSupportsSpeechRecognition: PropTypes.bool
};

class Football extends React.Component {
    
    constructor(props){
        super(props);
        this.state = { searchValue: "",
                       shortResult: [],
                       isTable : false,
                       searchResult: null,
                       expressions: [],
                       conversation: [] };
    }
    
 /*   handleChange (event) {
       this.setState({
            searchValue: event.target.value
        });
    } */
    
    componentDidMount(){
        var self= this;
      sendRequest("football", "default", null).then((data)=>{
                console.log(data);
                self.setState({
                    shortResult: data.resultText
                });
        });

        if(!isConfigured()) return;
        getExpressions().then((expressions)=>{
            self.setState({"expressions": expressions});
            self.subscribeServerSays();
            if(self.props.recognition){
                self.props.recognition.onresult = function(event) {
                    var result=event.results[event.results.length-1];
                    if(result.isFinal){
                        var objRequest = searchRequest(result[0].transcript, expressions);
                        console.log({"transcript": result[0].transcript,"data": objRequest});
                        if(objRequest && objRequest.plugin){
                            self.sendData(objRequest);
                        }
                    }
                };
            }
        });
    }
    subscribeServerSays(){
        var self = this;
        subscribeToEvent("serversays", function (data){
                self.setState({
                    shortResult: data.resultText
                });
        });
    }
    sendData(objRequest){
    var self = this;
    console.log("test :"+objRequest);
        sendRequest(objRequest.plugin, objRequest.action, objRequest.data).then((data)=>{
            if(data.resultText){
                self.setState({
                    shortResult: data.resultText
                });
            }
        });
    }
    render() {
        console.log(this.state.shortResult)

        const { startListening, stopListening, browserSupportsSpeechRecognition } = this.props;

        if(!isConfigured()){
            return <div>Configurer le server de merry home ;)</div>;
        }

        if (!browserSupportsSpeechRecognition) {
            return <div>Pour utiliser la reconnaissance vocale, merci d'utiliser google chrome ;)</div>;
        }

        return (
           <div>
                <div>
                    <Glyphicon glyph="comment" className={"voice-icon "+(this.props.listening  ? "listening" : "")} />
                    { this.props.listening  ?
                    <Button bsStyle="danger" onClick={stopListening}><Glyphicon glyph="stop" /> stop </Button> :
                    <Button bsStyle="info" onClick={startListening }><Glyphicon glyph="play" /> start </Button> }
                </div>
                <br></br>
            <select>
                <option  value="A-League">A-League</option>
                <option value="W League">W League</option>
                <option value="2 Division 2 Stage">2 Division 2 Stage</option>
                <option value="Ligue 2">Ligue 2</option>
            </select>

                 { this.state.shortResult.map( (match,index) => (
                    <div key={index}>
             <br></br>
            <Panel>
                <Label bsStyle="warning">{match.league_name}</Label>
                <Panel.Footer>
                <div>
                    <Label bsStyle="default">{match.match_time}</Label>{' '}
                    <Label bsStyle="primary">{match.match_hometeam_name}</Label>{' '}
                    <Label bsStyle="success">{match.match_hometeam_score}</Label>{' '}
                    <Label bsStyle="info">VS</Label>{' '}
                    <Label bsStyle="success">{match.match_awayteam_score}</Label>{' '}
                    <Label bsStyle="primary">{match.match_awayteam_name}</Label>{' '}
                </div>
                </Panel.Footer>
            </Panel>
                   </div>
                 ))}
           </div>
        );
    }
};

Football.propTypes = propTypes;

const options = {
  autoStart: false
};

export default SpeechRecognition(options)(Football);