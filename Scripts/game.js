var renderer, scene, camera, pointLight, spotLight;

var fieldWidth = 400, fieldHeight = 200;

var paddleWidth, paddleHeight, paddleDepth, paddleQuality;
var paddle1Y = 0, paddle2Y = 0, paddleSpeed = 3;

var ball, paddle1, paddle2;
var ballX = 1, ballY = 1, ballSpeed = 2;

var score1 = 0, score2 = 0;

var maxScore = 5;

var diffuculty = 0.2;

function setup()
{
    //create the scoreboard
    document.getElementById("winnerBoard").innerHTML = "First to " + maxScore + " wins!";
    score1 = 0;
    score2 = 0;

    //set the 3D objects
    createScene();
    draw();
}

function createScene()
{
    var WIDTH = 640, HEIGHT = 360;

    //camera attributes to be modified
    var ViewAngle = 50, 
        Aspect = WIDTH / HEIGHT, 
        Near = 0.1, 
        Far = 10000;
    
    var c = document.getElementById("gameCanvas");

    renderer = new THREE.WebGLRenderer();
    camera = new THREE.PerspectiveCamera(ViewAngle, Aspect, Near, Far);
    scene = new THREE.Scene();

    scene.add(camera);

    camera.position.z = 320;

    renderer.setSize(WIDTH, HEIGHT);

    c.appendChild(renderer.domElement);

    var planeWidth = fieldWidth,
        planeHeight = fieldHeight,
        planeQuality = 10;
    
    //creat materials
    var paddle1Material = new THREE.MeshLambertMaterial({color: 0xFF0000});
    var paddle2Material = new THREE.MeshLambertMaterial({color: 0x000000});
    var planeMaterial = new THREE.MeshLambertMaterial({color: 0x4BD121});
    var tableMaterial = new THREE.MeshLambertMaterial({color: 0x1B32C0});
    var pillarMaterial = new THREE.MeshLambertMaterial({color: 0x534d0d});
    var groundMaterial = new THREE.MeshLambertMaterial({color: 0x888888});

    //plane
    var plane = new THREE.Mesh(

        new THREE.PlaneGeometry(
            planeWidth * 0.9,
            planeHeight,
            planeQuality,
            planeQuality),
        planeMaterial
    );
    scene.add(plane);
    plane.recieveShadow = true;

    //table
    var table = new THREE.Mesh(
        new THREE.CubeGeometry( 
            planeWidth * 1.05,
            planeHeight * 1.03,
            100,
            planeQuality,
            planeQuality,
            1),
        tableMaterial);
    table.position.z = -51;
    scene.add(table);
    table.recieveShadow = true;

    //the Ball
    var radius = 5, segments = 6, rings = 6;

    var sphereMaterial = new THREE.MeshLambertMaterial({color: 0xD43001});

    ball = new THREE.Mesh(
        new THREE.SphereGeometry(radius, segments, rings),
        sphereMaterial);
    scene.add(ball);
    ball.position.x = 0;
    ball.position.y = 0;
    ball.position.z = radius;
    ball.recieveShadow = true;
    ball.castShadow = true;

    //paddles
    paddleWidth = 10;
    paddleHeight = 30;
    paddleDepth = 10;
    paddleQuality = 1;

    paddle1 = new THREE.Mesh(
        new THREE.CubeGeometry(
            paddleWidth,
            paddleHeight,
            paddleDepth,
            paddleQuality,
            paddleQuality,
            paddleQuality),
        paddle1Material);
    scene.add(paddle1);
    paddle1.recieveShadow = true;
    paddle1.castShadow = true;

    paddle2 = new THREE.Mesh(
        new THREE.CubeGeometry(
            paddleWidth,
            paddleHeight,
            paddleDepth,
            paddleQuality,
            paddleQuality,
            paddleQuality),
        paddle2Material);
        
        scene.add(paddle2);
        paddle2.castShadow = true;
        paddle2.recieveShadow = true;

        paddle1.position.z = paddleDepth;
        paddle2.position.z = paddleDepth;

        paddle1.position.x = -fieldWidth/2 + paddleWidth;
        paddle2.position.x = fieldWidth/2 - paddleWidth;

        for (var i = 0; i < 5; i++)
        {
            var backdrop = new THREE.Mesh(
                new THREE.CubeGeometry(30, 30, 300, 1, 1, 1),
                pillarMaterial);
            backdrop.position.x = -50 + i * 100;
            backdrop.position.y = 230;
            backdrop.position.z = -30;
            backdrop.castShadow = true;
            backdrop.recieveShadow = true;
            scene.add(backdrop);
        }
        for (var i = 0; i < 5; i++)
        {
            var backdrop = new THREE.Mesh(
                new THREE.CubeGeometry(30, 30, 300, 1, 1, 1),
                pillarMaterial);
            backdrop.position.x = -50 + i * 100;
            backdrop.position.y = -230;
            backdrop.position.z = -30;
            backdrop.castShadow = true;
            backdrop.recieveShadow = true;
            scene.add(backdrop);
        }

        var ground = new THREE.Mesh(
            new THREE.CubeGeometry(1000, 1000, 3, 1, 1, 1),
            groundMaterial);
        ground.position.z = -132;
        ground.recieveShadow = true;
        scene.add(ground);

        //create point light
        pointLight = new THREE.PointLight(0xF8D898);
        pointLight.position.x = -1000;
        pointLight.position.y = 0;
        pointLight.position.z = 1000;
        pointLight.intensity = 2.9;
        pointLight.distance = 10000;
        scene.add(pointLight);

        //creat spot light
        spotLight = new THREE.SpotLight(0xF8D898);
        spotLight.position.set(0, 0, 460);
        spotLight.intensity = 1.5;
        spotLight.castShadow = true;
        scene.add(spotLight);

        renderer.shadowMapEnabled = true;
}

