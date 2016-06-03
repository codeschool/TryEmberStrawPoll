import Ember from 'ember';
import Poll from 'straw-poll/models/poll';
import Option from 'straw-poll/models/option';

export default Ember.Route.extend({
  model(params) {
    return [
      Poll.create({
        id: '1',
        options: [
          Option.create({id: '1', text: 'Option 1', votes: 2}),
          Option.create({id: '2', text: 'Option 2', votes: 5}),
          Option.create({id: '3', text: 'Option 3', votes: 1}),
          Option.create({id: '4', text: 'Option 4', votes: 7})
        ],
        stem: 'Poll 1 how do you fare?'
      }),
      Poll.create({
        id: '2',
        options: [
          Option.create({id: '5', text: 'Option 1', votes: 2}),
          Option.create({id: '6', text: 'Option 2', votes: 5}),
          Option.create({id: '7', text: 'Option 3', votes: 1}),
          Option.create({id: '8', text: 'Option 4', votes: 7})
        ],
        stem: 'Poll 2 how do you fare?'
      })
    ];
  }
});
