// Author: Yiyi Dai   Date: Aug 14, 2014 
var mod_array = {};
var project_array = {};
var logon = false;
var CHANGE_TYPE = '';

// Jquery function
$(function() {

	// Logo点击刷新页面
	$(".top_logo").click(function() {
		location.reload();
	});

	// 登录
	$(".top_login_name").click(function() {

		if ($(this).text() == "登录") {
			$('#modaddplace').css("-webkit-filter", "blur(3px)");
			$('#BG').css("-webkit-filter", "blur(3px)");
			$(".login").show();
		}
	});

	$(".login_fn_qx").click(function() {
		$('#modaddplace').css("-webkit-filter", "blur(0)");
		$('#BG').css("-webkit-filter", "blur(0)");
		$(".login").hide();
		$(".login_name input").val("").blur();
		$(".login_pw input").val("").blur();
	});

	$('.login_fn_dl').click(function() {
		var newuser = $(".login_name input").val();
		$.post('/login', {
			username: newuser,
			pwd: $('.login_pw input').val()
		}, function(response) {
			if (response == "Passed") {
				setCookie("username", newuser, 365);
				setCookie("logon", "true", 1);

				$(".login").hide();
				$(".card_add,.mod_add").parent().show().removeAttr("style");
				$(".card_fn,.mod_fn_wrap").show().removeAttr("style");
				$(".top_logout").show();
				$(".top_login_name").text(newuser);
				$('#modaddplace').css("-webkit-filter", "blur(0)");
				$('#BG').css("-webkit-filter", "blur(0)");

				refreshMembers(newuser);
				load();
			} else if (response == "Not Pass.") {
				$(".login_error").show();
			}
		});
	});



	$(".login_name input").focus(function() {
		if ($(this).val() == "请输入用户名") {
			$(this).val("");
			$(this).css("color", "black");
		}
	});

	$(".login_name input").blur(function() {
		if ($(this).val() == "") {
			$(this).val("请输入用户名");
			$(this).css("color", "#999");
		}
	});

	$(".login_pw input").focus(function() {
		if ($(this).val() == "********") {
			$(this).val("");
			$(this).css("color", "black");
		}
	});

	$(".login_pw input").blur(function() {
		if ($(this).val() == "") {
			$(this).val("********");
			$(this).css("color", "#999");
		}
	});

	$('.top_logout').click(function() {
		setCookie("logon", "false", 1);
		delCookie('username');
		location.reload(true);
	});

	$('.top_setting_icon').click(function() {
		var layer = $('#setting_layer');
		if (layer.length != 0) {
			if (layer[0].style.display == 'none') {
				$('#setting_layer').show();
			} else {
				$('#setting_layer').hide();
			}
		} else {
			$('#setting_layer').remove();
			var newDiv = $("<div id='setting_layer'></div>");
			var pos = $('.top_setting_icon').offset();
			console.log('posss', pos);
			newDiv.css({
				width: '130px',
				height: 'auto',
				position: 'absolute',
				left: pos.left,
				top: pos.top + 30,
				padding: '10px 15px',
				background: 'rgba(0, 0, 0,.4)',
				color: '#FFF',
				fontFamily: 'Microsoft Yahei',
				zIndex: '999',
				fontSize: '16px'
			});
			$.get('/getConfig', function(res) {
				var allModules = res.allModules;
				var enableModules = res.config.moduleList;
				var isChecked = '';
				var ul = $('<ul>');
				for (var i = 0, l = allModules.length; i < l; i++) {
					if ($.inArray(allModules[i].id, enableModules) > -1) {
						isChecked = 'checked="checked"';
					}
					ul.append("<li><input id='" + allModules[i].id + "' class='modulesSelect' type='checkbox' " + isChecked + " value='" + allModules[i].id + "' /><label for='" + allModules[i].id + "'>" + allModules[i].title + "</label>");
					isChecked = '';
				}
				newDiv.append(ul);
				$('body').append(newDiv);
				$('.modulesSelect').on('click', function() {
					if ($(this).prop('checked') == true) {
						$.get('/setconfig/moduleList/add', {
							value: $(this).val()
						}, function(res) {
							console.log(res);
							$('div[mod_id]').remove();
							load();
						});
					} else {
						$.get('/setconfig/moduleList/rm', {
							value: $(this).val()
						}, function(res) {
							console.log(res);
							$('div[mod_id]').remove();
							load();
						});
					}
				});
			});
		}

	});
	// 回车提交表单
	$("#login").keydown(function(e) {
		var e = e || event,
			keycode = e.which || e.keyCode;
		if (keycode == 13) {
			$('.login_fn_dl').trigger('click');
		}
	});



	// 搜索
	$(".top_search_text input").on('input', function() {
		$(".top_search_hint").show();
		var keyword = $(this).val();

		$(".top_search_result_mod *").remove();
		$(".top_search_result_project *").remove();

		$.get('/search/' + keyword,
			function(res) {

				$.each(res, function(index, value) {
					if (value.id.indexOf("m") == 0) {
						$(".top_search_mod_subject").text("与“" + keyword + "”有关的产品线");
						var found_mod = $("<p><a href='#" + value.id + "'>" + value.title + "</a></p>");
						found_mod.on('click', 'a', function(event) {
							var mod_id = $(this).attr("href").substring(1);
							scrollToElement('div[mod_id="' + mod_id + '"]', 1000);
							var modDiv = $('div[mod_id="' + mod_id + '"]').addClass("highlight");

							setTimeout(function() {
								modDiv.removeClass("highlight");
							}, 1000);
						}).appendTo(".top_search_result_mod");
					}
					if (value.id.indexOf("p") == 0) {
						$(".top_search_project_subject").text("与“" + keyword + "”有关的项目");
						var found_project = $("<p><a href='#" + value.id + "'>" + value.name + "</a></p>");
						found_project.on('click', 'a', function(event) {
							var project_id = $(this).attr("href").substring(1);
							scrollToElement('div[card_id="' + project_id + '"]', 1000);
							var projectDiv = $('.front,.back', 'div[card_id="' + project_id + '"]').addClass("highlight");

							setTimeout(function() {
								projectDiv.removeClass("highlight");
							}, 1000);
						}).appendTo(".top_search_result_project");
					}
				});
			},
			"json");
	});

	// instead of blur of top_search_hint, use moursedown event to avoid conflicts
	$(document).mousedown(function() {
		if (!$.contains($(".top_search_hint").get(0), event.target)) {
			$(".top_search_hint").hide();
		}
	});

	$('.toggleMenu').click(function() {
		$(this).parent().next().removeClass('hide');
	});
	// 项目卡片相关
	$(".front, .back").click(function(event) {
		flip($(this));
	})

	$(".card_edit").click(function() {
		editCard($($(this).parents('.card')[0]));
	})

	$(".card_del").click(function() {
		deleteCard($($(this).parents('.card')[0]));
	})

	$(".editwindow_memberbutton").click(function() {
		$(".editwindow_member").removeClass("hide");
	})

	$(".editwindow_close").click(function() {
		$(this).parent().addClass("hide");
		$('#next_state').addClass("hide");

		$(".editwindow_memberdemo .member").remove();
		$(".editwindow_memberlist .member_add").each(function(index) {
			if ($(this).css("display") != "none") {
				$('<div class="member">' + $(this).prev().text() + '</div>').appendTo(".editwindow_memberdemo");
			}
		});
	})

	$(".editwindow_icon_del").click(function() {
		$(this).parents(".cover").addClass("hide");
		$('#next_week_frame').addClass('hide');
		$(".editwindow_close").click();
	})

	// $(".card_add").click(function() {
	// 	addCard($(this));
	// })

	$(".editwindow_statebutton").click(function() {
		$(this).parent().children(".editwindow_state").removeClass("hide");
		$(".editwindow_state").show();
	})

	$(".progressbar").click(function() {
		$(this).hide();
		$(this).next().removeClass("hide").focus();
	})

	$(".editwindow_per_input button").click(function() {
		var _input, _text, bar, progressbar;
		if ($(this).parents('#next_week_frame').length !== 0) {
			i = 1;
		} else {
			i = 0;

		}
		_text = $($(".progressbar .text")[i]);
		bar = $($(".progressbar .bar")[i]);
		_input = $($(".editwindow_per_input input")[i]);
		progressbar = $($(".progressbar")[i]);

		if (checkNum()) {
			var percentage = _input.val();
			_text.text(percentage + "%");
			bar.css("width", percentage + "%");
			_input.parent().addClass("hide");
			progressbar.show();
		}
	})

	$(".editwindow_xqps,.editwindow_ymgj,.editwindow_kfz,.editwindow_ltz,.editwindow_csz,.editwindow_ysx").click(function() {
		var progressbar_bar, demo, frame;
		if ($(this).parent().attr('id') === 'next_state') {
			progressbar_bar = $('#next_week_frame').find('.bar');
			demo = $('#next_week_frame').find(".statedemo");
			frame = $('#next_state');
		} else {
			progressbar_bar = $(".progressbar .bar");
			demo = $(".editwindow_statedemo");
			frame = $(".editwindow_state");
		}
		progressbar_bar.css({
			"background": $(this).css("background")
		});
		demo.text($(this).text()).css("background", $(this).css("background"));
		var _btn = $(this).attr('class');
		if ($(this).parent('#next_state').length == 0) {
			$('#next_state' + ' > .' + _btn).click();
		}
		frame.addClass('hide');
	})

	$(".editwindow_member .editwindow_memberlist").click(function() {
		$(".member_add", this).toggle();
	})

	$(".editwindow_tj").click(function() {
		if (checkNum()) {
			var id = $(".editwindow_card_id").val();
			project = project_array[id];

			project.name = $(".editwindow_name").val();
			project.state = $(".editwindow_statedemo").eq(0).text();
			project.percentage = $(".editwindow_per input").eq(0).val();
			project.members = $(".editwindow_memberlist .member_add").filter(function() {
				return ($(this).css("display") != "none");
			}).prev().map(function() {
				return $(this).text();
			}).get();
			project.nextPer = $(".editwindow_per input").eq(1).val();
			project.nextState = $("#next_week_frame .statedemo").text();
			var found_card = $(".card[card_id='" + id + "']");

			refreshCard(project, found_card);
			//这个模拟点击有问题 wk
			$(".editwindow_icon_del").click();
			console.log('edit submit', project );
			
			$.post(
				'/post/' + project.id, {
					data: project
				});
		}
	})

	$('#proceedNext').click(function() {
		$('#next_week_frame').removeClass('hide');
	});

	// 产品线相关
	$(".icon_edit").click(function() {
		editModTitle($(this));
	});

	$(".icon_save").click(function() {
		saveModTitle($(this));
	});

	$(".icon_del").click(function() {
		removeMod($(this));
	});

	$(".icon_cancel").click(function() {
		cancelEditModTitle($(this));
	});

	$(".mod_add").click(function() {
		CHANGE_TYPE = 'addMod';
		var newModData = {
			id: getNextId(mod_array),
			title: "新的产品线"
		};
		mod = do_addMod(newModData, $(".mod_add"));
		mod_array[newModData.id] = newModData;

		

		$.post(
			'/post/' + newModData.id, {
				data: newModData
			},
			"json");
	})


	// 刷新后展现
	function load() {
		if (getCookie("logon") != "true") {
			return;
		}
		$.get(
			'/get/all',
			function(response) {
				var modDiv_array = {};
				for (i = 0; i < response.length; i++) {
					if (response[i].id && response[i].id.indexOf("m") == 0) {
						mod_array[response[i].id] = response[i];
						modDiv_array[response[i].id] = do_addMod(response[i], $(".mod_add"));
					}
					if (response[i].id.indexOf("p") == 0) {
						project_array[response[i].id] = response[i];
					}
				}
				console.log(Object.keys(mod_array).length);
				console.log(Object.keys(project_array).length);

				for (i = 0; i < Object.keys(project_array).length; i++) {
					var key = Object.keys(project_array)[i];
					var project_data = project_array[key];
					//console.log("project name: " + project_data.name);
					var new_mod = modDiv_array[project_data.mod_id];
					//这里需要考虑数据有问题的情况
					!!new_mod && do_addCard(project_data, new_mod.find(".card_add"));
				}

				if (getCookie("logon") != "true") {
					$(".card_add,.mod_add").parent().hide();
					$(".card_fn,.mod_fn_wrap").hide();
					$(".top_logout").hide();
				} else {
					$(".top_login_name").text(getCookie("username"));
					$(".top_logout").show();
					refreshMembers(getCookie("username"));
				}
			},
			"json");
	}
	load();


	var socket = io.connect('http://10.210.74.72:8000');
	socket.on('update post', function(data) {
		console.log(data);
		showChange(CHANGE_TYPE, data);
		refreshSingle(data.data.id, data.data);
	});

	socket.on('remove', function(data) {
		//console.log(data);
		removeModPlus(data.id, data);
	});

	var refreshSingle = function(id, data) {
		var _refresh = function(id, data) {
			if (id.indexOf('m') > -1) {
				if ($('div[mod_id="' + id + '"]').length != 0) {
					$('div[mod_id="' + id + '"]').find('.mod_title').text(data.title);
					
				} else {
					do_addMod(data, $('.mod_add'));
					
					
				}
				var settingItem = $('label[for="' + id + '"]');
				if(settingItem.length == 0){
					//refresh new setting list
					var newItem = $('#setting_layer').find('li:last').clone(true);
					newItem.find('input').attr('id', id).val(data.title).end().find('label').attr('for', id).text(data.title);
					newItem.appendTo('#setting_layer > ul');
				}else{
					settingItem.text(data.title);
					settingItem.prev().prop({'id':id,'value':data.title});
				}
				mod_array[id] = data;
			} else {
				$('div[card_id="' + id + '"]').find('.projectname').text(data.name);
				// 绚酷
				project_array[id] = data;
			}
		}
		if (!data) {
			$.get('/get/' + id, function(res) {
				_refresh(id, res);
			})
		} else {
			_refresh(id, data);
		}
	};

	// 鼠标经过mod，背景滤镜
	(function(){
		var timer;
		$("#modaddplace").on('mouseover', '.mod', function() {
			if ($("#login").is(":hidden")) {
				timer = setInterval(function(){$('#BG').css("-webkit-filter", "sepia(1)")},1000);
			}
		}).on('mouseout', '.mod', function() {
			clearInterval(timer);
			$('#BG').css("-webkit-filter", "sepia(0)");
		});
	})();
	


});

