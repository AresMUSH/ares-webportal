import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({

  gameApi: service(),
  flashMessages: service(),
  showReport: false,
  selectedReportMessage: null,
  reportReason: '',
  chatMessage: '',
  
  chatAlerts: computed('channel.muted', 'scrollPaused', function() {
    let alertList = [];
    if (this.scrollPaused) {
      alertList.push("Scrolling is paused!");
    }
    if (this.get('channel.muted')) {
      alertList.push("This channel is muted.  You will not see new messages until you unmute.");
    }
    return alertList;
  }),
  
  canTalk: computed('channel.{muted,can_talk}', function() {
    return this.channel.can_talk && !this.channel.muted;
  }),
  
  actions: {
    
    leaveChannel: function() {
        let api = this.gameApi;
        let channelKey = this.get('channel.key');
                    
        api.requestOne('leaveChannel', { channel: channelKey }, null)
        .then( (response) => {
            if (response.error) {
                return;
            }
            this.set('channel.enabled', false);
        });
    },
    
    muteChannel: function(mute) {
        let api = this.gameApi;
        let channelKey = this.get('channel.key');
                    
        api.requestOne('muteChannel', { channel: channelKey, mute: mute }, null)
        .then( (response) => {
            if (response.error) {
                return;
            }
            if (mute) {
              this.set('channel.muted', true);
            }
            else {
              let existingIds = this.channel.messages.map(m => m.id);
              let newMessages = response.channel.messages.filter(m => !existingIds.includes(m.id));
              newMessages.forEach(m => this.channel.messages.pushObject(m));
              this.set('channel.who', response.channel.who);
              this.set('channel.muted', false);    
              this.scrollDown();          
            }
        });
    },
    
    reportChat: function() {
      let api = this.gameApi;
      let channelKey = this.get('channel.key');
      let reason = this.reportReason;
      let message = this.selectedReportMessage;
      this.set('reportReason', '');
      this.set('showReport', false);
      this.set('selectedReportMessage', null);
      
      
      if (reason.length == 0) {
        this.flashMessages.danger('You must enter a reason for the report.');
        return;
      }
      
      let command = this.get('channel.is_page') ? 'reportPage' : 'reportChat';
      
      api.requestOne(command, { key: channelKey, start_message: message, reason: reason }, null)
      .then( (response) => {
          if (response.error) {
              return;
          }
          this.flashMessages.success('The messages have been reported to the game admin.');
      });
      
    },
    
    send: function() {
        let api = this.gameApi;
        let channelKey = this.get('channel.key');
        let message = this.chatMessage;
        
        if (message.length === 0) {
            this.flashMessages.danger("You haven't entered anything.");
            return;
        }
        
        this.set(`chatMessage`, '');
                  
        if (this.get('channel.is_page'))  {
          api.requestOne('sendPage', { thread_id: channelKey, message: message }, null)
          .then( (response) => {
              if (response.error) {
                  return;
              }
          }); 
        } else {
          api.requestOne('chatTalk', { channel: channelKey, message: message }, null)
          .then( (response) => {
              if (response.error) {
                  return;
              }
          });
        }
    },
    
    scrollDown() {
      this.scrollDown();
    },
    
    pauseScroll() {
      this.setScroll(false);
    },
    unpauseScroll() {
      this.setScroll(true);
    },
  }
  
});
