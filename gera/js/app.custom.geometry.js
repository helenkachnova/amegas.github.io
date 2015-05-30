'use strict';

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

var generateRandomInteger = function( minimum, maximum ) {
    if ( typeof minimum !== 'number' )
        throw new Error( 'Can\'t generate the random integer, because the given minimum value is NOT a type of `number`.' );

    if ( typeof maximum !== 'number' )
        throw new Error( 'Can\'t generate the random integer, because the given maximum value is NOT a type of `number`.' );

    return Math.floor( Math.random() * ( maximum - minimum + 1 ) ) + minimum;
};

var generateRandomArbitrary = function( minimum, maximum ) {
    if ( typeof minimum !== 'number' )
        throw new Error( 'Can\'t generate the random arbitrary, because the given minimum value is NOT a type of `number`.' );

    if ( typeof maximum !== 'number' )
        throw new Error( 'Can\'t generate the random arbitrary, because the given maximum value is NOT a type of `number`.' );

    return Math.random() * ( maximum - minimum ) + minimum;
};

var prepareMeshObject = function() {
    var fetchedObjects = {
        jsonModel: null,
        texture: null
    };

    var promise = new Gera.Promise();

    getJsonModel( 'data/json/sword.json' )
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
            path: 'data/textures/sword.2.jpg'
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
                material: new Gera.Material( object3d.texture )
            });

            mesh.position.x = -23 + 5 * i;
            mesh.position.z = -5;
            mesh.rotation = new Gera.Rotation({
                vector: new Gera.Vector3({
                    x: generateRandomInteger( -1, 1 ),
                    y: 0,
                    z: generateRandomInteger( -1, 1 )
                }),
                angle: 1.5
            });
            scene.add( mesh );
        }
    });

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