#!/usr/bin/env node
const fs = require('fs');

try {
    const data = fs.readFileSync('input.txt', 'utf8')
    pack = data
                    .split('\n\n')
                    .map((pack) => {
                        return pack
                                .split('\n')
                                .map(snack => parseInt(snack))
                                .reduce((acc, cur) => acc + cur)
                    })
                    .sort((a, b) => b - a)
                    .shift()
    console.log('biggest snack pack:', pack);

} catch (err) {
    console.error(err)
}