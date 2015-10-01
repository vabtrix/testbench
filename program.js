
    var api_key="ac2fdfd5fec83138415b9f98c82f0aac";
    var apptaAgent = new ApptaAgent(api_key, "414920308635429");
	var twitterdata = [];
	var facebookcomments = [];
	var friendsfootprint = [];	
	var program_id;
	var program_name;
	var facebook_object_id;
	var link =window.location.href;
	var message="";
	var likeuserlist;
	var conversations;
	var private_conversations;
	var is_loggedin;
	var fb_username;
	var fb_profileurl;
	var fb_user_id;

    $( document ).ready(function(){
        getProgramDetails(window.location.search.replace("?id=", ""));
		$(".program-meta-friends").click(function() { 
		    $(".leaderboard").toggle();
		});
		getCommentsData();
		facebookLogin();
		userlikes(likeuserlist);
    });
	
	function getCommentsData(){
		var type="program";
		apptaAgent.getComments(program_id,program_name,type,function(data){console.log(data);});	
	}

	function getCookie(cname) {
    	var name = cname + "=";
    	var ca = document.cookie.split(';');
    	for(var i=0; i<ca.length; i++) {
    	    var c = ca[i];
    	    while (c.charAt(0)==' ') c = c.substring(1);
    	    if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    	}
    	return "";
	} 

	
	function facebookLogin(){
		console.log("fbLogin called by getProgramDetails api");
		console.log(is_loggedin);
        if(is_loggedin == false){
      		apptaAgent.login();
        }else{
			image = 'http://graph.facebook.com/'+fb_user_id+'/picture?type=small';
			$(".userimagecontainer").empty();
            $(".customfblogin").text(fb_username);
      		html = '<img src="'+image+'" alt="'+fb_username+'" style="border-radius: 50px; padding: 5px; height: 40px; width: 40px;" class="userimagesrc"/>';
      		$(".userimagecontainer").append(html);
        }
    }

    function getProgramDetails(id){
		apptaAgent.getLoginDetails(function(data){
			is_loggedin = data.is_logged_in;
			fb_profileurl=data.image_url;
			fb_username=data.name;
			fb_user_id=data.fb_id;
		});
        apptaAgent.getProgram(id, function sendData(data){
          renderProgramData(data);
        });
    }

	function fbshare(){
		apptaAgent.postFBShare(program_id,program_name,link,message);
	}

	function userlikes(data){
		html='<ul class="likefriends">';
		for(var m=0; m<data.length;m++){
		  html+='<li><img src="http://graph.facebook.com/'+data[m].fb_user_id+'/picture?type=small" alt="" style="height: 30px; width: 30px; border-radius: 50px; padding: 1px;"/></li>';
		}
		html+='</ul>'; 
		$(".leaderboard").append(html);
		$(".program-meta-friends").attr('style','padding: 0px; margin: 0px; background: grey; color: white; text-align: center; font-size: 14px; cursor: pointer;');
		var likefriends = $(".likefriends").children().length;
		$(".program-meta-friends > span").text(likefriends+" friends like this video");
	}


    function renderProgramData(data){
        var details = data;
		program_id=details.program.id;
		program_name=details.program.name;
		facebook_object_id=details.program.fb_page_url;
		likeuserlist=details.like_user_list;
		conversations = data.conversations;
		
		renderConversations(conversations);
		for(var x=0; x<data.twittercomments.comments.length;x++){
			twitterdata.push(data.twittercomments.comments[x]);
		}
		for(var y=0; y<data.facebookcomments.comments.length;y++){
			facebookcomments.push(data.facebookcomments.comments[y]);
		}
		friendsfootprint.push(data.friendsfootprint);	
		renderTwitterComments(twitterdata);
		renderFacebookComments(facebookcomments);
		userlikes(likeuserlist);
		
    }
		
	function findTwitterDetails(id){
		$.ajax({
		  url: 'https://api.twitter.com/1.1/users/show.json?user_id=173354553',
		  type: 'GET',
		  headers: {
			'Authorization':'OAuth oauth_consumer_key="Dv0qgHLVONdRuScuSruGhdJYM",oauth_token="72164110-Gyy2Uw480HqEOcEydx9zhKF5cNHeZky8O5XVoAYrf",oauth_signature_method="HMAC-SHA1",oauth_timestamp="1443517065",oauth_nonce="87a2e5d71cecd0fee8bb36553ae1a875",oauth_version="1.0",oauth_signature="RuELno7ZGY9Wt5mGOH1Ur540iHA%3D"'
		  },
		  success: function(data) {
			//console.log(data);
			//console.log(headers);
		  },
		  error: function(e) {
			//console.log(e.message);
		  }
		});	
	}

	function renderPublicComments(public_conversations){

	}
	
	function renderPrivateComments(private_conversations){

	}

	function renderTwitterComments(twitter){
		$(".program-social-data").empty();
		for(var d=0; d<twitter.length;d++){
			//var name = findTwitterDetails(twitter[d].twuserid);
			html = '<div style="padding: 18px 0px; margin: 4px 0px; background: white;" class="col-md-12">';
			html += '	<div class="col-md-3 program-social-data-image">';
			html += '	  <img style="border-radius: 50px;" alt="" src="'+twitter[d].profileurl+'">';
			html += '	</div>';
			html += '	<div class="col-md-7 program-social-data-name">';
			html += '	  <span>'+twitter[d].twusername+'</span>';
			html += '	</div>';
			html += '	<div class="col-md-2 program-social-data-srcmedia">';
			html += '	  <img style="border-radius: 50px; height: 20px; width: 20px;" alt="" src="http://telemundo.teletango.com/testbench/images/twitterlogo.png">';
			html += '	</div>';
			html += '	<div class="col-md-12">';
			html += '	    '+twitter[d].comment+' ';
			html += '	</div>';
			html += '</div>'; 
			$(".program-social-data").append(html);

		}
	}

	function renderFacebookComments(facebook){
		//console.log(facebook);
		for(var f=0; f<facebook.length;f++){
			//console.log(facebook[f].fbuserid);
			html = '<div style="padding: 18px 0px; margin: 4px 0px; background: white;" class="col-md-12">';
			html += '	<div class="col-md-3 program-social-data-image">';
			html += '	  <img style="border-radius: 50px;" alt="" src="'+facebook[f].thumbnail+'">';
			html += '	</div>';
			html += '	<div class="col-md-7 program-social-data-name">';
			html += '	  <span>'+facebook[f].name+'</span>';
			html += '	</div>';
			html += '	<div class="col-md-2 program-social-data-srcmedia">';
			html += '	  <img style="border-radius: 50px; height: 20px; width: 20px;" alt="" src="http://telemundo.teletango.com/testbench/images/facebooklogo.png">';
			html += '	</div>';
			html += '	<div class="col-md-12">';
			html += '	    '+facebook[f].comment+' ';
			html += '	</div>';
			html += '</div>'; 
			$(".program-social-data").append(html);
		}
	}
		
	function renderConversations(data){
		//$(".chatconversationslist").empty();
		for(var b=0; b<data.length;b++){
			html = '<li>';
			html +='<span>'+data[b].text+'</span>';
			html +='</li>';
			$(".chatconversationslist").append(html);
		}
	}

    function fbLogin(){
      //console.log("fb Login Clicked");
      var api_key="ac2fdfd5fec83138415b9f98c82f0aac";
      var apptaAgent = new ApptaAgent();
      apptaAgent.login(api_key); 
    }
	
	function programLike(){
		program_id=2;
		program_name="Lets Go Places";
		apptaAgent.likeProgram(program_id,program_name);	
	}

	function programComments(){
		var comment_text = $(".teletangocomment").val();
		var type="program";
		apptaAgent.postComment(program_id,program_name,comment_text,type);
		apptaAgent.getComments(program_id,program_name,type, function(data){renderConversations(data);});
	}

	function leaderboard(){

	}

	function submitcomment(chat_type){
		console.log("private comment accessed");
		if(is_loggedin === true){
			console.log("logged in to make a private comment");
			comment_text=$(".privatecomment").val();
			type = "friendsprogram";
			apptaAgent.postComment(program_id,program_name,comment_text,type);
		}else if(is_loggedin === false){
			console.log("not logged into to do private chat");
			apptaAgent.login();
		}
	}
	function postToFacebook(){
		var facebook_message=$(".facebookcomment").val();
		apptaAgent.postFBComment(program_id,program_name,facebook_object_id,facebook_message);
	}
	function postToTwitter(){
		var twitter_text = $(".twittercomment").val();
		apptaAgent.postTweet(program_id,program_name,twitter_text);
	}