// 将登录者用户名添加到成员列表可选行列
function refreshMembers(newuser) {
	// retrieve the stored members list on server
	$.get(
		'/getuser',
		function(response) {
			var logonMembers = null;
			if (!$.isEmptyObject(response) && (response.length > 0)) {
				logonMembers = {
					existingMembers: []
				};
				for (var i = 0, l = response.length; i < l; i++) {
					logonMembers['existingMembers'].push(response[i]['user']);
				}
			} else {
				logonMembers = {
					existingMembers: [],
					membersCount: 0
				};
			}

			if (!$.isEmptyObject(newuser) && $.inArray(newuser, logonMembers.existingMembers) == -1) {
				logonMembers.existingMembers.push(newuser);
				logonMembers.currentUser = newuser;
				logonMembers.membersCount = parseInt(logonMembers.membersCount) + 1;
			}

			// remove all non-default members from the edit window
			$(".editwindow_member .editwindow_memberlist[default!='true']").remove();
			var defaultMembers = $(".editwindow_member .editwindow_memberlist .name").map(function() {
				return $(this).text();
			});

			$.each(logonMembers.existingMembers, function(index, value) {
				if ($.inArray(value, defaultMembers) == -1) {
					var memberDiv = $('<div class="editwindow_memberlist"><div class="name">' + value + '</div><div class="member_add"></div></div>');
					memberDiv.on('click', function() {
						$(".member_add", $(this)).toggle();
					}).appendTo($(".editwindow_member"));
				}
			});

			// $.post(
			// 	'/post/logonMembers', {
			// 		data: logonMembers
			// 	});
		},
		"json");
}

