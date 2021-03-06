//Declare Global Variables if required here
var is_loggedin;
var api_key="ac2fdfd5fec83138415b9f98c82f0aac";
var apptaAgent = new ApptaAgent(api_key, "414920308635429");

//On Ready
$( document ).ready(function(){
	//get the modal window on loading of this script
	apptaAgent.getLoginDetails(function(data){
		if(data.is_logged_in === false){
	        is_loggedin=data.is_logged_in;	
			showFacebookInformation();
		}else{
			is_loggedin=data.is_logged_in;
			hideFacebookInformation();
		}
	});
	//GlobalLeaderBoard();
	//ProgramLeaderBoard();
	//UserWall();
/*	var facebookShowStatus = $('.facebookOnce').val();
	if(facebookShowStatus == 0){
		showFacebookInformation();
	}else if(facebookShowStatus == 1){
		hideFacebookInformation();
	}
*/
		
});

function GlobalLeaderBoard(){
	console.log("Global Leader Board");
	apptaAgent.getGlobalLeaderBoard(function(data){
		console.log(data);	
		renderLeaderBoard(data);
	});	
}

function renderLeaderBoard(data){
	$(".glb_username").text(data.first_name+" "+data.last_name);
	$(".glb_userimage").attr("src","https://graph.facebook.com/"+data.fb_user_id+"/picture?type=large");
	$(".glb_rankvalue").text(data.rank);
	$(".glb_leaderboard").text(data.points);
	$(".glb_rankboard").empty();
	for(var m=0; m<data.friends.length;m++){	
		//append the rankings 
    	html = '<li style="height: 30px; margin: 0px 0px;">';
		html+= '	<div class="col-md-12" style="background: white; margin: 2px 0px;">';
    	html+= '       	<div class="col-md-3" style="padding: 0px;">';
    	html+= '	       	<img style="height: 50px; width: 50px; border-radius: 50px; padding: 4px;" alt="" src="'+data.friends[m].image_url+'">';
    	html+= '        </div>';
    	html+= '        <div class="col-md-9" style="padding: 0px;">';
    	html+= '         	<p style="margin-bottom: 1px">'+data.friends[m].first_name+" "+data.friends[m].last_name+'</p>';
    	html+= '            <span style="font-size: 12px;">Total Points : '+data.friends[m].points+'</span><br>';
    	html+= '            <span style="font-size: 12px;">Rank: '+data.friends[m].rank+'</span>';
    	html+= '        </div>';
    	html+= '    </div>';
    	html+= '</li>';
		$(".glb_rankboard").append(html);
	}
}

// function UserWall(){
// 	console.log("UserWall");
// 	var app_user_id="623";
// 	var fb_id="760586213";
// 	apptaAgent.getUserWall(app_user_id,fb_id,function(data){
// 		console.log(data);
// 	});
// }

function settings(){
	if($("[name='privacy-checkbox']").is(':checked') === true){
        //if checked or true => privacy enabled
        apptaAgent.postSettings(true);
    }else{
        //if unchecked or false => privacy disabled
        apptaAgent.postSettings(false);
    }
}

function checkPrivacySettings(){
	$(".custom-privacy-message").show();
	//setTimeout(function(){ $(".custom-privacy-message").hide(); }, 1000);
	$(".maincontainer").attr('style','margin-top: 30px; pointer-events: none;');
}

function hidePrivacySettings(){
	$(".custom-privacy-message").hide();
	$(".maincontainer").attr('style','margin-top: 30px;');
}

function showFacebookInformation(){
    apptaAgent.getLoginDetails(function(data){
        if(data.is_logged_in === false){
			console.log("is_loggedin(true): "+is_loggedin);
            is_loggedin=data.is_logged_in;
			$(".custom-fb-message").show();
			$(".menucontainer").attr('style','background: grey; opacity: 0.5; pointer-events: none;');
			$(".maincontainer").attr('style','background: grey; opacity: 0.5; pointer-events: none;');
        }else{
            is_loggedin=data.is_logged_in;
			console.log("is_loggedin(false): "+is_loggedin);
            hideFacebookInformation();
        }
    });
}

function hideFacebookInformation(){
	$(".custom-fb-message").hide();
	//if OK Clicked then never show the pop up again	
	$(".facebookOnce").val(1);
}

function hideFacebookinformationalways(){
	$(".custom-fb-message").hide();
	$(".facebookOnce").val(1);
	$(".maincontainer").attr('style','');
	$(".menucontainer").attr('style','');
	updatePrivacyStatus();
	fbLogin();
}

function hideFacebookinformationonce(){
	$(".custom-fb-message").hide();
	$(".maincontainer").attr('style','');
	$(".menucontainer").attr('style','');
}

function updatePrivacyStatus(){
	var selectedvalue = $(".selectedprivacy").val();	
	$(".privystatus").val(99);
	if(selectedvalue == 1){
        apptaAgent.postSettings(false);
    }else if(selectedvalue == 2){
        apptaAgent.postSettings(true);
    }else{
        apptaAgent.postSettings(true);
    }
	$(".custom-privacy-message").hide();
	$(".maincontainer").attr('style','margin-top: 30px;');
}