function ballPhysics()
{
    if (ball.position.x <= -fieldWidth/2)
    {
        score2++;
        document.getElementsById("scores").innerHTML = score1 + "-" + score2;
        resetBall(2);
        matchScoreCheck();
    }
    if (ball.position.x >= fieldWidth/2)
    {
        score1++;
        document.getElementsById("scores").innerHTML = score1 + "-" + score2;
        resetBall(1);
        matchScoreCheck();
    }
    if(ball.position.y >= fieldWidth/2)
    {
        ballY = -ballY;
    }
    if(ball.position.y <= -fieldWidth/2)
    {
        ballY = -ballY;
    }

    ball.position.x += ballX * ballSpeed;
    ball.position.y += ballY * ballSpeed;

    if (ballY > ballSpeed * 2)
    {
        ballY = ballSpeed * 2;
    }
    else if (ballY < -ballSpeed * 2)
    {
        ballY = -ballSpeed * 2;
    }
}

function player1PaddleMovement()
{
    if (Key.isDown(key.A))
    {
        if (paddle1.position.y < fieldHeight * 0.45)
        {
            paddle1Y = paddleSpeed * 0.5;
        }
        else
        {
            paddle1Y = 0;
            paddle1.scale.z += (10 - paddle1.scale.z) * 0.2;
        }
    }
    else if (key.isdown(key.D))
    {
        if (paddle1.position.y > -fieldHeight * 0.45)
        {
            paddle1Y = -paddleSpeed * 0.5;
        }
        else
        {
            paddle1Y = 0;
            paddle1.scale.z += (10 - paddle1.scale.z) * 0.2;
        }
    }
    else
    {
        paddle1Y = 0;
    }

    paddle1.scale.y += (1 - paddle1.scale.y) * 0.2;
    paddle1.scale.z += (1 - paddle1.scale.z) * 0.2;
    paddle1.position.y += paddle1Y;
}