// 新建产品线
function do_addMod(data, object) {
	var newMod = $('<div class="mod"><div class="mod_title_wrap clearfix"><h3 class="mod_title">产品线名</h3><div class="mod_title_edit" style="display:none;"><input type="text" value="产品线名"></div><span class="mod_fn_wrap"><i class="icon_edit"></i><i class="icon_save" style="display:none;"></i><i class="icon_cancel" style="display:none;"></i><i class="icon_del"></i></span></div><div id="cardaddplace" class="card_wrap clearfix"><div id="cardaddwrap" class="card_add_wrap"><div id="addcardbutton" class="card_add"></div></div></div></div>');
	newMod.attr("mod_id", data.id);
	newMod.find("h3.mod_title").text(data.title);
	newMod.on('click', '.card_add', function() {
		addCard($(this));
	}).on('click', '.icon_edit', function() {
		editModTitle($(this));
	}).on('click', '.icon_cancel', function() {
		cancelEditModTitle($(this));
	}).on('click', '.icon_save', function() {
		saveModTitle($(this));
		CHANGE_TYPE = 'editMod';
	}).on('click', '.icon_del', function() {
		removeMod($(this));
	}).insertBefore(object.parent());
	return newMod;
}

// showChange
function showChange(type,msg){
	if( msg && type==='addMod'){
		$('#toptips').html('你的好基友 <span class="red">'+msg.user+'</span>创建了产品线:<span class="red">'+msg.data.id+'</span> 标题:<span class="red">'+msg.data.title+'</span>').show();
	}
	if( msg && type==='editMod'){
		$('#toptips').html('你的好基友 <span class="red">'+msg.user+'</span>编辑了产品线:<span class="red">'+msg.data.id+'</span> 标题:<span class="red">'+msg.data.title+'</span>').show();
	}
	if( msg && type==='addCard'){
		$('#toptips').html('你的好基友<span class="red">'+msg.user+'</span>创建了卡片:<span class="red">'+msg.data.id+'</span> name:<span class="red">'+msg.data.name+'</span>').show();
	}
	if( msg && type==='editCard'){
		$('#toptips').html('你的好基友 <span class="red">'+msg.user+'</span>编辑了卡片:<span class="red">'+msg.data.id+'</span> name:<span class="red">'+msg.data.name+'</span>').show();
	}


	
	
	$('#toptips').delay(3*1000).slideUp(500);
}