function privacyUpdate(data){
	if(data.value == 1){
		$(".selectedprivacy").val(data.value);
		$(".hidefacebookinformationalways").show();
	}else if(data.value == 2){
		$(".selectedprivacy").val(data.value);
	}else{
		$(".selectedprivacy").val(data.value);
	}
	$(".privystatus").val(99);
}
	
function fbLogout(){
	apptaAgent.logout();
	$(".customfblogin").text("Login");
	html = '<i style="font-size: 36px; padding: 2px;" class="fa fa-user"></i>';
	$(".userimagecontainer").empty();
	$(".userimagecontainer").append(html);
	var is_loggedin=false;
	$(".privacyOptions").hide();
}

function loadEnglish(){
	    var url = location.href;
        var loc = url.split('ref_01_07/');
        var loc2 = loc[1].split('?');
        if(loc2[0] === "program.php"){
            document.location.href="http://telemundo.teletango.com/ref_01_07/index.php?channel_name=English";
            var filter_object={
                channel_name:'Telemundo',
                page_size:30,
            };
            apptaAgent.getLounge(filter_object,function(data){
                console.log("called from program page for novelas");
                renderChannelLounge(data.loungePrograms);
            });
            $(".custom-banner-image").attr('src','images/english.png');
        }else{
            var filter_object={
                channel_name:'Telemundo',
                page_size:30,
            };
            apptaAgent.getLounge(filter_object,function(data){
                renderChannelLounge(data.loungePrograms);
            });
			$(".custom-banner-image").attr('src','images/english.png');
        }		
}

function loadEnt(){
        var url = location.href;
        var loc = url.split('ref_01_07/');
        var loc2 = loc[1].split('?');
        if(loc2[0] === "program.php"){
            document.location.href="http://telemundo.teletango.com/ref_01_07/index.php?channel_name=Novelas";
            var filter_object={
				channel_name:'Entretenimiento',
                page_size:30,
            };
            apptaAgent.getLounge(filter_object,function(data){
                console.log("called from program page for novelas");
                renderChannelLounge(data.loungePrograms);
            });
			$(".custom-banner-image").attr('src','images/ent.png');
        }else{
            var filter_object={
				channel_name:'Entretenimiento',
                page_size:30,
            };
            apptaAgent.getLounge(filter_object,function(data){
                renderChannelLounge(data.loungePrograms);
            });
			$(".custom-banner-image").attr('src','images/ent.png');
        }
}

function loadNovelas(){
		var url = location.href;
		var loc = url.split('ref_01_07/');
		var loc2 = loc[1].split('?');
		if(loc2[0] === "program.php"){
            document.location.href="http://telemundo.teletango.com/ref_01_07/index.php?channel_name=Novelas";
			var filter_object={
				channel_name:'Novelas',
				page_size:30,
			};
			apptaAgent.getLounge(filter_object,function(data){
				console.log("called from program page for novelas");
				renderChannelLounge(data.loungePrograms);
			});
			$(".custom-banner-image").attr('src','images/novelas.png');
		}else{
			var filter_object={
				channel_name:'Novelas',
				page_size:30,
			};
			apptaAgent.getLounge(filter_object,function(data){
				renderChannelLounge(data.loungePrograms);
			});
			$(".custom-banner-image").attr('src','images/novelas.png');
		}
}

