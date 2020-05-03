import React from 'react';
import originOptions from '../data/originOptions.json';


class Backstory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            siblings: []
        };
    }

    componentDidMount() {
        this.genState("parents");
        this.genState("birthplace");
        this.genState("siblings");
        this.genState("family");
    }
    
    
    genState = (field) => {
        switch(field) {
            case "parents":
                this.setState({
                    parents: this.getResult("parents", this.roll(20))
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
            default: 
                return false;
        }
    }
    
    roll = (max) => {
        return Math.floor(Math.random() * max + 1);
    };

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

        let numSibs = this.roll( this.getResult("siblings", roll)) + (Math.floor(roll/3));
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
            <li key={sib.num}>A {sib.gender}, who is {sib.order}</li>
        );

        return (

            <div>
                <h4>My Birth</h4>
                
                <p>I was born {this.state.birthplace}.</p>

                <h4>My Family</h4>
                <p>{this.state.parents}</p>
                <p>{this.state.family}</p>
                <p>I have {this.state.siblings.length ? this.state.siblings.length : 'no'} {this.state.siblings.length === 1 ? 'sibling' : 'siblings'}</p>
                <div><ul>{sibOut}</ul></div>
                <div>
                    <button onClick={() => this.genState("birthplace")}>Reroll Birthplace</button>
                    <button onClick={() => this.genState("parents")}>Reroll Parents</button>
                    <button onClick={() => this.genState("siblings")}>Reroll Siblings</button>
                    <button onClick={() => this.genState("family")}>Reroll Family</button>
                </div>
            </div>
        );
    }
}

export default Backstory;