import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    voteFor(option) {
      option.incrementProperty('votes');
      this.transitionTo('polls.poll.results');
    }
  },

  model(params) {
    return this.modelFor('polls').findBy('id', params['poll_id']);
  }
});
