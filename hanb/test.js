console.time('alpha');

var output = 1;
for (var i = 1; i < 10; i++) {
    output *= i;    
}
console.log('Result : ', output);

console.timeEnd('alpha');

for (var i = 31; i < 37; i++) {
    console.log('\u001b[%dm', i, 'Hello World .. !');
}
console.log('hi');
console.log('\u001b[0m');
console.log('bye');