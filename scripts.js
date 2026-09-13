// JavaScript Document
function pausecomp(ms) {
	ms += new Date().getTime();
	while (new Date() < ms){}
} 

function MM_swapImgRestore() { //v3.0
	var i,x,a=document.MM_sr; for(i=0;a&&i<a.length&&(x=a[i])&&x.oSrc;i++) x.src=x.oSrc;
}

function MM_preloadImages() { //v3.0
	var d=document; if(d.images){ if(!d.MM_p) d.MM_p=new Array();
		var i,j=d.MM_p.length,a=MM_preloadImages.arguments; for(i=0; i<a.length; i++)
			if (a[i].indexOf("#")!=0){ d.MM_p[j]=new Image; d.MM_p[j++].src=a[i];}}
}

function MM_findObj(n, d) { //v4.01
	var p,i,x;  if(!d) d=document; if((p=n.indexOf("?"))>0&&parent.frames.length) {
		d=parent.frames[n.substring(p+1)].document; n=n.substring(0,p);}
		if(!(x=d[n])&&d.all) x=d.all[n]; for (i=0;!x&&i<d.forms.length;i++) x=d.forms[i][n];
		for(i=0;!x&&d.layers&&i<d.layers.length;i++) x=MM_findObj(n,d.layers[i].document);
		if(!x && d.getElementById) x=d.getElementById(n); return x;
}

function MM_swapImage() { //v3.0
	var i,j=0,x,a=MM_swapImage.arguments; document.MM_sr=new Array; for(i=0;i<(a.length-2);i+=3)
		if ((x=MM_findObj(a[i]))!=null){document.MM_sr[j++]=x; if(!x.oSrc) x.oSrc=x.src; x.src=a[i+2];}
}

function updateState(user)
{
	$.ajax({
		type: "GET",
		url: "/get_update_state/"+user+"/",
		dataType: "json",
		success: function(retorno){
			if (retorno.ok)
				document.getElementById('update_state').innerHTML = retorno.msg
		}
	});

	func = "updateState(\""+user+"\")";

	setTimeout(func, 500); 
}

function removeComment(id)
{
	var resp = confirm("Deseja remover este comentario?");

	if (resp == false)
		return

	$.ajax({
		type: "GET",
		url: "/removeComment/" + id,
		dataType: "json",
		success: function(retorno){
			alert("Removido");
		}
	});
}

function encode_text(text)
{
	return $("<div/>").html(text).text();
}

function reportTip(tip_id)
{
	var msg = "Ao denunciar uma dica um de nossos administradores realizar&aacute; uma revis&atilde;o nela." + "\n\n" + "Denuncias em dicas boas ser&atilde;o punidas." + "\n\n" + "Tem certeza que deseja denunciar ?"
	var resp = confirm(encode_text(msg));

	if (resp == false)
		return

	msg = "Qual o motivo da den&uacute;ncia? (Sua resposta ser&aacute; verificada pelos moderadores)";
	var resp = prompt (encode_text(msg));

	if (resp == null || resp == "")
	{
		alert(encode_text("Den&uacute;ncia n&atilde;o efetivada."));
		return;
	}

	url = "/reportTip/"+tip_id+"/?resp=" + resp;

	$.ajax({
		type: "GET",
		url: url,
		dataType: "json",
		success: function(retorno){
			alert("Den&uacute;ncia realizada com sucesso!");
		}
	});
}

function vote(type, tip_id)
{
	if (type == "down")
	{
		var resp = prompt ("Qual o motivo da negativação? (Sua resposta será verificada pelos moderadores)","");

		if (resp == null || resp == "")
		{
			alert("Voto não computado");
			return;
		}

		url = "/vote_tip/"+type+"/" + tip_id + "/?resp=" + resp;
	}
	else
	{
		url = "/vote_tip/"+type+"/" + tip_id;
	}

	$.ajax({
		type: "GET",
		url: url,
		dataType: "json",
		success: function(retorno){

			if (retorno.erro == 1)
			{
				alert("Voce precisa estar logado para votar");
				return;
			}

			if (retorno.type == "up")
			{
				document.getElementById("up_"   + tip_id).src= "/new/media/img/check.png";
				document.getElementById("down_" + tip_id).src= "/new/media/img/vote_down.png";
			}
			else
			{
				document.getElementById("down_"   + tip_id).src= "/new/media/img/check.png";
				document.getElementById("up_" + tip_id).src= "/new/media/img/vote_up.png";
			}

			rep = document.getElementById("points_" + tip_id)
			rep.style.backgroundColor = retorno.style;
			rep.innerHTML = retorno.points;
		}
});

}
function vote_up(tip_id)
{
	vote("up", tip_id);
}

function vote_down(tip_id)
{
	vote("down", tip_id);
}

function get_trophy_tip(trophy_id)
{
	if (document.getElementById("open_trophy" + trophy_id))
	{
		//document.getElementById("corpoDica"  + trophy_id).innerHTML = "";
		$("#corpoDica"  + trophy_id).html("");
		return;
	}

	$("#corpoDica" + trophy_id).append('<tr><td align="center"><img src="/new/media/img/load.gif"></td></tr>');

	if (document.getElementById('group'))
	{
		group_name = document.getElementById('group').value;
		url =  "/get_trophy_tip/" + trophy_id + "/?group=" + group_name ;
	}
	else
	{
		url =  "/get_trophy_tip/" + trophy_id;
	}

	$.ajax({
		type: "GET",
		url: url,
		dataType: "html",
		success: function(retorno){
			$("#corpoDica" + trophy_id).html(retorno) ;
	}});
}

function get_tip(tip_id)
{
	if (document.getElementById("open_tip" + tip_id))
	{
		$("#corpoDica"  + tip_id).html("");
		return;
	}

	$("#corpoDica" + tip_id).append('<tr><td align="center"><img src="/new/media/img/load.gif"></td></tr>');

	$.ajax({
		type: "GET",
		url: "/get_tip/" + tip_id + "/",
		dataType: "html",
		success: function(retorno){
			$("#corpoDica" + tip_id).html(retorno) ;
	}});
}

function fill_trophy_list(game_id)
{

	if (game_id == "Selecione")
		return;

	$.ajax({
		type: "GET",
		url: "/game_trophy/"+game_id+"/",
		dataType: "json",
		success: function(retorno){
			var options = '';
			$.each(retorno, function(i, item){
				options += '<option value="' + item.pk + '">' + item.fields['name'] + '</option>';
			});
			$("select#selectTrophy").html(options);
		}
});
}

function boost_user(username, boost_id, action)
{

	var resp = confirm("Deseja sair deste Boost?");

	if (resp != true)
		return;

	$("#boost_" + boost_id).stop().animate({"opacity": "0.1"});

	$.ajax({
		type: "GET",
		url: "/boost_user/"+username+"/"+boost_id+"/" +action +"/",
		dataType: "json",
		success: function(retorno){

			$("#boost_" + boost_id).html("") ;
			$("#boost_sep" + boost_id).html("") ;

			if (action == "join")
			{
				$("#boost_on").append(retorno);
			}
		}
});
}

function change_user_tab_last(username, type, index, platform)
{
	if (window.type == null)
		window.type = 'Todos';


	url_index = "/rank/"+username+"/ultimos/?page=" + index + "&type=" + type

	if (type == "facil" || type == "dificil")
		url_index = "/rank/"+username+"/ultimos/?page=" + index + "&type=" + window.type + "&filter=" + type
	else
		window.type = type;

	if (platform != undefined)
		if (platform != "")
			url_index +=  "&platform=" + platform;

	//$("#user_content").html("<tr width=100% height=100% align=center><td align=center><img src=/new/media/img/load.gif></td></tr>") ;
	$("#user_content").stop().animate({"opacity": "0.1"});

	$.ajax({
		type: "GET",
		url: url_index,
		dataType: "html",
		success: function(retorno){
			$("#user_content").html(retorno) ;
			$("#user_content").stop().animate({"opacity": "1"});
		}
});
}

function change_user_friend(username, error)
{
	$("#user_content").html("<tr width=100% height=100% align=center><td align=center><img src=/new/media/img/load.gif></td></tr>") ;

	if (document.getElementById('group'))
	{
		group_name = document.getElementById('group').value;
		url =  "/rank/"+username+"/amigos/?group=" + group_name + "&error=" + error ;
	}
	else
	{
		url =  "/rank/"+username+"/amigos/?error=" + error;
	}

	$.ajax({
		type: "GET",
		url: url,
		dataType: "html",
		success: function(retorno){
			$("#user_content").html(retorno) ;
		}
});
}

function gup( name )
{
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( window.location.href );
  if( results == null )
    return "";
  else
    return results[1];
}

function change_user_tab(username, tab)
{
	location.hash = "!" + tab;

	if (document.getElementById('group'))
	{
		group_name = document.getElementById('group').value;
		url =  "/rank/"+username+"/"+tab+"/" + "/?group=" + group_name ;
	}
	else
	{
		url =  "/rank/"+username+"/"+tab+"/";
	}

	// desliga todos
	liga_desliga_link(tab);

	//try { pageTracker._trackPageview(url); } catch(e) { }

	$("#user_content").stop().animate({"opacity": "0.3"});

	var r = null;

	if (tab == "mural")
	{
		r = gup('id');
		if (r)
		{
			if (window.gone != 1)
				url += "?id="+r;
			window.gone = 1
		}
	}

	window.user_color = undefined;

	$.ajax({
		type: "GET",
		url: url,
		dataType: "html",
		success: function(retorno){
			$("#user_content").html(retorno) ;

			$("#user_content").stop().animate({"opacity": "1"});

			if (tab == 'jogos')
				sorttable.init();

			if (tab == 'perfil' || tab == 'amigos' || tab == 'amigos2' || tab == 'mural' || tab == 'badges')
			{
				try {
					jQuery("img[rel]").tooltip({ effect: 'slide' });
					jQuery("a[rel]").tooltip({ effect: 'slide' });
					jQuery("span[rel]").tooltip({ effect: 'slide' });
				} catch (e) {}
			}
			if (tab == 'amigos2')
			{
				init_mural_search();
				sorttable.init();
			}

			if (tab == 'configuracao')
			{
				/*
				try {
				new dgCidadesEstados({
					estado: $('#estado').get(0),
					cidade: $('#cidade').get(0)
				});
				} catch (e) {}
				*/
			}
			if (window.gone == 1 && r != null)
			{
				abreFecha('comment_list_' + r, 'lnk_' + r, 'Ver todos comentários');
				abreFecha('comment_' + r, '');
			}

	},
	error: function(retorno) { change_user_tab(username, 'perfil') }
});
}
function containsObject(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i] === obj) {
            return true;
        }
    }

    return false;
}

function removeItemOnce(arr, value) {
  var index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}



function change_user_game_pf(username, pf)
{
   if (!window.platform || !window.platform instanceof Array)  {
      window.platform = new Array();
   }

   if (containsObject(pf, window.platform)) {
      removeItemOnce(window.platform, pf);
   } else {
      window.platform.push(pf);
   }
	if (window.filter)
		change_user_game_filter(username, window.filter);
	else
		change_user_game_filter(username, '');
}

function change_user_game_filter(username, filter)
{
	tab = 'jogos';

	//$("#user_content").html("<tr width=100% height=100% align=center><td align=center><img src=/new/media/img/load.gif></td></tr>") ;

	$("#user_content").stop().animate({"opacity": "0.1"});

	if (document.getElementById('group'))
	{
		group_name = document.getElementById('group').value;
		url =  "/rank/"+username+"/"+tab+"/"  + filter + "/?group=" + group_name ;
	}
	else
	{
		url =  "/rank/"+username+"/"+tab+"/" + filter;
	}

	window.filter = filter;

	if (window.platform.length > 0)
		url += "/?platform=" + window.platform.join(',');

	$.ajax({
		type: "GET",
		url: url,
		dataType: "html",
		success: function(retorno){
			$("#user_content").html(retorno) ;
			$("#user_content").stop().animate({"opacity": "1"});
			sorttable.init();
		}
});
}

function enable_button(button_id)
{
	if (!document.getElementById("img_" + button_id))
		return;

	var str = document.getElementById("img_" + button_id).src;
	new_src = str.replace('On.gif', '.gif');
	document.getElementById("img_" + button_id).src = new_src;
}

function disable_button(button_id)
{
	if (!document.getElementById("img_" + button_id))
		return;

	var str = document.getElementById("img_" + button_id).src;
	document.getElementById("img_" + button_id).src = str.replace('.gif', 'On.gif');
}

function change_estado_rank(rank, cidade, page)
{
	//if (rank == window.rank && page == window.page)
	//	return;

	if ( page == 0 || page == 'busca')
	{
		if (window.cidade)
			cidade = window.cidade;

		if (window.rank)
			rank = window.rank;

		if (window.rank == "estado")
			rank = "sp";
	}

	if (page == 'busca')
	{
		page = document.getElementById('busca').value;

		if (!page)
		{
			alert('Voce deve especificar um usuario para buscar');
			return;
		}
	}

	liga_desliga_link(rank);

	old_content = $("#rank_content").html();
	$("#rank_content").html("<tr width=100% height=100% align=center><td align=center><img src=/new/media/img/load.gif></td></tr>") ;

	url = "/rank_estado/"+rank+"/?page="+page;

	if (cidade)
	{
		window.cidade = cidade;
		url = "/rank_estado/"+rank+"/?page="+page + "&cidade=" + cidade;
	}
	else
		window.cidade = "";

	$.ajax(
		{ type: "GET", url: url, dataType: "html", success: function(retorno)
			{

				if (retorno == "\"fail\"")
				{
					alert('Usuario nao encontrado');
					$("#rank_content").html(old_content);
					return;
				}

				$("#rank_content").html(retorno) ;

				window.rank = rank;
				window.page = page;

				document.title = "myPSt | Rank " + rank;

				imagePreview();

			}
});
}

function change_rank(rank, page, estado)
{
	if (rank == window.rank && page == window.page)
		return;

	if ( page == 0 || page == 'busca')
	{
		if (window.rank)
			rank = window.rank;
		else
			return;

		if (rank == 'estado')
		{
			if (page == 'busca')
				change_estado_rank('', '', 'busca');
			else
				change_estado_rank('', '', 0);
			return;
		}
	}

	if (page == 'busca')
	{
		page = document.getElementById('busca').value;

		if (!page)
		{
			alert('Voce deve especificar um usuario para buscar');
			return;
		}
	}

	liga_desliga_link(rank);

	old_content = $("#rank_content").html();
	//$("#rank_content").html("<tr width=100% height=100% align=center><td align=center><img src=/new/media/img/load.gif></td></tr>") ;
	$("#rank_content").stop().animate({"opacity": "0.1"});

	if (window.rank)
	{
		enable_button(window.rank);
	}

	disable_button(rank);

	if (document.getElementById('group'))
	{
		group_name = document.getElementById('group').value;
		url = "/rank/"+rank+"/"+page+"/?group=" + group_name;
	}
	else
	{
		url = "/rank/"+rank+"/"+page+"/";
	}

	$.ajax(
		{ type: "GET", url: url, dataType: "html", success: function(retorno)
			{

				if (retorno == "\"fail\"")
				{
					alert('Usuario nao encontrado');
					$("#rank_content").html(old_content);
					return;
				}

				$("#rank_content").html(retorno) ;
				$("#rank_content").stop().animate({"opacity": "1"});

				window.rank = rank;
				window.page = page;

				document.title = "myPSt | Rank " + rank;

				imagePreview();

			}
});
}

