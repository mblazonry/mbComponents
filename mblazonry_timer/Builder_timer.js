(function ($, skuid, undefined)
{
	'use strict';
	/*jshint -W030 */
	/*jslint browser:true, lastsemic:true, unused:false */

	// Create some shortcut variables
	$ = skuid.$; // should equiv skuid.jquery
	var bc = skuid.builder.core;
	var $xml = skuid.utils.makeXMLDoc;
	var $j = $.noConflict();

	skuid.builder.registerBuilder(new skuid.builder.Builder(
	{
		id: 'mblazonry__timer',
		name: 'Timer',
		icon: 'sk-icon-versions', // looks like a clock
		description: 'Records and displays elapsed time.',
		handleStateEvent: function (c, event, f)
		{
			var changeEvent = "model.idChange" === event.type,
				removeEvent = "model.remove" === event.type,
				update = false;
			removeEvent && skuid.builder.core.handleModelRemove(c, event,
			{
				component: f
			}),
			changeEvent && skuid.builder.core.handleModelIdChange(c, event), (removeEvent || changeEvent) && c.children("actions").first().children('action[type="savecancel"]').each(function ()
			{
				$(this).children("models").first().children("model").each(function ()
				{
					var a = $(this).text();
					removeEvent && a === event.modelId ? ($(this).remove(), update = true) : changeEvent && a === event.oldId && ($(this).text(event.newId), update = true);
				});
			}),
			update && skuid.events.publish("skuidBuilderNeedSave");
		},
		propertiesRenderer: function (propertiesObj, component)
		{
			propertiesObj.setHeaderText("Timer Properties");
			var state = component.state;
			var properties = [];

			var basicPropsList = [
				{
					id: 'model',
					type: 'model',
					label: 'User Model',
					required: true,
					onChange: function ()
					{
						component.updateAutoCreatedEditorCondition && component.updateAutoCreatedEditorCondition(),
						component.save().rebuildProps().refresh();
					}
				},
				{
					id: "userId",
					type: "template",
					location: "attribute",
					label: "Current User Id",
					onChange: function ()
					{
						//component.sectionHeader && // make sure the header exists
						//component.sectionTitle.text(state.attr("userId")); // set it via model attr
					}
				},
				{
					id: "startTime",
					type: "template",
					location: "attribute",
					label: "Start Time field",
					onChange: function ()
					{
						component.refresh();
					}
				},
				{}, // to make the properties list align properly in the builder window
				{
					id: 'onPageLoad',
					type: 'string',
					label: 'onPageLoad Snippet',
					helptext: 'Snippet to call when the timer is loaded into a page',
					placeholder: "none",
					onChange: function ()
					{
						component.refresh();
					},
					required: false
				},
				{
					id: 'onStart',
					type: 'string',
					label: 'onStart Snippet Id',
					helptext: 'Called when the timer starts.',
					placeholder: "none",
					onChange: function ()
					{
						component.refresh();
					},
					required: false
				},
				{
					id: 'onDone',
					type: 'string',
					label: 'onDone Snippet Id',
					helptext: 'Called when the timer ends.',
					placeholder: "none",
					onChange: function ()
					{
						component.refresh();
					},
					required: false
				},
				{
					id: "recColor",
					type: "color",
					label: "Record Color",
					defaultValue: "red",
					placeholder: "default",
					onChange: function ()
					{
						component.refresh();
					},
					required: true
				}
			];
			var advancedPropsList = [
				{
					id: 'timerLabel',
					type: 'string',
					label: 'Button Label',
					helptext: 'Label for timer.',
					defaultValue: 'Rec',
					onChange: function (label)
					{
						component.body.find(".mblazonry-timer-button > .ui-button-text").text(label);
					},
					required: true
				},
				{
					id: 'timerIcon',
					type: 'icon',
					label: 'Timer Icon',
					helptext: 'Icon for timer.',
					defaultValue: 'sk-icon-opportunities',
					onChange: function ()
					{
						component.refresh();
					},
					required: true
				},
				skuid.builder.core.coreProps.uniqueIdProp(
				{
					component: this
				}),
				skuid.builder.core.coreProps.cssClassProp()
			];

			// Properties
			properties.push(
			{
				name: 'Basic',
				props: basicPropsList
			},
			{
				name: 'Advanced',
				props: advancedPropsList
			});
			/*properties.push(
				skuid.builder.core.getRenderingCategory(
				{
					component: component,
					model: null,
					propViewer: propertiesObj
				}),
				skuid.builder.core.getContextCategory(
				{
					propViewer: propertiesObj,
					state: state,
					model: state.attr("userModel")
				}));*/
			propertiesObj.applyPropsWithCategories(properties, state);
		},
		componentRenderer: function (component)
		{
			component.setTitle(component.builder.name);
			var buttonBuilder = new skuid.builder.core.Builder(
			{
				id: "action",
				name: "Button",
				hideWrapper: true,
				dragHandle: ".nx-pagebuilder-pagetitle-action",
				componentRenderer: function (actionItem)
				{
					actionItem.element.css("float", "left").addClass("nx-pagebuilder-pagetitle-action");
					actionItem.body.css("padding", "0px").css("overflow", "visible");
					actionItem.actionbar.addClass("nx-pagebuilder-actionbar-item");
					var HTML = $("<div>").css(
					{
						marginLeft: "4px",
						opacity: "0.35"
					});
					var actionItemState = actionItem.state;
					var actionItemLabel = actionItemState.attr("label");
					var actionItemIcon = actionItemState.attr("icon");
					switch (actionItemState.attr("type"))
					{
					case "delete":
						HTML.text(actionItemLabel || skuid.label.read("delete")).skooButton(
						{
							icon: "sk-icon-delete"
						});
						break;
					case "share":
						HTML.text(actionItemLabel || skuid.label.read("share")).skooButton(
						{
							icon: "sk-icon-share"
						});
						break;
					case "clone":
						HTML.text(actionItemLabel || skuid.label.read("clone")).skooButton(
						{
							icon: "sk-icon-clone"
						});
						break;
					case "save":
						HTML.text(actionItemLabel || skuid.label.read("save")).skooButton(
						{
							icon: actionItemIcon || "sk-icon-save"
						});
						break;
					case "cancel":
						HTML.text(actionItemLabel || skuid.label.read("cancel")).skooButton(
						{
							icon: actionItemIcon || "sk-icon-cancel"
						});
						break;
					case "savecancel":
						HTML.text(actionItemState.attr("cancelLabel") || skuid.label.read("cancel")).skooButton(
						{
							icon: "sk-icon-cancel"
						});
						$("<div>").css(
						{
							marginLeft: "4px",
							opacity: "0.35"
						}).text(actionItemState.attr("saveLabel") || skuid.label.read("save")).skooButton(
						{
							icon: "sk-icon-save"
						}).appendTo(actionItem.body);
						break;
					case "popup":
						var hasPopup = actionItemState.children("popup");
						var popupBuilder = skuid.builder.desktop.makePopupBuilder(
						{
							getContextModelName: function ()
							{
								return component.state.attr("model");
							},
							linkedComponent: actionItem,
							useAfterCloseActions: true
						});
						if (0 === hasPopup.length)
						{
							hasPopup = popupBuilder.defaultStateGenerator();
							actionItemState.append(hasPopup);
						}
						actionItem.popupcomponent = skuid.builder.core.componentFactory(hasPopup, popupBuilder, true);
						HTML.text(actionItemLabel).skooButton(
						{
							icon: actionItemIcon
						});
						break;
					case "custom":
						HTML.text(actionItemLabel).skooButton(
						{
							icon: actionItemIcon
						});
						break;
					case "sfdcweblink":
						HTML.text(actionItemLabel).skooButton(
						{
							icon: actionItemIcon
						});
						var n = actionItemState.attr("weblinkname");
						var o = actionItemState.attr("weblinkobject");
						var p = function ()
						{
							skuid.component.getByType("skuidpage")[0].addProblem("Invalid Salesforce Custom Button/Link" + (o && n ? " on object " + o + ": " + n : "."));
						};
						if (n && o)
						{
							var q;
							var r;
							var s = n.split("__");
							if (2 === s.length)
							{
								q = s[0];
								r = s[1];
							}
							else
							{
								r = s[0];
							}
							skuid.sfdc.weblink.get(
							{
								objectName: actionItemState.attr("weblinkobject"),
								weblinkName: r,
								namespacePrefix: q,
								callback: function (a)
								{
									if (a)
									{
										if (actionItemState.attr("label") != a.MasterLabel)
										{
											actionItemState.attr("label", a.MasterLabel);
											actionItem.save();
										}
										HTML.find(".ui-button-text").text(a.MasterLabel);
									}
									else
									{
										p();
									}
								}
							});
						}
						break;
					default:
						HTML.text(actionItemLabel).skooButton(
						{
							icon: actionItemIcon
						});
					}
					actionItem.addActionItem("", "sk-icon-delete", function ()
					{
						actionItem.remove();
					});
					actionItem.body.append(HTML);
				},
				propertiesRenderer: function (propertiesObj, button)
				{
					propertiesObj.setHeaderText("Button Properties");
					var j;
					var buttonstate = button.state;
					var buttontype = buttonstate.attr("type");
					var buttonmodel = buttonstate.closest("pagetitle").attr("model");
					var buttonSObjectName = skuid.builder.core.getSObjectNameFromModelName(buttonmodel);
					var basicPropsList = {
						id: "type",
						type: "picklist",
						label: "Action Type",
						defaultValue: "multi",
						picklistEntries: [
						{
							label: "Run Multiple Actions",
							value: "multi"
						},
						{
							label: "Delete",
							value: "delete"
						},
						{
							label: "Share",
							value: "share"
						},
						{
							label: "Clone",
							value: "clone"
						},
						{
							label: "Save / Cancel",
							value: "savecancel"
						},
						{
							label: "Redirect to URL",
							value: "redirect"
						},
						{
							label: "Pop Up",
							value: "popup"
						},
						{
							label: "Save",
							value: "save"
						},
						{
							label: "Cancel",
							value: "cancel"
						},
						{
							label: "Custom: Run Skuid Snippet",
							value: "custom"
						},
						{
							label: "Custom: SF Button/Link",
							value: "sfdcweblink"
						}],
						onChange: function (a, c)
						{
							if (-1 !== $.inArray(a, ["delete", "share", "clone", "savecancel", "sfdcweblink"]))
							{
								buttonstate.removeAttr("label");
							}
							else
							{
								if ("multi" === a && !buttonstate.children("actions").length)
								{
									var d;
									var e;
									var f = skuid.utils.makeXMLDoc("<actions/>");
									if ("redirect" === c)
									{
										d = skuid.utils.makeXMLDoc('<action type="redirect"/>').attr(
										{
											url: buttonstate.attr("url"),
											window: buttonstate.attr("window")
										});
									}
									else
									{
										if ("custom" === c)
										{
											d = skuid.utils.makeXMLDoc('<action type="custom"/>').attr(
											{
												snippet: buttonstate.attr("snippet")
											});
										}
										else
										{
											if ("popup" === c)
											{
												d = skuid.utils.makeXMLDoc('<action type="showPopup"/>').append(buttonstate.children("popup"));
											}
											else
											{
												if ("save" === c || "cancel" === c)
												{
													var j = buttonstate.attr("window");
													var l = buttonstate.attr("rollbackonanyerror");
													var m = buttonstate.attr("afterSave");
													var n = buttonstate.attr("afterCancel");
													var o = buttonstate.closest("pagetitle").attr("model");
													var p = buttonstate.children("models");
													if (p.length || (p = skuid.utils.makeXMLDoc("<models/>")), d = skuid.utils.makeXMLDoc('<action type="' + c + '"/>'), p && (o && p.append(skuid.utils.makeXMLDoc("<model/>").text(o)), d.append(p)), l && d.attr("rollbackonanyerror", l), m || n)
													{
														e = [d];
														var q = skuid.utils.makeXMLDoc('<action type="redirect"/>');
														e.push(q);
														if (j)
														{
															q.attr("window", j);
														}
														if (m && "save" === c)
														{
															q.attr("url", m);
														}
														else
														{
															if (n)
															{
																if ("cancel" === c)
																{
																	q.attr("url", n);
																}
															}
														}
													}
												}
											}
										}
									}
									if (e)
									{
										$.each(e, function ()
										{
											f.append(this);
										});
										f.appendTo(buttonstate);
									}
									else
									{
										if (d)
										{
											d.appendTo(f);
											f.appendTo(buttonstate);
										}
									}
								}
								if (!buttonstate.attr("label"))
								{
									if ("save" === a)
									{
										buttonstate.attr(
										{
											label: skuid.label.read("save"),
											icon: "sk-icon-save"
										});
									}
									else
									{
										if ("cancel" === a)
										{
											buttonstate.attr(
											{
												label: skuid.label.read("cancel"),
												icon: "sk-icon-cancel"
											});
										}
										else
										{
											if ("popup" === a)
											{
												buttonstate.attr("label", "Show Popup");
											}
											else
											{
												buttonstate.attr("label", "New Button");
											}
										}
									}
								}
							}
							button.save().refresh().rebuildProps();
						}
					};
					var p = {
						id: "label",
						type: "template",
						location: "attribute",
						displayAs: "input",
						label: "Button Label",
						onChange: function ()
						{
							button.refresh();
						}
					};
					var q = {
						id: "icon",
						type: "icon",
						label: "Button Icon",
						onChange: function ()
						{
							button.refresh();
						}
					};
					var r = {
						id: "secondary",
						type: "boolean",
						location: "attribute",
						label: "Is Secondary",
						helptext: 'Purely stylistic. Will change the button style to match that of the standard "Cancel" button'
					};
					var s = {
						id: "snippet",
						type: "string",
						label: "Snippet Name",
						helptext: "The name of the Skuid Snippet that should be run when this button is clicked. To create a new Snippet, go to the JavaScript tab under Resources."
					};
					var t = {
						id: "url",
						type: "template",
						location: "attribute",
						displayAs: "input",
						helptext: "The URL to redirect the user to when this button is clicked. Can include template syntax, e.g. '/{{Model.KeyPrefix}}'",
						label: "Redirect URL"
					};
					var u = {
						id: "window",
						type: "picklist",
						label: "Open URL in",
						defaultValue: "self",
						picklistEntries: [
						{
							label: "Current window",
							value: "self"
						},
						{
							label: "Blank window",
							value: "blank"
						},
						{
							label: "Parent window",
							value: "parent"
						}]
					};
					var v = {
						id: "weblinkname",
						type: "picklist",
						label: "Custom Button / Link Name",
						defaultValue: "",
						picklistEntries: [],
						onChange: function (b)
						{
							if (b)
							{
								var c;
								var d;
								var e = b.split("__");
								if (2 === e.length)
								{
									c = e[0];
									d = e[1];
								}
								else
								{
									d = e[0];
								}
								skuid.sfdc.weblink.get(
								{
									objectName: buttonSObjectName,
									weblinkName: d,
									namespacePrefix: c,
									callback: function (a)
									{
										buttonstate.attr(
										{
											label: a.MasterLabel,
											weblinkobject: buttonSObjectName
										});
										button.save().refresh().rebuildProps();
									}
								});
							}
							else
							{
								button.save().refresh().rebuildProps();
							}
						}
					};
					if ("sfdcweblink" === buttontype)
					{
						p.type = "readonly";
						var w = skuid.sfdc.weblink;
						var x = w.getAllForObject(buttonSObjectName);
						var y = skuid.Mustache.render;
						var z = function ()
						{
							$.each(x, function ()
							{
								v.picklistEntries.push(
								{
									label: skuid.utils.decodeHTML(y("{{MasterLabel}}{{#NamespacePrefix}} ({{NamespacePrefix}}){{/NamespacePrefix}}", this)),
									value: y("{{#NamespacePrefix}}{{NamespacePrefix}}__{{/NamespacePrefix}}{{Name}}", this)
								});
							});
						};
						if (x.length)
						{
							z();
						}
						else
						{
							if (w.haveQueriedForObject(buttonSObjectName))
							{
								return window.alert("There are no Custom Buttons / Links on the " + buttonSObjectName + " object that Skuid can use.\n\nThis Button will be removed."), void button.remove();
							}
							propertiesObj.body.append($('<div style="padding: 10px; font-size: 12pt;">').text("Loading Custom Buttons and Links for Object: " + buttonSObjectName));
							w.get(
							{
								objectName: buttonSObjectName,
								callback: function ()
								{
									button.refresh().rebuildProps();
								}
							});
						}
					}
					j = "save" == buttontype ? "Save" : "cancel" == buttontype ? "Cancel" : "Save/Cancel";
					var A;
					var B = buttonstate.parent().parent().attr("model");
					var C = {
						id: "models",
						type: "models",
						label: "Additional Models to " + j,
						helptext: "When the " + j + ("Save/Cancel" === j ? " buttons are " : " button is") + " shown, clicking on " + ("Save/Cancel" === j ? "these buttons will " : "this button will ") + j + " the Model defined for this PageTitle component, as well as any additional Models selected here.",
						noneSelectedText: "Select Models...",
						entryFilter: function (a)
						{
							return !B || B !== a;
						}
					};
					var D = {
						id: "afterSave",
						type: "template",
						location: "attribute",
						displayAs: "input",
						label: "After Save Redirect URL",
						helptext: "The URL to which the User will be taken upon a successful Save."
					};
					var E = {
						id: "afterCancel",
						type: "template",
						location: "attribute",
						displayAs: "input",
						label: "After Cancel Redirect URL",
						helptext: "The URL to which the User will be taken immediately upon clicking 'Cancel'."
					};
					var F = {
						id: "saveLabel",
						type: "template",
						location: "attribute",
						displayAs: "input",
						label: "(Optional) Save Button Label",
						onChange: function ()
						{
							button.refresh();
						}
					};
					var G = {
						id: "cancelLabel",
						type: "template",
						location: "attribute",
						displayAs: "input",
						label: "(Optional) Cancel Button Label",
						onChange: function ()
						{
							button.refresh();
						}
					};
					var H = {
						type: "customaction",
						label: "Configure Popup",
						icon: "sk-bi-popup",
						id: "popup",
						mode: "edit",
						customAction: function ()
						{
							button.popupcomponent.select();
						}
					};
					if (skuid.utils.startsWith(buttontype, "save"))
					{
						A = {
							id: "rollbackonanyerror",
							label: "Roll back entire save on any error",
							helptext: "If true, then if there is any error while saving any of the selected Models, then the entire save operation will be rolled-back, as if no part of it ever occurred. ",
							type: "boolean"
						};
					}
					var I = skuid.builder.core.coreProps.domIdProp(
					{
						id: "uniqueid"
					});
					var J = skuid.builder.desktop.cssClassProp;
					var K = {
						savecancel: [basicPropsList, C, A],
						custom: [basicPropsList, p, q, s],
						redirect: [basicPropsList, p, q, t, u],
						popup: [basicPropsList, p, q, H],
						save: [basicPropsList, C, A, p, q, D, u],
						cancel: [basicPropsList, C, p, q, E, u],
						sfdcweblink: [basicPropsList, v, p, q],
						multi: [basicPropsList, p, q]
					};
					var L = {
						savecancel: [D, E, F, G, u],
						save: [I, J],
						cancel: [I, J]
					};
					var M = [
					{
						name: "Basic",
						props: K[buttontype] || [basicPropsList, p]
					}];
					if ("multi" === buttontype)
					{
						M.push(skuid.builder.core.getActionsCategory(
						{
							useModelName: buttonmodel,
							linkedComponent: button
						}));
					}
					M.push(
					{
						name: "Advanced",
						props: L[buttontype] || [I, J, r]
					});
					if ("savecancel" === buttontype)
					{
						M.push(skuid.builder.core.getHotkeysCategory(
						{
							id: "savehotkeys",
							label: "Save Hotkeys",
							linkedComponent: button
						}), skuid.builder.core.getHotkeysCategory(
						{
							id: "cancelhotkeys",
							label: "Cancel Hotkeys",
							linkedComponent: button
						}));
					}
					else
					{
						M.push(skuid.builder.core.getHotkeysCategory(
						{
							linkedComponent: button
						}));
					}
					M.push(skuid.builder.core.getRenderingCategory(
					{
						component: button,
						model: buttonmodel,
						propViewer: propertiesObj,
						showEnableDisableConditions: true
					}));
					propertiesObj.applyPropsWithCategories(M, buttonstate);
				},
				defaultStateGenerator: function ()
				{
					return skuid.utils.makeXMLDoc('<action type="multi" label="New Button"/>');
				}
			});
			var buttonAcceptor = new skuid.builder.desktop.ComponentAcceptor(component.state.children("actions"), buttonBuilder, ".nx-pagebuilder-pagetitle-action", component.mode);
			buttonAcceptor.element.addClass("nx-pagebuilder-acceptor-inline-small").appendTo(component.body);
			component.addActionItem("Add Button", "sk-bi-action-add", function ()
			{
				var state = buttonBuilder.getDefaultState();
				component.state.children("actions").append(state);
				var button = skuid.builder.core.componentFactory(state, buttonBuilder, true);
				buttonAcceptor.addComponent(button);
				component.save();
			});

			// Create some shortcut variables
			var timerState = component.state,
				timer = component.body;
			timer.addClass("mblazonry-timer");

			var button = $("<div>").addClass("mblazonry-timer-button"),
				timerLabel = timerState.attr("timerLabel") || "Rec",
				timerIcon = timerState.attr("timerIcon"),
				recColor = timerState.attr("recColor");

			button.text(timerLabel).skooButton(
			{
				icon: timerIcon
			});

			$(".mblazonry-timer-button .ui-icon").css(
			{
				"color": recColor || "red"
			});
			timer.append(button);

			// mblazonry-timer-counter
			var counter = $('<span id="counter">').addClass('counter counter-analog3'),
				label = "\t[HH:MM]";

			counter.text(label).addClass("sk-navigation-item-iconlabel");
			timer.append(counter);
		},
		defaultStateGenerator: function ()
		{
			/*jshint -W030 */

			// Almost useless to have this
			var lastModel = skuid.builder.core.getLastSelectedModelComponent(),
				model = lastModel && lastModel.state ? lastModel.state.attr("id") : null;

			// $xml === skuid.utils.makeXMLDoc
			return $xml('<mblazonry__timer/>').attr(
			{
				//'userModel': model || "master_CurrentUser",
				'model': model || "master_CurrentUser",
				'userId': "",
				'startTime': "",
				'onPageLoad': "",
				'onStart': "",
				'onDone': "",
				'recColor': "red", // = #ff0000
				'timerLabel': "Rec",
				'timerIcon': "sk-icon-opportunities",
				//'model': "pgs_CurrentUser", // this needs to be model id
				'height': "95%"
			}).append(skuid.utils.makeXMLDoc("<actions/>"));
		}
	}));
})(window.skuid.$, window.skuid);
