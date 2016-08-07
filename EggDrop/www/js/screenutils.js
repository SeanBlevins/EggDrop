var Utils;
(function (Utils) {
    var ScreenMetrics = (function () {
        function ScreenMetrics() {
        }
        return ScreenMetrics;
    })();
    Utils.ScreenMetrics = ScreenMetrics;
    ;
    var ScreenUtils = (function () {
        function ScreenUtils() {
        }
        // -------------------------------------------------------------------------
        ScreenUtils.calculateScreenMetrics = function (defaultWidth, defaultHeight) {
            var gameAspect = defaultWidth / defaultHeight;
            var aspect = "default";

            var pixRatio = (window.devicePixelRatio == 0) ? 1 : window.devicePixelRatio;
			
			var windowWidth = window.innerWidth;
            var windowHeight = window.innerHeight;
			var windowAspect = windowWidth / windowHeight;
			
			var heightScale = windowHeight / defaultHeight;
			
			var displayWidth = windowWidth * pixRatio;
			var displayHeight = windowHeight * pixRatio;
			
			if(windowAspect >= 0.7) {
			    aspect = "fat";
			} else if(windowAspect <= 0.6) {
			    aspect = "tall";
			} else {
			    //normal 3:2
			}
            
            var gameSize = "xsmall";
            var bgWidth;
            var bgHeight;
            var fontSize = {
	            small : 20,
	            medium : 28,
	            large : 36
            };
            
            if (aspect == "fat") {
                bgWidth = 360;
                bgHeight = 480;
                if (displayWidth > 360) {
                    gameSize = "small";
                    bgWidth = 540;
                    bgHeight = 720;
                }
                if (displayWidth > 540) {
                    gameSize = "medium";
                    bgWidth = 720;
                    bgHeight = 960;
                }
                if (displayWidth > 720) {
                    gameSize = "large";
                    bgWidth = 1080;
                    bgHeight = 1440;
                }
                if (displayWidth > 1080) {
                    gameSize = "xlarge";
                    bgWidth = 1440;
                    bgHeight = 1920;
                }
                
            } else if (aspect == "tall") {
                bgWidth = 320;
                bgHeight = 570;
                if (displayHeight > 570) {
                    gameSize = "small";
                    bgWidth = 480;
                    bgHeight = 855;
                }
                if (displayHeight > 855) {
                    gameSize = "medium";
                    bgWidth = 640;
                    bgHeight = 1140;
                }
                if (displayHeight > 1140) {
                    gameSize = "large";
                    bgWidth = 960;
                    bgHeight = 1710;
                }
                if (displayHeight > 1710) {
                    gameSize = "xlarge";
                    bgWidth = 1280;
                    bgHeight = 2280;
                }
            } else {
                bgWidth = 320;
                bgHeight = 480;
                if (displayWidth > 320) {
                    gameSize = "small";
                    bgWidth = 480;
                    bgHeight = 720;
                }
                if (displayWidth > 480) {
                    gameSize = "medium";
                    bgWidth = 640;
                    bgHeight = 960;
                }
                if (displayWidth > 640) {
                    gameSize = "large";
                    bgWidth = 960;
                    bgHeight = 1440;
                }
                if (displayWidth > 960) {
                    gameSize = "xlarge";
                    bgWidth = 1280;
                    bgHeight = 1920;
                }
            }
            

            var bgWidthScale = windowWidth / bgWidth;
            var bgHeightScale = windowHeight / bgHeight;
            
            var gamePixScale = Math.max(bgWidthScale, bgHeightScale);

            fontSize.small = Math.round(heightScale * fontSize.small);
            fontSize.medium = Math.round(heightScale * fontSize.medium);
            fontSize.large = Math.round(heightScale * fontSize.large);
            
            console.log('----------------------------------');

            console.log("aspect       : " + aspect);
            console.log("Game size    : " + gameSize);
            
            console.log("bgWidthScale : " + bgWidthScale);
            console.log("bgHeightScale: " + bgHeightScale);
            
            console.log("gamePixScale : " + gamePixScale);
            console.log('pixRatio     : ' + pixRatio);
            
            console.log('windowWidth  : ' + windowWidth);
		    console.log('windowHeight : ' + windowHeight);
			console.log('windowAspect : ' + windowAspect);
			
			console.log('heightScale  : ' + heightScale);
			
			console.log(fontSize);
			
			console.log('----------------------------------');

            this.screenMetrics = new ScreenMetrics();
            this.screenMetrics.windowWidth = windowWidth;
            this.screenMetrics.windowHeight = windowHeight;

            this.screenMetrics.windowAspect = windowAspect;
            
            this.screenMetrics.defaultGameWidth = defaultWidth;
            this.screenMetrics.defaultGameHeight = defaultHeight;
            
            this.screenMetrics.bgWidthScale = bgWidthScale;
            this.screenMetrics.bgHeightScale = bgHeightScale;
            
            this.screenMetrics.gameSize = gameSize;
            this.screenMetrics.fontSize = fontSize;
            
            this.screenMetrics.bgWidth = bgWidth;
            this.screenMetrics.bgHeight = bgHeight;
            
            this.screenMetrics.pixRatio = pixRatio;
            this.screenMetrics.gamePixScale = gamePixScale;
            this.screenMetrics.heightScale = heightScale;
            return this.screenMetrics;
        };
        return ScreenUtils;
    })();
    Utils.ScreenUtils = ScreenUtils;
})(Utils || (Utils = {}));
//# sourceMappingURL=screenutils.js.map