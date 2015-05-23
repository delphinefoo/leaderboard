
Meteor.subscribe('thePlayers');

Template.leaderboard.helpers({

  'player': function(){
    var currentUserId = Meteor.userId();
    return PlayersList.find({}, {sort: {score: -1, name: 1} });
  },
  'count': function(){
    return PlayersList.find().count()
  },
  'selectedClass': function(){
    var playerId = this._id;
    var selectedPlayer = Session.get('selectedPlayer');
    if(playerId == selectedPlayer) {
      return "selected"
    }
  },
  'showSelectedPlayer': function() {
    var selectedPlayer = Session.get('selectedPlayer');
    return PlayersList.findOne(selectedPlayer)
  }
});

Template.leaderboard.events({
  
  'click .player': function(){
    var playerId = this._id;
    Session.set('selectedPlayer', playerId);
  },

  'click .increment': function(){
    var selectedPlayer = Session.get('selectedPlayer');
    Meteor.call('modifyPlayerScore', selectedPlayer, 10);
  },

  'click .decrement': function(){
    var selectedPlayer = Session.get('selectedPlayer');
    Meteor.call('modifyPlayerScore', selectedPlayer, -10);
  },

  'submit form': function(event){
    event.preventDefault();
    var playerNameVar = event.target.playerName.value;
    var playerScoreVar = event.target.addScore.value == '' ? 0 : parseInt(event.target.addScore.value);
    Meteor.call('insertPlayerData', playerNameVar, playerScoreVar);
    event.target.playerName.value = '';
    event.target.addScore.value = '';
  },
  'click .remove': function(){
    var selectedPlayer = Session.get('selectedPlayer');
    confirm('Are you sure you want to remove ' + PlayersList.findOne(selectedPlayer).name + '?');
    Meteor.call('removePlayerData', selectedPlayer);
  }
});