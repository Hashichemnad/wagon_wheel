(function (window, undefined) {
  var document = window.document
  
  , grapher = function (selector, options) {
    return new grapher.prototype.init(selector, options);
  }
  
  , defaults = {
	 wagonColours: [
      ''
      , '#FFFFFF'
      , '#CF54FF'
      , '#FFFF2B'
      , '#1428FC'
      , '#FCAB14'
      , '#FF0D0D'
    ]
    , wagonBackground: '#7CD14B'
    , wagonWidth: 2
    
  }
  
  , combineObjects = function (object1, object2) {
    var key, object = {};
    
    for (key in object1) {
      if (object1.hasOwnProperty(key)) {
        if (object2.hasOwnProperty(key)) {
          object[key] = object2[key];
        }
        else {
          object[key] = object1[key];
        }
      }
    }
    return object;
  }
  
  , axesOffset = 20
  
  , getMousePosition = function(e, elem) {
    var mousePos, elemPos, style
    
    mousePos = {x: 0, y: 0};
    elemPos = {x: elem.offsetLeft, y: elem.offsetTop};
    
    while (elem = elem.offsetParent) {
      if (elem.offsetLeft || elem.offsetTop) {
        elemPos.x += elem.offsetLeft;
        elemPos.y += elem.offsetTop;
      }
    }
    
    if (window.getComputedStyle) {
      style = getComputedStyle(document.body);
    }
    else {
      style = document.body.currentStyle;
    }
    
    elemPos.x += parseInt(style.marginLeft);
    elemPos.y += parseInt(style.marginTop);
    
    if (e.pageX || e.pageY) {
      mousePos.x = e.pageX;
      mousePos.y = e.pageY;
    }
    else if (e.clientX || e.clientY) {
      mousePos.x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
      mousePos.y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    
    mousePos.x -= elemPos.x;
    mousePos.y -= elemPos.y;
    
    return mousePos;
  }
  
  , mouseMoveHandle = function(e) {
    var i, len;
    
    for (i = 0, len = this.g.chartTypes.length; i < len; i++) {
      switch (this.g.chartTypes[i]) {
        case 'pie':
          pieMouseMove.call(this, e);
          break;
      }
    }
  }
  
  , mouseOutHandle = function(e) {
    var i, len;
    
    for (i = 0, len = this.g.chartTypes.length; i < len; i++) {
      switch (this.g.chartTypes[i]) {
        case 'pie':
          pieMouseOut.call(this, e);
          break;
      }
    }
  }
  

  
  grapher.fn = grapher.prototype = {
    init: function (selector, options) {
      var elem;
      
      this.options = combineObjects(defaults, options || {});
      
      if (selector.nodeType) {
        elem = selector;
      }
      else if (typeof selector === 'string') {
        elem = document.getElementById(selector);
      }
      
      this.element = elem;
      this.element.g = this;
      this.chartTypes = [];
      
      if(document.addEventListener)
      {
        elem.addEventListener('mousemove', mouseMoveHandle, false);
        elem.addEventListener('mouseout', mouseOutHandle, false);
      }
      else if(document.attachEvent)
      {
        elem.attachEvent('onmousemove', function(){ return mouseMoveHandle.call(elem, window.event); });
        elem.attachEvent('onmouseout', function(){ return mouseOutHandle.call(elem, window.event); });
      }
      
      return this;
    }
    
  
 
    , wagon: function (data) {
      var center, gRad, i, len, ctx, angle, x, y, length;
      this.element.height=1000;
	  this.element.width=500;
      center = {
        x: this.element.width /2,
        y: this.element.height /2
      };
      
      gRad = Math.min(center.x, center.y) - 10;
      
      center.x = gRad + 0;
      center.y = gRad + 0;
      
      if (this.element.getContext) {
        ctx = this.element.getContext('2d');
        
        ctx.save();
        
        ctx.fillStyle = this.options.wagonBackground;
        
        ctx.beginPath();
        ctx.arc(center.x, center.y, gRad, 0, Math.PI * 2, true);
        
        ctx.fill();
        
        ctx.font = '12px Calibri';
          
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        
        ctx.fillStyle = '#000000';
        
        /*ctx.fillText('Runs', this.element.width - 28, 6);
        
        for (i = 1; i < 7; i++) {
          ctx.fillStyle = this.options.wagonColours[i];
          
          ctx.beginPath();
          ctx.arc(this.element.width - 15, 12 * i + 8, 4, 0, Math.PI * 2, true);
          
          ctx.fill();
          ctx.stroke();
          
          ctx.fillStyle = '#000000';
          
          ctx.fillText(i, this.element.width - 8, 12 * i + 8);
        }*/
        
        ctx.restore();
        
        ctx.save();
        
        ctx.lineWidth = this.options.wagonWidth;
        
        for (i = 0, len = data.length; i < len; i++) {
          if(data[i].runs > 0) {
            angle = data[i].angle / 180 * Math.PI;
            length = data[i].length * gRad;
            
            x = center.x + Math.sin(angle) * length;
            y = center.y - Math.cos(angle) * length;
            
            ctx.strokeStyle = this.options.wagonColours[data[i].runs];
            
            ctx.beginPath();
            
            ctx.moveTo(center.x, center.y);
            ctx.lineTo(x, y);
            
            ctx.stroke();
          }
        }
        
        ctx.restore();
      }
      
      return this;
    }
    
   
    
    , clear: function() {
      if (this.element.getContext) {
        ctx = this.element.getContext('2d');
        
        ctx.clearRect(0, 0, this.element.width, this.element.height);
      }
      
      if (this.pieMouseOvers) {
        this.pieMouseOvers = undefined;
      }
      
      if (this.chartTypes) {
        this.chartTypes = [];
      }
      
      if (this.piePixelData) {
        this.piePixelData = undefined;
      }
      
      return this;
    }
    
    , resetAxes: function() {
      this.maxX = undefined;
      this.maxY = undefined;
      
      return this;
    }
  }
  
  grapher.fn.init.prototype = grapher.fn;
  
  window.g = grapher;
})(this);