// 新建项目
function addCard(object) {

	//Make a new id for the new mod
	var mod_id = object.parents(".mod").attr("mod_id");
	var mod = mod_array[mod_id];
	var newProjectData = {
		id: getNextId(project_array),
		state: "需求评审",
		percentage: "0",
		name: "新的项目",
		members: [''],
		mod_id: mod_id,
		nextPer: 0,
		nextState: "开发中"
	};

	var card = do_addCard(newProjectData, object);
	project_array[newProjectData.id] = newProjectData;

	CHANGE_TYPE = 'addCard';
	console.log('addCard', newProjectData, newProjectData.id);

	editCard(card);
	// $.post(
	// 	'http://prom.com/post/' + newProjectData.id, {
	// 		data: newProjectData
	// 	}, function(res) {
	// 		editCard(card);
	// 	},
	// 	"json");
}

function do_addCard(data_card, object) {
	var newCard = $('<div class="card flip-card"><a class="front-face" href="javascript:void(0);"><div class="front"><div class="stateshow"></div><div class="projectname"></div></div><div class="back"><div class="stateshow"></div><div class="memberinfo"></div></div></a><div class="card_box"></div><span class="card_fn"><i class="card_edit"></i><i class="card_del"></i></span></div>');
	newCard.attr("card_id", data_card.id);
	refreshCard(data_card, newCard);
	newCard.on('click', '.card_edit', function() {
		editCard($($(this).parents('.card')[0]));
		CHANGE_TYPE = 'editCard';
	}).on('click', '.card_del', function() {
		deleteCard($($(this).parents('.card')[0]));
	}).on('click', '.front,.back', function() {
		flip($(this));
	}).insertBefore(object.parent());
	return newCard;
}

