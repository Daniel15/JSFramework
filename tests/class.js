describe('Class', function()
{
	var ExampleClass;
	beforeEach(function()
	{
		// Example class used in all tests
		ExampleClass = new Class(
		{
			init: function(name, age)
			{
				this.name = name;
				this.age = age;
			},
			sayHello: function()
			{
				return 'Hello ' + this.name;
			},
			sayAge: function()
			{
				return 'You are ' + this.age;
			},
			myName: function()
			{
				return this.name;
			}
		});
	});
		
	describe('Basic class construction', function()
	{
		var sample;
		beforeEach(function()
		{
			sample = new ExampleClass('Dan', 21);
		});
		it('should support instanceOf checks', function()
		{
			expect(sample instanceof ExampleClass).toBeTruthy();
		});
		
		it('should call the constructor', function()
		{
			expect(sample.name).toBe('Dan');
		});

		it('should support instance methods', function()
		{
			expect(sample.sayHello()).toBe('Hello Dan');
			expect(sample.myName()).toBe('Dan');
			expect(sample.sayAge()).toBe('You are 21');
		});
		
		it('should support changing variables', function()
		{
			expect(sample.sayHello()).toBe('Hello Dan');
			sample.name = 'Daniel';
			expect(sample.sayHello()).toBe('Hello Daniel');
		});
	});
	
	describe('Extending classes', function()
	{
		var ChildClass, child;
		beforeEach(function()
		{
			ChildClass = ExampleClass.extend({
				sayHello: function()
				{
					return 'G\'day ' + this.name;
				},
				sayAge: function()
				{
					return this.parent() + '. Amazing';
				},
				newFunction: function()
				{
					return 42;
				}
			});
			child = new ChildClass('Dan', 21);
		});
		
		it('should support adding new functions', function()
		{
			expect(child.newFunction()).toBe(42);
		});
		it('should support overriding functions', function()
		{
			expect(child.sayHello()).toBe('G\'day Dan');
		});
		it('should support overriding functions and calling the parent', function()
		{
			expect(child.sayAge()).toBe('You are 21. Amazing');
		});
		it('should support instanceOf checks', function()
		{
			expect(child instanceof ChildClass).toBeTruthy();
			expect(child instanceof ExampleClass).toBeTruthy();
		});
		it('should support changing variables', function()
		{
			expect(child.sayHello()).toBe('G\'day Dan');
			child.name = 'Daniel';
			expect(child.sayHello()).toBe('G\'day Daniel');
		});
	});
});
