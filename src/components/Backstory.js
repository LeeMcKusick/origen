import React from 'react';
import Rollable from './Rollable';

import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import originOptions from '../data/originTables.json';
//import raceOptions from '../data/originOptions.json';


class Backstory extends Rollable {
    
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
            age: 20,
            lifeEvents: []
        };
    }

    componentDidMount() {
        this.genState("birthplace");
        this.generateFamily();
        this.generateChildhood();
        this.generateLifeEvents();
        this.genState("background");
        this.genState("class");
    }

    componentDidUpdate(props) {        
        Object.keys(props).forEach((prop) => {
            if (props[prop] !== this.props[prop] ) {
                //Move to this later for simplification.
                /*this.setState({
                    [prop]: this.props.prop
                })*/

                switch (prop) {
                    case "race": 
                        this.generateFamily();
                        break;
                    case "class": 
                        this.genState("class");
                        break;
                    case "age": 
                        this.generateLifeEvents();
                        break;
                    case "charisma": 
                        this.generateChildhood();
                        break;
                    case "background": 
                        this.genState("background");
                        break;
                    default:
                        return false;
                }
            }
        });
        
        
    }

    rerollAll = () => {
        this.genState("birthplace");
        this.generateFamily();
        this.generateChildhood();
        this.generateLifeEvents();
        this.genState("background");
        this.genState("class");
    }

    generateFamily() {
        let familyRoll = this.rollOnTable('raised');
        let motherStatus = '';
        let fatherStatus = '';

        let knewMother = this.roll(20) === 1 ? false : true;
        let knewFather = this.roll(20) === 1 ? false : true;

        if(!familyRoll.absentMother) { knewMother = true; }
        if(!familyRoll.absentFather) { knewFather = true; }

        let racesWithParentOptions = ["half-elf", "half-orc", "tiefling"];
        let parentRace = "";
        if (racesWithParentOptions.includes(this.props.race.name)) {
            parentRace = " " + this.rollOnTable(this.props.race.name);
        }


        if(knewMother) {
            if(familyRoll.absentMother ) {
                let motherStatusRoll = this.roll(10);
                //console.log(motherStatusRoll);
                motherStatus = "My mother " + this.getResult("absentParent", motherStatusRoll);
                if (motherStatusRoll < 5) {
                    motherStatus = motherStatus + " She " + this.rollOnTable("causeOfDeath");
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
                    fatherStatus = fatherStatus + " He " + this.rollOnTable("causeOfDeath");
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
        this.genState("birthplace");
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

        
    }

    generateLifeEvents = () => {
        console.log(this.props.age);
        let lifeAge = this.getResult("numLifeEvents", Number(this.props.age));
        console.log(lifeAge);
        let numLifeEvents = this.roll(lifeAge);

        let lifeEvents = [];
        
        for (let i=0; i < numLifeEvents; i++) {
            let event = this.rollOnTable('lifeEvents');
            console.log(event);
            let eventText = "";
            
            if (event.name === "crime") {
                eventText += "I was accused of " + this.getResult(event.table, this.roll(event.die)) + ". ";
                eventText += this.rollOnTable("punishment");
            } else if (event.name === "supernatural") {
                let snRoll = this.roll(event.die);
                eventText += event.label + " " + this.getResult(event.table, snRoll);
                if (snRoll > 70 && snRoll < 76) {
                    eventText += this.rollOnTable("possession");
                }
            } else if (event.table) {
                eventText += event.label + " " + this.rollOnTable(event.table);
            } else {
                eventText += event.label;
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
                        parentRace = this.rollOnTable(this.props.race)
                    }
                }
                this.setState({
                    parents: this.getResult("parents", parentRoll),
                    parentRace: parentRace
                });
                break;
            case "birthplace":
                this.setState(
                    {birthplace: this.rollOnTable("birthplace") }
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
                    backgroundReason: this.rollOnTable(this.props.background.name)
                });
                break;
            case "class":
                this.setState({
                    classReason: this.rollOnTable(this.props.class.name)
                });
                break;
            default: 
                return false;
        }
    }

    getSiblings = (roll) => {
        let numSibs = this.roll( this.getResult("siblings", roll)) + (Math.floor(roll/4));
        console.log("numSibs: " + numSibs)
        let siblings = [];
     
        for(let i=0; i < numSibs; i++) {
            siblings.push({
                num: i,
                order: this.rollOnTable( "birthOrder"),
                gender: this.rollOnTable("siblingGender")
            });
        }
        return siblings;
    } 

    render() {
        let sibOut = this.state.siblings.map((sib) =>
                <span class="sib" key={sib.num}> {sib.order} {sib.gender}</span>
        );

        /* Replace sibout with a separate component */
        return (


        <Container>
            <hr/>
            <Row>
                <Col className="center"><Button onClick={() => this.generateFamily()}>Reroll Family</Button></Col>
                <Col className="center"><Button onClick={() => this.generateChildhood()}>Reroll Childhood</Button></Col>
                <Col className="center"><Button onClick={() => this.generateLifeEvents()}>Reroll Life Events</Button></Col>
                <Col className="center"><Button onClick={() => this.rerollAll()}>Reroll All</Button></Col>
            </Row>
            <hr/>
            <Row>
            <Col>
            <Container>
                <Row>
                    <h4>My Family</h4>
                </Row>
                <Row>
                    <p>{this.state.parents}</p>
                </Row>
                <Row>
                    <p><span class="siblings">I have {this.state.siblings.length ? this.state.siblings.length : 'no'} {this.state.siblings.length === 1 ? 'sibling' : 'siblings'}</span><span>{sibOut}</span>.</p>
                </Row></Container>
                <Container>
                <Row>
                    <h4>My Childhood</h4>
                </Row>
                <Row>
                    <p>I was born {this.state.birthplace}.</p>
                </Row>
                <Row>
                    <p>I grew up {this.state.childhoodHome}, in {this.state.lifestyle} conditions.</p>
                </Row>
                <Row>
                    <p>{this.state.childhoodMemories}</p>
                </Row>
                </Container>
            </Col>
            <Col>
            <Container>
                <Row>
                    <h4>My Life Choices</h4>
                </Row>
                <Row>
                    <p>I became {this.props.background.textLabel} because {this.state.backgroundReason}</p>
                </Row>
                <Row>
                    <p>I became a {this.props.class.label} because {this.state.classReason}</p>
                </Row>
                </Container>
                <Container>
                <Row>
                    <h4>My Life Events</h4>
                </Row>
                {
                    this.state.lifeEvents.map((lifeEvent) => (
                        <Row className="lifeEvent">{lifeEvent}</Row>
                    ))
                }
                
                </Container></Col>
            </Row>
        </Container>
        );
    }
}

export default Backstory;