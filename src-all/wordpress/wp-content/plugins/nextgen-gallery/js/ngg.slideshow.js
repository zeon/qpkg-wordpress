jQuery.fn.nggSlideshow = function ( args ) { 
    
    var defaults = { id:    1,
                     width: 320,
                     height: 240,
                     fx: 	'fade',
                     domain: '',
                     timeout: 5000 };
                     
    var s = jQuery.extend( {}, defaults, args);
    
    var obj = this.selector;
    var stack = [];
    var url = s.domain + 'index.php?callback=json&api_key=true&format=json&method=gallery&id=' + s.id;

	jQuery.getJSON(url, function(r){
		if (r.stat == "ok"){
             
            for (img in r.images) {
				var photo = r.images[img];
                //populate images into an array
                stack.push( decodeURI( photo['imageURL'] ) );
            }
            
            // push the first three images out
            var i = 1, counter = 0;
            while (stack.length && i <= 3) {
                var img = new Image(); 
                img.src = stack.shift();
                jQuery( img ).bind('load', function() {
                    jQuery( obj ).append( imageResize(this, s.width , s.height) );
                    counter++;
                    // start cycle after the third image
                    if (counter == 3 || stack.length == 0 )
                        startSlideshow();                        
                });
                i++;
            }
            
		}
	});

    function startSlideshow() {

        // hide the loader icon
    	jQuery( obj + '-loader' ).empty().remove();
        
        // Start the slideshow
        jQuery(obj + ' img:first').fadeIn(1000, function() {
       	    // Start the cycle plugin
        	jQuery( obj ).cycle( {
        		fx: 	s.fx,
                containerResize: 1,
                fit: 1,
                timeout: s.timeout,
                next:   obj,
                before: jCycle_onBefore
        	});
        });
        
    }

    //Resize Image and keep ratio on client side, better move to server side later
    function imageResize(img, maxWidth , maxHeight) {

        // hide it first
        jQuery( img ).css({
          'display': 'none'
        });
        
        // in some cases the image is not loaded, we can't resize them
        if (img.height == 0 || img.width == 0)
            return img;
 
        var height = (img.height < maxHeight) ? img.height : maxHeight;
       	var width  = (img.width  < maxWidth)  ? img.width  : maxWidth;
        if (img.height >= img.width)
        	width = Math.floor( Math.ceil(img.width / img.height * maxHeight) );
        else
        	height = Math.floor( Math.ceil(img.height / img.width * maxWidth) );
  
        jQuery( img ).css({
          'height': height,
          'width': width
        });
        
        return img;
	};

    // add images to slideshow step by step
    function jCycle_onBefore(curr, next, opts) {
        if (opts.addSlide)
            if (stack.length) {
                var img = new Image(); 
                img.src = stack.shift();
                jQuery( img ).bind('load', function() {
                    opts.addSlide( imageResize(this, s.width , s.height) );                     
                });
            }
    }; 
}