function change_genero_game(filter)
{
	window.genero = filter;
	p = window.page;
	window.page = 0;
	change_game_page(p);
}

function change_region_game(filter)
{
	window.region = filter;
	window.page = 0;
	change_game_page('all');
}

function change_game_filter(filter)
{
	window.filter = filter;
	p = window.page;
	window.page = 0;
	change_game_page(p);

	l_1 = '#00306a'
	l_2 = '#0076ef'

	if (filter == 'PS3')
	{
		color = '#126bd8';
	}
	else if (filter == 'VITA')
	{
		color = '#4ab049'
		l_2 = '#79d678'
		l_1 = '#319330'
	}
	else if (filter == 'Todos')
	{
		color = '#004496'
	}
	else if (filter == 'PS4')
		color = '#083174'

	$(".linha_1").css("background",l_1);
	$(".linha_2").css("background",l_2);

	document.getElementById('linha_filter').bgColor = color;
	document.getElementById('linha_filter_2').bgColor = color;
}

function change_game_page(page)
{
	if (page == window.page)
		return;

	if (!window.filter)
		window.filter = 'Todos';

	$("#game_content").stop().animate({"opacity": "0.1"});

	if (document.getElementById('group'))
	{
		group_name = document.getElementById('group').value;
		url =  "/" + group_name + "/jogos/"+page+"/" ;
	}
	else
	{
		url =  "/jogos/"+page+"/" ;
	}

	url += "?filter=" + window.filter;

	if (window.genero)
	{
		if (window.genero != -1)
		{
			url += "&gen=" + window.genero;
		}
	}

	if (window.region)
	{
		if (window.region != -1)
		{
			url += "&region=" + window.region;
		}
	}

	liga_desliga_link(page);

	$("#game_content").html("<table align=center><tr width=100% height=100% align=center><td align=center><img src=/new/media/img/load.gif></td></tr></table>") ;

	$.ajax({
		type: "GET",
		url: url,
		dataType: "html",
		success: function(retorno){

			$("#game_content").html(retorno) ;

			window.page = page;

			//document.title = "myPS3t | Jogos - " + page;

		},
		error : function(data){
			alert(data);
		}
});

$("#game_content").stop().animate({"opacity": "1"});

}

function removeTip(tip_id)
{
	var url = window.location.href;
	var resp = confirm("Deseja remover esta dica?");

	if (resp == true)
	{
		$.ajax(
			{
				type: "GET",
				url: "/remove_tip/"+tip_id+"/",
				dataType: "json",
				success: function(retorno)
				{
					if (retorno.success == true)
					{
						if (document.getElementById("corpoDica" + tip_id))
							$("#corpoDica" + tip_id).html("") ;

						if (document.getElementById("corpoDica" + retorno.trophy_id))
							$("#corpoDica" + retorno.trophy_id).html("") ;

						if (url.search("editar") != -1)
						{
							history.go(-1);
						}
						else
						{
							if (url.search("jogos") == -1)
								window.location.reload( false );

							if (url.search("mod") != -1)
								window.location = "/dicas/mod/";

							if (url.search("ver") != -1)
								history.go(-1);
						}

					}
				}
			});
	}
}

function removeTipDenuncia(tip_id)
{
	var url = window.location.href;
	var resp = confirm("Deseja remover esta denuncia?");

	if (resp == true)
	{
		$.ajax(
			{
				type: "GET",
				url: "/remove_tip_denuncia/"+tip_id+"/",
				dataType: "json",
				success: function(retorno)
				{
					if (retorno.success == true)
					{
						if (document.getElementById("corpoDica" + tip_id))
							$("#corpoDica" + tip_id).html("") ;

						if (document.getElementById("corpoDica" + retorno.trophy_id))
							$("#corpoDica" + retorno.trophy_id).html("") ;

						if (url.search("editar") != -1)
						{
							history.go(-1);
						}
						else
						{
							if (url.search("jogos") == -1)
								window.location.reload( false );

							if (url.search("mod") != -1)
								window.location = "/dicas/mod/";

							if (url.search("ver") != -1)
								history.go(-1);
						}

					}
				}
			});
	}
}

function change_have_page(game, page, filter, friend, time)
{
	//$("#game_content").html("<table align=center><tr width=100% height=100% align=center><td align=center><img src=/new/media/img/load.gif></td></tr></table>") ;
	$("#game_content").stop().animate({"opacity": "0.1"});
	liga_desliga_link(page);

	window.page = "quem_tem";

	liga_desliga_link(window.page);

	if (document.getElementById('group'))
	{
		group_name = document.getElementById('group').value;
		url =  "/jogos/"+game+"/quem_tem/?group=" + group_name +"&page=" + page ;
	}
	else
	{
		url =  "/jogos/"+game+"/quem_tem/?page=" + page;
	}

	if (filter)
		url += "&filter=" + filter;

	if (time)
		url += "&time=" + time;

	if (friend == "friend")
		url += "&user=1";

	if (filter)
	{
		if (filter == "ultimos")
			url = "/jogos/" + game + "/ultimos/?page=" + page;
	}

	$.ajax({
		type: "GET",
		url: url,
		dataType: "html",
		success: function(retorno){

			$("#game_content").html(retorno) ;
			$("#game_content").stop().animate({"opacity": "1"});

		}
});
}

function change_game_trophy(game, trophy_id)
{
	$("#game_content").html("<table align=center><tr width=100% height=100% align=center><td align=center><img src=/new/media/img/load.gif></td></tr></table>") ;

	window.page = "";

	//$('html, body').animate({scrollTop:380}, 'fast');
	error = getParameterByName('error');
	tip = getParameterByName('tip');

	if (document.getElementById('group'))
	{
		group_name = document.getElementById('group').value;
		url =  "/jogos/"+game+"/" + trophy_id + "/?group=" + group_name ;
	
		if (error)
			url += "&error=" + error;

	}
	else
	{
		url =  "/jogos/"+game+"/" + trophy_id ;

		if (error)
			url += "/?error=" + error;

	}



	$.ajax({
		type: "GET",
		url: url,
		dataType: "html",
		success: function(retorno){

			$("#game_content").html(retorno) ;

		}
});
}

function change_game_megaboost(game, boost_id)
{
	$("#game_content").html("<table align=center><tr width=100% height=100% align=center><td align=center><img src=/new/media/img/load.gif></td></tr></table>") ;

	window.page = "";

	if (document.getElementById('group'))
	{
		group_name = document.getElementById('group').value;
		url =  "/megaboost/"+game+"/" + boost_id + "/?group=" + group_name ;
	}
	else
	{
		url =  "/megaboost/"+game+"/" + boost_id;
	}

	$.ajax({
		type: "GET",
		url: url,
		dataType: "html",
		success: function(retorno){

			$("#game_content").html(retorno) ;
		}
});
}

function change_game_boost(game, boost_id)
{
	return change_game_megaboost(game, boost_id);
	$("#game_content").html("<table align=center><tr width=100% height=100% align=center><td align=center><img src=/new/media/img/load.gif></td></tr></table>") ;

	window.page = "";

	if (document.getElementById('group'))
	{
		group_name = document.getElementById('group').value;
		url =  "/boost/"+game+"/" + boost_id + "/?group=" + group_name ;
	}
	else
	{
		url =  "/boost/"+game+"/" + boost_id;
	}

	$.ajax({
		type: "GET",
		url: url,
		dataType: "html",
		success: function(retorno){

			$("#game_content").html(retorno) ;
		}
});
}

function change_edit_mode(game)
{
	$("#game_content").html("<center><table><tr width=100% height=100% align=center><td align=center><img src=/new/media/img/load.gif></td></tr></table></center>") ;

	if (document.getElementById('group'))
	{
		group_name = document.getElementById('group').value;
		url =  "/jogos/"+game+"/trofeus/?group=" + group_name + "&e=true" ;
	}
	else
	{
		url =  "/jogos/"+game+"/trofeus/?e=true" ;
	}

	$.ajax({
		type: "GET",
		url: url,
		dataType: "html",
		success: function(retorno){

			$("#game_content").html(retorno) ;

		}
});
}

function getParameterByName(name)
{
  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
  var regexS = "[\\?&]" + name + "=([^&#]*)";
  var regex = new RegExp(regexS);
  var results = regex.exec(window.location.search);
  if(results == null)
    return "";
  else
    return decodeURIComponent(results[1].replace(/\+/g, " "));
}


function change_game_section(game, page)
{
	//if (page == window.page)
	//	return;

	liga_desliga_link(page);

	$("#game_content").html("<center><table><tr width=100% height=100% align=center><td align=center><img src=/new/media/img/load.gif></td></tr></table></center>") ;

	if (document.getElementById('group'))
	{
		group_name = document.getElementById('group').value;
		url =  "/jogos/"+game+"/" + page + "/?group=" + group_name ;
	}
	else
	{
		url =  "/jogos/"+game+"/" + page + "/" ;
	}

	$.ajax({
		type: "GET",
		url: url,
		dataType: "html",
		success: function(retorno){

			//group_name = document.getElementById('game_content').innerHTML =  retorno;
			$("#game_content").html(retorno) ;

			window.page = page;

		}
});
}

function user_game_page(user_id, game_id)
{
	location.hash = "!jogos/" + game_id;
	$("#user_content").html("<tr width=100% height=100% align=center><td align=center><img src=/new/media/img/load.gif></td></tr>") ;
	//$('html, body').animate({scrollTop:320}, 'fast');
	$.ajax({
		type: "GET",
		url: "/rank/"+user_id+"/game/"+game_id+"/",
		dataType: "html",
		success: function(retorno){
			$("#user_content").html(retorno) ;

			window.tab = "";
		}
});
}


function username_onblur()
{
	if (document.getElementById("username_registro").value == "")
	{
		return;
	}

	document.getElementById("img_avatar").src = "/new/media/img/avatar_loading.gif";
	document.getElementById("img_result").src = "/new/media/img/transp.gif";
	document.getElementById("label_result").innerText = 'AGUARDE...';

	user = document.getElementById("username_registro").value;

	$.ajax({
		type: "GET",
		url: "/check_psn_user/" + user,
		dataType: "json",
		success: function(retorno)
		{
			if (retorno.result)
			{
				avatar =  retorno.pic_url; //retorno.pic_url.replace('_s','_m').replace('s.png','m.png').replace('"', '').replace('"', '');
				document.getElementById("img_avatar").src = avatar;
				document.getElementById("img_result").src = "/new/media/img/IconCadastroY.gif";
				document.getElementById("label_result").innerText = 'ID APROVADO';
			}
			else
			{
				document.getElementById("img_avatar").src = "/new/media/img/IconCadastroNo.gif";
				document.getElementById("img_result").src = "/new/media/img/IconCadastroX.gif";

				if (retorno.error == 1) {
					document.getElementById("label_result").innerHTML= 'ID JA CADASTRADO <a href="/rank/' + user + '">' + user + '</a>';
				} else if (retorno.error == 4) {
					document.getElementById("label_result").innerHTML= 'ID JA CADASTRADO <a href="/rank/' + retorno.dup_user + '">' + retorno.dup_user + '</a>';
				}
				else
				{
					document.getElementById("label_result").innerText = 'ID RECUSADO';
				}
			}
		}
});
}
function accept()
{

	if (document.getElementById("checkbox"))
	{
		if (!document.getElementById("checkbox").checked)
		{
			alert("Voce deve ler e aceitar as regras.");
			return;
		}
	}

	var resp = confirm("Você leu as regras atentamente? Cuidado, você pode perder sua conta caso quebre alguma regra");

	if (resp == true)
		document.getElementById("form1").submit();
}

function register()
{

	if (document.getElementById("checkbox"))
	{
		if (!document.getElementById("checkbox").checked)
		{
			alert("Voce deve ler e aceitar as regras.");
			return;
		}
	}

	if (document.getElementById("label_result").innerText != 'ID APROVADO')
	{
		alert("Voce deve preencher o campo ID PSN com uma ID valida.");
		return;
	}

	if (document.getElementById("password_reg_1").value != document.getElementById("password_reg_2").value)
	{
		alert("As senhas devem ser iguais.");
		return;
	}

	document.getElementById("form1").submit();
}

function change_stats_page(page)
{
	if (page == window.page)
		return;

	liga_desliga_link(page);

	document.title = "myPSt | Estatisticas - " + page.toUpperCase();

	$("#stats_content").html("<tr width=100% height=100% align=center><td align=center><img src=/new/media/img/load.gif></td></tr>") ;

	if (document.getElementById('group'))
	{
		group_name = document.getElementById('group').value;
		url =  "/stats/" + page + "/?group=" + group_name ;
	}
	else
	{
		url =  "/stats/" + page + "/";
	}

	$.ajax({
		type: "GET",
		url: url,
		dataType: "html",
		success: function(retorno){

			$("#stats_content").html(retorno) ;
			window.page = page;

		}
});
}



function update_new_user(user, group)
{
	var username = user

	//updateState(user);

	$.ajax({
		type: "GET",
		url: "/update_new_user/" + username,
		dataType: "json",
		success: function(retorno)
		{
			if (retorno == "\"fail\"")
			{
				document.getElementById("img_loading").src = "/media/nok.gif"
			}
			else
			{
				document.getElementById("img_loading").src = "/media/ok.gif";
				window.location=group + '/rank/' + username;
			}
		},
		error: function(retorno)
		{
			document.getElementById("img_loading").src = "/media/nok.gif";
			alert('Erro! Favor tentar novamente mais tarde. Se o erro persistir, entrar em contato com - admin@mypst.com.br');
			window.location=group + '/rank/' + username;
		}
});
}

function load_tip_box(game_id, trophy_id)
{
	id = "#" + game_id + "_" + trophy_id;
	if (window.open_box)
	{
		if (window.open_box == id)
			return;

		$(window.open_box).html("");
	}

	$(id).html("<tr width=100% height=100% align=center><td align=center><img src=/new/media/img/load.gif></td></tr>") ;

	$.ajax({
		type: "GET",
		url: "/get_tip_form/" + game_id + "/" + trophy_id,
		dataType: "html",
		success: function(retorno)
		{
			$(id).html(retorno);
			window.open_box = id;

		}
});
}

function post_tip(game_id, trophy_id)
{

	//tinyMCE.triggerSave();

	var params = $('#form_dica').serialize();

	//#alert(params);

	id = game_id + "_" + trophy_id;

	document.getElementById(id + "_img").src = '/new/media/img/load2.gif';

	$.ajax({
		type: 'POST',
		url: '/post_tip/' + game_id + '/' + trophy_id + '/', 
		data: params, 
		success: function(data){

			if (data.result == true)
			{

				var url = window.location.href;
				if (url.search("jogos") != -1)
				{
					document.getElementById(id + "_link").href = "Javascript:get_trophy_tip(" + data.trophy_id + ")";
					document.getElementById(id + "_link").innerHTML = data.tip_count;
					$("#td_master_" + data.trophy_id).html('<table id="corpoDica' + data.trophy_id + '" width="100%" border="0" cellpadding="0" cellspacing="0"> </table>');
					$("#corpoDica" + data.trophy_id).html('<tr><td align="center"><b><span class="txt02">Obrigado por postar!</span></b></td></tr>');
				}
				else
				{
					$("#" + id).html('<tr><td align="center"><b><span class="txt02">Obrigado por postar!</span></b></td></tr>');

					if (document.getElementById(id + "_img"))
						document.getElementById(id + "_img").src = '/new/media/img/btnPerfilModifica.gif';

					if (document.getElementById(id + "_link"))
						document.getElementById(id + "_link").href = '/dicas/editar/' + data.tip + '/';
				}

				if (url.search("dicas") != -1)
					window.location.reload( false );

			}
			else
			{
				alert(data.error);
				document.getElementById(id + "_img").src = '/new/media/img/btnPerfilPost.gif';
			}
		},
		error : function(data){
			alert('Ocorreu um erro na postagem da sua dica, favor tentar novamente');
			document.getElementById(id + "_img").src = '/new/media/img/btnPerfilPost.gif';
		}
});
}

