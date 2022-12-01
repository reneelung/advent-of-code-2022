#!/usr/bin/env node
const fs = require('fs');

try {
    const data = fs.readFileSync('input.txt', 'utf8')
    sum = data
                    .split('\n\n')
                    .map((pack) => {
                        return pack
                                .split('\n')
                                .map(snack => parseInt(snack))
                                .reduce((acc, cur) => acc + cur)
                    })
                    .sort((a, b) => b - a)
                    .slice(0,3)
                    .reduce((acc, cur) => acc + cur)
    console.log('three biggest snack packs combined:', sum);

} catch (err) {
    console.error(err)
}