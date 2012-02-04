var container;
var camera, scene, renderer, particles, geometry, materials = [], parameters, i, h, color;
var pointLight;
var mousedown = false;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var onMouseDownPosition, radius = 3, theta = 0, onMouseDownTheta = 0, phi = 0, onMouseDownPhi = 0;

init();
render()

function init() {

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    scene = new THREE.Scene();

    if (r3jsdata.camera && r3jsdata.camera.radius) 
	radius = r3jsdata.camera.radius;

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 3000 );
    camera.position.x = radius * Math.sin( theta * Math.PI / 360 ) * Math.cos( phi * Math.PI / 360 );
    camera.position.y = radius * Math.sin( phi * Math.PI / 360 );
    camera.position.z = radius * Math.cos( theta * Math.PI / 360 ) * Math.cos( phi * Math.PI / 360 );
    camera.target = new THREE.Vector3(0, 0, 0);
    camera.lookAt(camera.target);
    camera.updateMatrix();
    scene.add( camera );

    // axis
    if (r3jsdata.options.axisbox) 
	scene.add( new THREE.Mesh( new THREE.CubeGeometry( 1, 1, 1 ), 
				   new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true } )) );

    if (r3jsdata.options.axisline) {
	var origin = new THREE.Vertex(new THREE.Vector3(0,0,0));
	var axisx = new THREE.Geometry();
	axisx.vertices.push(origin);
	axisx.vertices.push(new THREE.Vertex( new THREE.Vector3(1,0,0)));
	scene.add(new THREE.Line( axisx, new THREE.LineBasicMaterial( { color: 0xff0000, opacity: 1, linewidth: 5} )));

	var axisy = new THREE.Geometry();
	axisy.vertices.push(origin);
	axisy.vertices.push(new THREE.Vertex( new THREE.Vector3(0,1,0)));
	scene.add(new THREE.Line( axisy, new THREE.LineBasicMaterial( { color: 0x00ff00, opacity: 1, linewidth: 5} )));

	var axisz = new THREE.Geometry();
	axisz.vertices.push(origin);
	axisz.vertices.push(  new THREE.Vertex( new THREE.Vector3(0,0,1)));
	scene.add(new THREE.Line( axisz, new THREE.LineBasicMaterial( { color: 0x0000ff, opacity: 1, linewidth: 5} )));
    }

    // light
    pointLight = new THREE.PointLight( 0xFFFFFF );
    pointLight.position = new THREE.Vector3(3, 3, 3);
    scene.add(pointLight);
    pointLight = new THREE.PointLight( 0xFFFFFF );
    pointLight.position = new THREE.Vector3(-3, -3, -3);
    scene.add(pointLight);

    // mouse 
    document.addEventListener( 'mousedown', onDocumentMouseDown, false );
    document.addEventListener( 'mouseup', function(e){mousedown = false;}, false );
    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    onMouseDownPosition = new THREE.Vector2();

    // renderer
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    // data
    var segments = 16, rings = 16;
    for (var i = 0; i < r3jsdata.values.length; ++i) {
	var p = r3jsdata.values[i];
	switch(p.type) {
	case "sphere":
	    for ( var j = 0; j < p.n; j ++ ) {
		var sphere = new THREE.Mesh(new THREE.SphereGeometry(p.r[j], segments, rings), new THREE.MeshLambertMaterial({ opacity: p.alpha[j], color: p.col[j]}));
		sphere.position = new THREE.Vector3(p.x[j], p.y[j], p.z[j]);
		scene.add(sphere);
	    }
	    break;
	case "line":
	    var line = new THREE.Geometry();
	    var colors = [];
	    for ( var j = 0; j < p.n; ++ j) {
		line.vertices[j] = new THREE.Vertex( new THREE.Vector3(p.x[j], p.y[j], p.z[j]))
		colors[j] = new THREE.Color(p.col[j]);
	    }
	    line.colors = colors;
	    var material = new THREE.LineBasicMaterial( { color: 0xffffff, opacity: p.alpha, linewidth: p.lwd} );
	    material.vertexColors = true;
	    scene.add(new THREE.Line( line, material));
	    break;
	case "lathe":

	    var points = [];
	    for ( var j = 0; j < p.n; ++ j ) {
		points.push(new THREE.Vector3(p.x[j], p.y[j], p.z[j]))
	    }
	    var object = THREE.SceneUtils.createMultiMaterialObject( new THREE.LatheGeometry( points, 2 ), 
								     [new THREE.MeshLambertMaterial({ opacity: p.alpha, color: p.col}),
								      new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true, opacity: 1 } )]);
	    object.children[ 0 ].doubleSided = true;
	    object.position.set( 0, 0, 0 );
	    scene.add( object );
	}
    }
}

function onDocumentMouseDown( event ) {
    event.preventDefault();
    onMouseDownTheta = theta;
    onMouseDownPhi = phi;
    onMouseDownPosition.x = event.clientX;
    onMouseDownPosition.y = event.clientY;
    mousedown = true;
}

function onDocumentMouseMove( event ) {
    event.preventDefault();
    if ( mousedown ) {
        theta = - ( ( event.clientX - onMouseDownPosition.x ) * 0.5 ) + onMouseDownTheta;
        phi = ( ( event.clientY - onMouseDownPosition.y ) * 0.5 ) + onMouseDownPhi;
        camera.position.x = radius * Math.sin( theta * Math.PI / 360 ) * Math.cos( phi * Math.PI / 360 );
        camera.position.y = radius * Math.sin( phi * Math.PI / 360 );
        camera.position.z = radius * Math.cos( theta * Math.PI / 360 ) * Math.cos( phi * Math.PI / 360 );
	camera.lookAt(camera.target);
        camera.updateMatrix();
	pointLight.position.x = camera.position.x;
	pointLight.position.y = camera.position.y + 3;
	pointLight.position.z = camera.position.z;
	render();
    }
}

function render() {
    renderer.render( scene, camera );
}


