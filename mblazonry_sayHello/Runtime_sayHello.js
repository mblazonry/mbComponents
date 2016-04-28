(function (skuid)
{
   skuid.componentType.register("mblazonry__sayhello", function (element, xmlDef)
   {
      element.addClass("hello-content").html("<b>Hello " + xmlDef.attr("person") + "</b>");
   });
})(skuid);
