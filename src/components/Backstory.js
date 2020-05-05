import React from 'react';

import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import originOptions from '../data/originTables.json';
//import raceOptions from '../data/originOptions.json';


class Backstory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            race: this.props.race,
            parents: '',
            siblings: [],
            childhoodHome: "",
            lifestyle: "",
            childhoodMemories: "",
            backgroundReason: "",
            classReason: "",
            age: 80,
            lifeEvents: []
        };
    }

    componentDidMount() {
        this.genState("birthplace");
        //this.genState("family");

        this.generateFamily();
        this.generateChildhood();
        this.generateLifeEvents();


        //this.genState("parents");
        this.genState("siblings");
    }

    generateFamily() {
        let familyRoll = this.getResult("raised", this.roll(100));
        let motherStatus = '';
        let fatherStatus = '';

        let knewMother = this.roll(20) === 1 ? false : true;
        let knewFather = this.roll(20) === 1 ? false : true;

        if(!familyRoll.absentMother) { knewMother = true; }
        if(!familyRoll.absentFather) { knewFather = true; }

        let racesWithParentOptions = ["half-elf", "half-orc", "tiefling"];
        let parentRace = "";
        if (racesWithParentOptions.includes(this.props.race.name)) {
            parentRace = " " + this.getResult(this.props.race.name, this.roll(8));
        }


        if(knewMother) {
            if(familyRoll.absentMother ) {
                let motherStatusRoll = this.roll(10);
                //console.log(motherStatusRoll);
                motherStatus = "My mother " + this.getResult("absentParent", motherStatusRoll);
                if (motherStatusRoll < 5) {
                    motherStatus = motherStatus + " She " + this.getResult("causeOfDeath", this.roll(20));
                }
                //console.log(motherStatus);
            } else {
                motherStatus = "My mother is alive and well."
            }
        } else {
            motherStatus = 'I never knew my mother.';
        }

        if(knewFather) {
            if(familyRoll.absentFather) {
                let fatherStatusRoll = this.roll(10);
                console.log(fatherStatusRoll);
                fatherStatus = "My father " + this.getResult("absentParent", fatherStatusRoll);
                if (fatherStatusRoll < 5) {
                    fatherStatus = fatherStatus + " He " + this.getResult("causeOfDeath", this.roll(20));
                }
                //console.log(motherStatus);
            } else {
                fatherStatus = "My father is alive and well.";
            }
        } else {
            fatherStatus = 'I never knew my father.';
        }


        this.setState({
            parents: "I was raised " + familyRoll.label + " " + motherStatus + " " + fatherStatus + parentRace,
        })

        this.genState("siblings");
    }

    generateChildhood = () => {
        let lifestyleRoll = this.getResult("familyLifestyle", this.roll(6) + this.roll(6) + this.roll(6) )
        let childhoodHomeRoll = this.roll(100) + lifestyleRoll.modifier;
        
        if (childhoodHomeRoll < 0) { 
            childhoodHomeRoll = 0;
        } else if (childhoodHomeRoll > 111) {
            childhoodHomeRoll = 111;
        }

        let childhoodHome = this.getResult("childhoodHome", childhoodHomeRoll);

        let memoriesRoll = this.rollMulti(6, 3) + this.props.charisma.modifier;
        console.log("mem" + memoriesRoll)
        if (memoriesRoll < 3) {  memoriesRoll = 3 }
        if (memoriesRoll > 18) {  memoriesRoll = 18 }

        let memories = this.getResult("childhoodMemories", memoriesRoll);

        this.setState({
            childhoodHome: childhoodHome,
            lifestyle: lifestyleRoll.label,
            childhoodMemories: memories
        });

        this.genState("background");
        this.genState("class");

    }

    generateLifeEvents = () => {
        let lifeAge = this.getResult("numLifeEvents", this.props.age);
        let numLifeEvents = this.roll(lifeAge);

        let lifeEvents = [];
        for (let i=0; i < numLifeEvents; i++) {
            let event = this.getResult('lifeEvents', this.roll(100));
            let eventText = "";
            if (event.name === "crime") {
                
                eventText = "I was accused of " + this.getResult(event.table, this.roll(event.die)) + ". ";
                eventText += this.getResult("punishment", this.roll(12));;
            
            } else if (event.table) {
                
                eventText = this.getResult(event.table, this.roll(event.die));

                
            } else {
                eventText = event.label;
            }
            lifeEvents.push(eventText);
        }
        this.setState({
            lifeEvents: lifeEvents
        })

    }



    genState = (field) => {
        switch(field) {
            case "parents":
                let parentRoll = this.roll(20);
                let parentRace = '';
                let racesWithParentOptions = ["halfelf", "halforc", "tiefling"];
                
                //If you know your parents
                if (parentRoll > 1 ) { 
                    
                    if (racesWithParentOptions.includes(this.props.race)) { 
                        parentRace = this.getResult(this.props.race, this.roll(8))
                    }
                }
                this.setState({
                    parents: this.getResult("parents", parentRoll),
                    parentRace: parentRace
                });
                break;
            case "birthplace":
                this.setState(
                    {birthplace: this.getResult("birthplace", this.roll(100)) }
                );
                break;
            case "siblings":
                this.setState(
                    {
                        siblings: this.getSiblings( this.roll(10) )
                    }
                );
                break;
            case "family":
                let roll = this.roll(100);
                let fam = this.getResult("family", roll);

                if (this.state.parents !== "I do not know who my parents were.") {
                    if( roll < 36 ){
                        fam = fam + " My mother " + this.getResult("absentParent", this.roll(10))  + " My father " + this.getResult("absentParent", this.roll(10));
                    } else if (roll < 56) {
                        fam = fam + " My mother " + this.getResult("absentParent", this.roll(10)) 
                    } else if (roll < 76) {
                        fam = fam + " My father " + this.getResult("absentParent", this.roll(10)) 
                    }
                }
                this.setState({
                    family: fam
                });

                break;
            case "background":
                this.setState({
                    backgroundReason: this.getResult(this.props.background, this.roll(6) )
                });
                break;
            case "class":
                this.setState({
                    classReason: this.getResult(this.props.class, this.roll(6) )
                });
                break;
            default: 
                return false;
        }
    }
    
    roll = (max) => {
        return Math.floor(Math.random() * max + 1);
    };

    rollMulti = (die, num) => {
        let total = 0;
        for( let i=0; i < num; i++) {
            total += Math.floor(Math.random() * die + 1);
            //console.log(total);
        }
        return total;
    }

    getResult = (table, roll) => {
        //console.log(originOptions[]);
        //console.log(roll);
        let res = originOptions[table][roll];
        if (res) {
            return res;
        } else {
            let val;
            //let opts;
            Object.keys(originOptions[table]).forEach(function(key) {
                let splitKey = key.split(":");
                if(splitKey[1]) {
                    if(splitKey[0] <= roll && roll <= splitKey[1]) {
                        val = originOptions[table][key];
                    }
                }
            })
            return val;
        }
    }

    getSiblings = (roll) => {
        let numSibs = this.roll( this.getResult("siblings", roll)) + (Math.floor(roll/4));
        console.log("numSibs: " + numSibs)
        let siblings = [];
     
        for(let i=0; i < numSibs; i++) {
            siblings.push({
                num: i,
                order: this.getResult( "birthOrder", this.roll(20) ),
                gender: this.getResult("siblingGender", this.roll(2) )
            });
        }
        return siblings;
    } 

    render() {
        let sibOut = this.state.siblings.map((sib) =>
            <li key={sib.num}>{sib.order} {sib.gender}</li>
        );

        
        let lifeEvents = this.state.lifeEvents.map((lifeEvent) => 
            <Row>{lifeEvent}</Row>
        );
        


        /* Replace sibout with a separate component */
        return (

        <Container>
            <hr/>
            <Row>
                <Col><Button onClick={() => this.genState("birthplace")}>Reroll Birthplace</Button></Col>
                <Col><Button onClick={() => this.generateFamily()}>Reroll Family</Button></Col>
                <Col><Button onClick={() => this.generateChildhood()}>Reroll Childhood</Button></Col>
                <Col><Button onClick={() => this.generateLifeEvents()}>Reroll Life Events</Button></Col>
            </Row>
            <hr/>
            <Row>
                <h4>My Birth </h4>
            </Row>
            <Row>
                <p>I was born {this.state.birthplace}.</p>
            </Row>
            <Row>
                <h4>My Family</h4>
            </Row>
            <Row>
                <p>{this.state.parents}</p>
            </Row>
            <Row>
                <p>I have {this.state.siblings.length ? this.state.siblings.length : 'no'} {this.state.siblings.length === 1 ? 'sibling' : 'siblings'}</p>
            </Row>
            <Row>
                <div><ul>{sibOut}</ul></div>
            </Row>
            <Row>
                <h4>My Childhood</h4>
            </Row>

            <Row>
                <p>I grew up {this.state.childhoodHome}, in {this.state.lifestyle} conditions.</p>
            </Row>
            <Row>
                <p>{this.state.childhoodMemories}</p>
            </Row>
            <Row>
                <p>I became a {this.props.background} because {this.state.backgroundReason}</p>
            </Row>
            <Row>
                <p>I became a {this.props.class} because {this.state.classReason}</p>
            </Row>
            <Row>
                <h4>Life Events</h4>
            </Row>
            {lifeEvents}
        </Container>
        );
    }
}

export default Backstory;