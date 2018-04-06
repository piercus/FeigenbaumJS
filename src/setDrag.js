var resizeBox = function({w, h, x, y, rect}){
	rect.style.width = Math.abs(w)+"px";

	if(w>=0){
		rect.style.left = (x)+"px";
	} else {
		rect.style.left = (w + x)+"px";
	}


	rect.style.height = Math.abs(h)+"px";
	if(h>=0){
		rect.style.top = (y)+"px";
	} else {
		rect.style.top = (y + h)+"px";
	}

};

var display = function({rect}){
	rect.style.display = "block";
};

var hide = function({rect}){
	rect.style.display = "none";
}

/**
* @param {Object} options
* @param {HTMLElement} options.el el that is clickable
* @param {Box} options.box
* @param {HTMLElement} options.rect rectangle HTMLElement
* @param {function(dragging)} options.onSelect function that is called after the drop
*/
var setDrag = function({el, box, rect, onSelect}){
    var dragX,
			dragY,
			startX,
			startY;

		var dragging = false;

    var resetDrag = function(){
      dragX = 0;
      dragY = 0;
    };

    el.addEventListener("mousemove",function(event){
			if(dragging){
				dragging.w = event.x - dragging.x;
				dragging.h = event.y - dragging.y;
				resizeBox(dragging)
			}
      //
      // dragY+= d3.event.dy;
      // //console.log("on drag",dragX,dragY,x,y);

      //resizeBox({x: dragX, y: dragY, rect: rect});

    })
		el.addEventListener("mousedown",function(event){
			dragging = {
				x : event.x,
				y: event.y,
				w:0,
				h:0,
				rect: rect
			};
			resizeBox(dragging)
			display({rect})
			event.stopPropagation();
      // d3.event.sourceEvent.stopPropagation(); // silence other listeners
      // var s = d3.select("#chart1 svg"),
      //     left = s.node().getBoundingClientRect().left,
      //     top = s.node().getBoundingClientRect().top;
      //
      // startX = d3.event.sourceEvent.clientX-left;
      // startY = d3.event.sourceEvent.clientY-top;
      // rect = s.append("rect")
      //   .attr("style", "fill:blue;stroke:blue;stroke-width:5;opacity:0.1")
      //   .attr("x",startX)
      //   .attr("y",startY);
      //
      // //console.log("dragstart", d3.event, drag.origin());
      // resetDrag();

    })

		el.addEventListener("mouseup",function(event){
			hide({rect});
			onSelect(dragging);
			dragging = false;
      // rect.remove();
      //
      // var graphRect = d3.select(".nv-groups").node().getBoundingClientRect();
      //
      // var svgRect = d3.select('#chart1 svg').node().getBoundingClientRect();
      //
      // var dragRect = {
      //   left : Math.min(startX, startX + dragX)+svgRect.left,
      //   right : Math.max(startX, startX + dragX)+svgRect.left,
      //   top : Math.min(startY, startY + dragY)+svgRect.top,
      //   bottom : Math.max(startY, startY + dragY)+svgRect.top
      // };
      //
      //
      //
      // ratioPixelScale = [
      //   (box[0][1] - box[0][0])/(graphRect.right-graphRect.left),
      //   (box[1][1] - box[1][0])/(graphRect.bottom-graphRect.top),
      // ];
      //
      // newBox = [[
      //     (dragRect.left-graphRect.left)*ratioPixelScale[0]+box[0][0],
      //     (dragRect.right-graphRect.right)*ratioPixelScale[0]+box[0][1]
      //   ],[
      //     (-1)*(dragRect.bottom-graphRect.bottom)*ratioPixelScale[1]+box[1][0],
      //     (-1)*(dragRect.top-graphRect.top)*ratioPixelScale[1]+box[1][1]
      // ]];
      //
      // //console.log(newBox, dragRect, graphRect, ratioPixelScale, box);
      //
      // drawBif({box : newBox})

    });
}