// refresh the card with the associated project data
function refreshCard(data_card, card) {
	var stateshow_width = 230 * data_card.percentage / 100
		//find state
	var stateshow_color = $('.editwindow_xqps,.editwindow_ymgj,.editwindow_kfz,.editwindow_ltz,.editwindow_csz,.editwindow_ysx').filter(function() {
		/*
        	true = click the background color matched state
        	false = do nothing
        */
		return ($(this).text() == data_card.state);
	}).css("background");
	card.find(".stateshow").css("width", stateshow_width + "px").css("background", stateshow_color);
	card.find(".projectname").text(data_card.name);
	card.find(".memberinfo").empty();
	if (data_card.hasOwnProperty("members")) {
		$.each(data_card.members, function(index, value) {
			if (value.length > 0) {
				var memberDiv = $('<div class="name">' + value + '</div>');
				card.find(".memberinfo").append(memberDiv);
			}
		});
	}
}

// 修改项目卡片内容
function editCard(cardObject) {
	//do edit function
	$("#popup_cover").removeClass("hide");

	var id = cardObject.attr("card_id");
	var found_project = project_array[id];
	var project_name = found_project.name;
	var percentage = found_project.percentage;
	var state = found_project.state;

	// change card id
	$(".editwindow_card_id").val(id);

	// change project name
	$(".editwindow_name").val(project_name);

	//change progress bar color
	$(".editwindow_per_input input").val(percentage);
	$(".progressbar .text").text(percentage + "%");
	$(".progressbar .bar").css("width", percentage + "%");

	//change state
	$('.editwindow_xqps,.editwindow_ymgj,.editwindow_kfz,.editwindow_ltz,.editwindow_csz,.editwindow_ysx').filter(function() {
		/*
        	true = click the inner text matched state
        	false = do nothing
        */
		return ($(this).text() == state);
	}).click();

	// change selected member
	$(".editwindow_memberlist .member_add").hide();
	$(".editwindow_memberdemo .member").remove();
	if (found_project.hasOwnProperty("members")) {
		$(".editwindow_memberlist .member_add").each(function(index) {
			if ($.inArray($(this).prev().text(), found_project.members) == -1) {
				$(this).hide();
			} else {
				$(this).show();
				$('<div class="member">' + $(this).prev().text() + '</div>').appendTo(".editwindow_memberdemo");
			}
		});
	}
	//set status for next week
	$(".editwindow_per_input input").eq(1).val(100);
	$(".progressbar .text").eq(1).text(100 + "%");
	$(".progressbar .bar").css("width", 100 + "%");
}

