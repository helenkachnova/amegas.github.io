'use strict';

QUnit.test( 'Quaternions equality', function( assert ) {
    var firstQuaternion = new Gera.Quaternion();
    var secondQuaternion = new Gera.Quaternion();

    assert.ok( firstQuaternion.isEqual( secondQuaternion ), 'Passed!' );
});

QUnit.test( 'Quaternions addition', function( assert ) {
    var firstQuaternion = new Gera.Quaternion();
    var secondQuaternion = new Gera.Quaternion({
        x: 5, y: 10, z: 3, w: 1
    });

    firstQuaternion.add( secondQuaternion );
    firstQuaternion.w = 1;

    assert.ok( firstQuaternion.isEqual( secondQuaternion ), 'Passed!' );
});

QUnit.test( 'Quaternions inversion', function( assert ) {
    var firstQuaternion = new Gera.Quaternion({
        x: -1, y: -1, z: -1, w: 1
    });

    var secondQuaternion = Gera.Quaternion.inverse( firstQuaternion );
    firstQuaternion.inverse();
    assert.ok( firstQuaternion.isEqual( secondQuaternion ), 'Static check - passed!' );

    secondQuaternion = new Gera.Quaternion({
        x: 1, y: 1, z: 1, w: 1
    });

    firstQuaternion.inverse();
    secondQuaternion.inverse();
    assert.ok( firstQuaternion.isEqual( secondQuaternion ), 'Object check - passed!' );
});

QUnit.test( 'Static/object quaternion creation with the offset', function( assert ) {
    var firstQuaternion = new Gera.Quaternion();
    var secondQuaternion = new Gera.Quaternion({
        x: 10, y: 5, z: 3, w: 1
    });

    var firstArray = [ 10, 5, 3, 1 ];
    var secondArray = [ 3, 3, 3, 1 ];
    var offset = 2;

    // first subtest
    firstQuaternion.fromArray( firstArray );
    assert.ok( firstQuaternion.isEqual( secondQuaternion ), 'the check of object method `.fromArray()` with NO offset - passed!' );

    // second subtest
    firstQuaternion.fromArray( [ 3, 3, 3, 1 ], offset );
    secondQuaternion = new Gera.Quaternion({
        x: 5, y: 5, z: 5, w: 3
    });

    assert.ok( firstQuaternion.isEqual( secondQuaternion ), 'the check of object method `.fromArray()` with using offset - passed!' );

    // third subtest
    firstQuaternion.fromArray( firstArray );
    secondQuaternion = Gera.Quaternion.fromArray( firstArray );
    assert.ok( firstQuaternion.isEqual( secondQuaternion ), 'the check of static method `.fromArray()` with NO offset - passed!' );

    // fourth subtest
    firstQuaternion.fromArray( firstArray, offset );
    secondQuaternion = Gera.Quaternion.fromArray( firstArray, offset );
    assert.ok( firstQuaternion.isEqual( secondQuaternion ), 'the check of static method `.fromArray()` with using offset - passed!' );
});

QUnit.test( 'Quaternion setting/creation from matrix', function( assert ) {
    var matrix = new Float32Array([
        0, 19, 5, 4,
        3, 23, 7, 3,
        2, 37, 9, 2,
        1, 56, 1, 9
    ]);

    var firstQuaternion = new Gera.Quaternion();
    firstQuaternion.fromMatrix( matrix );

    var secondQuaternion = Gera.Quaternion.fromMatrix( matrix );
    assert.ok( firstQuaternion.isEqual( secondQuaternion ), 'the check of object/static methods `.fromMatrix()` - passed!' );
});