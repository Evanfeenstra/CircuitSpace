console.log('hi circuitjs!')


Peeps = new Mongo.Collection("peeps");

Router.route('/', function(){
  this.render('main');
});
Router.route('/settings', function() {
  this.render('settings');
});
Router.route('/members', function() {
	this.render('members');
});
Router.route('/classes', function() {
	this.render('classes');
});
Router.route('/learn', function() {
	this.render('learn');
});
Router.route('/assets', function() {
  this.render('assets');
});
Router.route('/yo', function() {
	this.render('yo');
});
Router.route('/:userx', function() {
	this.render('pagey', {
		data: function() {
			var userx = this.params.userx;
			//console.log(userx);
			return this.params
		}
	});
});
//global layout template
Router.configure({
   layoutTemplate: 'layout'  //can be any template name
 });

if (Meteor.isClient) {

Meteor.subscribe("peeps");



  Template.nav.events({
    // 'change' is the event emitted by the component
    'click #tabs': function (e, template) {
      //Session.set('counter', e.target.value);
      var id=e.target.id;
      if (id=='nav0') {
        Router.go('yo')
      }
      else if (id=='nav1') {
      	Router.go('members')
      }
      else if (id=='nav2') {
      	Router.go('learn');
      }
    }
  });

  Template.yo.rendered = function(){
  		if (Meteor.user()) {
          var name=Meteor.user().username;
        }
        else {var name="home"}
        Router.go(':userx', {userx: name})
  };

  Template.members.helpers({
  	//define the users in {#each users} in HTML
  	users: function() {
  		return Peeps.find({}, {fields: {owner: 1, icon: 1, iconcolor: 1, message: 1,}});
  	},
  });


  Template.pagey.helpers({
    isHome: function() {
      var yo;
      if (this.userx=='home') {yo=false}
      else {yo=true}
      return yo;
    },
  	"user": function() {
  		return this.userx;
  	},
  	isOwner: function() {
  		return this.userx===Meteor.user().username;
  	},
    "htmleditorOptions": function() {
        return {
            lineNumbers: true,
            mode: "htmlmixed",
            theme: Peeps.find({owner:this.userx},{fields:{theme:1}}).fetch()[0].theme,
        }
    },
    "csseditorOptions": function() {
        return {
            lineNumbers: true,
            mode: "css",
            theme: Peeps.find({owner:this.userx},{fields:{theme:1}}).fetch()[0].theme,
        }
    },
    "jseditorOptions": function() {
        return {
            lineNumbers: true,
            mode: "javascript",
            theme: Peeps.find({owner:this.userx},{fields:{theme:1}}).fetch()[0].theme,
        }
    },

    code: function() {
        return Peeps.find({owner:this.userx},{fields:{html:1,css:1,js:1}}).fetch()[0];
    }

  });//end Template.pagey helpers

  //global object. are you supposedto do this a meteor way like in helpers?
  var Pen = {
    base_tpl:
            "<!doctype html>\n" +
            "<html>\n\t" +
            "<head>\n\t\t" +
            "<meta charset=\"utf-8\">\n\t\t" +
            "<title>Circuit Space</title>\n\n\t\t\n\t" +
            "</head>\n\t" +
            "<body>\n\t\n\t" +
            "</body>\n" +
            "</html>",

    bodyNoMargin: "body{margin:0;}",

    scriptsy: "<script type='text/javascript' src='/js/prefixfree.js'></script>\n<script type='text/javascript' src='/js/phaser.js'></script>",

    prepareSource: function(html,css,js) {
            var src = '';
            src = Pen.base_tpl.replace('</body>', html + '</body>');
            css = '<style>' + css + Pen.bodyNoMargin + '</style>';
            src = src.replace('</head>', css + Pen.scriptsy + '</head>');
            js = '<script>' + js + '</script>';
            src = src.replace('</body>', js + '</body>');
            return src;
            },

    render: function(html,css,js) {
            var source = Pen.prepareSource(html,css,js);
            var iframe = document.querySelector('#output iframe'),
                iframe_doc = iframe.contentDocument;
            iframe_doc.open();
            iframe_doc.write(source);
            iframe_doc.close();
            //iframe.webkitRequestFullScreen();
            },

    eventFire: function(el, etype){
	        if (el.fireEvent) {
	          el.fireEvent('on' + etype);
	        } else {
	          var evObj = document.createEvent('Events');
	          evObj.initEvent(etype, true, false);
	          el.dispatchEvent(evObj);
	        }
	    	},

  };//end Pen

  Template.pagey.events({

    "click #pagetabs": function (e, template) {
      
      var okgo=function() {
          var html = template.find("#htmleditor").value;
          var css = template.find("#csseditor").value;
          var js = template.find("#jseditor").value;
          Pen.render(html,css,js);
        //Pen.getPlayer();
        };

      var hide=function(num) {
        var wbpgs = template.findAll(".wbpg");
        for (var i=0;i<4;i++){
          if (i==num) {wbpgs[i].style.zIndex=1;}
          else {wbpgs[i].style.zIndex=0;}
        }
      };

      //this replaces all but numbers
      //console.log('z14'.replace( /[^\d.]/g, '' ));
      var id=e.target.id;
      var num=id.replace('pt','')
      if (num==0) {
        okgo();
      }
      hide(num);

    },//end "click #pagetabs"

    "click #fabsave": function(e, template) {
    	console.log('save')
    	var html = template.find("#htmleditor").value;
        var css = template.find("#csseditor").value;
        var js = template.find("#jseditor").value;
    	Meteor.call("updatePeeps", html, css, js, Meteor.user().username);
    },

    "click #fabsettings": function(e, template) {
    	Router.go('settings')
    }

  });//end Template.pagey.events

  Template.pagey.rendered = function(){
  	console.log('template pagey rendered');
        var html = this.find("#htmleditor").value;
        var css = this.find("#csseditor").value;
        var js = this.find("#jseditor").value;
        //var fullscreen=false;
        Pen.render(html,css,js);
    //}

  };

  Template.settings.helpers({
    //then use data.icon to get icon.
    data: function() {
      return Peeps.find({owner:Meteor.user().username},{fields:{icon:1,iconcolor:1,message:1,theme:1}}).fetch()[0];
    }
  });

  Template.settings.events({
    'submit form': function(event){
      event.preventDefault();
      console.log(event.target)
      var icon=event.target.icon.value; //use template.find here instead for safari
      var iconcolor=event.target.iconcolor.value;
      var message=event.target.message.value;
      var theme=event.target.theme.value;
      Meteor.call("settingsPeeps",icon,iconcolor,message,theme,Meteor.user().username);
      //Meteor.users.update( { _id: Meteor.userId() }, { $set: { 'profile.pen': pen }} );
      Router.go('members');
    }
  });

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });

  Template.assets.helpers({
    img: function() {
      var img = ['aqua_ball','asteroids_ship','asteroid1','asteroid2','asteroid3','atom1a','atom1b','atom2a','atom2b','atom3a','atom3b','atom4a','atom4b','baddie_cat_1','baddie2','baddie3','balls','ball','ball2','bg','block','blue_ball','boom32wh12','car','car90','breakout','brick1','brick2','brick3','brick4','brick5','bricks','bullet','bullet2','bullet3','car1','carrot','centroid','chick','coin','droid','dude','diamond','diamonds32x5','diamonds32x24x5','dudesprite','eggplant','enemy-bullet','enemy-tanks','explode','explode2','explosion','firstaid','fishie','fruitnveg32wh37','green_ball','invader','invader32x32x4','helix','lazer','loop','muzzle-flash','master','melon','mushroom','mushroom2','onion','orb-red','orb-green','orb-blue','parsec','pepper','player2','purple_ball','platform','red_ball','paddle','paddle1','paddle2','player','powerup_ball','powerup_lazer','powerup_multiball','powerup_p','powerup_s','powerup_x','running_bot','slimeeyes','snowflakes','snowflakes_large','tomato','ufo','wabbit','sand','scorched_earth','light_grass','dark_grass','light_sand','earth','shadow','ship','slime-head','slime','splatter1','splatter2','splatter3','sprites','star','star2','starfield','tanks','tiles-1','track','turret','wall','walls','background2','background3','background4']
      return img
    }
  });

  Template.learn.events({
    "click .hiliteSel": function(e) {
      var selection = window.getSelection();
      var range = document.createRange();
      var referenceNode = e.target.nextSibling.nextSibling;
      console.log(referenceNode);
      range.selectNodeContents(referenceNode);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  });

}//end if client


if (Meteor.isServer) {
Meteor.startup(function () {
	Meteor.publish("peeps", function() {
		return Peeps.find();
	});
});
//automatically create a Peeps document as well
Accounts.onCreateUser(function(options, user) {
	Peeps.insert({
    owner: user.username,
		html: '',
		css: '',
		js: '',
    icon: 'eye',
    iconcolor: 'black',
    message: 'I love to code!',
    theme: 'blackboard',
		//botX: null,
		//botY: null,
		//botLevel: 'hi'
	});
	// We still want the default hook's 'profile' behavior.
  if (options.profile)
    user.profile = options.profile;
  return user;
});
}


Meteor.methods({

	updatePeeps: function(html,css,js,user) {
		if (! Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}

		console.log('user '+user, ' updated')
		//$set sets only these vars and leaves the others alone
		Peeps.update({owner:user},{ $set: {
			html: html,
			css: css,
			js: js
		}
		});
	},

  settingsPeeps: function(icon,iconcolor,message,theme,user) {
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    console.log('user '+user, 'settings updated')

    Peeps.update({owner:user},{ $set: {
      icon: icon,
      iconcolor: iconcolor,
      message: message,
      theme: theme
    }
    });
  }


});