// 删除项目卡片
function deleteCard(cardObject) {
	//do delete function
	if (window.confirm("确定要删除该项目吗?")) {
		var id = cardObject.attr('card_id');
		var project = project_array[id];

		// remove project from project_array
		delete project_array[project.id];

		// remove card from page
		cardObject.remove();

		// remove the project on server
		$.get(
			'/remove/' + project.id);
	}
}

// 删除产品线
function removeMod(object) {
	if (window.confirm("确定要删除该产品线吗?")) {
		var mod_id = object.parents('.mod').attr('mod_id')
			// remove the mod on server
		$.get(
			'/remove/' + mod_id, function(res) {
				removeModPlus(mod_id)
			});
	}
}

function removeModPlus(id, data) {
	if (id.indexOf('p') > -1) {
		var project_ids_to_remove = [];
		$.each(project_array, function(k, v) {
			if (v.mod_id == mod_id) {
				project_ids_to_remove.push(k);
			}
		});

		$.each(project_ids_to_remove, function(i, l) {
			delete project_array[l];

			// remove the project on server
			$.get(
				'/remove/' + l);
		});
	} else {
		var mod_id = id;
		var mod = mod_array[mod_id];

		// remove mod from mod_array
		delete mod_array[mod.id];

		// remove mod from page
		//object.parents(".mod").remove();
		$('div[mod_id="' + mod_id + '"]').remove();

		//update settings
		$('#' + mod_id).parent().remove();
	}
}

