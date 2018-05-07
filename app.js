//NavCoin KB-Helper for r/NavCoin

//declaring dependencies and variables
require('dotenv').config();

const Snoowrap = require('snoowrap');
const Snoostorm = require('snoostorm');

var rep;
var case_ident = true; var valid = false;
var user;

//Build Snoowrap and Snoostorm clients
const r = new Snoowrap({
	userAgent: 'kb-helper-reddit',
	clientId: process.env.CLIENT_ID,
	clientSecret: process.env.CLIENT_SECRET,
	username: process.env.REDDIT_USER,
	password: process.env.REDDIT_PASS
});

const client = new Snoostorm(r);
console.log('Logged in as ' + r.username);

//Configure Subreddit and Stream-Size
const streamOpts = {
	subreddit: 'sandkasten2',
	results: 25
};
console.log('Watching comments from /r/' + streamOpts.subreddit + '\n');

//Configure sleep function (https://www.sitepoint.com/delay-sleep-pause-wait/)
function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

//Convert date in ms format to string
function convertDate(time){
	var date = new Date(time * 1000);
	return date;
}


//Apply settings and create stream
const comments = client.CommentStream(streamOpts);

//Act on comment
comments.on('comment', (comment) => {
	//Split comment body after ! and switch by argument
	if (comment.body.substring(0, 1) == '!') {
			var args = comment.body.substring(1).split(' ');
			var cmd = args[0];
			var argument = args[1];
			args = args.splice(1);
			//Get Parent comment / submission author and add to reply message
			var comment_parent = comment.parent_id;
			//Identify type based off first three chars
			//'1' is used to identify comments
			if(comment_parent[1] === '1') {
				//cut away type identifier
				comment_parent = comment_parent.substring(3);
				//I have no fucking idea what this is or why it works but it does somehow
				r.getComment(comment_parent).author.name.then(function(result) {
					console.log('Parent item is a comment. Parent commenter is ' + result.toString());
					user = result.toString();
				});
			}
			//'3' is used to identify submissions
			else if(comment_parent[1] === '3') {
				//cut away type identifier
				comment_parent = comment_parent.substring(3);
				//I have no fucking idea what this is or why it works but it does somehow
				r.getSubmission(comment_parent).author.name.then(function(result) {
					console.log('Parent item is a submission. OP is ' + result.toString());
					user = result.toString();
					console.log(user);
				});
			}
				//Invoked when comment is !kbhelp xxx
				if(cmd === 'kbhelp') {
					switch(argument) {
						default:
							rep = 'This search term was not found. You can write "!kbhelp list" to get a list of all commands. \nIf you believe it should be included please contact Jonathan.';
							case_ident: false;
							break;
						case 'about':
							rep = 'If you have a problem with a topic you can type "!kbhelp <search term>". To get a list of all commands write "!kbhelp list". \n\nThe bot is still work in progress. If something is missing or not working contact Jonathan.';
							break;
						case 'list':
							rep = 'This is a list of all currently supported commands.\n\nDefault commands: "about", "list"\nGeneral commands: "data", "bootstrap", "connection", "firewall", "backup", \n                                      "encrypt", "repair", "update", "restore", "electrum"\nSpecific commands: "navpi", "navpay", "paper", "navcoin"';
							break;
						case 'navpi':
							rep = 'Learn how to setup the NavPi [here](https://info.navcoin.org/knowledge-base/how-to-set-up-the-navpi/).';
							break;
						case 'data':
							rep = 'Learn how to find your data folder [here](https://info.navcoin.org/knowledge-base/how-to-find-the-navcoin-data-folder/).';
							break;
						case 'connection':
							rep = 'Learn how to increase your connection count [here](https://info.navcoin.org/knowledge-base/how-to-increase-your-connection-count/).';
							break;
						}
						console.log('!kbhelp ' + argument + ' invoked');
						valid = true
				}
				//invoked when comment is !github xxx
				else if(cmd === 'github') {
					switch(argument) {
						default:
							rep = 'NavCoin is completely open-source. You can find NavCoins protocol applications on https://github.com/NavCoin and second layer applications on https://github.com/Encrypt-S';
							break;
						case 'navpay':
							rep = 'The NavPay repository can be found [here](https://github.com/Encrypt-S/NavPay).'; break;
						case 'navcoin':
							rep = 'The NavCoin Core Wallet repository can be found [here](https://github.com/NavCoin/NavCoin-Core). For the whole protocol repository click [here](https://github.com/NAVCoin/)'; break;
						case 'issue':
							rep = 'To open an issue on GitHub click on "New issue" on [this page for NavCoin Core](https://github.com/NAVCoin/navcoin-core/issues) or [this page for NavPay](https://github.com/Encrypt-S/NavPay/issues)'
						}
						console.log('!GitHub ' + argument + ' invoked.');
						valid = true;
				}
				else {
					console.log('No valid command invoked.');
				}
			}
			comment.reply(rep + '\n\nPinging parent /u/' + user);
			console.log('Identified case: ' + case_ident + '\nReplied at ' + convertDate(comment.created));
			sleep(1000);
		});