function player2PaddleMovement() {
    if (Key.isDown(key.LEFT_ARROW)) {
        if (paddle2.position.y < fieldHeight * 0.45) {
            paddle2Y = paddleSpeed * 0.5;
        } else {
            paddle2Y = 0;
            paddle2.scale.z += (10 - paddle2.scale.z) * 0.2;
        }
    } else if (Key.isDown(key.RIGHT_ARROW)) {
        if (paddle2.position.y > -fieldHeight * 0.45) {
            paddle2Y = -paddleSpeed * 0.5;
        } else {
            paddle2Y = 0;
            paddle2.scale.z += (10 - paddle2.scale.z) * 0.2;
        }
    } else {
        paddle2Y = 0;
    }

    paddle2.scale.y += (1 - paddle2.scale.y) * 0.2;
    paddle2.scale.z += (1 - paddle2.scale.z) * 0.2;
    paddle2.position.y += paddle2Y;
}

function cameraPhysics()
{
    spotLight.position.x = ball.position.x * 2;
    spotLight.position.y = ball.position.y * 2;

    camera.position.x = paddle1.position.x - 100;
    camera.position.y += (paddle1.position.y - camera.position.y) * 0.05;
    camera.position.z = paddle1.position.z + 100 + 0.04 * (-ball.position.x + paddle1.position.x);

    camera.rotation.z = -0.01 * ball.position.y * Math.PI/180;
    camera.rotation.y = -60 * Math.PI/180;
    camera.rotation.x = -90 * Math.PI/180;
}

function resetBall(loser)
{
    ball.position.x = 0;
    ball.position.y = 0;

    if (loser == 1)
    {
        ballX = -1;
    }
    else
    {
        ballX = 1;
    }
    ballY = 1;
}

var bounceTime = 0;

function matchScoreCheck()
{
    if (score1 >= maxScore)
    {
        ballSpeed = 0;
        document.getElementById("scores").innerHTML = "Player wins!";
        document.getElementById("winnerBoard").innerHTML = "Refresh to play again";
        bounceTime++;
        paddle1.position.z = Math.sin(bounceTime * 0.1) * 10;

        paddle1.scale.z = 2 + Math.abs(Math.sin(bounceTime * 0.1)) * 10;
        paddle1.scale.y = 2 + Math.abs(Math.sin(bounceTime * 0.05)) * 10;
    }
    else if (score2 >= maxScore)
    {
        ballSpeed = 0;
        document.getElementById("scores").innerHTML = "SPU wins!";
        document.getElementById("winnerBoard").innerHTML = "Refresh to play again";
        bounceTime++;
        paddle2.position.z = Math.sin(bounceTime * 0.1) * 10;
        paddle2.scale.y = 2 + Math.abs
    }
}

function paddlePhysics()
{
    if (ball.position.x <= paddle1.position.x + paddleWidth 
        && ball.position.x >= paddle1.position.x)
        {
            if (ball.position.y <= paddle1.position.y + paddleHeight/2
                && ball.position.y >= paddle1.position.y - paddleHeight/2)
            {
                if (ballX < 0)
                {
                    paddle1.scale.y = 15;
                    ballX = -ballX;
                    ballY -= paddle1Y * 0.7;
                }
            }
        }
    /*
    // if ball is aligned with paddle2 on x plane
    // remember the position is the CENTER of the object
    // we only check between the front and the middle of the paddle (one-way collision)
    if (ball.position.x <= paddle2.position.x + paddleWidth
        && ball.position.x >= paddle2.position.x) {
        // and if ball is aligned with paddle2 on y plane
        if (ball.position.y <= paddle2.position.y + paddleHeight / 2
            && ball.position.y >= paddle2.position.y - paddleHeight / 2) {
            // and if ball is travelling towards opponent (+ve direction)
            if (ballDirX > 0) {
                // stretch the paddle to indicate a hit
                paddle2.scale.y = 15;
                // switch direction of ball travel to create bounce
                ballDirX = -ballDirX;
                // we impact ball angle when hitting it
                // this is not realistic physics, just spices up the gameplay
                // allows you to 'slice' the ball to beat the opponent
                ballDirY -= paddle2DirY * 0.7;
            }
        }
    }*/
}

function draw()
{
    renderer.render(scene, camera);
    requestAnimationFrame(draw);

    ballPhysics();
    player1PaddleMovement();
    player2PaddleMovement();
    paddlePhysics();
    cameraPhysics();
}