// 修改产品线名称
function editModTitle(object) {
	var _input = object.parents(".mod_title_wrap").find(".mod_title_edit input");
	_input.val(object.parents(".mod_title_wrap").find(".mod_title").text());
	object.parents(".mod_title_wrap").find(".mod_title_edit,.icon_save,.icon_cancel").show();
	object.parents(".mod_title_wrap").find(".mod_title,.icon_edit,.icon_del").hide();
	_input.select();
	_input.keyup(function(evt) {
		if (evt.keyCode == 13) {
			saveModTitle(object);
		}
	});
}

function cancelEditModTitle(object) {
	object.parents(".mod_title_wrap").find(".mod_title_edit,.icon_save,.icon_cancel").hide();
	object.parents(".mod_title_wrap").find(".mod_title,.icon_edit,.icon_del").show();
}

function saveModTitle(object) {
	object.parents(".mod_title_wrap").find(".mod_title_edit,.icon_save,.icon_cancel").hide();
	object.parents(".mod_title_wrap").find(".mod_title,.icon_edit,.icon_del").show();
	//Collect data
	var mod_id = object.parents(".mod").attr('mod_id');
	var _input = object.parents(".mod_title_wrap").find(".mod_title_edit input");
	var inputtitle = _input.val();
	object.parents(".mod_title_wrap").find(".mod_title").text(inputtitle);

	//Parse string to a JSON object
	foundMod = mod_array[mod_id];
	foundMod.title = inputtitle;
	console.log('save mode title', foundMod);
	$.post(
		'/post/' + foundMod.id, {
			data: foundMod
		});
}

// 项目卡片翻转
function flip(object) {
	if (object.hasClass("front")) {
		var back = object.next();
		object.addClass("front-hide");
		back.addClass("back-show");
	} else if (object.hasClass("back")) {
		var front = object.prev();
		object.removeClass("back-show");
		front.removeClass("front-hide");
	}
}

// 检查输入的进度是不是合理数字
function checkNum() {
	var content = $(".editwindow_per input").val();
	if (content.match(/[^\d]/)) {
		alert("进度栏请输入0到100的数字！");
		return false;
	} else if (content < 0 || content > 100) {
		alert("进度栏请输入0到100的数字！");
		return false;
	} else {
		return true;
	}
}



// sort arrays like mod_array, project_array
function descending(a, b) {
	return parseInt(b.substring(1)) - parseInt(a.substring(1));
}

// get next id for new module or new project, the new id 
// will be the next number of the largest module/project id.
function getNextId(array) {
	var keys = Object.keys(array);
	if (keys.length == 0) {
		if (array === mod_array) {
			return "m1";
		} else if (array === project_array) {
			return "p1";
		}
	} else {
		keys.sort(descending);
		console.log(keys);
		var max_key = keys[0];

		return max_key.substr(0, 1) + (parseInt(max_key.substring(1)) + 1);
	}
}

// 记住用户
function setCookie(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	var expires = "expires=" + d.toGMTString();
	document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') c = c.substring(1);
		if (c.indexOf(name) != -1) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}

function checkCookie() {
	var user = getCookie("username");
	if (user != "") {
		alert("Welcome again " + user);
	} else {
		user = prompt("Please enter your name:", "");
		if (user != "" && user != null) {
			setCookie("username", user, 30);
		}
	}
}

function delCookie(name) {
	var exp = new Date();
	exp.setTime(exp.getTime() - 1);
	var cval = getCookie(name);
	if (cval != null) document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}

// 搜索结果点击跳转
function scrollToElement(selector, time, verticalOffset) {
	time = typeof(time) != 'undefined' ? time : 1000;
	verticalOffset = typeof(verticalOffset) != 'undefined' ? verticalOffset : 0;
	element = $(selector);
	offset = element.offset();
	offsetTop = offset.top + verticalOffset;
	$('html, body').animate({
		scrollTop: offsetTop
	}, time);
}



// 回到顶端
$(function() {
	$(function() {
		$(window).scroll(function() {
			if ($(window).scrollTop() > 100) {
				$(".icon_up").fadeIn(1500);
			} else {
				$(".icon_up").fadeOut(1500);
			}
		});

		$(".icon_up").click(function() {
			$('body,html').animate({
				scrollTop: 0
			}, 1000);
			return false;
		});
	});
});