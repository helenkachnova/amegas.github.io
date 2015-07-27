'use strict';

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
    
    for ( var i = 0; i < 3; i++ ) {
        var mesh = new Gera.Mesh({
            geometry: new Gera.Geometry({
                type: Gera.Geometry.Type.Cube
            }),
            material: new Gera.Material(
                new Gera.Texture({
                    type: Gera.Texture.Type.Color,
                    color: 0x00fffa
                })
            )
        });

        mesh.wireframe.set( false );
        mesh.ambientColor.set(
            Gera.Color.Type.HexadecimalString,
            '#333333'
        );

        mesh.position.x = -4 + i * 4;
        mesh.position.z = -10 - Math.random() * 50;
        mesh.rotation = new Gera.Rotation({
            vector: new Gera.Vector3({
                x: 1,
                y: -1,
                z: 0
            }),
            angle: 0.25
        });

        scene.add( mesh );
    }

    var light = new Gera.Light({
        type: Gera.Light.Type.Directional,
        direction: new Gera.Vector3({
            x: -0.25,
            y: -0.25,
            z: -1.0
        })
    });

    scene.add( light );

    var frameBufferColor = new Gera.Color.Rgba({
        red: 0x50,
        green: 0x50,
        blue: 0x50,
        alpha: 0xff
    });

    renderer.setCurrentFrameBufferColor(
        Gera.Color.prototype.convertRgbaObjectToGlFloatObject(
            frameBufferColor
        )
    );

    renderer.setCurrentScene( scene );
    renderer.renderScene();

    window.onkeydown = function( event ) {
        switch ( event.keyCode ) {
            // rotation
            // up
            case 73:
                camera.rotate( new Gera.Vector3( { x: -1, y: 0, z: 0 } ), 1.5 );
                break;
            // down
            case 75:
                camera.rotate( new Gera.Vector3( { x: 1, y: 0, z: 0 } ), 1.5 );
                break;
            // left
            case 74:
                camera.rotate( new Gera.Vector3( { x: 0, y: -1, z: 0 } ), 1.5 );
                break;
            // right
            case 76:
                camera.rotate( new Gera.Vector3( { x: 0, y: 1, z: 0 } ), 1.5 );
                break;
                
            // translation
            // forward
            case 87:
                camera.position.z += 0.25;
                break;
            // backward
            case 83:
                camera.position.z -= 0.25;
                break;
            // left
            case 65:
                camera.position.x += 0.25;
                break;
            // right
            case 68:
                camera.position.x -= 0.25;
                break;
            default:
                break;
        }
    };
};