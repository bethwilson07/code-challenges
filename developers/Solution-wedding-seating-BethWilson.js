//Solution for Wedding Seating ByteCubed Challenge (using JavaScript)- Beth Wilson 03/30/2019//

/*Because tables and parties have different values for the same attributes, creating classes for
both Table and Party makes sense.*/

const TABLES = [];
const PARTIES = [];

const seatCapacities = "A-8 B-8 C-7 D-7"
const reservations = 'Thornton, party of 3; Garcia, party of 2; Owens, party of 6 dislikes Thornton, Taylor; Smith, party of 1 dislikes Garcia ; Taylor, party of 5; Reese, party of 7 '

//Assuming that the input is a string//
const createTables =(str) => {
  str.split(' ').forEach(tbl => new Table(tbl[0], tbl[2]))
}

//Assuming that the input is a long string/CSV-ish file, modify string and create new instances//
const createParties = (str) => {
  str.split('; ').forEach(res => {
    let name = res.split(' ')[0];
    let size = parseInt(res.split(' ')[3]);
    if (res.split(' ').length > 5){
      let dislikes = res.split(' ').slice(5);
      new Party(name, size, dislikes)
    } else {
      new Party(name, size)
    }
  })
}

//sort parties in DESC order by size because it might be easier to fill bigger parties first//
const sortedParties = () => {
  return PARTIES.sort(function(a,b) {
    return b.size - a.size;
  })
}

//get a max table size for the tables to weed out parties that are too large to fit a table//
const maxTableSize = () => {
  let maxCap = 0
  TABLES.forEach(tbl => {
    if (tbl.size > maxCap) {
      maxCap = tbl.size;
    }
  })
  return maxCap;
}

/*Because both tables and parties have different values for similar
attributes, using classes makes sense*/

class Table {
  constructor(name, space) {
    this.name = name;
    this.space = space;
    this.filled = false;
    this.parties = [];
    TABLES.push(this)
  }

  filled() {
    if(this.space === 0) {
      this.filled = true;
    }
  }
}

class Party {
  constructor(name, size, dislikes = []) {
    this.name = name;
    this.size = size;
    this.dislikes = dislikes;
    this.added = false;
    PARTIES.push(this);
  }
}

createTables(seatCapacities);
createParties(reservations);


/* I want to go thru each party instance (use sorted PARTIES array) and
also iterate through the tables;

if table.space > party.size && party.dislikes does not include anyone from the table.parties array
(AND if the party hasn't been added yet)

push the party to the table instance's parties array and change the attribute for the party to added
*/


/* This function contains the main logic. I'm using nested forEach() functions, so this solution
will take at least n^2 runtime. */

sortedParties().forEach(party => {
  if (maxTableSize() < party.size) {
    throw new Error(`The ${party.name.slice(0, party.name.length - 1)} party is too large to fit at a table.`)
  }

  TABLES.forEach(table => {
    if (!table.filled && party.dislikes.length > 0 && table.space > party.size && !party.added) {
      for (let el of party.dislikes) {
        if (!table.parties.includes(el) && table.space > party.size && !party.added){
          table.parties.push(party);
          table.space -= party.size;
          party.added = true;
        }
      }
    } else if (!table.filled && !table.parties.includes(party) && table.space > party.size && !party.added) {
      table.parties.push(party);
      table.space -= party.size;
      party.added = true;
    }
  })
})

let results = [];

TABLES.forEach(tbl => {
  results.push(`Table ${tbl.name}: ${tbl.parties.map(p => `${p.name} party of ${p.size}`)}`)
})

console.log(results);

/*results = {
  ["Table A: Reese, party of 7",
  "Table B: Owens, party of 6,Smith, party of 1",
  "Table C: Taylor, party of 5",
  "Table D: Thornton, party of 3,Garcia, party of 2"]
}*/

/* Even though this solution is slightly different from the example output
in the problem description, it doesn't break any of the conditions described. */