function save_config_promo()
{

	if (!document.getElementById("checkbox").checked)
	{
		alert("Voce deve ler e aceitar as regras.");
		return;
	}

	var params = $('form').serialize();

	document.getElementById("promo_send").src = "/new/media/img/enviando.gif"

	$.ajax({
		type: 'POST',
		url: '/promo_post/', 
		data: params, 
		success: function(data){

			if (data.erro)
			{
				alert(data.erro);
				document.getElementById("promo_send").src = "/new/media/img/btnEnviarPromo.gif";
			}
			else
			{
				alert("Obrigado por participar! O vencedor sera divulgado no dia 15 de fev.");
				window.location.reload( false );
			}
		}
});
}

function save_config_data()
{
	var params = $('form').serialize();

	start_loading();

	document.getElementById("card_normal").src = "/new/media/img/load.gif";
	document.getElementById("card_hall").src = "/new/media/img/load.gif";
	document.getElementById("card_hall_psn").src = "/new/media/img/load.gif";
	document.getElementById("card_jogo").src = "/new/media/img/load.gif";

	$.ajax({
		type: 'POST',
		url: './configuracao/', 
		data: params, 
		success: function(data){
			document.getElementById("card_normal").src = "/media/card/a/" + data.user + ".png?r=" + data.random;
			document.getElementById("card_hall").src = "/media/card/a/" + data.user + "-hall.png?r=" + data.random;
			document.getElementById("card_hall_psn").src = "/media/card/a/" + data.user + "-hall-psn.png?r=" + data.random;
			document.getElementById("card_jogo").src = "/media/card/a/" + data.user + "-jogo.png?r=" + data.random;
			end_loading_ok();
		}
	});
}

/*
* Image preview script 
* powered by jQuery (http://www.jquery.com)
* 
* written by Alen Grakalic (http://cssglobe.com)
* 
* for more info visit http://cssglobe.com/post/1695/easiest-tooltip-and-image-preview-using-jquery
*
*/

this.imagePreview = function(){	
	/* CONFIG */

	xOffset = 10;
	yOffset = 30;

	// these 2 variable determine popup's distance from the cursor
	// you might want to adjust to get the right result

	/* END CONFIG */
	$("div.preview").hover(function(e){
		$("body").append("<p id='preview'><img src='"+ this.id +"' alt='Card mypst' /></p>");								 
		$("#preview")
		.css("top",(e.pageY - xOffset) + "px")
		.css("left",(e.pageX + yOffset) + "px")
		.fadeIn("fast");						
	},
	function(){
		$("#preview").remove();
	});	
	$("div.preview").mousemove(function(e){
		$("#preview")
		.css("top",(e.pageY - xOffset) + "px")
		.css("left",(e.pageX + yOffset) + "px");
	});			
};

function applyTag(obj, tag){
	obj = document.getElementById(obj);
	wrapText(obj, '['+tag+']', '[/'+tag+']');
};

function applySmile(obj, tag){
	obj = document.getElementById(obj);
	wrapText(obj, tag, ' ');
};

function replaceAll(str, de, para){
	var pos = str.indexOf(de);
	while (pos > -1){
		str = str.replace(de, para);
		pos = str.indexOf(de);
	}
	return (str);
}

function applyQuote(obj, username, id){
	obj = document.getElementById(obj);

	el = "cc" + id;

	txt = document.getElementById(el).value;

	txt = replaceAll(txt, '<br />', '\n');

	tag = '[quote ' + username + ']' + txt;
	wrapText(obj, tag, '[/quote]\n');
};

function wrapText(obj, beginTag, endTag){
	if(typeof obj.selectionStart == 'number')
	{
		// Mozilla, Opera, and other browsers
		var start = obj.selectionStart;
		var end   = obj.selectionEnd;
		obj.value = obj.value.substring(0, start) + beginTag + obj.value.substring(start, end) + endTag + obj.value.substring(end, obj.value.length);
	}
	else if(document.selection)
	{

		// Internet Explorer
		// make sure it's the textarea's selection

		obj.focus();

		var range = document.selection.createRange();

		if(range.parentElement() != obj) return false;
		if(typeof range.text == 'string')
			document.selection.createRange().text = beginTag + range.text + endTag;
	}
	else
		obj.value += text;
};
function spoiler(obj)
{
	if (obj.parentNode.parentNode.getElementsByTagName('div')[1].getElementsByTagName('div')[0].style.display != '')
	{
		obj.parentNode.parentNode.getElementsByTagName('div')[1].getElementsByTagName('div')[0].style.display = '';
		obj.innerHTML = '<b>Spoiler: </b><a class="lnk01" href=\'#\' onClick=\'return false;\'>esconder</a>';
	} 
	else
	{
		obj.parentNode.parentNode.getElementsByTagName('div')[1].getElementsByTagName('div')[0].style.display = 'none';
		obj.innerHTML = '<b>Spoiler: </b><a class="lnk01" href=\'#\' onClick=\'return false;\'>mostrar</a>';
	}
}

function showResult(key_count)
{
	str = document.getElementById("name_stop").value;

	if (str.length==0)
	{ 
		document.getElementById("search_live").innerHTML="";
		document.getElementById("livesearch").style.border="0px";
		return;
	}

	if (str.length<3)
	{ 
		return;
	}

	if(key_count != key_count_global) {
		return;
	}

	document.getElementById("livesearch").style.visibility = 'visible';
	document.getElementById("livesearch").innerHTML='<center><img src="/new/media/img/load.gif"></center>';

	if (window.XMLHttpRequest)
		{// code for IE7+, Firefox, Chrome, Opera, Safari
			xmlhttp=new XMLHttpRequest();
		}
		else
		{// code for IE6, IE5
			xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
		}

		xmlhttp.onreadystatechange=function()
		{
			if (xmlhttp.readyState==4 && xmlhttp.status==200)
			{
				txt = replaceAll(xmlhttp.responseText, '"', '');
				document.getElementById("livesearch").innerHTML=txt;
				document.getElementById("livesearch").style.visibility = 'visible';
			}
		}
		xmlhttp.open("GET","/search/"+str,true);
		xmlhttp.send();
}

function badge_action()
{
	badges = jQuery(".badge_body")

	if ( badges.size() == 0 )
		return;

	jQuery(".badge_msg").show();

	b = badges.first()
	html_id = b[0].id;

	b_id = html_id.replace(/badge_/, 'badge_id_');
	id = document.getElementById(b_id).value;
	t_id = html_id.replace(/badge_/, 'badge_type_');
	type = document.getElementById(t_id).value;

	func = "show_badge(\"" + html_id + "\", \"" + id+ "\", \"" + type + "\")";
	//alert(func);
	play_trophy();
	jQuery(b).fadeIn('slow');
	setTimeout(func, 1000*10);
	return;

}


function show_badge(html_id, id, type)
{
	$("#" + html_id).fadeOut('slow');
	func = "remove_badge(\"" + html_id + "\", \"" + id + "\", \"" + type + "\")";
	//alert(func);
	setTimeout(func, 1000);
}

function remove_badge(html_id, id, type)
{
	$("#" + html_id).remove();

	setTimeout("badge_action()", 1);

	url = "/plim_ok/" + id + "/" + type + "/";

	// Salva para nao repetir
	$.ajax({ type: "GET", url: url, dataType: "json", success: function(retorno){ } });
}


function play_trophy()
{
	sound_file_url = '/new/media/sound/TrophySound-myps3t.mp3';
	document.getElementById("sound_element").innerHTML= "<embed src='"+sound_file_url+"' hidden=true autostart=true loop=false>";
}

function init()
{
	
	setTimeout("badge_action()", 1000);

	if (!document.getElementById("name_stop"))
		return;

	key_count_global = 0; // Global variable
	document.getElementById("name_stop").value = 'Digite algo para buscar';
	document.getElementById("name_stop").onkeypress = function() {
		key_count_global++;
		setTimeout("showResult("+key_count_global+")", 1000);//Function will be called 1 second after user types anything. Feel free to change this value.
	}
}

function game_boost(game_id)
{
	document.getElementById("game_pic").src ='/new/media/img/load.gif';
	//document.getElementById("game_trophy_list").innerHTML = '<tr><td align="center"><img src="/new/media/img/load.gif"></td></tr>';
	document.getElementById("game_name").innerHTML = "";
	document.getElementById("error").innerHTML = "";

	$.ajax({
		type: "GET",
		url: "/game_trophy_boost/" + game_id + "/",
		dataType: "json",
		success: function(retorno)
		{
			document.getElementById("game_pic").src ='/media/game/' + retorno.game_psn_id + '/icon.png';
			document.getElementById("game_pic").width = 100;
			document.getElementById("game_name").innerHTML = retorno.game_name;
			window.psn_id = retorno.game_psn_id;

			if (retorno.game_boost_count > 0)
			{

				if (retorno.game_boost_count > retorno.can_have)
				{
					document.getElementById("error").innerHTML = "Ja existem " + retorno.game_boost_count+ " boosts criados para este jogo ! Verifique <a href='/jogos/" + retorno.game_psn_id + "/?index=boost'>aqui</a>.<br/> A criacao de novos boost esta desabilitada.";
					document.getElementById("error").style.color = "red";
					document.getElementById("game_trophy_list").innerHTML = "";
					document.getElementById("dlc_trophy").innerHTML = "";
					return;
				}
				else
				{
					document.getElementById("error").innerHTML = "Ja existem " + retorno.game_boost_count+ " boosts criados para este jogo ! Verifique <a href='/jogos/" + retorno.game_psn_id + "/?index=boost'>aqui</a> antes de criar um novo. No total podem ser criados " + retorno.can_have + " boosts para este jogo.";
					document.getElementById("error").style.color = "yellow";
				}
			}
			else
			{
				document.getElementById("error").innerHTML = "Nao existem boosts para este jogo! Voce pode criar o seu!";
				document.getElementById("error").style.color = "green";
			}

			document.getElementById("game_trophy_list").innerHTML = retorno.game_trophy_html;
			document.getElementById("dlc_trophy").innerHTML = retorno.dlc_trophy;
			window.total = 0;
		}
});
}

function add_trophy(trophy_id)
{
	if (!window.total)
		window.total = 0;

	var td   = document.getElementById("td_" + trophy_id);
	var span = document.getElementById("trophy_" + trophy_id);
	var img  = document.getElementById("img_" + trophy_id);

	if (span.value == 1)
	{
		img.src = '/new/media/img/sim.png';
		img.title = 'Adicionar ao boost';

		span.value = 0;

		td.bgColor = '#383838';
		window.total -= 1;
	}
	else
	{
		if (window.total == 13)
		{
			alert('Limite de 13 trofeus por boost')
			return;
		}

		img.src = '/new/media/img/nao.png';
		img.title = 'Remover do boost';
		span.value = 1;
		td.bgColor = '#023363';
		window.total += 1;
	}
}

function show_hide_dlc(dlc_id)
{
	dlc_table = document.getElementById("table_dlc_" + dlc_id);
	dlc_img = document.getElementById("img_dlc_" + dlc_id);

	if (dlc_table.style.display == '')
	{
		dlc_table.style.display = 'none';
		dlc_img.src = '/new/media/img/imgBoostDw.gif';
		dlc_img.title = 'Exibir trofeus da DLC';
	}
	else
	{
		dlc_table.style.display = '';
		dlc_img.src = '/new/media/img/imgBoostUp.gif';
		dlc_img.title = 'Esconder trofeus da DLC';
	}
}

function save_boost()
{
	if (window.total == null)
	{
		alert("Selecione um jogo para comecar a criar seu boost");
		return;
	}

	if (window.total <= 0)
	{
		alert("Voce precisa selecionar trofeus para seu boost");
		return;
	}

	var name = document.getElementById("boost_name").value;

	if (!name)
	{
		alert("Seu boost precisa de um nome!");
		return;
	}

	var desc = document.getElementById("boost_desc").value;

	if (!desc)
	{
		alert("Seu boost precisa de uma descricao!");
		return;
	}

	var str = "";

	jQuery.each($("span"), function() {
		if (this.id.match("^trophy") == "trophy")
		{
			if (this.value == 1)
				str += this.id + ",";
		}
	});

	var param = "trophy_list=" + str.substring(0, str.length-1) + "&name=" + encodeURIComponent(name) + "&desc=" + encodeURIComponent(desc) + "&psn_id=" + window.psn_id;

	token = $('input[name=csrfmiddlewaretoken]').val();

	param += "&csrfmiddlewaretoken=" + token;

	//alert(param);
	var img_save = document.getElementById("img_save")
	img_save.src = '/new/media/img/load.gif';

	var link_save = document.getElementById("link_save")
	link_save.href ='#';

	$.ajax({
		type: 'POST',
		url: '/boost_wizard/', 
		data: param, 
		success: function(data){
			//alert(data.friend_have);

			if (data.friend_have != null)
			{
				document.getElementById("friend_have").innerHTML = data.friend_have;
				javascript:scroll(0,0);
			}
			else
			{
				window.location.href = data.boost_url;
			}
			return;
		},
		error : function(data){
			alert("Erro!");
		}
});
}

function change_comment_page(page)
{
	type = window.comment_type;
	id = window.comment_id;

	url = '/paginate_comments/' + type + '/' + id + '/?page=' + page;
	jQuery("#comment_list").stop().animate({"opacity": "0.1"});

	jQuery.ajax({
		type: "GET",
		url: url,
		dataType: "html",
		success: function(retorno){
			document.getElementById("comment_list").innerHTML = retorno;
			jQuery("#comment_list").stop().animate({"opacity": "1"});
			imagePreview();
		}
});
}

function load_comment(type, id)
{
	window.comment_type = type;
	window.comment_id = id;

	change_comment_page(0);
}

function auto_change(user)
{
	tab = location.hash.replace("#!", "");

	if (tab == "_#_")
		tab = 'configuracao';

	l = tab.split('/');

	if (l[0] == 'jogos') {
		if (l[1])
		{
			user_game_page(user, l[1])
			return;
		}
	}

	if (l[0] == 'ultimos') {
		if (l[1]) {
			change_user_tab_last(user, l[1], 1, 'None');
			return;
		} else {
			change_user_tab_last(user, 'Todos', 1, 'None');
			return;
		}
	}

	if (tab) {
		change_user_tab(user, tab);
		return 0;
	}
	return 1;
}

function show_obj_detail(track)
{
	jQuery.each($("span"), function() {
		if (this.id.match("^obj") == "obj")
		{
			if (this.id == "obj_" + track)
			{
				this.style.display = '';
			}
			else
			{
				this.style.display = 'none';
			}
		}
	});
}

function change_preco_country(game, country)
{
	url = "/jogos/" + game + "/preco/?&country=" + country;

	$("#game_content").stop().animate({"opacity": "0.1"});

	$.ajax({
		type: "GET",
		url: url,
		dataType: "html",
		success: function(retorno){
			$("#game_content").html(retorno) ;
		}});

		$("#game_content").stop().animate({"opacity": "1"});

}

