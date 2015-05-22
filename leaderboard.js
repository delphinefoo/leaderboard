PlayersList = new Mongo.Collection('players');


if(Meteor.isClient){

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
      console.log(playerId)
    },
    'click .increment': function(){
      var selectedPlayer = Session.get('selectedPlayer');
      PlayersList.update(selectedPlayer, {$inc: {score: 5} });
    },
    'click .decrement': function(){
      var selectedPlayer = Session.get('selectedPlayer');
      PlayersList.update(selectedPlayer, {$inc: {score: -5} });
    },
    'submit form': function(event){
      event.preventDefault();
      var playerNameVar = event.target.playerName.value;
      var playerScoreVar = event.target.addScore.value;
      var currentUserId = Meteor.userId();
      PlayersList.insert({
        name: playerNameVar,
        score: playerScoreVar,
        createdBy: currentUserId
      });
      event.target.playerName.value = '';
      event.target.addScore.value = '';

    },
    'click .remove': function(){
      var selectedPlayer = Session.get('selectedPlayer');
      confirm('Are you sure you want to remove ' + PlayersList.findOne(selectedPlayer).name + '?');
      PlayersList.remove(selectedPlayer);
    }
  });
}

if(Meteor.isServer){
  Meteor.publish('thePlayers', function(){
    var currentUserId = this.userId;
    return PlayersList.find({createdBy: currentUserId})
  });
}