var getJsonModel = function( jsonModelPath ) {
    if ( typeof jsonModelPath !== 'string' )
        throw new Error( 'Can\'t get the JSON 3D-model, because the given `jsonModelPath` argument is NOT a type of `string`.' );

    var promise = new Gera.Promise();

    Gera.Ajax.sendRequest(
        new Gera.Ajax.Request({
            method: Gera.Ajax.HttpMethod.Get,
            endpoint: jsonModelPath,
            asynchronous: true,
            responseType: Gera.Ajax.ResponseType.Json
        })
    )
    .then( function( response ) {
        promise.resolve( response );
    });

    return promise;
};

var getWavefrontObjectModel = function( objectModelPath ) {
    if ( typeof objectModelPath !== 'string' )
        throw new Error( 'Can\'t get the Wavefront object file, because the given `objectModelPath` argument is NOT a type of `string`.' );

    var promise = new Gera.Promise();

    Gera.Ajax.sendRequest(
        new Gera.Ajax.Request({
            method: Gera.Ajax.HttpMethod.Get,
            endpoint: objectModelPath,
            asynchronous: true,
            responseType: Gera.Ajax.ResponseType.Text
        })
    )
    .then( function( response ) {
        promise.resolve( response );
    });

    return promise;
};

var prepareMeshObject = function() {
    var fetchedObjects = {
        jsonModel: null,
        texture: null
    };

    var promise = new Gera.Promise();

    getJsonModel( 'test.data/json/sword.json' )
    .then( function( jsonModel ) {
        if ( typeof jsonModel !== 'object' )
            throw new Error( 'Can\'t prepare the mesh object, because the given JSON-model object is NOT a type of `object`.' );

        var jsonParser = new Gera.Parser.Json();
        var parsedJsonModel = jsonParser.parse( jsonModel );

        if ( !( parsedJsonModel instanceof Gera.Object3d ) )
            throw new Error( 'Can\'t prepare the object, because the parsed JSON-model is NOT an instance of `Gera.JsonModel`.' );

        fetchedObjects.jsonModel = parsedJsonModel;
        fetchedObjects.texture = new Gera.Texture({
            type: Gera.Texture.Type.Image,
            path: 'test.data/textures/sword.2.jpg'
        });

        promise.resolve( fetchedObjects );
    });

    return promise;
};

window.onload = function( sender ) {
    this.canvas = document.getElementById( 'webgl-application' );
    this.renderer = new Gera.Renderer();

    renderer.setActiveCanvasElement( canvas );

    var webglContext = renderer.createWebGLContext(
        canvas,
        new Gera.Renderer.Settings({
            alpha: true,
            antialias: true,
            depth: true,
            stencil: true
        })
    );

    renderer.setCurrentWebGLContext( webglContext );

    var scene = new Gera.Scene();

    var camera = new Gera.Camera();
    camera.setProjection(
        new Gera.Bounds.Perspective({
            fieldOfView: 45,
            aspect: window.innerWidth / window.innerHeight,
            near: 0.1,
            far: 100
        })
    );

    scene.add( camera );
    scene.setActiveCamera( camera );

    prepareMeshObject()
    .then( function( object3d ) {
        if ( typeof object3d !== 'object' )
            throw new Error( 'Can\'t create a new mesh object, because the given argument is NOT a type of `object`.' );

        if ( !( object3d.jsonModel instanceof Gera.Object3d ) )
            throw new Error( 'Can\'t create a new mesh object, because the given JSON 3D-model is NOT an instance of `Gera.Object3d`.' );

        if ( !( object3d.texture instanceof Gera.Texture ) )
            throw new Error( 'Can\'t create a new mesh object, because the given texture is NOT an instance of `Gera.Texture`.' );

        for ( var i = 0; i < 10; i++ ) {
            var mesh = new Gera.Mesh({
                geometry: new Gera.Geometry({
                    type: Gera.Geometry.Type.Custom,
                    vertices: object3d.jsonModel.vertices,
                    indices: object3d.jsonModel.indices,
                    uvCoordinates: object3d.jsonModel.uvCoordinates
                }),
                material: new Gera.Material( object3d.texture ),
                //drawMode: Gera.Renderer.DrawMode.Triangles
            });

            mesh.position.x = -23 + 5 * i;
            mesh.position.z = -5;
            mesh.rotate( new Gera.Vector3( { x: 0, y: 0, z: 1 } ), 90 );
            // mesh.rotate( new Gera.Vector3( { x: 1, y: 0, z: 1 } ), -90 );
            mesh.transparency.set( Math.random() );
            scene.add( mesh );
        }
    });

    var cubeMesh = new Gera.Mesh({
        geometry: new Gera.Geometry({
            type: Gera.Geometry.Type.Cube
        }),
        material: new Gera.Material(
            new Gera.Texture({
                type: Gera.Texture.Type.Color,
                color: 0xff0000
            })
        )
    });

    cubeMesh.position.z = -15;
    cubeMesh.wireframe.set( true );
    cubeMesh.rotation = new Gera.Rotation({
        vector: new Gera.Vector3( { x: 0, y: 1, z: 0 } ),
        angle: 1.5
    });
    // cubeMesh.rotate( new Gera.Vector3( { x: 0, y: 1, z: 0 } ), 45 );
    // cubeMesh.transparency.set( 0.5 );
    scene.add( cubeMesh );

    renderer.setCurrentFrameBufferColor(
        new Gera.Color.GlFloat({
            red: 1,
            green: 1,
            blue: 1,
            alpha: 1
        })
    );

    renderer.setCurrentScene( scene );
    renderer.renderScene();
};