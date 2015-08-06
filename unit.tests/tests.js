QUnit.test( "Test vector object creation", function( assert ) {
    var initialVector = new Gera.Vector2({
        x: 10,
        y: 5
    });

    var testVector = new Gera.Vector2();
    testVector.x = 10;
    testVector.y = 5;

    assert.ok( initialVector !== testVector, "Passed vector creation unit test!" );
});