function change_preco_region(game, region)
{

	url = "/jogos/" + game + "/preco/?&region=" + region;

	$("#game_content").stop().animate({"opacity": "0.1"});

	$.ajax({
		type: "GET",
		url: url,
		dataType: "html",
		success: function(retorno){
			$("#game_content").html(retorno) ;
		}});

		$("#game_content").stop().animate({"opacity": "1"});
}

function change_preco_page(filter, content, page)
{
	$("#game_content").stop().animate({"opacity": "0.1"});

	if (filter != "")
		url = "/jogos/price/?" + filter + "=" + content + "&page=" + page;
	else
		url = "/jogos/price/?&page=" + page;

	$.ajax({
		type: "GET",
		url: url,
		dataType: "html",
		success: function(retorno){
			$("#game_content").html(retorno) ;
		}});

		$("#game_content").stop().animate({"opacity": "1"});
}

function boost_calendar(year, month, boost_id)
{
	$("#calendar_content").stop().animate({"opacity": "0.1"});

	url = '/calendar/' + boost_id + '/' + month + '/' + year + '/'

	$.ajax({
		type: "GET",
		url: url,
		dataType: "html",
		success: function(retorno){
			$("#calendar_content").html(retorno) ;
		}});

		$("#calendar_content").stop().animate({"opacity": "1"});
}

function create_event(date, boost)
{
	var params = $('form').serialize();
	var url =  '/new_event/' + date + "/" + boost + "/";

	$.post(url, params , 
		function(retorno)
		{
			//year = date.substring(0,4)
			//month = date.substring(5,7)

			parent.jQuery.fancybox.close();
			change_game_megaboost(retorno.game, retorno.boost_id);
			//boost_calendar(year, month, boost);
		}
	);
}

function join_event(event_id)
{
	$.ajax({
		type: "GET",
		url: "/view_event/" + event_id + "/join/",
		dataType: "json",
		success: function(retorno){
			alert("Parabens;! Voce agora faz parte deste evento!");
			parent.jQuery.fancybox.close();
			change_game_megaboost(retorno.game, retorno.boost_id);
		}
});
}

function change_user_boost(type, boost_id)
{
	$.ajax({
		type: "GET",
		url: "/join_quit_boost/" + type + "/" + boost_id + "/",
		dataType: "json",
		success: function(retorno){
			if (retorno.ok == true)
			{
				if (retorno.type == "join")
					alert ("Agora voce faz parte deste boost!");

				change_game_megaboost(retorno.game_id, retorno.boost_id)
			}
			else
				alert ("ERRO - favor entrar em contato com a Administracao!");
		}
});
}

/*
Author:		Robert Hashemian (http://www.hashemian.com/)
Modified by:	Munsifali Rashid (http://www.munit.co.uk/)
*/


function countdown(obj)
{
	this.obj		= obj;
	this.Div		= "clock";
	this.BackColor		= "white";
	this.ForeColor		= "black";
	this.TargetDate		= "12/31/2020 5:00 AM";
	this.DisplayFormat	= "%%D%% Days, %%H%% Hours, %%M%% Minutes, %%S%% Seconds.";
	this.CountActive	= true;

	this.DisplayStr;

	this.Calcage		= cd_Calcage;
	this.CountBack		= cd_CountBack;
	this.Setup		= cd_Setup;
}

function cd_Calcage(secs, num1, num2)
{
	s = ((Math.floor(secs/num1))%num2).toString();
	if (s.length < 2) s = "0" + s;
	return (s);
}
function cd_CountBack(secs)
{
	if (secs < 0)
	{
		myDiv = "clock1";
		document.getElementById(myDiv).innerHTML = "Evento iniciado!";
		return;
	}

	this.DisplayStr = this.DisplayFormat.replace(/%%D%%/g,	this.Calcage(secs,86400,100000));
	this.DisplayStr = this.DisplayStr.replace(/%%H%%/g,		this.Calcage(secs,3600,24));
	this.DisplayStr = this.DisplayStr.replace(/%%M%%/g,		this.Calcage(secs,60,60));
	this.DisplayStr = this.DisplayStr.replace(/%%S%%/g,		this.Calcage(secs,1,60));

	document.getElementById(this.Div).innerHTML = this.DisplayStr;
	if (this.CountActive) setTimeout(this.obj +".CountBack(" + (secs-1) + ")", 990);
}
function cd_Setup()
{
	var dthen	= new Date(this.TargetDate);
	var dnow	= new Date();
	ddiff		= new Date(dthen-dnow);
	gsecs		= Math.floor(ddiff.valueOf()/1000);
	this.CountBack(gsecs);
}

function mural_page(username, page, type, append, friend)
{
	//ver_mais = document.getElementById('ver_mais');

	if (friend == undefined && document.getElementById('my_profile'))
	{
		if (window.friend == undefined)
			window.friend = 1;

		friend = window.friend;
	}
	else
		window.friend = friend;

	if (!append)
	{
		$("#mural_entry").html('<img src="/new/media/img/load.gif">');
		$("#ver_mais").attr("href", "#")
	}
	else
	{
		$("#ver_mais").removeClass('menu_link');
		$("#ver_mais").html('<img class="menu_link_on" src="/new/media/img/load.gif">');
	}

	liga_desliga_link(type);

	if (friend == 1)
	{
		$("#todas").addClass('menu_link_on');
		$("#minhas").removeClass('menu_link_on');
		url =  "/mural_friends/?page=" + page + "&type=" + type;
	}
	else
	{
		$("#minhas").addClass('menu_link_on');
		$("#todas").removeClass('menu_link_on');
		url =  "/mural_page/?user=" + username + "&page=" + page + "&type=" + type;
	}

	$.ajax(
	{
		type: "GET",
		url: url,
		dataType: "html",
		success: function(retorno)
		{

			if (retorno == "" || retorno.length == 1)
			{
				$("#ver_mais").html('Sem mais registros...');
				$("#ver_mais").attr("href", "#")

				if (append != 1)
					$("#mural_entry").html("<center><img src='/new/media/img/mural/why.jpg'></center>");

				return;
			}

			if (append == 1)
			{
				ht = $("#mural_entry").html() ;
				ht += retorno;
			}
			else
				ht = retorno;	

			$("#mural_entry").html(ht) ;

			next_page = parseInt(page)+1;

			if (friend == 1)
				next = "Javascript:mural_page(''                 ," + next_page + ", '" + type + "', " + 1 + ")"
			else
				next = "Javascript:mural_page('" + username + "', " + next_page + ", '" + type + "', " + 1 + ")"

			$("#ver_mais").attr("href", next)
			$("#ver_mais").html('Ver Mais...');
			$("#ver_mais").addClass('menu_link');

			jQuery("img[rel]").tooltip({ effect: 'slide' });
			jQuery("a[rel]").tooltip({ effect: 'slide' });
		}
	});
}

function send_message(user)
{

	var params = $('#form_msg').serialize();

	/*
	old = document.getElementById("btn_img").src;
	document.getElementById("btn_img").src = '/new/media/img/load2.gif';
	*/
	text = document.getElementById("comment_txt_");
	if (text.value == text.defaultValue || text.value == "")
	{
		alert("Digite algo! :)");
		return;
	}

	$.ajax({
		type: 'POST',
		url: '/send_message/' + user + '/',
		data: params, 
		dataType: "html",
		success: function(data){
			abreFecha('user_comment');
			text.value = text.defaultValue;
			document.getElementById('mural_entry').innerHTML = data + document.getElementById('mural_entry').innerHTML;
			jQuery("img[rel]").tooltip({ effect: 'slide' });
			jQuery("a[rel]").tooltip({ effect: 'slide' });
			imagePreview();
		},
		error : function(data){
			alert('Ocorreu um erro na postagem da sua mensagem, favor tentar novamente mais tarde');
			//document.getElementById("btn_img").src = old;
		}
});
}

function send_message_game(user)
{

	var params = $('#form_msg').serialize();

	/*
	old = document.getElementById("btn_img").src;
	document.getElementById("btn_img").src = '/new/media/img/load2.gif';
	*/
	text = document.getElementById("comment_txt_");
	if (text.value == text.defaultValue || text.value == "")
	{
		alert("Digite algo! :)");
		return;
	}

	$.ajax({
		type: 'POST',
		url: '/send_message_game/' + user + '/',
		data: params, 
		dataType: "html",
		success: function(data){
			text.value = text.defaultValue;
			document.getElementById('mural_game').innerHTML = data + document.getElementById('mural_game').innerHTML;
			rQuery("img[rel]").tooltip({ effect: 'slide' });
			jQuery("a[rel]").tooltip({ effect: 'slide' });
			imagePreview();
		},
		error : function(data){
			alert('Ocorreu um erro na postagem da sua mensagem, favor tentar novamente mais tarde');
			//document.getElementById("btn_img").src = old;
		}
});
}

function post_comment(url, form_id)
{

	var params = $('#form_' + form_id).serialize();

	btn = "btn_img_" + form_id

	old = document.getElementById(btn).src;
	document.getElementById(btn).src = '/new/media/img/load2.gif';

	$.ajax({
		type: 'POST',
		url: url,
		data: params, 
		success: function(data){
			$("#comment_" + form_id).html('<tr><td align="center"><b><span class="txt02">Coment&aacute;rio enviado!</span></b></td></tr>');
		},
		error : function(data){
			alert('Ocorreu um erro na postagem da sua dica, favor tentar novamente');
			document.getElementById(btn).src = old;
		}
	});
}

function liga_desliga_link(liga)
{
	// desliga todos
	$(".menu_link").css("background","");
	$(".menu_link").css("border"    ,"");
	$(".menu_link").css("border-radius", "");

	// liga o atual
	$("#" + liga).css("background"   , "#015ecf");
	$("#" + liga).css("border"       , " solid thick #015ecf");
	$("#" + liga).css("border-radius", "0.5em");
}

function mural_send_comment(mural_id)
{
	text = document.getElementById("comment_txt_" + mural_id);
	if (text.value == text.defaultValue || text.value == "")
	{
		alert("Digite algo! :)");
		return;
	}

	var params = $('#form_' + mural_id).serialize();

	$("#comment_txt_" + mural_id).attr("disabled", "disabled");
	var location= $('#comment_lnk_' + mural_id).attr("href");
	$("#comment_lnk_" + mural_id).removeAttr('href');

	url = '/mural_send_comment/' + mural_id + '/';

	$.ajax({
		type: 'POST',
		url: url,
		data: params, 
		dataType: "html",
		success: function(data){
			// fecha a box de comentar
			abreFecha('comment_' + mural_id);

			// Deixa a msg default, caso o usuario queira postar mais
			text.value = text.defaultValue;

			// Apenda o comentario atual
			new_comment = document.getElementById("mural_new_comment_" + mural_id)
			new_comment.innerHTML += data;

			imagePreview();
			$("#comment_txt_" + mural_id).removeAttr("disabled");
			$("#comment_lnk_" + mural_id).attr("href", location);
		},
		error : function(data){
			alert('Ocorreu um erro na postagem do seu comentário, favor tentar novamente');
		}
	});
}

function accept_friend(friend_id)
{
	me = document.getElementById('me').value;

	url = '/accept_friend/' + friend_id;

	$.ajax({
		type: 'GET',
		url: url,
		dataType: "json",
		success: function(data){

			alert(data.msg);

			if (data.success)
			{
				change_user_tab(me, 'amigos2');
				return;
			}

			return;

		},
		error : function(data){
			alert('Ocorreu um erro , favor tentar novamente');
		}
	});
}

function del_tracks()
{
	var data = [];

	num = $("input:checked").length

	if (num == 0 )
	{
		alert("Nenhum track selecionado...");
		return;
	}

	var resp = confirm("Deseja remover " + num + " track(s)?");

	if (resp == false)
		return

	$('input:checked').each(function(){
		var me = $(this);
		var id = me.attr("id").split('_');
		data.push(id[1])

	});

	url = '/track/del/?list=' + data;

	$("#ret").html(url);

	$.ajax({
		type: 'GET',
		url: url,
		dataType: "json",
		success: function(data){
			alert("Registros removidos!");
			$('input:checked').remove()
		},
		error : function(data){
			alert("Erro! Tente novamente");
			window.location.reload( false );
		}
	});

}

function del_friends(type)
{
	me = document.getElementById('me').value;

	var params = $('form#del_friend_form').serialize();

   var $b = $('input[type=checkbox]');
   count = $b.filter(':checked').length; // works

	if (count == 0)
	{
		alert("Selecione os usuarios que deseja remover");
		return;
	}

	if (count == 1)
		var resp = confirm("Você deseja remover este usuario?");
	else
		var resp = confirm("Você deseja remover estes " + count + " usuários?");

	if (!resp)
		return;

	url = '/del_friend/';

	$.ajax({
		type: 'POST',
		url: url,
		data: params, 
		dataType: "json",
		success: function(data){

			alert(data.msg);

			if (data.success)
			{
				change_user_tab(me, 'amigos2');
				return;
			}

			return;

		},
		error : function(data){
			alert('Ocorreu um erro, favor tentar novamente');
		}
	});
}

function del_request()
{
	me = document.getElementById('me').value;

	var params = $('form#del_request_form').serialize();

   var $b = $('input[type=checkbox]');
   count = $b.filter(':checked').length; // works

	if (count == 0)
	{
		alert("Selecione as requisicoes que deseja negar");
		return;
	}

	if (count == 1)
		var resp = confirm("Você deseja negar estas solicitacoes?");
	else
		var resp = confirm("Você deseja negar a solicitacao destes " + count + " usuários?");

	if (!resp)
		return;

	url = '/del_request/';

	$.ajax({
		type: 'POST',
		url: url,
		data: params, 
		dataType: "json",
		success: function(data){

			alert(data.msg);

			if (data.success)
			{
				change_user_tab(me, 'amigos2');
				return;
			}

			return;

		},
		error : function(data){
			alert('Ocorreu um erro, favor tentar novamente');
		}
	});
}

function new_friend(type, username)
{

	if (username == undefined)
		username = document.getElementById('friend_name_box').value;

	me = document.getElementById('me').value;

	if (username == "")
	{
		alert("Voce deve digitar um nome de usuario");
		return;
	}

	var params = $('form#add_friend_form').serialize();

	params += "&type=" + type;

	url = '/add_friend/';

	$.ajax({
		type: 'POST',
		url: url,
		data: params, 
		dataType: "json",
		success: function(data){

			alert(data.msg);

			if (data.success)
			{
				if (document.getElementById('header'))
					window.location = "/rank/" + me + "/?page=amigos2";
				else
					change_user_tab(me, 'amigos2');
				return;
			}

			return;

		},
		error : function(data){
			alert('Ocorreu um erro, favor tentar novamente');
		}
	});
}

function del_mural(mural_id)
{
	var resp = confirm("Você deseja apagar esta entrada?");

	if (!resp)
		return;

	url = '/del_mural/' + mural_id;

	$.ajax({
		type: 'GET',
		url: url,
		dataType: "json",
		success: function(data){

			if (data.ok)
			{
				$("#" + mural_id).hide();
			}
			else
				alert(data.msg);

			return;

		},
		error : function(data){
			alert('Ocorreu um erro , favor tentar novamente');
		}
	});
}

function del_comment_mural(cm_id)
{
	var resp = confirm("Você deseja apagar este comentário?");

	if (!resp)
		return;

	url = '/del_comment_mural/' + cm_id;

	$.ajax({
		type: 'GET',
		url: url,
		dataType: "json",
		success: function(data){

			if (data.ok)
			{
				$("#" + cm_id).hide();
			}
			else
				alert(data.msg);

			return;

		},
		error : function(data){
			alert('Ocorreu um erro , favor tentar novamente');
		}
	});
}

