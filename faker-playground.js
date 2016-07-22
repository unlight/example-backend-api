var faker = require('faker');
var asciitable = require("asciitable");

var methods = [
	'name.findName',
	'name.jobTitle',
	'name.jobType',
	'name.jobArea',
	'name.title',
	// 'hacker.abbreviation',
	// 'hacker.adjective',
	// 'hacker.noun',
	// 'hacker.verb',
	// 'hacker.ingverb',
	// 'hacker.phrase',
]

var result = [];
for (var i = 0; i < 20; i++) {
	var item = {};
	methods.forEach(function(id) {
		item[id] = eval(`faker.${id}()`);
	});
	result.push(item);
}

var options = {
	// skinny: true,
	// intersectionCharacter: "x",
	columns: methods.map(x => ({
		field: x,
		name: x
	}))
};

var table = asciitable(options, result);
console.log(table);