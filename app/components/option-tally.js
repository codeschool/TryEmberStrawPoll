import Ember from 'ember';

export default Ember.Component.extend({
  percentage: function() {
    let votes = this.get('votes');
    let totalVotes = this.get('totalVotes');

    if (totalVotes <= 0) {
      return 0;
    }

    return Math.round(votes * 100 / totalVotes);
  }.property('totalVotes', 'votes')
});
