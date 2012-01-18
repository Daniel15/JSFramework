describe('Core', function()
{
	describe('Environment', function()
	{
		it('should have core String functions available', function()
		{
			// Check required functions
			expect(String.prototype.trim).toBeDefined();
		});
	});
	
	describe('Util', function()
	{
		describe('extend', function()
		{
			it('should return the extended object', function()
			{
				var extended = Util.extend({hello: 'world'}, {foo: 'bar'});
				var expected = {hello: 'world', foo: 'bar'};
				expect(extended).toEqual(expected);
			});
			it('should modify the destination object', function()
			{
				var first = {hello: 'world'};
				var second = {foo: 'bar'};
				Util.extend(first, second);
				
				// Ensure an element from second object is in the first object
				expect(first.foo).toEqual('bar');
			});
		});
		
		describe('buildQueryString', function()
		{
			describe('simple querystrings', function()
			{
				it('should handle empty objects', function()
				{
					expect(Util.buildQueryString({})).toBe('');
				});
				it('should handle objects with one item', function()
				{
					expect(Util.buildQueryString({hello: 'world'})).toBe('hello=world');
				});
				it('should handle objects with two items', function()
				{
					expect(Util.buildQueryString({hello: 'world', foo: 'bar'})).toBe('hello=world&foo=bar');
				});
				it('should handle Unicode characters', function()
				{
					expect(Util.buildQueryString({hello: '\u0CA0_\u0CA0'})).toBe('hello=%E0%B2%A0_%E0%B2%A0');
				});
			});
			it('should handle inner arrays', function()
			{
				expect(Util.buildQueryString({hello: ['world', 'foo']})).toBe('hello[]=world&hello[]=foo');
				expect(Util.buildQueryString({hello: ['world', 'foo'], moo: 'goo'})).toBe('hello[]=world&hello[]=foo&moo=goo');
			});
			it('should handle inner objects', function()
			{
				expect(Util.buildQueryString({hello: {world: 'foo'}})).toBe('hello[world]=foo');
				expect(Util.buildQueryString({hello: {world: 'foo', moo: 'goo'}})).toBe('hello[world]=foo&hello[moo]=goo');
			});
		});
	});
});
