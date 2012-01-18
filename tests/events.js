describe('Events', function()
{
	it('should set up the environment', function()
	{
		expect(Events.add).toBeDefined();
		expect(Events.stop).toBeDefined();
		expect(ElementWrapper.prototype.addEvent).toBeDefined();
	});
});