function renderChannelLounge(defaultPrograms){
	$(".column1").empty();
	$(".column2").empty();
	$(".column3").empty();
	for(var a=0; a<defaultPrograms.length;a++){
	  if(defaultPrograms[a].thumbnail){
		if(a<=9){
      		ahtml = '<div data-program="'+defaultPrograms[a].id+'" class="default programs col-md-12" style="cursor:pointer; border: 1px solid #cecece;" onclick="checkinProgram('+defaultPrograms[a].id+')">';
        	ahtml +='  <div class="col-md-12" style="padding: 0px; margin: 0px;">';
        	ahtml +='    <img src="'+defaultPrograms[a].thumbnail+'" class="img-responsive" style="width: 100% ">';
        	ahtml +='    <span style="font-weight: 10px; color: red;">'+defaultPrograms[a].channel+'</span><br/>';
        	ahtml +='    <span style="font-size: 20px; font-weight: bold;">'+defaultPrograms[a].name+'</span><br/>';
        	ahtml +='  </div>';
        	ahtml +='  <div class="col-md-12 program-tile" style="padding: 9px 0px 0px 3px;  border-top: 1px solid lightgrey;  font-size: 17px;" >';
        	ahtml +='    <div class="col-md-5 friendsList" id="friendsListForPrg-'+defaultPrograms[a].id+'" data-program-id="'+defaultPrograms[a].id+'">';
        	ahtml +='    </div>';
        	ahtml +='    <div class="col-md-7 metalist" style="border-left: 1px solid lightgrey; color: lightgrey;">';
        	ahtml +='      <div class="col-md-6 metaviews">';
        	ahtml +='       <i class="fa fa-eye" style="color: lightgrey;"></i>';
        	ahtml +='       <span>'+defaultPrograms[a].nbr_views+'</span>';
        	ahtml +='      </div>';
        	ahtml +='      <div class="col-md-6 metaConversations">';
        	ahtml +='       <i class="fa fa-comment" style="color: lightgrey;"></i>';
        	ahtml +='       <span>'+defaultPrograms[a].nbr_conversations+'</span>';
        	ahtml +='      </div>';
        	ahtml +='    </div>';
        	ahtml +='  </div>';
        	ahtml +='</div>';
        	$(".column1").append(ahtml);
		}else if(a <=19){
      		ahtml = '<div data-program="'+defaultPrograms[a].id+'" class="default programs col-md-12" style="cursor:pointer; border: 1px solid #cecece;" onclick="checkinProgram('+defaultPrograms[a].id+')">';
        	ahtml +='  <div class="col-md-12" style="padding: 0px; margin: 0px;">';
        	ahtml +='    <img src="'+defaultPrograms[a].thumbnail+'" class="img-responsive" style="width: 100% ">';
        	ahtml +='    <span style="font-weight: 10px; color: red;">'+defaultPrograms[a].channel+'</span><br/>';
        	ahtml +='    <span style="font-size: 20px; font-weight: bold;">'+defaultPrograms[a].name+'</span><br/>';
        	ahtml +='  </div>';
        	ahtml +='  <div class="col-md-12 program-tile" style="padding: 9px 0px 0px 3px;  border-top: 1px solid lightgrey;  font-size: 17px;" >';
        	ahtml +='    <div class="col-md-5 friendsList" id="friendsListForPrg-'+defaultPrograms[a].id+'" data-program-id="'+defaultPrograms[a].id+'">';
        	ahtml +='    </div>';
        	ahtml +='    <div class="col-md-7 metalist" style="border-left: 1px solid lightgrey; color: lightgrey;">';
        	ahtml +='      <div class="col-md-6 metaviews">';
        	ahtml +='       <i class="fa fa-eye" style="color: lightgrey;"></i>';
        	ahtml +='       <span>'+defaultPrograms[a].nbr_views+'</span>';
        	ahtml +='      </div>';
        	ahtml +='      <div class="col-md-6 metaConversations">';
        	ahtml +='       <i class="fa fa-comment" style="color: lightgrey;"></i>';
        	ahtml +='       <span>'+defaultPrograms[a].nbr_conversations+'</span>';
        	ahtml +='      </div>';
        	ahtml +='    </div>';
        	ahtml +='  </div>';
        	ahtml +='</div>';
        	$(".column2").append(ahtml);
		}else if(a <=29){
      		ahtml = '<div data-program="'+defaultPrograms[a].id+'" class="default programs col-md-12" style="cursor:pointer; border: 1px solid #cecece;" onclick="checkinProgram('+defaultPrograms[a].id+')">';
        	ahtml +='  <div class="col-md-12" style="padding: 0px; margin: 0px;">';
        	ahtml +='    <img src="'+defaultPrograms[a].thumbnail+'" class="img-responsive" style="width: 100% ">';
        	ahtml +='    <span style="font-weight: 10px; color: red;">'+defaultPrograms[a].channel+'</span><br/>';
        	ahtml +='    <span style="font-size: 20px; font-weight: bold;">'+defaultPrograms[a].name+'</span><br/>';
        	ahtml +='  </div>';
        	ahtml +='  <div class="col-md-12 program-tile" style="padding: 9px 0px 0px 3px;  border-top: 1px solid lightgrey;  font-size: 17px;" >';
        	ahtml +='    <div class="col-md-5 friendsList" id="friendsListForPrg-'+defaultPrograms[a].id+'" data-program-id="'+defaultPrograms[a].id+'">';
        	ahtml +='    </div>';
        	ahtml +='    <div class="col-md-7 metalist" style="border-left: 1px solid lightgrey; color: lightgrey;">';
        	ahtml +='      <div class="col-md-6 metaviews">';
        	ahtml +='       <i class="fa fa-eye" style="color: lightgrey;"></i>';
        	ahtml +='       <span>'+defaultPrograms[a].nbr_views+'</span>';
        	ahtml +='      </div>';
        	ahtml +='      <div class="col-md-6 metaConversations">';
        	ahtml +='       <i class="fa fa-comment" style="color: lightgrey;"></i>';
        	ahtml +='       <span>'+defaultPrograms[a].nbr_conversations+'</span>';
        	ahtml +='      </div>';
        	ahtml +='    </div>';
        	ahtml +='  </div>';
        	ahtml +='</div>';
        	$(".column3").append(ahtml);
		}
	  }
    }
}
