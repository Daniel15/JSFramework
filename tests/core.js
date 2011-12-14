module('Core');

test('environment', function()
{
	// Check required functions
	ok(String.prototype.trim, 'String.prototype.trim');
});

test('Function.bind', function()
{
	var thisObj = { Daniel15: 'is awesome'};
	var fn = function() 
	{
		// Ensure "this" is correct
		deepEqual(this, thisObj);
	}
	fn.bind(thisObj)();
});

module('Core: Util');

test('extend: returns extended object', function()
{
	var extended = Util.extend({hello: 'world'}, {foo: 'bar'});
	var expected = {hello: 'world', foo: 'bar'};
	deepEqual(extended, expected);
});

test('extend: modifies destination object', function()
{
	var first = {hello: 'world'};
	var second = {foo: 'bar'};
	Util.extend(first, second);
	// Ensure elements from second object are in first object
	equals(first.foo, 'bar');
});

test('buildQueryString simple', function()
{
	equals(Util.buildQueryString({}), '', 'empty');
	equals(Util.buildQueryString({hello: 'world'}), 'hello=world', 'one item');
	equals(Util.buildQueryString({hello: 'world', foo: 'bar'}), 'hello=world&foo=bar', 'two items');
	
	equals(Util.buildQueryString({hello: '\u0CA0_\u0CA0'}), 'hello=%E0%B2%A0_%E0%B2%A0', 'unicode');
});

test('buildQueryString arrays', function()
{
	equals(Util.buildQueryString({hello: ['world', 'foo']}), 'hello[]=world&hello[]=foo', 'two items');
	equals(Util.buildQueryString({hello: ['world', 'foo'], moo: 'goo'}), 'hello[]=world&hello[]=foo&moo=goo');
});

test('buildQueryString objects', function()
{
	equals(Util.buildQueryString({hello: {world: 'foo'}}), 'hello[world]=foo', 'one item');
	equals(Util.buildQueryString({hello: {world: 'foo', moo: 'goo'}}), 'hello[world]=foo&hello[moo]=goo', 'two items');
});
