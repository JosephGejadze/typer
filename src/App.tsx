import React from 'react';
import './App.css';

type KeyWise = {
  key: string;
}

export class App extends React.Component{
  
  texts = [
          "Velociraptor is one of the most bird-like dinosaurs ever discovered. It was small and fast, and the sickle-shaped claw on the second toe of each foot made it a formidable predator. A special bone in its wrist allowed it to swivel its wrist sideways in a flapping motion and to fold its arm against its body like a bird. This motion allowed it to snap its arms forward to grab fleeing prey and is an important part of the flight stroke in modern birds.",
          "Dilophosaurus was a fast-moving meat-eating dinosaur. A kink in its upper jaw may mean that it ate a certain kind of food, or attacked by gripping and holding on to prey - modern crocodiles have a similar kink.",
          "Triceratops may have been one of the most common dinosaurs in the North American West at the time of Tyrannosaurus rex. These dinosaurs are often pictured traveling in large groups, but the biggest gathering of Triceratops ever found consisted of three youngsters. Perhaps it lived only in family groups. Triceratops nipped at low-growing plants with its beak and cut them with its 800 little teeth. When walking, Triceratops's toes pointed outward, a primitive posture common to most dinosaurs. Given its multi-ton weight, it did not walk quickly.",
          "Ankylosaurus is a genus of armored dinosaur. Its fossils have been found in geological formations dating to the very end of the Cretaceous Period, about 68-66 million years ago, in western North America, making it among the last of the non-avian dinosaurs. It was named by Barnum Brown in 1908; the only species in the genus is A. magniventris.",
          "She sells seashells by the seashore.",
          "How can a clam cram in a clean cream can?",
          "I scream, you scream, we all scream for ice cream!",
          "I thought I thought of thinking of thanking you."
        ];

  text: string = this.texts[Math.floor(Math.random()*this.texts.length)];
  letterStatus: string[] = ['current'];
  textLetterIndex: number = 0;
  minuteCount: number = 0;
  errorCount: number = 0;
  state = {nextCharacter: this.text[this.textLetterIndex], userCharacter: " ", gameCounter: 1, clockOn: true};

  handleKeyDown = (e: KeyWise) => {
    if(e.key.length===1){
      if(e.key!==this.state.nextCharacter){ 
        this.letterStatus[this.textLetterIndex] = 'incorrect';
        ++this.errorCount;
      } else{
        this.letterStatus[this.textLetterIndex] = 'correct';
      }
      this.letterStatus[this.textLetterIndex+1] = 'current';
      this.setState({userCharacter: e.key, nextCharacter: this.text[++this.textLetterIndex]});
      if(this.textLetterIndex===this.text.length) this.setState({clockOn: false});
      if(this.textLetterIndex===this.text.length){
        alert("Congratulations, you won!\n" + `Word count: ${this.countWords(this.text)}` + '\n' + `Minute count: ${this.minuteCount.toFixed(4)}`
        + '\n' + `Words per minute: ${(this.countWords(this.text)/this.minuteCount).toFixed(0)}` + '\n' + `Error count: ${this.errorCount}`);
      }
    }
    if(e.key==="Backspace" && this.textLetterIndex>0){
      if(this.letterStatus[this.textLetterIndex-1]==='incorrect') --this.errorCount;
      this.letterStatus[this.textLetterIndex] = 'pending';
      this.letterStatus[this.textLetterIndex-1] = 'current';
      this.setState({nextCharacter: this.text[--this.textLetterIndex]});
    }
  }

  start = ():void => {
    this.textLetterIndex = 0;
    this.text = this.texts[Math.floor(Math.random()*this.texts.length)];
    this.resetLetterStatus();
    this.setState({clockOn: true, userCharacter: " ", nextCharacter: this.text[this.textLetterIndex], gameCounter: this.state.gameCounter+1});
  }

  countWords = (text: string): number => {
    let wordCount = 1;
    for(let i=0; i<text.length; i++){
      if(text[i]===' ') wordCount++;
    }
    return wordCount;
  }

  countMinutes = (min: number, sec: number): void => {
    this.minuteCount = min + sec/60;
  }

  resetLetterStatus():void{
    this.letterStatus=[];
    this.letterStatus.push('current');
    for(let i=1; i<this.text.length; i++){
      this.letterStatus.push('pending');
    }
  }

  componentDidMount(){
    document.addEventListener("keydown", this.handleKeyDown);
    this.resetLetterStatus();
  }

  componentWillUnmount(){
    document.removeEventListener("keydown", this.handleKeyDown);
  }

  render(){
    return(
      <div>
        <DisplayText text={this.text} nextCharacter = {this.state.nextCharacter} userCharacter={this.state.userCharacter}
        textLetterIndex={this.textLetterIndex} clockOn={this.state.clockOn} start={this.start} countMinutes={this.countMinutes}
        gameCounter={this.state.gameCounter} letterStatus={this.letterStatus}/>
      </div>
    );
  }
};

type DisplayTextProps = {
  text: string;
  nextCharacter: string;
  userCharacter: string;
  textLetterIndex: number;
  clockOn: boolean;
  start: ()=>void;
  countMinutes: (a: number, b: number)=>void;
  gameCounter: number;
  letterStatus: string[];
}

class DisplayText extends React.Component<DisplayTextProps>{
  
  render(){
    return(
      <div className="DisplayTextDiv">
        <h1>Next character: "{this.props.nextCharacter}"</h1>
        <h1>Your character: "{this.props.userCharacter}"</h1>
        <div className="DisplayLettersDiv">
          <div className="LetterBoxDiv">
            {this.props.text.split("").map((element: any, index: number) => (<Letter element={element} letterStatus={this.props.letterStatus[index]}/>))}  
          </div>
        </div>
        <ClockContainer clockOn={this.props.clockOn} countMinutes={this.props.countMinutes} key={this.props.gameCounter}/>
        {!this.props.clockOn && <button onClick={this.props.start}>Restart</button>}
      </div>
    );
  }
};

type LetterProps = {
  element: string;
  letterStatus: string;
}

const Letter = React.memo((props: LetterProps):JSX.Element => {
  console.log("letter logged");
  return <span className={"LetterDiv " + props.letterStatus}>{props.element}</span>;
});

type ClockContainerProps = {
  clockOn: boolean;
  countMinutes: (a: number, b: number)=>void;
  key: number;
}

class ClockContainer extends React.Component<ClockContainerProps>{
  state = {min: 0, sec: 0};
  started = false;
  clockIntervalId:any = null;
  
  oneSecond = () => {
    if(this.state.sec === 59){
      this.setState({min: this.state.min+1, sec: 0});
    } else{
      this.setState({sec: this.state.sec+1})
    }
  }

  componentDidUpdate(){
    if(!this.started){ 
      this.clockIntervalId = setInterval(this.oneSecond, 1000);
      this.started = true;
    }
    this.props.countMinutes(this.state.min, this.state.sec);
    if(!this.props.clockOn){
      clearInterval(this.clockIntervalId);
    }  
  }

  componentWillUnmount(){
    clearInterval(this.clockIntervalId);
  }

  render(){
    return(
    <Clock min={this.state.min} sec={this.state.sec}/>
    );
  }
}

type ClockProps = {
  min: number;
  sec: number;
}

const Clock = (props: ClockProps) => {
  return(
    <div>
      <h1>Time</h1>
      <h1>{props.min}:{props.sec}</h1>
    </div>
    );
}
export default App;
