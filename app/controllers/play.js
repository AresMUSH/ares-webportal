import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  connected: false,
  consoleText: '',
  text1: '',
  text2: '',
  gameSocket: service(),
  favicon: service(),
  messages: [],
  history1: [],
  history2: [],
  showHistory1: false,
  showHistory2: false,
  scrollPaused: false,
    
  idleKeepalive: function() {
    if (this.get('connected')) {
      this.sendInput("keepalive");
    }
    else {
      clearInterval(this.get('keepaliveInterval'));
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
    this.get('messages').pushObject(html);
    this.scrollToBottom();  
    this.get('gameSocket').notify(null);
  },
  onConnect: function(self) {
    document.getElementById("sendMsg").focus();
    self.set('connected', true);   
    self.set('messages', []); 
    self.set('scrollPaused', false);
        
    let cmd = {
      'type': 'identify',
      'data': { 'id': this.get('charId'), 'webclient': true }
    };
    let json = JSON.stringify(cmd);
    this.get('websocket').send(json);
  },
    
  onDisconnect: function(self) {
    self.set('connected', false);
  },
    
  scrollToBottom: function() {
    // Unless scrolling paused 
    if (this.get('scrollPaused')) {
      return;
    }
      
    try {
      $('#console').stop().animate({
        scrollTop: $('#console')[0].scrollHeight
      }, 800);           
    }
    catch(error) {
      // This happens sometimes when transitioning away from play screen.
    }      
  },
    
  showDisconnect: function() {
    return this.get('connected');
  }.property('connected'),
    
  showConnect: function() {  
    return !this.get('connected');
  }.property('connected'),
    
  sendInput: function(msg) {
    var cmd, json;
    cmd = {
      'type': 'input',
      'message': msg.trim()
    };
    json = JSON.stringify(cmd);
    let socket = this.get('websocket');
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
        this.get('websocket').onmessage = function(evt) { 
          self.onMessage(evt);
        };
        this.get('websocket').onclose = function() {
          self.onDisconnect(self);
        };
        this.get('websocket').onopen = function() {
          self.onConnect(self);
        };
                
        this.get('keepaliveInterval', window.setInterval(function(){ self.idleKeepalive() }, idle_keepalive_ms));

                
      },
      disconnect() {
        if (this.get('connected')){
          this.sendInput('quit');                    
        }
      },
      sendMsg1() {
        let cmd = this.get('text1');
        this.sendInput(cmd);
        this.set('text1', '');
        this.get('history1').addObject(cmd); 
        if (this.get('history1').length > 10) {
          this.get('history1').removeAt(0);
        }
      },
      sendMsg2() {
        let cmd = this.get('text2');
        this.sendInput(cmd);
        this.set('text2', '');
        this.get('history2').addObject(cmd); 
        if (this.get('history2').length > 10) {
          this.get('history2').removeAt(0);
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
