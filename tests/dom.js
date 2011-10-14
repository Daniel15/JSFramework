module('DOM: Class names', 
{
	setup: function()
	{
		this.el = DOM.get('qunit-fixture');
		this.el.set('className', 'hello world foobar');
	}
});

test('addClass', function()
{
	this.el.addClass('test');
	equals(this.el.get('className'), 'hello world foobar test');
	this.el.addClass('test2');
	equals(this.el.get('className'), 'hello world foobar test test2');
});

test('removeClass', function()
{
	this.el.set('className', 'hello world foobar test');
	
	this.el.removeClass('world');
	equals(this.el.get('className'), 'hello foobar test', 'remove from middle');
	
	this.el.removeClass('test');
	equals(this.el.get('className'), 'hello foobar', 'remove from end');
	
	this.el.removeClass('hello');
	equals(this.el.get('className'), 'foobar', 'remove from start');
});

test('hasClass', function()
{
	ok(this.el.hasClass('hello'), 'start');
	ok(this.el.hasClass('world'), 'middle');
	ok(this.el.hasClass('foobar'), 'end');
	ok(!this.el.hasClass('asdf'), 'invalid class');
	ok(!this.el.hasClass(''), 'empty class');
});