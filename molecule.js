(function(window, document){
   
    window.onload = function(){
        
        var canvas;
        var ctx;
        var Width,
            Height,
            i,j,
            molecules = [],
            moleculesTimer,
            cursor,            
            //default values: Change according to your need
            numMolecules = 50,
            minDistance = 50,
            moleculeColor = "rgba(255, 255, 255, .5)",
            moleculeSpeed = 0.5,            
            moleculeSizeMax = 3,
            moleculeSizeMin = 1;

        createCanvas();
        
        setCanvas();

        // Generate the molecules
        generateMolecules();

        //start the timer here
        draw();
       // moleculesTimer = setInterval(draw, 100);
     
        document.getElementsByTagName("body")[0].addEventListener("mousemove", function(e){
            cursor.x = e.pageX;
            cursor.y = e.pageY; 
        });        
       
        function draw(){
            //clear canvas
            ctx.clearRect(0, 0, Width, Height);

            // draw the molecules and their bonds
            ctx.strokeStyle = moleculeColor;        
            drawMolecules();
            requestAnimationFrame(draw);
        }

        function generateRandom(min, max){
             return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        function generateMolecules(){
            for(i = 0; i < numMolecules; i++){
                var newMolecule = {
                    size :generateRandom(moleculeSizeMin, moleculeSizeMax),
                    y: generateRandom(0,Height),
                    x: generateRandom(0, Width), 
                    vx: Math.random()/2,// generateRandom(-moleculeSpeed, moleculeSpeed), 
                    vy: Math.random()/2,//generateRandom(-moleculeSpeed, moleculeSpeed),
                    angle: generateRandom(-Math.PI, Math.PI)
                };

                molecules.push(newMolecule);   
            } 
        }

        function drawMolecules() {
            for(var length = molecules.length-1, i = length; i >= 0; i--){

                var m1 = molecules[i];

                m1.x += Math.cos(m1.angle) * m1.vx;
                m1.y += Math.sin(m1.angle) * m1.vy;

                ctx.beginPath();           
                ctx.arc(m1.x, m1.y, m1.size, 0, 360);
                ctx.stroke();
                
                ctx.beginPath(); 
                ctx.fillStyle = moleculeColor;
                ctx.arc(m1.x, m1.y, m1.size-1, 0, 360);
                ctx.fill();
                
                let offset = 20;
                if(m1.x < -offset || m1.x > Width+offset) m1.vx *= -1;
                else if(m1.y < -offset || m1.y > Height+offset) m1.vy *= -1;


                for(var length2 = molecules.length-1, j = length2; j >= 0; j--){
                    var m2 = molecules[j];
                    var x1 = m1.x;
                    var y1 = m1.y;
                    var x2 = m2.x;
                    var y2 = m2.y;
                    var distance = Math.sqrt(Math.pow(x2-x1, 2) + Math.pow(y2-y1, 2));
                    if(distance < minDistance){                        
                        ctx.lineWidth = 0.4;
                        ctx.beginPath();  
                        ctx.moveTo(m1.x, m1.y); 
                        ctx.lineTo(m2.x, m2.y);                               
                        ctx.stroke(); 
                        ctx.lineWidth = 1;
                    }
                }
            }
        }

        function createCanvas(){            
            canvas = document.createElement("canvas");
            ctx = canvas.getContext('2d');            
            document.getElementsByTagName('body')[0].appendChild(canvas);            
        }
        
        function setCanvas(){

            Width = window.innerWidth;
            Height = window.innerHeight;            
            canvas.setAttribute("width", Width);
            canvas.setAttribute("height", Height);            
            canvas.style.position = "absolute";
            canvas.style.left = 0;
            canvas.style.top = 0;            
            canvas.style.zIndex = -1;
            canvas.style.cursor = "default";
           
            molecules = [];
            generateMolecules();            
            
            // create and push the push the cursor molecule initially
            cursor = {size: 1, y: 0, x: 0, speedX: 0, speedY: 0};    
            molecules.push(cursor);
                        
        }

        window.onresize = function(){            
            setCanvas(); 
        }
       
    };
   
}(window, document));