function del_track(track_id, username)
{
	var resp = confirm("Você deseja apagar este track?");

	if (!resp)
		return;

	url = '/track/del/' + track_id + '/?ref=mural/';

	$.ajax({
		type: 'GET',
		url: url,
		dataType: "json",
		success: function(data){

			if (data.ok)
			{
				parent.jQuery.fancybox.close();
				mural_page(username, 1, 7    );
			}
			else
				alert(data.msg);

			return;

		},
		error : function(data){
			alert('Ocorreu um erro , favor tentar novamente');
		}
	});
}

function mural_showResult(key_count)
{
	str = document.getElementById("friend_name_box").value;

	if (str.length==0)
	{ 
		document.getElementById("user_livesearch").innerHTML="";
		document.getElementById("user_livesearch").style.border="0px";
		return;
	}

	if (str.length<3)
	{ 
		return;
	}

	if(key_count != key_count_user_global) {
		return;
	}

	document.getElementById("user_livesearch").style.visibility = 'visible';
	document.getElementById("user_livesearch").innerHTML='<center><img src="/new/media/img/load.gif"></center>';

	if (window.XMLHttpRequest)
		{// code for IE7+, Firefox, Chrome, Opera, Safari
			xmlhttp=new XMLHttpRequest();
		}
		else
		{// code for IE6, IE5
			xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
		}

		xmlhttp.onreadystatechange=function()
		{
			if (xmlhttp.readyState==4 && xmlhttp.status==200)
			{
				txt = replaceAll(xmlhttp.responseText, '"', '');
				document.getElementById("user_livesearch").innerHTML=txt;
				document.getElementById("user_livesearch").style.visibility = 'visible';
			}
		}
		xmlhttp.open("GET","/search_user/"+str,true);
		xmlhttp.send();
}

function init_mural_search() {

	if (!document.getElementById("friend_name_box"))
		return;

	key_count_user_global = 0; // Global variable
	document.getElementById("friend_name_box").onkeypress = function() {
		key_count_user_global++;
		setTimeout("mural_showResult("+key_count_user_global+")", 1000);//Function will be called 1 second after user types anything. Feel free to change this value.
	}
}

function select_friend(friend, avatar)
{
	if (location.pathname.indexOf('mensagens') == 1)
		addUserDestinatario(friend, avatar);
	else
	{
		document.getElementById('friend_name_box').value=friend;
		document.getElementById('user_livesearch').style.visibility='hidden';
	}


	return;
}

function user_search_mural_timeout(mural_id)
{
	el = "comment_txt_" + mural_id;

	if (!document.getElementById(el))
		return;

	window.key_count_user_global = 0; // Global variable

	document.getElementById(el).onkeypress = function() {
		window.key_count_user_global++;
		setTimeout("user_search_mural("+ mural_id + ")", 1000);//Function will be called 1 second after user types anything. Feel free to change this value.
	}
}

function user_search_mural(mural_id)
{
	var start=/@/ig; // @ Match
	var word=/@(\w+)/ig; //@abc Match

	if (mural_id == undefined)
		mural_id = '';

	var el=$("#comment_txt_" + mural_id); //Content Box Data
	var textbox = el;
	var content = el.val();

   var end = textbox.getSelection().end;
   var result = /\S+$/.exec(document.getElementById('comment_txt_' + mural_id).value.slice(0, end));
   var lastWord = result ? result[0] : null;

	name = lastWord;

	var go = name.match(start); //Content Matching @

	if (!go)
		return;

	//If @ available
	if(go.length>0)
	{
		if (window.key_count_user_global<= 3)
			return false;

		//if @abc avalable
		if(name.length>3)
		{
			window.key_count_user_global = 0;
			$("#comment_txt_" + mural_id).attr("disabled", "disabled");
			$.ajax({
				type: "GET",
				url: "/search_user/" + name + "/?mural=1&mural_id=" + mural_id,
				cache: false,
				success: function(data)
				{
					document.getElementById("display_" + mural_id).style.visibility = 'visible';
					$("#msgbox_" + mural_id).hide();
					if (data == "")
						$("#display_" + mural_id).html("Nenhum usu&aacute;rio encontrado!").show();
					else
						$("#display_" + mural_id).html(data).show();

					$("#comment_txt_" + mural_id).removeAttr("disabled");
				}
		});
		}
	}
	return false;
}

function select_user_from_search_mural(friend_search, friend, mural_id)
{
	if (mural_id == undefined)
		mural_id = '';

	var textbox=$("#comment_txt_" + mural_id); //Content Box Data
   var end = textbox.getSelection().end;
   var result = /\S+$/.exec(document.getElementById('comment_txt_' + mural_id).value.slice(0, end));

	if (result)
		friend_search = result[0];

   var textarea = document.getElementById("comment_txt_" + mural_id);

	textarea.value =  textarea.value.replace(friend_search, '@' + friend);
	$("#display_" + mural_id).hide();
}

function search_game(type)
{
	if (type == 'SEM' || type == 'LAN')
	{
		name = type
		type = 'col';
	}
	else
	{
		name = document.getElementById('game_name').value;
	}
	url = '/search_game/' + name + '/' + type;

	$("#game_list").html("Aguarde...");

	$.ajax({
		type: 'GET',
		url: url,
		dataType: "html",
		success: function(data)
		{
			// fecha a box de comentar
			$("#game_list").html(data);
		},
		error : function(data){
			alert('Ocorreu um erro na postagem do seu comentário, favor tentar novamente');
		}
	});
}

function salvar_guia()
{

	s = document.getElementById('saving')
	s.innerHTML = 'Salvando... aguarde.';

	var params = $('form').serialize();

	url = $("#form").attr('action'); 

	$.ajax({
		type: 'POST',
		url: url,
		data: params, 
		dataType: "json",
		success: function(data){
			s.innerHTML = 'Salvo!';
		},
		error : function(data){
			alert('Ocorreu um erro, favor parar de fazer cagadas :D');
		}
	});

}

var addUrlParam = function(url, key, value){

	s = key + '=' + value;

	var ret = url.indexOf("?");

	if (ret != -1)
		url += '&';
	else
		url += '?';

	return url + s;
};

function gen_rank_url(liga)
{
	url_rank = '/new_rank/'

	for (var i in h) {

		if (h[i] == "") continue;

		e = h[i].split(':');

		type = e[0];

		if (e[0] == 'busca')
		{
			window.filter_busca = e[1];
			url_rank = addUrlParam(url_rank, 'busca', e[1]);
		}

		if (e[0] == 'ago')
		{
			window.filter_ago = e[1];
			url_rank = addUrlParam(url_rank, 'ago', e[1]);
		}

		if (e[0] == 'me')
		{
			window.filter_me = e[1];
			url_rank = addUrlParam(url_rank, 'me', true);
		}

		if (e[0] == 'amigos')
		{
			window.filter_amigos = e[1];
			url_rank = addUrlParam(url_rank, 'amigos', true);
		}

		if (e[0] == 'r')
		{
			type = 'rank';
			window.filter_rank = e[1];
			url_rank = addUrlParam(url_rank, 'type', e[1]);
		}

		if (e[0] == 'page')
		{
			window.rank_page = e[1];
			url_rank = addUrlParam(url_rank, 'page', e[1]);
		}

		if (e[0] == 'R')
		{
			type = 'regiao';
			window.filter_regiao = e[1];
			url_rank = addUrlParam(url_rank, e[0], e[1]);
		}

		if (e[0] == 's')
		{
			type = 'date_start';
			window.filter_date_start = e[1];
			url_rank = addUrlParam(url_rank, e[0], e[1]);
		}

		if (e[0] == 'meninas')
		{
			window.filter_meninas = true;
			url_rank = addUrlParam(url_rank, e[0], e[1]);
		}

		if (e[0] == 'p')
		{
			type = 'periodo';
			window.filter_periodo = e[1];
			url_rank = addUrlParam(url_rank, e[0], e[1]);
		}

		if (e[0] == 't')
		{
			type = 'trofeu';
			window.filter_trofeu = e[1];
			url_rank = addUrlParam(url_rank, e[0], e[1]);
		}

		if (e[0] == 'uf')
		{
			type = 'estado';
			window.filter_estado = e[1];
			url_rank = addUrlParam(url_rank, e[0], e[1]);
			//mostraEstado();
		}

		if (e[0] == 'cidade')
		{
			window.filter_cidade = e[1];
			url_rank = addUrlParam(url_rank, e[0], e[1]);
			//mostraEstado();
		}

		if (e[0] == 'grupo')
		{
			window.filter_grupo = e[1];
			url_rank = addUrlParam(url_rank, e[0], e[1]);
			$("#grupo_select").val(e[1]);
			//mostraEstado();
		}

		if (e[0] == 'badge')
		{
			window.filter_badge = e[1];
			url_rank = addUrlParam(url_rank, e[0], e[1]);
		}


		if (liga)
			liga_desliga_link_rank(type, e[1]);

	}

	return url_rank;
}

function  gen_xls()
{
	url = gen_rank_url(false);
	url = addUrlParam(url_rank, "xls", 1);
	window.location = url;
}

function load_rank_from_hash()
{

	var re_hash = false;

	hash = location.hash;
	h = hash.replace("#!", "")
	h = h.split(';')

	url_rank = gen_rank_url(true);

	if (window.filter_regiao == 'estadual' && !window.filter_estado)
	{
		window.filter_regiao = false;
	}

	if (window.filter_estado)
		mostraEstado();

	if (!window.filter_rank)
	{
		re_hash = true;
		window.filter_rank = 'geral';
	}

	if (!window.filter_trofeu)
	{
		re_hash = true;
		window.filter_trofeu = 'all';
	}

	if (!window.filter_regiao || (window.filter_regiao == 'grupo' && !window.filter_grupo))
	{
		re_hash = true;
		window.filter_regiao = 'brasil';
		escondeEstado();
	}

	if (re_hash)
	{
		rank_hash();
		load_rank_from_hash();
		return
	}

	$("#rank_content").stop().animate({"opacity": "0.1"});
	$("#rank_name").html(url_rank);

	$.ajax({
		type: "GET",
		url: url_rank,
		dataType: "html",
		success: function(retorno){

			if (retorno.indexOf("ERRO:") == 0)
				alert(retorno);
			else
				$("#rank_content").html(retorno);

			$("#rank_content").stop().animate({"opacity": "1"});
			//pageTracker._trackPageview(url_rank);
		}
});

//$(document).scrollTop( $("#header").offset().top - 50 );  

}

function rank_hash()
{
	r = "";

	if (!window.filter_periodo)
		window.filter_ago = false;

	if (window.filter_rank)
		r += "r:" + window.filter_rank + ";";

	if (window.filter_badge)
		r += "badge:" + window.filter_badge + ";";

	if (window.filter_busca)
		r += "busca:" + window.filter_busca+ ";";

	if (window.filter_me)
		r += "me:true;";

	if (window.filter_amigos)
		r += "amigos:true;";

	if (window.rank_page)
		r += "page:" + window.rank_page+ ";";

	if (window.filter_regiao)
		r += "R:" + window.filter_regiao + ";";

	if (window.filter_date_start)
		r += "s:" + window.filter_date_start + ";";

	if (window.filter_meninas)
		r += "meninas:true;";

	if (window.filter_ago)
		r += "ago:" + window.filter_ago + ";";

	if (window.filter_periodo)
		r += "p:" + window.filter_periodo + ";";

	if (window.filter_trofeu)
		r += "t:" + window.filter_trofeu + ";";

	if (window.filter_estado)
		r += "uf:" + window.filter_estado + ";";

	if (window.filter_cidade)
		r += "cidade:" + window.filter_cidade + ";";

	if (window.filter_grupo)
		r += "grupo:" + window.filter_grupo + ";";

	location.hash = "!" + r;
}

function change_badge_site(user, badge)
{
	//if (badge == 'jogo')
	//	badge = 'site';
	// desliga todos
	$(".s_badge").hide()

	// desliga todos
	$(".site_badge").css("background","#005eba");

	b_list = badge.split('_')

	for (var i in b_list) {
		// liga o atual
		$("#" + b_list[i]).css("background", "#75B100");
		$("#s_" + b_list[i]).show()
	}
}

function change_tab(tab)
{
	// desliga todos
	$(".tab_link").css("background","#005eba");

	b_list = tab.split('_')

	$(".tab").hide();

	for (var i in b_list) {
		// liga o atual
		$("#" + b_list[i]).css("background", "#75B100");
		$("#c_" + b_list[i]).show()
	}
}

function liga_lista_badge(badge) {
	$(".badge_aba").css("background","#005eba");
	$(".last_aba").css("background","#005eba");
	$("#" + badge).css("background", "#75B100");
	$("." + badge).css("background", "#75B100");

	b_list = badge.split('_')

	for (var i in b_list) {
		$("#" + b_list[i]).css("background", "#75B100");
	}
}

function change_lista_badge(badge) {

	liga_lista_badge(badge);

	start_loading();

	url = badge + "/";

	$.ajax({
		type: "GET",
		url: url,
		dataType: "html",
		success: function(retorno){
			end_loading_ok();
			$("#content").html(retorno);
			$("#content").show();
		},
		error: function(retorno) {
			end_loading_nok();
		}
	});
}

function change_badge(user, badge)
{
	if (badge == "site" || badge == "portal")
		badge = "site_portal";

	if (badge == "forum")
		badge = "site_forum";

	// desliga todos
	$(".badge").css("background","#005eba");

	b_list = badge.split('_')

	for (var i in b_list) {
		// liga o atual
		$("#" + b_list[i]).css("background", "#75B100");
		$("#c_" + b_list[i]).show()
	}

	url = "/rank/"+user+"/badges/" + badge;

	$("#c_badge").html('<center><img src="/new/media/img/load.gif"><center>');

	$.ajax({
		type: "GET",
		url: url,
		dataType: "html",
		success: function(retorno){
			$("#c_badge").html(retorno);
			$("#c_badge").show();
		}
});
}

function like(mural_id)
{
	c = document.getElementById("like_" + mural_id);
	c.innerHTML = 'Aguarde';
	$.ajax({
		type: "GET",
		url: "/like/"+mural_id+"/",
		dataType: "json",
		success: function(retorno){
			if (retorno.ok)
			{
				x = document.getElementById("like_count_" + mural_id);
				x.innerHTML = retorno.count;
				c.innerHTML = 'Curti!';
			}
			else
			{
				if (retorno.error)
					alert(retorno.error);
				c.innerHTML = 'Curtir';
			}
		}
});
}

function set_filter(type, rank)
{
	window.rank_page = false;
	window.filter_me = false;
	window.filter_busca = false;

	if (type == 'busca')
		rank = $("#busca").val();

	f = ""
	eval("f = window.filter_" + type);

	if ( f == rank )
	{
		if ( type == 'rank' )
			return;
		else
		{
			str = "window.filter_" + type + " = false";
			liga_desliga_link_rank(type, false);
		}
	}
	else
	{
		str = "window.filter_" + type + " = \"" + rank + "\"";

		if (type == 'perido')
		{
			if (window.filter_periodo != rank)
				window.filter_ago = false;
		}

		if (type == 'cidade')
		{
			window.filter_uf = false;
			window.filter_regiao = 'estado';
		}

		if (type == 'grupo')
		{
			window.filter_regiao = 'grupo';
			window.filter_cidade = false;
			escondeEstado();
		}

		if (type == 'estado')
		{
			window.filter_cidade = false;
			window.filter_grupo = false;
			$("#grupo_select").val('false');
		}

		if (type == 'regiao')
		{
			window.filter_cidade = false;
			window.filter_grupo = false;
			$("#grupo_select").val('false');
		}
	}

	if (type == 'grupo' && rank == 'false')
	{
		window.filter_grupo = false;
	}
	else if (type == 'cidade' && rank == '0')
	{
		window.filter_cidade = false;
	}
	else if (type == 'amigos' && window.filter_amigos)
	{
		window.filter_amigos = false;
	}

	else
		eval(str);

	rank_hash();
	load_rank_from_hash()
}

