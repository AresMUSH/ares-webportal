import $ from "jquery"
import { computed } from '@ember/object';
import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
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
    this.messages.pushObject(html);
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
      
    try {
      $('#console').stop().animate({
        scrollTop: $('#console')[0].scrollHeight + 1000
      }, 800);           
    }
    catch(error) {
      // This happens sometimes when transitioning away from play screen.
    }      
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
    
    
  actions: {
    connect() {
      var idle_keepalive_ms = 60000;
      var protocol = aresconfig.use_https ? 'wss' : 'ws';
      this.set('websocket', new WebSocket(`${protocol}://${aresconfig.host}:${aresconfig.websocket_port}/websocket`));
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
      disconnect() {
        if (this.connected){
          this.sendInput('quit');                    
        }
      },
      sendMsg1() {
        let cmd = this.text1;
        this.sendInput(cmd);
        this.set('text1', '');
        this.history1.addObject(cmd); 
        if (this.history1.length > 10) {
          this.history1.removeAt(0);
        }
      },
      sendMsg2() {
        let cmd = this.text2;
        this.sendInput(cmd);
        this.set('text2', '');
        this.history2.addObject(cmd); 
        if (this.history2.length > 10) {
          this.history2.removeAt(0);
        }
      },
      loadHistory1(text) {
        this.set('text1', text);
        this.set('showHistory1', null);
      },
      loadHistory2(text) {
        this.set('text2', text);
        this.set('showHistory2', null);
      },
      pauseScroll() {
        this.set('scrollPaused', true);
      },
      unpauseScroll() {
        this.set('scrollPaused', false);
        this.scrollToBottom();
      }
    }
  });
