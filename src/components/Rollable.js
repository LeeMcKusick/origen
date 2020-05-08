import React from 'react';
import originOptions from '../data/originTables.json';

class Rollable extends React.Component {
    
    roll = (max) => {
        return Math.floor(Math.random() * max + 1);
    };

    rollMulti = (die, num) => {
        let total = 0;
        for( let i=0; i < num; i++) {
            total += Math.floor(Math.random() * die + 1);
        }
        return total;
    }

    rollOnTable = (table) => {
        const options = originOptions[table]

        if(options) {
            const tableMax = this.getHighestValueInTable(table);
            const roll = this.roll(tableMax);
            
            let result = options[roll];
            if (result) {
                return result;
            } else {
                Object.keys(options).forEach(function(key) {
                    let splitKey = key.split(":");
                    if(splitKey[1]) {
                        if(splitKey[0] <= roll && roll <= splitKey[1]) {
                            result = options[key];
                        }
                    }
                })
            }
            return result;
        } 
        return false;
    }

    getHighestValueInTable = (table) => {
        let highest = Object.keys(originOptions[table]).sort(function(a, b){
            a = Number(a.split(":")[0]);
            b = Number(b.split(":")[0]);
            return a-b;
        }).pop();
        highest = highest.split(":");
        if (highest[1]) { return highest[1] }
        return highest[0];
    }

    getResult = (table, roll) => {
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
}

export default Rollable;