function change_rank_page(page)
{
	window.filter_busca = false;
	window.filter_me = false;
	window.rank_page = page;
	rank_hash();
	load_rank_from_hash()
}

function liga_desliga_link_rank(type, liga)
{
	// desliga todos
	if (liga == false)
	{
		desliga_link(liga, type);
		return;
	}

	if (liga == true || liga == "true")
	{
		liga_link(type, type);
		return;
	}

	desliga_link(liga, type);
	liga_link(liga, type);
}

function liga_link(liga, type)
{
	c = "filter_" + type;
	el = $("#" + liga);

	if (type == 'trofeu')
	{
		//el.addClass("filter_fix_" + liga);
		el.removeClass("trofeu_opacity");
		$("#bar").removeClass();
		$("#bar").addClass("filter_fix_" + liga);
		return;
	}

	if (el.hasClass(c))
	{
		el.addClass("filter_fix_" + type);
	}
	else
	{
		el.css("background"   , "#015ecf");
		el.css("border"       , " solid thick #015ecf");
		el.css("border-radius", "0.5em");
	}
}

function desliga_link(liga, tag)
{
	if (tag == 'trofeu')
	{
		c = 'trofeu';
	}
	else
	{
		c = "filter_" + tag;
		d = "filter_fix_" + tag;
	}
	// desliga todos
	$("." + tag + ", #" + tag).each(function ()
	{
		el = $(this);
		if (el.hasClass(c))
		{
			if (el.hasClass('trofeu'))
			{
				//css = "filter_fix_" + $(el)[0].id;
				$(el).addClass('trofeu_opacity');
			}
			else
				$(el).removeClass(d);
		}
		else
		{
			$(el).css("background","");
			$(el).css("border"    ,"");
			$(el).css("border-radius", "");
		}
	});
}

function muda_on_off(my_class, liga)
{
	$(".filter_fix").each(function() {
		$(this).removeClass("filter_fix");
	});

	$("." + my_class).each(function() {
		lnk = $("#lnk_" + this.id);
		if (this.id == liga)
		{
			$(this).addClass('filter_fix');
		}
	});
}

function liga_desliga_link_filter_trofeu(liga)
{
	muda_on_off("filter_trofeu", liga);
}

function start_teste(id)
{
	//alert("window.atual: " + window.atual + " id: " + id);

	if (window.atual)
	{
		if (window.atual == id)
		{
			//alert("OK!");
			return;
		}
	}

	window.myTimeout = setTimeout("teste(" + id + ")", 500);
}

function kill_teste()
{
	clearTimeout(window.myTimeout);
}

function set_dif(tag, up, down, dest)
{
	v_up   = $("#" + tag + "_" +   up).html().replace(/\./g,'').replace(/,/g, '');
	v_down = $("#" + tag + "_" + down).html().replace(/\./g,'').replace(/,/g, '');

	dif = v_up - v_down;

	d = $("#" + tag + "_" + dest + "_" + row);

	if (dif  > 0)
	{
		dif = "+" + intcomma(dif);
		d.addClass('txt_rank_up_dif');
	}
	else
	{
		d.addClass('txt_rank_down_dif');
	}

	d.html(intcomma(dif));

}

function intcomma(value) {
	// inspired by django.contrib.humanize.intcomma
	var origValue = String(value);
	var newValue = origValue.replace(/^(-?\d+)(\d{3})/, '$1.$2');
	if (origValue == newValue){
		return newValue;
	} else {
		return intcomma(newValue);
	}
};


function teste(id)
{
	window.atual = id;

	//alert("show: " + id);
	row = id

	$(".added_row").hide();

	up   = $("#" + row + "_1");
	down = $("#" + row + "_2");

	try
	{
		set_dif("points"  , row, row-1, "1");
		set_dif("total"   , row, row-1, "1");
		set_dif("bronze"  , row, row-1, "1");
		set_dif("silver"  , row, row-1, "1");
		set_dif("gold"    , row, row-1, "1");
		set_dif("platinum", row, row-1, "1");
		set_dif("pdm"     , row, row-1, "1");
		$(up).slideToggle("fast");
		$(up).addClass('added_row');
		//} catch (e) { alert(e) };
} catch (e) { };

try
{
	set_dif("points"  , row, row+1, "2");
	set_dif("total"   , row, row+1, "2");
	set_dif("bronze"  , row, row+1, "2");
	set_dif("silver"  , row, row+1, "2");
	set_dif("gold"    , row, row+1, "2");
	set_dif("platinum", row, row+1, "2");
	set_dif("pdm"     , row, row+1, "2");
	$(down).slideToggle("fast");
	$(down).addClass('added_row');
	//} catch (e) {alert(e) };
} catch (e) { };
}

function user_badge_game_page(user, game_id)
{
	url = '/rank/' + user + '/mygames/' + game_id;

	$("#c_badge").html('<center><img src="/new/media/img/load.gif"><center>');

	$.ajax({
		type: "GET",
		url: url,
		dataType: "html",
		success: function(retorno){
			$("#c_badge").html(retorno);
			$("#c_badge").show();
		}
});
}

function change_memoria_rank(type, page)
{
	url = '/memoria_rank_content/?page=' + page + '&type=' + type;

	$("#rank_content").stop().animate({"opacity": "0.1"});

	liga_desliga_link(type);

	$.ajax({
		type: "GET",
		url: url,
		dataType: "html",
		success: function(retorno){
			$("#rank_content").html(retorno);
			$("#rank_content").stop().animate({"opacity": "1"});
		}
});
}

function open_video(v_id)
{
	return;
}

function start_interval()
{
	if (window.video_interval)
		clearInterval(window.video_interval);

	window.video_interval = setInterval(function() {
		show_next_video();
	}, 5000);
}

function click_activate_video(v_id)
{
	activate_video(v_id);

	start_interval();
}

function activate_video(v_id)
{
	window.actual_video = v_id;
	v = get_data_from_video_id(v_id);

	if (v == undefined)
		return;

	jQuery("#youtube_big").bind('mouseover', function() { open_video(v_id)});
	jQuery("#youtube_desc").html(v[2].substr(0, 40));

	image = jQuery("#youtube_big")
	image.fadeOut('fast', function () {
		jQuery('#youtube_big_td').css({
			'background-image'  : 'url(' + v[1] + ')',
			'background-size'   : '244px 160px',
		'background-repeat' : 'no-repeat'})
		image.fadeIn('fast');
	});

	jQuery("#youtube_big").attr("src", '/new/media/img/img_player.png');

	jQuery(document).ready(function() {
		url = '/show_video?video=' + v[0] + '&desc=' + encodeURIComponent(v[2]);

		jQuery("#youtube_big").click(function() {
			$.fancybox({
				'padding'		: 0,
				'autoScale'		: false,
				'transitionIn'	: 'none',
				'transitionOut': 'none',
				'width'			: 700,
				'height'		   : 530,
				'href'			: url,
				'type'			: 'ajax',
				'scrolling'   : 'no',
				'onStart': function() {
					$('#fancybox-outer').css({'background':'transparent'});
					$('#fancybox-bg-n,#fancybox-bg-ne,#fancybox-bg-e,#fancybox-bg-se,#fancybox-bg-s,#fancybox-bg-sw,#fancybox-bg-w,#fancybox-bg-nw').css({'background-image':'none'})},
			}).click();

			return false;
		});
	});
}

function get_video_id_from_url(url)
{
	return url.replace('http://www.youtube.com/watch?v=', '').replace('&feature=youtube_gdata', '').replace('https://www.youtube.com/watch?v=', '');
}

function get_data_from_video_id(id)
{
	return window.video_list[parseInt(id)];
}

function show_video_thumb()
{

	v_list = window.video_list_rotate

	for (var i in v_list)
	{
		v = get_data_from_video_id(v_list[i]);
		jQuery("#youtube_" + i).attr("src", v[1]);
		jQuery("#youtube_" + i).data("v_id", v_list[i]);
		a = function() { click_activate_video($(this).data('v_id'))};
		jQuery("#youtube_" + i).bind('mouseover', a);
	}
}

function next_list_of_videos()
{
	if (window.video_list_rotate[0] == 0)
		window.video_list_rotate = [3, 4, 5];
	else
		window.video_list_rotate = [0, 1, 2];

	show_video_thumb();

	activate_video(window.video_list_rotate[0]);

	start_interval();
}

function show_next_video()
{
	n = window.actual_video;
	v = window.video_list_rotate;
	f = 0;
	l = 0;

	for (var i in v)
	{
		if ( f == 1 )
		{
			l = 1;
			break;
		}

		if (v[i] == n)
			f = 1;
	}

	if ( l == 1)
		activate_video(v[i]);
	else
		activate_video(v[0]);
}

function get_latest_videos()
{
	url = 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=UUMBo0HerpMR4bo_m9CunMwg&key=***REMOVED***&maxResults=6'
	jQuery.getJSON(url,
		function(response){
			v_id_1 = response.items[0].snippet.resourceId.videoId;
			v_id_2 = response.items[1].snippet.resourceId.videoId;
			v_id_3 = response.items[2].snippet.resourceId.videoId;
			v_id_4 = response.items[3].snippet.resourceId.videoId;
			v_id_5 = response.items[4].snippet.resourceId.videoId;
			v_id_6 = response.items[5].snippet.resourceId.videoId;

			thumb_1 = response.items[0].snippet.thumbnails.default.url
			thumb_2 = response.items[1].snippet.thumbnails.default.url
			thumb_3 = response.items[2].snippet.thumbnails.default.url
			thumb_4 = response.items[3].snippet.thumbnails.default.url
			thumb_5 = response.items[4].snippet.thumbnails.default.url
			thumb_6 = response.items[5].snippet.thumbnails.default.url

			desc_1 = response.items[0].snippet.title;
			desc_2 = response.items[1].snippet.title;
			desc_3 = response.items[2].snippet.title;
			desc_4 = response.items[3].snippet.title;
			desc_5 = response.items[4].snippet.title;
			desc_6 = response.items[5].snippet.title;

			window.video_list = [
				[ v_id_1, thumb_1, desc_1 ] ,
				[ v_id_2, thumb_2, desc_2 ] ,
				[ v_id_3, thumb_3, desc_3 ] ,
				[ v_id_4, thumb_4, desc_4 ] ,
				[ v_id_5, thumb_5, desc_5 ] ,
				[ v_id_6, thumb_6, desc_6 ] ,
			]
			window.video_list_rotate = [0, 1, 2, 3, 4, 5];

			show_video_thumb();
			activate_video(0);
			start_interval();

/*
			url = 'http://gdata.youtube.com/feeds/api/users/tvgameover/uploads/?alt=json';

			jQuery.getJSON(url,
				function(response){
					v_id_1  = get_video_id_from_url(response.feed.entry[0].link[0].href);
					thumb_1 = response.feed.entry[0].media$group.media$thumbnail[0].url;
					desc_1  = response.feed.entry[0].title.$t;
					window.video_list[2] = [ v_id_1, thumb_1, desc_1 ];
					window.video_list_rotate = [0, 1, 2];

					show_video_thumb();
					activate_video(0);
					start_interval();
				}
			);
*/

		}
	);
}

function mostraAvancado()
{
	$('#avancado').toggle();
}

function estado()
{
	if ($("#estado_list").is(":visible"))
	{
		escondeEstado();
		set_filter('regiao', 'brasil');
	}
	else
		mostraEstado();
}

function escondeEstado()
{
	$('#estado_list').hide();

	if (window.filter_estado)
	{
		window.filter_estado = false;
		liga_desliga_link_rank('estado', false);
	}

	window.filter_cidade = false;

	//set_filter('regiao', 'brasil');

}

function mostraEstado()
{
	$('#estado_list').show();
	liga_desliga_link_rank('regiao', 'estadual');
	window.filter_regiao = 'estadual';
}

function mural_game(game_id, type, page)
{
	var app = false;

	if (type == -1)
	{
		app = true;

		if (!window.type)
			window.type = 'all';

		if (!window.m_page)
			window.m_page = 1;

		type = window.type;
		page = window.m_page + 1;

		$("#ver_mais").removeClass('menu_link');
		$("#ver_mais").html('<img class="menu_link_on" src="/new/media/img/load.gif">');
	}
	else
		$("#mural_game").stop().animate({"opacity": "0.1"});

	window.type = type;
	window.m_page = page;
	window.game_id = game_id;

	url = '/mural_game/' + game_id + "/?type=" + type + "&page=" + page;

	liga_desliga_link(type);

	$.ajax({
		type: "GET",
		url: url,
		dataType: "html",
		success: function(retorno){

			if (retorno.length == 1)
				$("#ver_mais").html('Sem registros :(');
			else
			{
				next = "Javascript:mural_game(" + game_id + ", -1)"
				$("#ver_mais").attr("href", next)
				$("#ver_mais").html('Ver Mais...');
				$("#ver_mais").addClass('menu_link');
			}

			if (app)
			{
				$("#mural_game").append(retorno);
			}
			else
				$("#mural_game").html(retorno);

			$("#mural_game").stop().animate({"opacity": "1"});
		},
		error: function(retorno)
		{
			$("#ver_mais").html('Sem registros :(');
		}
});
}

function follow_game(game_id)
{
	url = '/follow_game/' + game_id
	$.ajax({
		type: 'GET',
		url: url,
		dataType: "json",
		success: function(data){
			if (data.ok)
			{
				alert("Agora as mensagens aqui postadas tambem aparecerao no seu mural");
				$("#follow_button").hide()
			}
		},
		error : function(data){
			alert('Ocorreu um erro, favor tentar novamente mais tarde');
		}
	});
}

function unfollow_game(game_id)
{
	url = '/unfollow_game/' + game_id
	$.ajax({
		type: 'GET',
		url: url,
		dataType: "json",
		success: function(data){
			if (data.ok)
			{
				alert("Voce parou de seguir este jogo... :/");
				$("#follow_button").hide()
			}
		},
		error : function(data){
			alert('Ocorreu um erro, favor tentar novamente mais tarde');
		}
	});
}

function set_pais(pais_id)
{
	if (pais_id == -1)
		return;

	if (pais_id == "-1")
		return;

	if (pais_id == 35)
	{
		set_estado(-1);
		$('#estado').show();
		$('#cidade').show();
	}
	else
	{
		$('#estado').hide();
		$('#cidade').hide();
	}
}

function set_estado(estado_id, cidade_id)
{
	if (estado_id == -1)
	{
		$('#cidade').html("").show();
		return;
	}

	if (estado_id == "-1")
	{
		$('#cidade').html("").show();
		return;
	}

	url = '/get_cidades/' + estado_id + '/';
	$('#cidade').hide();
	$('.carregando').show();
	$.getJSON(url, function(j){
		var options = '<option value=""></option>';	
		for (var i = 0; i < j.length; i++) {
			options += '<option ';
			if (cidade_id) {
				if (j[i].pk == cidade_id) options += " SELECTED ";
			}
			options += 'value="' + j[i].pk;
			options += '">' + j[i].fields.nome+ '</option>';
	}	
	$('#cidade').html(options).show();
	$('.carregando').hide();
	})
}

