// TODO: Proper fixture support (similar to Jasmine-Prototype)

describe('DOM', function()
{
	describe('Navigation', function()
	{
		beforeEach(function()
		{
			$('fixtures').set('innerHTML', '<div id="fixture-first"></div><div id="fixture-second"></div><div id="fixture-third"></div>')
		});
		it('should support .parent("body")', function()
		{
			expect($('fixtures').parent('body')).toBe(DOM.body);
		});
		it('should support .previous()', function()
		{
			expect($('fixture-second').previous().get('id')).toBe('fixture-first');
		});
		it('should support .next()', function()
		{
			expect($('fixture-second').next().get('id')).toBe('fixture-third');
		});
	});
	
	describe('Class names', function()
	{
		var el;
		beforeEach(function()
		{
			el = $('fixtures');
			el.set('className', 'hello world foobar');
		});
		it('should support addding classes', function()
		{
			el.addClass('test');
			expect(el.get('className')).toBe('hello world foobar test');
			el.addClass('test2');
			expect(el.get('className')).toBe('hello world foobar test test2');
		});
		describe('removeClass', function()
		{
			it('should support removing from the middle', function()
			{
				el.removeClass('world');
				expect(el.get('className')).toBe('hello foobar');
			});
			it('should support removing from the end', function()
			{
				el.removeClass('foobar');
				expect(el.get('className')).toBe('hello world');
			});
			it('should support removing from the start', function()
			{
				el.removeClass('hello');
				expect(el.get('className')).toBe('world foobar');
			});
		});
		describe('hasClass', function()
		{
			it('should support checking the start', function()
			{
				expect(el.hasClass('hello')).toBeTruthy();
			});
			it('should support checking the middle', function()
			{
				expect(el.hasClass('world')).toBeTruthy();
			});
			it('should support checking the end', function()
			{
				expect(el.hasClass('foobar')).toBeTruthy();
			});
			it('should return false for invalid classes', function()
			{
				expect(el.hasClass('asdf')).toBeFalsy();
			});
			it('should return false for empty classes', function()
			{
				expect(el.hasClass('')).toBeFalsy();
			});
		});
	});
	
	describe('Creation', function()
	{
		it('should support simple DOM creation', function()
		{
			var el = DOM.create('div');
			expect(el.get('nodeName')).toBe('DIV');
		});
		it('should support properties', function()
		{
			var el = DOM.create('div', { id: 'newDiv', innerHTML: 'Hello world' });
			expect(el.get('id')).toBe('newDiv');
			expect(el.get('innerHTML')).toBe('Hello world');
		});

		it('should support attributes', function()
		{
			var el = DOM.create('div', {}, true, { 'data-awesome': 'yes' });
			expect(el.getAttribute('data-awesome')).toBe('yes');
		});
	});
	
	describe('Wrapping', function()
	{
		it('should not wrap elements twice', function()
		{
			var el = DOM.create('div');
			var wrapped = $(el);
			expect(el).toBe(wrapped);
		});
		
		it('should cache wrappers', function()
		{
			var el1 = $('fixtures');
			var el2 = $('fixtures');
			expect(el1).toBe(el2);
		});
		
		describe('wrapAll', function()
		{
			it('should wrap all passed elements', function()
			{
				var els = document.getElementsByTagName('div');
				var wrapped = DOM.wrapAll(els);
				for (var i = 0, count = wrapped.length; i < count; i++)
				{
					expect(wrapped[i] instanceof ElementWrapper).toBeTruthy();
				}
			});
			
			it('should call methods on all elements', function()
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
					expect(els[i].get('className')).toBe('wrapAllTester testpassed');
				}
	
				// Remove the elements
				els.remove();
			});
		});
	});
});
