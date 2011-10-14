module('Core');

test('environment', function()
{
	// Check required functions
	ok(Function.prototype.bind, 'Function.prototype.bind');
	ok(String.prototype.trim, 'String.prototype.trim');
});

module('Core: Util');

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