function change_news(self)
{
	id = parseInt(self.id) - 1;
	$('#painel_link').html(window.news_list[id][0]);
	$("#painel_link").attr("href", window.news_list[id][1]);

	if (window.news_list[id][3])
		$("#painel_link").attr('target','_blank');
	else
		$("#painel_link").attr('target',false);

	$('#painel_date').html(window.news_list[id][2]);
	$(".painel_small").css({ opacity: 0.5 });
	p_id = id+1
	$("#painel_small_" + p_id).css({ opacity: 1 });
}

function painel_onMouseOver(id)
{
	if (!window.shift)
		return;

	window.shift(id-1);
	window.stop_clock();
	a = { "id" : id };
	change_news(a);
}
function painel_onMouseOut()
{
	if (window.start_clock)
		window.start_clock();
}

function start_trophy()
{
	changeAbaTrofeu('BGSTrofeus');
	window.trophy_interval = setInterval(function() {
		change_trophy();
	}, 5000);
}

function change_trophy()
{
	tests = $("." + window.aba_trofeu)
	show   = $(tests).filter(':visible')
	hidden = $(tests).filter(':hidden')
	show.last().hide("1")
	hidden.first().insertBefore(show.first());
	hidden.first().show("3");
	show.last().insertAfter(hidden.last());
}

function change_trophy()
{
	rotaciona_elementos("." + window.aba_trofeu)
}

function rotaciona_elementos(elemento, direcao)
{
	tests = elemento;
	show   = $(tests).filter(':visible')
	hidden = $(tests).filter(':hidden')
	show.last().hide("1")
	hidden.first().insertBefore(show.first());
	hidden.first().show("3");
	show.last().insertAfter(hidden.last());
}

function changeAbaTrofeu(aba)
{
	if(window.location.href.indexOf("/badges") > -1)
		size = 8;
	else
		size = 10;

	$(".BGSTrofeus").hide();
	$("." + aba).slice(0, size).show();
	window.aba_trofeu = aba;
}

function start_check_update(task_id, username, group)
{
	check_update(task_id, username, group);
	window.update_interval = setInterval(function() {
		check_update(task_id, username, group);
	}, 5000);
}

function check_update(task_id, username, group)
{
	url = '/check_async_update/' + task_id + '/';
	$.ajax({
		type: 'GET',
		url: url,
		dataType: "json",
		success: function(data){
			h = $("#task_id").html() + '<br/>'
			$("#task_id").html( h + JSON.stringify(data));

			if (data.status == 'SUCCESS')
			{
				clearInterval(window.update_interval);
				window.update_interval = 0;
				document.getElementById("img_loading").src = "/media/ok.gif";

				if (group)
					window.location = group + '/rank/' + username;
				else
					window.location = '/rank/' + username;
			}
			else if (data.status == 'FAILURE')
			{
				document.getElementById("img_loading").src = "/media/nok.gif"
				clearInterval(window.update_interval);
				window.update_interval = 0;
			}
		},
		error : function(data){
			clearInterval(window.update_interval);
			if (window.update_interval != 0)
				alert('Ocorreu um erro, favor tentar novamente mais tarde');
		}
	});
}

function postComment(this_form, e)
{
	var $form = $(this_form);

	$.ajax({
		type     : "POST",
		cache    : false,
		url      : $form.attr('action'),
		data     : $form.serializeArray(),
		success  : function(data) {
			change_comment_page(0);
			e.preventDefault();
			return false;
		}
	});
	e.preventDefault();
	return false;
}

function aspectRatio(size)
{
	SIZE_MAX = [ 700, 525 ];

	if (size[0] > SIZE_MAX[0])
	{
		new_size = [0, 0];
		new_size[0] = SIZE_MAX[0]
		a = (size[1] / size[0]) * SIZE_MAX[0]
		new_size[1] = a
		return new_size;
	}

	return size;
}

function ajaxUpload(this_form)
{
	vars = $("#" + this_form).serializeArray();

	if ($("#link")[0].value == "")
	{
		alert("Coloque a URL de uma imagem.");	
		return;
	}

	start_loading();

	$.ajax({
		type     : "POST",
		cache    : false,
		url      : '/ajaxUpload/',
		data     : vars,
		success  : function(data) {
			size = aspectRatio(data.size)

			end_loading_ok();

			link = data.url + "?" + data.ret[0];
			$("#target").attr('src'   , link);
			//$("#target").attr('width' , 800);
			//$("#target").attr('height', 600);
			$("#target").attr('width' , size[0]);
			$("#target").attr('height', size[1]);

			$(".jcrop-holder").remove()
			jcrop_api = $.Jcrop('#target',
			{ 
			keySupport: false,
         onSelect:    updateCoords,
         aspectRatio: 399/130,
         bgColor:     'black',
         boxWidth: size[0], boxHeight: size[1],
			trueSize: data.size,
         bgOpacity:   .4
			});
			jcrop_api.setImage(link); 
			$("#crop_form").show();
		},
		error: function(retorno)
		{
			alert("Ocorreu um erro, verifique se a URL essta correta.");	
			end_loading_nok();
		}
	});
}

function ajaxCrop(this_form)
{
	vars = $("#" + this_form).serializeArray();

	start_loading();

	$.ajax({
		type     : "POST",
		cache    : false,
		url      : '/ajaxCrop/',
		data     : vars,
		success  : function(data) {
			if (data.ok) {
				end_loading_ok();
				$("#final_bg").css('background-image', "url(" + data.url + ")");
				card_alterado();
			} else {
				end_loading_nok();
				if (data.msg) {
					alert(data.msg);
				}
			}
		},
		error: function(retorno)
		{
			alert("Ocorreu um erro, tente novamente.");	
			end_loading_nok();
		}
	});
}

function toggle_fundo(el)
{
	card_alterado();
	$(".fundo").not(el).attr("checked", false);
	//$(el).attr("checked", true);

	x = $(el)[0].value;

	$(".fundo_div").slideUp( "slow");
	//$("#" + x).show();
	$("#" + x).slideToggle('slow', 'linear');
}

function toggle_time(el)
{
	card_alterado();
	 var el;
    var f = el.options[el.selectedIndex].value;    

	if (f == "0")
		return;

	url = 'http://mypst.com.br/media/cards_times/' + f + '.png';
	url = url.replace(/ /g, '_');
	$("#final_bg").css('background-image', "url(" + url + ")");
}

function toggle_game(el)
{
	card_alterado();

	 var el;
    var f = el.options[el.selectedIndex].value;    

	if (f == "0")
		return;

	url = "/get_game_bg/" + f + "/";

	$.ajax({
		type: 'GET',
		url: url,
		dataType: "json",
		success: function(data){
			$("#final_bg").css('background-image', "url(" + data.img + ")"); 
		}
	});
}

function toggle_last(type)
{
	card_alterado();

	el = $("#img_last_" + type)[0];
	url = el.value;
	$("#final_bg").css('background-image', "url(" + url + ")"); 
}

// enable = 0 | desligou
// enable = 1 | ligou
// enable = 2 | trocou o bloco
function repos_elements(c, v, enable)
{
	console.log("repos_elements: c = " + c + " v = " + v + " enable = " + enable);
	// Avatar
	if (c == "bloco0")
	{
		if (v == "bloco0-grande")
		{
			// Bloco 1 fica mais baixo
			$("div[id=bloco1-jogando]").css("top", 60);
			$("div[id=bloco1-jogando]").css("height", 52);
			$("div[id=bloco1-jogando]").css("background-size", "53px 52px");

			$("div[id=bloco1-badges]").css("top", 60);
			$("div[id=bloco1-badges]").css("height", 52);
			$("div[id=bloco1-badges]").css("background-size", "53px 52px");
			// ----
			bg_jg  = $("div[id=bloco1-jogando]").css("background-image").replace('jogando2', 'jogando');
			bg_ba  = $("div[id=bloco1-badges]" ).css("background-image").replace('badges2' , 'badges');
			$("div[id=bloco1-jogando]").css("background-image", bg_jg);
			$("div[id=bloco1-badges]" ).css("background-image", bg_ba);

			bg_jg = $("#bloco1-jogando-img").attr("src").replace('jogando2', 'jogando');
			bg_ba = $("#bloco1-badges-img").attr("src").replace('badges2', 'badges');
			$("#bloco1-jogando-img").attr("src", bg_jg)
			$("#bloco1-badges-img").attr("src", bg_ba)

			$("#bloco1-jogando-img").attr("height", 52)
			$("#bloco1-badges-img").attr("height", 52)

			$("#username" ).css("left", 60);
			$("#frase").css("left", 60);

			// Se algum bloco1 ativo, nao move os outros
			if ($("input[class=bloco1]:checked").length > 0)
				return

			// Bloco 2 vai para direita
			$("div[id=bloco2-platinas]").css("left", 60);
			$("div[id=bloco2-trofeus]" ).css("left", 60);
			$("div[id=bloco2-trofeus2]").css("left", 60);

			// Bloco 3 vai para direita tb
			$("div[id=bloco3-esquerda]" ).css("left", "+=55");
		}
		else
		{
			// Bloco 1 fica mais alto
			$("div[id=bloco1-jogando]").css("top", 36);
			$("div[id=bloco1-jogando]").css("height", 76);
			$("div[id=bloco1-jogando]").css("background-height", 76);
			$("div[id=bloco1-jogando]").css("background-size", "53px 76px");

			$("div[id=bloco1-badges]").css("top", 36);
			$("div[id=bloco1-badges]").css("height", 76);
			$("div[id=bloco1-badges]").css("background-height", 76);
			$("div[id=bloco1-badges]").css("background-size", "53px 76px");

			bg_jg  = $("div[id=bloco1-jogando]").css("background-image").replace('jogando', 'jogando2');
			bg_ba  = $("div[id=bloco1-badges]" ).css("background-image").replace('badges' , 'badges2');
			$("div[id=bloco1-jogando]").css("background-image", bg_jg);
			$("div[id=bloco1-badges]" ).css("background-image", bg_ba);
	
			bg_jg = $("#bloco1-jogando-img").attr("src").replace('jogando', 'jogando2');
			bg_ba = $("#bloco1-badges-img").attr("src").replace('badges', 'badges2');
			$("#bloco1-jogando-img").attr("src", bg_jg)
			$("#bloco1-badges-img").attr("src", bg_ba)

			$("#bloco1-jogando-img").attr("height", 76)
			$("#bloco1-badges-img").attr("height", 76)

			// ----
			//
			$("#username" ).css("left", 50);
			$("#frase").css("left", 34);
			
			// Se algum bloco1 ativo, nao move os outros
			if ($("input[class=bloco1]:checked").length > 0)
				return

			// Bloco 2 vai para esquerda
			$("div[id=bloco2-platinas]").css("left", 5);
			$("div[id=bloco2-trofeus]" ).css("left", 5);
			$("div[id=bloco2-trofeus2]").css("left", 5);

			// Bloco 3 vai para esquerda tb
			if ($("div[id=bloco3-esquerda]" ).css("left").replace('px', '') > 10)
				$("div[id=bloco3-esquerda]" ).css("left", "-=55");
		}
	}

	if (c == "bloco1")
	{

		// Se for deste tamanho, ele nao atrapalha os outros
		if ($("#bloco1-badges").css("height") == "52px")
			return;

		if (enable == 1)
		{
			$("div[id=bloco3-esquerda]"  ).css("left", "+=55");
			$("div[id=bloco2-platinas]"  ).css("left", "+=55");
			$("div[id=bloco2-trofeus]"   ).css("left", "+=55");
			$("div[id=bloco2-trofeus2]"  ).css("left", "+=55");
		}
		else if (enable == 0)
		{
			if ($("div[id=bloco3-esquerda]" ).css("left").replace('px', '') > 10)
				$("div[id=bloco3-esquerda]" ).css("left", "-=55");

			if ($("div[id=bloco2-platinas]"  ).css("left").replace('px', '') > 10)
			{
				$("div[id=bloco2-platinas]"  ).css("left", "-=55");
				$("div[id=bloco2-trofeus]"   ).css("left", "-=55");
				$("div[id=bloco2-trofeus2]"  ).css("left", "-=55");
			}
		}
	}

	if (c == "bloco2")
	{
		if (enable == 1)
			$("div[id=bloco3-esquerda]").css("left", "+=51");
		else if (enable == 0)
			if ($("div[id=bloco3-esquerda]" ).css("left").replace('px', '') > 10)
				$("div[id=bloco3-esquerda]").css("left", "-=51px");
	}
}

function toggle_bloco(el)
{
	card_alterado();

	e = $(el)[0];
	c = e.className;
	v = e.name;

	f = $("." + c).not('input')
	r = $(f).filter(function() { return $(this).css("display") != "none" })

	$(f).hide();
	$("input[class='" + c + "']").attr("checked", false);

	if (r.length == 1 && c != "bloco0")
	{
		if ($(r)[0].id == e.name)
		{
			repos_elements(c, v, 0);

			if (e.name == "bloco1-badges")
				$("#div_badges").slideUp( "slow");

			return;
		}
	}

	if (r.length == 0)
		repos_elements(c, v, 1);
	else
		if ($(r)[0].id != e.name)
			repos_elements(c, v, 2);

	if (c == "bloco2")
		$("div[id=bloco3-esquerda]").css("left", "113px");

	if (c == "bloco1")
	{
		if (v == "bloco1-badges")
			$("#div_badges").slideToggle('slow', 'linear');

		else
			$("#div_badges").slideUp( "slow");
	}

	$(el).get(0).checked = true;//attr("checked", true);
	$("div[id='" + v + "']").show();
}

function toggle_arredondado(liga)
{
	card_alterado();

	$(".arredonda").each(function ()
	{
		if ($(this)[0].localName == "div")
			bg = $(this).css('background-image')
		else
			bg = $(this)[0].src;

		if (bg.search('redondo') != -1)
			redondo = true;
		else
			redondo = false;

		if (redondo && liga)
			return;

		if (!redondo && !liga)
			return;

		if (liga)
			bg = bg.replace(".png", "-redondo.png");
		else
			bg = bg.replace("-redondo", "");

		if ($(this)[0].localName == "div")
			$(this).css('background-image', bg);
		else
			$(this).attr("src", bg);

		if ($(this).css('display') != 'none')
		{
			$(this).hide();
			$(this).slideToggle("slow");
		}
	}
	);
}

function toggle_independente(el)
{
	card_alterado();

	e = $(el)[0];
	c = e.className;
	v = e.name;

	f = $("div[id='" + v + "']")
	r = $(f).filter(function() { return $(this).css("display") != "none" })

	$(f).hide();

	if (r.length == 1 || (v == "cantos" && e.checked == false))
	{
		$(f).attr("checked", false);

		if (v == "cantos")
		{
			toggle_arredondado(false)
		}

		if (v == "sec")
			$("#div_sec").slideUp( "slow");

		return;
	}

	if (v == "cantos")
	{
		toggle_arredondado(true);
	}

	if (v == "sec")
		$("#div_sec").slideToggle('slow', 'linear');

	$(el).attr("checked", true);
	$("div[id='" + v + "']").show();
}

function card_alterado()
{
	try
	{
		if (window.load_complete)
			$("#card_gerado_message").html("<span style='color: #ffd800;font-weight:bold;'>Card alterado! &Eacute; necess&aacute;rio clicar novamente no GERAR CARD!</span>");
	}
	catch (e) {};
}

