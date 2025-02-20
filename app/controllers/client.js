import { computed } from '@ember/object';
import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import AresConfig from 'ares-webportal/mixins/ares-config';
import { action } from '@ember/object';
import { pushObject } from 'ares-webportal/helpers/object-ext';
import { scrollElementToBottom } from 'ares-webportal/helpers/scroll-element';

export default Controller.extend(AresConfig, {
  connected: false,
  consoleText: '',
  text1: '',
  text2: '',
  gameSocket: service(),
  favicon: service(),
  messages: null,
  history1: null,
  history2: null,
  showHistory1: false,
  showHistory2: false,
  scrollPaused: false,

  init: function() {
    this._super(...arguments);
    this.set('messages', []);
    this.set('history1', []);
    this.set('history2', []);
  },
      
  idleKeepalive: function() {
    if (this.connected) {
      this.sendInput("keepalive");
    }
    else {
      clearInterval(this.keepaliveInterval);
    }
  },
    
  onMessage: function(evt) {
    var data;
        
    try
    {
      data = JSON.parse(evt.data);
    }
    catch(e)
    {
      data = null;
    }
        
    if (!data) {
      return;
    }
        
    var notification_type = data.args.notification_type;
        
    if (notification_type != "webclient_output") {
      return;
    }
        
    let html = ansi_up.ansi_to_html(data.args.message);
    pushObject(this.messages, html, this, 'messages');
    this.scrollToBottom();  
    this.gameSocket.notify("");
  },
  onConnect: function(self) {
    document.getElementById("sendMsg").focus();
    self.set('connected', true);   
    self.set('messages', []); 
    self.set('scrollPaused', false);
        
    let cmd = {
      'type': 'identify',
      'data': { 'id': this.charId, 'webclient': true }
    };
    let json = JSON.stringify(cmd);
    this.websocket.send(json);
  },
    
  onDisconnect: function(self) {
    self.set('connected', false);
  },
    
  scrollToBottom: function() {
    // Unless scrolling paused 
    if (this.scrollPaused) {
      return;
    }
     
    scrollElementToBottom('console'); 
  },
    
  showDisconnect: computed('connected', function() {
    return this.connected;
  }),
    
  showConnect: computed('connected', function() {  
    return !this.connected;
  }),
    
  sendInput: function(msg) {
    var cmd, json;
    cmd = {
      'type': 'input',
      'message': msg.trim()
    };
    json = JSON.stringify(cmd);
    let socket = this.websocket;
    if (socket) {
      socket.send(json);
    }
  },
    
    
  @action
  connect() {
    let idle_keepalive_ms = 60000;
    let protocol = this.httpsEnabled ? 'wss' : 'ws';
      
    this.set('websocket', new WebSocket(`${protocol}://${this.mushHost}:${this.websocketPort}/websocket`));
    var self = this;
    this.websocket.onmessage = function(evt) { 
      self.onMessage(evt);
    };
    this.websocket.onclose = function() {
      self.onDisconnect(self);
    };
    this.websocket.onopen = function() {
      self.onConnect(self);
    };
            
    this.set('keepaliveInterval', window.setInterval(function(){ self.idleKeepalive() }, idle_keepalive_ms));
            
  },
      
  @action
  disconnect() {
    if (this.connected){
      this.sendInput('quit');                    
    }
  },
      
  @action
  sendMsg1() {
    let cmd = this.text1;
    this.sendInput(cmd);
    this.set('text1', '');
    pushObject(this.history1, cmd); 
    if (this.history1.length > 10) {
      this.history1.splice(0, 1);
    }
  },
      
  @action
  sendMsg2() {
    let cmd = this.text2;
    this.sendInput(cmd);
    this.set('text2', '');
    pushObject(this.history2, cmd); 
    if (this.history2.length > 10) {
      this.history2.splice(0, 1);
    }
  },
      
  @action
  loadHistory1(text) {
    this.set('text1', text);
    this.set('showHistory1', null);
  },
      
  @action
  loadHistory2(text) {
    this.set('text2', text);
    this.set('showHistory2', null);
  },
      
  @action
  pauseScroll() {
    this.set('scrollPaused', true);
  },
      
  @action
  unpauseScroll() {
    this.set('scrollPaused', false);
    this.scrollToBottom();
  },
  
  @action
  setShowHistory1(value) {
    this.set('showHistory1', value);
  },
  
  @action
  setShowHistory2(value) {
    this.set('showHistory2', value);
  }
});
