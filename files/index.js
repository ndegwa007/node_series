#!/usr/bin/node

// read a file
const fs = require('fs');
const fspromise = require('fs/promises');
const path = require('path');

// reading async file

async function getSWE () {
  try {
    const data = await fspromise.readFile('database.csv', 'utf-8');
    const students = [];
    const lines = data.split('\n');
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      const student = {
        firstname: values[0],
        lastname: values[1],
        age: parseInt(values[2]),
        field: values[3]
      };
      students.push(student);
    }
    const sweStudents = students.filter(st => st.field === 'SWE');
    return sweStudents;
  } catch (e) {
    throw new Error(e);
  }
}
// write to a file
function writeToFile () {
  try {
    getSWE()
      .then((items) => {
        const fmt = JSON.stringify(items);
        fs.writeFile('sweStudents.txt', fmt, (err) => {
          if (err) throw err;
          console.log('success');
        });
      });
  } catch (err) {
    console.log(err);
  }
}
writeToFile();