function toggle_color(cor)
{
	e = $(cor)[0]
	c = e.className;
	v = e.value;

	card_alterado();

	if (window.user_color != undefined)
		color_change = window.user_color;
	else
		color_change = undefined;

	window.user_color = v;

	$("input[class='" + c + "']").not(cor).attr("checked", false);
	$(cor).get(0).checked = true;

	$(".color_change").each(function ()
	{
		if ($(this)[0].localName == "div")
			bg = $(this).css('background-image')
		else
			bg = $(this)[0].src;

		if (typeof color_change != "undefined")
			bg = bg.replace(color_change, window.user_color);
		else
			bg = bg.replace("card-custom", "card-custom/" + v);

		if ($(this)[0].localName == "div")
			$(this).css('background-image', bg);
		else
			$(this).attr("src", bg);

		if ($(this).css('display') != 'none')
		{
			$(this).hide();
			$(this).slideToggle("slow");
		}
	}
	);
}

function show_badge_card(el)
{
	e = $(el)[0]
	name = e.name;
	value = e.value;

	if (name == "badge_x")
	{
		if (value != "espec")
		{
			$(".select_badge").hide();
			return;
		}

		try { x = $("input[name=badge]:checked")[0].value } catch(e) { x = false };

		if (x)
			$("select[id=select_" + x + "]").show();
	}
	else if (name == "badge")
	{

		if (value == "todas")
		{
			$("input[value=espec]").attr('disabled',true);
			$("input[value=espec]").attr('checked',false);
			$(".select_badge").hide();
		}
		else
			$("input[value=espec]").attr('disabled',false);

		try { a = $("input[name=badge_x]:checked")[0].value; } catch(e) { a = false };

		if (a == "espec")
		{
			$(".select_badge").hide();
			$("select[id=select_" + value + "]").show();
		}
	}

}

function saveCard()
{
	//$form = $("div[id=card_content] input, div[id=card_content] select")
	//$form = $("div[id=card_content] input:visible, div[id=card_content] select:visible")
	$form = $("div[id=card_content] input:visible, div[id=card_content] select:visible, div[id=card_content] input[type=hidden]")

	vars = $form.serializeArray();

	start_loading();
	//$("#img_card_gerado").attr("src", '')
	$("#img_card_gerado").remove();
	$("#card_gerado_message").html("Gerando o card... aguarde!");

	$.ajax({
		type     : "POST",
		cache    : false,
		url      : '/saveCard/',
		data     : vars,
		success  : function(data) {
			end_loading_ok();

			//$("#img_card_gerado").attr("src", data.card);

			var img = $('<img id="img_card_gerado" onerror="imgError(this);" width=399 height=130>')
			img.attr('src', data.card);
			img.appendTo('#box_card_gerado');

			$("#card_gerado_message").html("Card gerado com sucesso! Ele ser&aacute; carregado na box abaixo.");
/*
			$.fancybox({
				'width'			: 399,
				'height'		   : 130,
				'href'			: data.card,
			});
*/
		},
		error: function(retorno)
		{
			end_loading_nok();
		}
	});
}

function start_loading()
{
	if (window.end_load)
	{
		clearTimeout(window.end_load)
		window.end_load = undefined;
	}

	$("#loading").attr('src', '/new/media/img/index.ajax-spinner-gif.svg');
	$("#barraTopo_loading").fadeIn('fast');
	$("#loading").fadeIn('fast');
}

function end_loading_timeout()
{
	window.end_load = setTimeout("end_loading()", 3000);
}

function end_loading()
{
	$("#loading").fadeOut('slow');
	$("#barraTopo_loading").fadeOut('slow');
}

function end_loading_ok()
{
	$("#loading").attr('src', '/media/ok.gif');
	end_loading_timeout();
}

function end_loading_nok()
{
	$("#loading").attr('src', '/media/nok.gif');
	end_loading_timeout();
}

function regras_myplus(el)
{
	$(".regras").prop('checked', false);

	if ($(el)[0].id == 'concordo')
	{
		if ($("#pagamento").css('display') == 'none')
			$("#pagamento").slideToggle("slow");
	}
	else
	{
		if ($("#pagamento").css('display') != 'none')
			$("#pagamento").slideToggle("slow");
	}

	$(el).prop('checked', true);
}

function salvarInformaces()
{
	nome  = $("#nome" ).val();
	email = $("#email").val();

	if (!nome && !email)
	{
		alert(encode_text("Nenhuma informa&ccedil;&atilde;o alterada"));
		return;
	}

	start_loading();

	data = $("#dadosCadastrais").serializeArray();

	$.ajax({
		type     : "POST",
		cache    : false,
		url      : '/atualizaDadosCadastrais/',
		data     : data,
		success  : function(data) {
			if (data.ok)
			{
				end_loading_ok();
				if (data.email)
				{
					alert(encode_text("Dados alterados com sucesso.\n\nUma mensagem de confirma&ccedil;&atilde;o foi enviada para o seu email (" + data.email + ").\n\nVoc&ecirc; deve confirmar seu email para participar do myPlus."));
					window.location = "/myplus/";
				}
				else
					alert(encode_text("Dados alterados com sucesso."));
			}
			else
			{
				end_loading_nok();
				alert(encode_text(data.error));
			}
			return
		},
		error: function(retorno)
		{
			end_loading_nok();
		}
	});
}

function enviarMensagem()
{

	if ($("#titulo").length) {
		if ($("#titulo").val().length <= 0)
		{
			alert(encode_text("O t&iacute;tulo &eacute; obrigat&oacute;rio."));
			return;
		}
	}

	list_of_users = false;

	if ($(".userDest").length) {
		list_of_users = $(".userDest").map(function() { return this.id;}).get().join(',')

		if (list_of_users == "")
		{
			alert(encode_text("Voc&ecirc; deve adicionar, no m&iacute;nimo, 1 destinat&aacute;rio."));
			return;
		}
	}

	$form = $("#form_enviarmensagem");

	for ( instance in CKEDITOR.instances )
   	CKEDITOR.instances[instance].updateElement();

	vars = $form.serialize();
	if (list_of_users)
		vars += "&destinatario=" + list_of_users

	if (location.pathname.indexOf('editar') != -1) {
		url = '/mensagens/editar/?ajax=1'
		if (list_of_users) url += '&destinatario=' + list_of_users
  		$("#form_enviarmensagem").attr("action", url);
		$("#form_enviarmensagem").submit();
		return;
	} else {
		url = '/mensagens/enviar/?ajax=1';
	}

	start_loading();

	$("#nova_mensagem").slideToggle("slow", "linear");

	$.ajax({
		type     : "POST",
		cache    : false,
		url      : url,
		data     : vars,
		success  : function(data) {

			end_loading_ok();
			alert("Mensagem enviada com sucesso!");
			if (data.url)
				window.location.assign(data.url)
		},
		error: function(retorno)
		{
			end_loading_nok();
			alert("Erro ao enviar... Mensagem nao enviada");
		}
	});
}

function removerDestinatario(username, dest_id)
{
	var resp = confirm(encode_text("Deseja remover \"" + username + "\" da mensagem?"));

	if (!resp)
		return;

	start_loading();

	$.ajax({
		type     : "GET",
		cache    : false,
		url      : '/mensagens/removerDestinatario/?pk=' + dest_id,
		success  : function(data) {

			end_loading_ok();
			$("#dest_" + dest_id).slideToggle();
			alert(encode_text("Usu&aacute;rio removido da conversa..."));

		},
		error: function(retorno)
		{
			end_loading_nok();
			alert("Erro ao enviar... Mensagem nao enviada");
		}
	});
}

function cleanArray(actual){
  var newArray = new Array();
  for(var i = 0; i<actual.length; i++){
      if (actual[i].trim()){
        newArray.push(actual[i]);
    }
  }
  return newArray;
}

function get_list_of_users(user, el)
{
	start_loading();

	$.ajax({
		type: "GET",
		url: "/search_user/" + user + "/?mensagem=1",
		cache: false,
		success: function(data)
		{
			$("#" + el).html(data);
			$("#" + el).slideDown();
			return data;
		}
	});
}

function findUser(user_find)
{
	try { user = cleanArray(user_find.split(',')).splice(-1)[0] }
	catch (e) { return; }

	if (user.length < 3)
		return;

	console.log(user);

	$("#find_user").hide();

	start_loading()
	$("#destinatario").prop('disabled', true);
	data = get_list_of_users(user, "find_user");
	end_loading_ok();
	$("#destinatario").prop('disabled', false);
}

function addUserDestinatario(friend, avatar)
{
	$("#find_user").hide();
	$("#destinatario").attr('value', '');

	if ($(".userDest[id=" + friend + "]").length >= 1)
	{
		alert(encode_text("Usu&aacute;rio j&aacute; incluso..."));
		return 
	}

	if ($(".userDest").length >= 10)
	{
		alert(encode_text("O m&aacute;ximo de destinat&aacute;rios s&atilde;o 10!"));
		return 
	}

	html = '<div id="' + friend + '" class="userDest mensagemBotao variableBorder"><img width=16 align="middle" style="position:relative;top:-4px;" src="' + avatar + '"><span style="position: relative; top:1px;">&nbsp;' + friend + '<span style="color:#96c2ff; font-weight:bold;" title="Remover destinatario" onClick="$(\'.userDest[id=' + friend + ']\').remove()">&nbsp;x</span></div>'

	console.log(html);
	$("#list_of_dest").append(html);

}

function msgExcluir(msg_id, msg_type)
{
	var msg = "Tem certeza que deseja excluir?"
	var resp = confirm(encode_text(msg));

	if (resp == false)
		return

	start_loading();

	$.ajax({
		type: "GET",
		url: "/mensagens/apagar/?id=" + msg_id + "&type=" + msg_type,
		cache: false,
		success: function(data)
		{
			if (data.result)
				alert("Mensagem apagada com sucesso!")
			else {
				alert(data.error)
				end_loading_nok();
				return
			}

			end_loading_ok();

			if (msg_type == 0)
				window.location = '/mensagens/';
		}
	});
}

function msgQuote(id, author) {
	txt = $("#texto_" + id).html();
	html = "<blockquote><b>" + author + " disse:</b><br/>" + txt + "</blockquote><p>&nbsp;</p>"
	CKEDITOR.instances.editor.insertHtml(html);

	var editor = CKEDITOR.instances.editor; 
	var jqDocument = $(editor.document.$);
	var documentHeight = jqDocument.height();
	jqDocument.scrollTop(documentHeight);

}

function guia_salvar(el) {

	start_loading();

	content = $("#" + el).html();
	name = $("#title_input_" + el).val();
	url = "../salvar-secao/";
	vars = "el=" + el + "&content=" + encodeURIComponent(content) + "&name=" + encodeURIComponent(name);

	$.ajax({
		type: "POST",
		data     : vars,
		url: url,
		cache: false,
		success: function(data)
		{
			if (!data.result) {
				alert(data.error)
				end_loading_nok();
				return
			}

			has = $("#title_" + el).hasClass("subsection");

			if (has) {
				$("#title_" + el).html("<h1>" + data.name + "</h1>");
			} else {
				$("#title_" + el).html("<h3>" + data.name + "</h3>");
			}

			end_loading_ok();
		}
	});
}

function guia_ajax_get(url) {
	start_loading();
	$.ajax({
		type: "GET",
		url: url,
		cache: false,
		success: function(data)
		{
			if (!data.result) {
				alert(data.error)
				end_loading_nok();
				return data;
			}

			end_loading_ok();
			return data;
		}
	});
}

function guia_nova_subsecao(el) {

	name = $("#nova_sub_" + el).val();
	url = "../nova-secao/?pai=" + el + "&name=" + encodeURIComponent(name);
	start_loading();
	$.ajax({
		type: "GET",
		url: url,
		cache: false,
		success: function(data)
		{
			if (!data.result) {
				alert(data.error)
				end_loading_nok();
				return data;
			}

			$("#section_" + el).append(data.secao_html);
			end_loading_ok();
			return data;
		}
	});
}

function guia_nova_secao(el) {

	name = $("#nova_secao").val();
	url = "../nova-secao/?name=" + encodeURIComponent(name);
	start_loading();
	$.ajax({
		type: "GET",
		url: url,
		cache: false,
		success: function(data)
		{
			if (!data.result) {
				alert(data.error)
				end_loading_nok();
				return data;
			}

			$("#content").append(data.secao_html);
			end_loading_ok();
			return data;
		}
	});
}

function guia_remover(el) {

	var msg = "Tem certeza que deseja remover?"
	var resp = confirm(encode_text(msg));

	if (resp == false)
		return

	start_loading();

	content = $("#" + el).html();
	url = "../remover-secao/?el=" + el;

	$.ajax({
		type: "GET",
		url: url,
		cache: false,
		success: function(data)
		{
			if (!data.result) {
				alert(encode_text(data.error))
				end_loading_nok();
				return
			}

			$("#SectionContainer" + data.pk).remove();

			end_loading_ok();
		}
	});
}

function showPopup(img, url) {
	Javascript:$.fancybox(
		{'content' : "<a target=\"_blank\" href=\"" + url + "\"><img width=800 height=500 src=\"" + img + "\"></a>",
		 "autoScale": false,
		 fitToView: false
	 });
}

function changeLanguage(psn_id, lang) {
	url = '/jogos/' + psn_id + '/trofeus/?lang=' + lang
	start_loading();
	$.ajax({
		type: "GET",
		url: url,
		cache: false,
		success: function(data)
		{
			if (!data) {
				end_loading_nok();
				return
			}

			data.forEach(function(t) {
				if (t.model == "myps3t.gametrophyinfo") {
					t_id = t.pk;
				} else {
					t_id = t.fields.trophy;
				}

				$("#show_name_" + t_id).text(t.fields.name);
				$("#show_desc_" + t_id).text(t.fields.desc);
			});

			

			end_loading_ok();
		}
	});
}

function printTrophyList(user, game_id) {
	lang = $("#lang_select").val();
	url = '/rank/' + user + '/game/' + game_id + '/?print=1&lang=' + lang
	window.location = url;
}

window.onerror = function() {
	end_loading_nok();
};

function fancy_badge(type, pk, gen) {

	url = '/badges/lista-de-badges/' + type + '/' + pk + '/'
	if (gen) {
		url += '?gen=' + gen;
	}
	start_loading();
	$.ajax({
		type: "GET",
		url: url,
		cache: false,
		success: function(data) {
			Javascript:$.fancybox(
				{
				'content' : data,
				'autoScale': false,
				 fitToView: false
			 });
			end_loading_ok();
		}
	});
}

function fancy_contador(user) {

	start = $("#inicio").val().replace(/\D/g,'');
	end = $("#fim").val().replace(/\D/g,'');
	pf = $("#pf").val();
	url = '/contador-de-trofeus-get/?date_start=' + start  + '&date_end=' + end + '&user=' + user + '&pf=' + pf;
	start_loading();
	$.ajax({
		type: "GET",
		url: url,
		cache: false,
		success: function(data) {
			Javascript:$.fancybox(
				{
				'content' : data,
				'autoScale': false,
				 fitToView: false
			 });
			end_loading_ok();
		}
	});
}

function change_stats_rank(rank) {
	$(".badge_aba").css("background","#005eba");
	$(".last_aba").css("background","#005eba");
	$("#" + rank).css("background", "#75B100");
	$("." + rank).css("background", "#75B100");

	$(".rank_table").hide();
	$("table[id*='" + rank + "']").show();
}
