'use strict';

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

    for ( var i = 0; i < 10; i++ ) {
        for ( var j = 0; j < 10; j++ ) {
            var mesh = new Gera.Mesh({
                geometry: new Gera.Geometry({
                    type: generateRandomInteger( 1, Object.keys( Gera.Geometry.Type ).length - 2 )
                }),
                material: new Gera.Material(
                    new Gera.Texture({
                        type: Gera.Texture.Type.Color,
                        color: generateRandomInteger( 0, 0xffff )
                    })
                )
            });

            mesh.position.x = -23 + 5 * i;
            mesh.position.z = -55 + 5 * j;
            mesh.transparency.set( generateRandomArbitrary( 0.5, 1.0 ) );
            scene.add( mesh );
        }
    }

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