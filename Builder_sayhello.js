(function($)
{


	skuid.builder.core.registerBuilder(new skuid.builder.core.Builder(
	{
		id: "mblazonry__sayhello",
		name: "Say Hello",
		icon: "fa-comments-o",
		description: "This component says Hello to someone",
		componentRenderer: function(component)
		{
			component.setTitle(component.builder.name);
			component.body.html(
				"<div class='hello-content'>Hello " + component.state.attr("person") + "!</div>"
			);
		},
		mobileRenderer: function(component)
		{
			component.setTitle(component.builder.name);
			component.body.html(
				"<div class='hello-content'>Hello " + component.state.attr("person") + "!</div>"
			);
		},
		propertiesRenderer: function(propertiesObj, component)
		{
			propertiesObj.setTitle("Say Hello Component Properties");
			var state = component.state;
			var propCategories = [];
			var propsList = [
				{
					id: "person",
					type: "string",
					label: "Person to say Hello to",
					helptext: "Pick a name, any name!",
					onChange: function()
					{
						component.refresh();
					}
			}];
			propCategories.push(
			{
				name: "",
				props: propsList,
			});
			if (skuid.mobile) propCategories.push(
			{
				name: "Remove",
				props: [
					{
						type: "remove"
				}]
			});
			propertiesObj.applyPropsWithCategories(propCategories, state);
		},
		defaultStateGenerator: function()
		{
			return skuid.utils.makeXMLDoc("<mblazonry__sayhello person='sys' />");
		}
	}));
})(skuid);