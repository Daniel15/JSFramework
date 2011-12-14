module('DOM');
test('parent(body)', function()
{
	equals($('qunit-fixture').parent('body'), DOM.body);
});

test('previous', function()
{
	equals($('qunit-fixture').previous(), $('qunit-tests'));
});

test('next', function()
{
	equals($('qunit-tests').next(), $('qunit-fixture'));
});

module('DOM: Class names', 
{
	setup: function()
	{
		this.el = $('qunit-fixture');
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

module('DOM: Creation');

test('simple', function()
{
	var el = DOM.create('div');
	equal(el.get('nodeName'), 'DIV', 'node name');
});

test('with properties', function()
{
	var el = DOM.create('div', { id: 'newDiv', innerHTML: 'Hello world' });
	equal(el.get('id'), 'newDiv', 'id');
	equal(el.get('innerHTML'), 'Hello world', 'innerHTML');
});

test('with attributes', function()
{
	var el = DOM.create('div', {}, true, { 'data-awesome': 'yes' });
	equal(el.getAttribute('data-awesome'), 'yes');
});

module('DOM: Wrapping');

test('Elements aren\'t wrapped twice', function()
{
	var el = DOM.create('div');
	var wrapped = $(el);
	equal(el, wrapped);
});

test('Wrappers are cached', function()
{
	var el1 = $('qunit-fixture');
	var el2 = $('qunit-fixture');
	equal(el1, el2);
});

test('wrapAll: Ensure all are wrapped', function()
{
	var els = document.getElementsByTagName('div');
	var wrapped = DOM.wrapAll(els);
	for (var i = 0, count = wrapped.length; i < count; i++)
	{
		ok(wrapped[i] instanceof ElementWrapper, 'item ' + i);
	}
});

test('wrapAll: Ensure method is called on all', function()
{
	// Arrange
	// Create 5 new elements and add them to the body
	for (var i = 0; i < 5; i++)
	{
		var el = DOM.create('div', { className: 'wrapAllTester' });
		DOM.body.appendChild(el);
	}
	
	// Act
	var els = DOM.body.getByClass('wrapAllTester');
	els.addClass('testpassed');
	
	// Assert
	for (var i = 0; i < 5; i++)
	{
		equal(els[i].get('className'), 'wrapAllTester testpassed');
	}
	
	// Remove the elements
	els.remove();
});
