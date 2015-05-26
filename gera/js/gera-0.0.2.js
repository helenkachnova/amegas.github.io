/*
    Gera, WebGL 3D library, version 0.0.2
    JSC Amegas.sys, copyright 2014-2015 (c)
    Developer: Oleg Orlov A
    E-mail: oleg@amegas.ru

    Official project website:
    http://magesi.ru/gera

    Official project mirrors:
    https://gera.codeplex.com
    https://github.com/amegas/gera

    Despite on fact, that this product is open-source one,
    it doesn't belong to GNU GPL or Apache types of license,
    it has own specific license, which regulates terms of use.	
    http://magesi.ru/gera/license
*/
( function( globalContext, libraryName ) {
    'use strict';

    if ( typeof globalContext !== 'object' || !( globalContext instanceof Window ) )
        throw new Error( 'You\'re trying to apply a new library instance NOT to the global object `Window`.' );

    if ( typeof libraryName !== 'string' )
        throw new Error( 'Can\'t initialize a name of the new library instance with type, distinct from `string`.' );

    if ( typeof libraryName === 'string' && libraryName.length === 0 )
        throw new Error( 'Can\'t initialize a name of the new library, because input library name argument is an empty string.' );

    var libraryObject = globalContext[ libraryName ] = {};
    libraryObject.version = '0.0.2';

    ( function( Gera ) {
    
        Gera.Global = {
            checkElementExistenceInArray: function( collection, requiredElement ) {
                if ( !( collection instanceof Array ) )
                    throw new Error( 'Can\'t screen the input collection, because it\'s NOT an instance of `Array`.' );
    
                if ( requiredElement === undefined )
                    throw new Error( 'Can\'t handle the required element, because it\'s undefined.' );
    
                if ( collection.length === 0 )
                    throw new Error( 'Input screening collection is an instance of `Array`, but it\'s content length equals zero.' );
    
                if ( collection.indexOf( requiredElement ) === -1 )
                    return false;
    
                return true;
            },
            checkElementsExistenceInArray: function( collection, requiredElements ) {
                if ( !( collection instanceof Array ) )
                    throw new Error( 'Can\'t screen the input collection, because it\'s NOT an instance of `Array`.' );
    
                if ( !( requiredElements instanceof Array ) )
                    throw new Error( 'Can\'t handle the required elements, because they are NOT compiled into `Array` object.' );
    
                if ( collection.length === 0 )
                    throw new Error( 'Input screening collection is an instance of `Array`, but it\'s content length equals zero.' );
    
                if ( requiredElements.length === 0 )
                    throw new Error( 'Input required elements collection is an instance of `Array`, but it\'s content length equals zero.' );
    
                for ( var item in requiredElements )
                    if ( collection.indexOf( requiredElements[ item ] ) === -1 )
                        return false;
    
                return true;
            },
            checkPropertyExistence: function( object, propertyName ) {
                if ( typeof object !== 'object' )
                    throw new Error( 'Can\'t check the property existence in object, because the input object is NOT a type of `object`.' );
    
                if ( typeof propertyName !== 'string' )
                    throw new Error( 'Can\'t check the property existence in object, because the input property name is NOT a type of `string`.' );
    
                return object.hasOwnProperty( propertyName );
            },
            convertObjectPropertiesToArray: function( object ) {
                if ( typeof object !== 'object' )
                    throw new Error( 'Can\'t convert the properties of input object to array, because the input object is NOT a type of `object`.' );
    
                var properties = [];
    
                for ( var key in object )
                    if ( object.hasOwnProperty( key ) )
                        properties.push( object[ key ] );
    
                return properties;
            },
            getPropertyNameByValue: function( handlingObject, value ) {
                if ( typeof handlingObject !== 'object' )
                    throw new Error( 'Can\'t handle input object, because it\'s NOT type of `object`.' );
    
                if ( value === undefined )
                    throw new Error( 'Can\'t handle input object with the undefined value.' );
    
                for ( var item in handlingObject )
                    if ( handlingObject[ item ] === value )
                        return item;
            },
            objectsEqual: function( firstObject, secondObject ) {
                return ( firstObject === secondObject ) ? true : false;
            }
        };
    
    })( libraryObject );

    ( function( Gera ) {
    
        Gera.Guid = function() {
            this.parts = generateGuidParts();
            this.sequence = this.convertToString();
        };
    
        Gera.Guid.prototype.convertToString = function() {
            if ( !( this.parts instanceof Array ) )
                throw new Error( 'Can\'t convert the GUID object to the `string` value, because the parts object is NOT an instanceof of `Array`.' );
    
            return this.parts.toString().replace( /,/g, '-' );
        };
    
        var maximumSubitemsCapicity = 5;
    
        var generateGuidParts = function() {
            var parts = new Array( maximumSubitemsCapicity );
    
            for ( var index = 0; index < parts.length; index++ ) {
                switch ( index ) {
                    case 0:
                        parts[ index ] =
                            String.prototype.concat(
                                generateSubitem(),
                                generateSubitem()
                            );
                        break;
                    case 1:
                    case 2:
                    case 3:
                        parts[ index ] = generateSubitem();
                        break;
                    case 4:
                        parts[ index ] =
                            String.prototype.concat(
                                generateSubitem(),
                                generateSubitem(),
                                generateSubitem()
                            );
                        break;
                    default:
                        throw new Error(
                            String.prototype.concat(
                                'Can\'t generate the subitem for the new GUID-object, because a single GUID object may contain only the ',
                                maximumSubitemsCapicity,
                                ' subitems maximum.'
                            )
                        );
                }
            }
    
            return parts;
        };
    
        var generateSubitem = function() {
            return Math.floor( ( 1 + Math.random() ) * 65536 ).toString( 16 ).substring( 1 );
        };
    
    })( libraryObject );

    ( function( Gera ) {
    
        Gera.Promise = function( wrappedObject ) {
            this.resolved = false;
            this.wrappedObject = wrappedObject;
            this.then = handleThenableObject.bind( this );
            this.run = handlePromiseProcess.bind( this );
            this.resolve = handlePromiseResolving.bind( this );
        };
    
        Gera.Promise.create = function( callback ) { 
            return ( typeof callback === 'function' && callback.hasOwnProperty( 'promise' ) )
                ? callback.promise : new Gera.Promise(); 
        };
    
        Gera.Promise.executeAsynchronously = function( callback ) {
            if ( typeof callback !== 'function' )
                throw new Error( 'Can\'t execute the given callback function asynchronously, because the given callback function object is NOT a type of `function`.' );
    
            window.setTimeout( callback, 0 );
        };
    
        var handleThenableObject = function( object ) {
            if ( typeof this.resolved !== 'boolean' )
                throw new Error( 'Can\'t handle a thenable object, because the binded property `resolved` is NOT a type of `boolean`.' );
    
            if ( this.resolved )
                handlePromiseCompletion.call( this, object );
            else {
                this.next = new Gera.Promise( object );
                return this.next;
            }
        };
    
        var handlePromiseProcess = function( object ) {
            var self = this;
    
            Gera.Promise.executeAsynchronously(
                function() {
                    self.wrappedObject.call( self, object );
                }
            );
        };
    
        var handlePromiseCompletion = function( object ) {
            if ( this.next instanceof Gera.Promise )
                handlePromiseProcess.call( this.next, object );
        };
    
        var handlePromiseResolving = function( object ) {
            if ( typeof this.resolved !== 'boolean' )
                throw new Error( 'Can\'t resolve the promise, because the binded property `resolved` is NOT a type of `boolean`.' );
    
            this.resolved = true;
            handleThenableObject.call( this, object );
        };
    
    })( libraryObject );

    ( function( Gera ) {
    
        Gera.Ajax = function() {
            throw new Error( 'You\'re trying to create an instance of abstract `Gera.Ajax` prototype.' );
        };
    
        Gera.Ajax.HttpMethod = {
            Get: 0,
            Post: 1,
            Put: 2,
            Delete: 3,
            Copy: 4,
            Patch: 5,
            Options: 6,
            Head: 7,
            Purge: 8,
            Link: 9,
            Unlink: 10
        };
    
        Gera.Ajax.HttpStatusCode = {
            // 1xx Informational
            Continue: 100,
            SwitchingProtocols: 101,
            Processing: 102,
    
            // 2xx Success
            Ok: 200,
            Created: 201,
            Accepted: 202,
            NonAuthoritativeInformation: 203,
            NoContent: 204,
            ResetContent: 205,
            PartialContent: 206,
            MultiStatus: 207,
            AlreadyReported: 208,
            ImUsed: 226,
    
            // 3xx Redirection
            MultipleChoices: 300,
            MovedPermanently: 301,
            Found: 302,
            SeeOther: 303,
            NotModified: 304,
            UseProxy: 305,
            SwitchProxy: 306,
            TemporaryRedirect: 307,
            PermanentRedirect: 308,
    
            // 4xx Client Error
            BadRequest: 400,
            Unauthorized: 401,
            PaymentRequired: 402,
            Forbidden: 403,
            NotFound: 404,
            MethodNotAllowed: 405,
            NotAcceptable: 406,
            ProxyAuthenticationRequired: 407,
            RequestTimeout: 408,
            Conflict: 409,
            Gone: 410,
            LengthRequired: 411,
            PreconditionFailed: 412,
            RequestEntityTooLarge: 413,
            RequestUriTooLong: 414,
            UnsupportedMediaType: 415,
            RequestedRangeNotSatisfiable: 416,
            ExpectationFailed: 417,
            MisdirectedRequest: 421,
            UnprocessableEntity: 422,
            Locked: 423,
            FailedDependency: 424,
            UpgradeRequired: 426,
            PreconditionRequired: 428,
            TooManyRequests: 429,
            RequestHeaderFieldsTooLarge: 431,
    
            // 5xx Server Error
            InternalServerError: 500,
            NotImplemented: 501,
            BadGateway: 502,
            ServiceUnavailable: 503,
            GatewayTimeout: 504,
            HttpVersionNotSupported: 505,
            VariantAlsoNegotiates: 506,
            InsufficientStorage: 507,
            LoopDetected: 508,
            NotExtended: 510,
            NetworkAuthenticationRequired: 511
        };
    
        Gera.Ajax.ReadyState = {
            Unsent: 0,
            Opened: 1,
            HeadersReceived: 2,
            Loading: 3,
            Done: 4
        };
    
        Gera.Ajax.ResponseType = {
            Text: 0,
            ArrayBuffer: 1,
            Blob: 2,
            Document: 3,
            Json: 4
        };
    
        Gera.Ajax.Request = function() {
            if ( arguments.length === 0 )
                throw new Error( 'Can\'t create a new `Gera.Ajax.Request` object, because there are NO input arguments for creating it.' );
    
            if ( typeof arguments[ 0 ] !== 'object' )
                throw new Error( 'Can\'t create a new `Gera.Ajax.Request` object, because the input arguments object is NOT a type of `object`.' );
    
            var requestData = prepareHttpRequestObject( arguments[ 0 ] );
    
            for ( var item in requestData )
                this[ item ] = requestData[ item ];
    
            setHttpMethodStringForRequestObject( this );
            setResponseTypeStringForRequestObject( this );
        };
    
        Gera.Ajax.AuthenticationData = function( login, password ) {
            if ( !login && typeof password === 'string' )
                throw new Error( 'Can\'t create a new `Gera.Ajax.AuthenticationData` object, because the occurred situation can\'t be real. The given login is `undefined/null`, but password is a type of `string`. The login may be set with empty password, but not vice versa.' );
    
            ( typeof login === 'string' )
                ? this.login = login
                : this.login = null;
    
            ( typeof password === 'string' )
                ? this.password = password
                : this.password = null;
        };
    
        Gera.Ajax.sendRequest = function( httpRequest ) {
            var promise = new Gera.Promise();
    
            sendXmlHttpRequest( httpRequest )
            .then( function( response ) {
                promise.resolve( response );
            });
    
            return promise;
        };
    
        var prepareHttpRequestObject = function( requestOptions ) {
            if ( requestOptions.login && typeof requestOptions.login !== 'string' )
                throw new Error( 'Can\'t prepare the HTTP request object, because the optional property `login` is NOT a type of `string`.' );
    
            if ( requestOptions.password && typeof requestOptions.password !== 'string' )
                throw new Error( 'Can\'t prepare the HTTP request object, because the optional property `password` is NOT a type of `string`.' );
    
            var httpObjectProperties = {};
            handleHttpRequestRequiredOptions( httpObjectProperties, requestOptions ); 
            handleHttpRequestOptionalOptions( httpObjectProperties, requestOptions );
            return httpObjectProperties;
        };
    
        var handleHttpRequestRequiredOptions = function( httpObjectProperties, options ) {
            if ( typeof httpObjectProperties !== 'object' )
                throw new Error( 'Can\'t handle the required HTTP-request options, because the input `httpObjectProperties` argument is NOT type of `object`.' );
    
            if ( typeof options !== 'object' )
                throw new Error( 'Can\'t handle the required HTTP-request options, because the input `options` argument is NOT type of `object`.' );
    
            if ( !Gera.Global.checkElementsExistenceInArray( Object.keys( options ), [ 'method', 'endpoint', 'asynchronous' ] ) )
                throw new Error( 'Can\'t prepare the HTTP request object, because the required properties for creating it weren\'t provided. Required properties are the next: [ method, endpoint, asynchronous ]. Optional properties are: [ login, password ].' );
    
            if ( typeof options.method !== 'number' )
                throw new Error( 'Can\'t prepare the HTTP request object, because the required property `method` is NOT a type of `number`. The number type is required, because the enumeration `Gera.Ajax.HttpMethod` holds number values, which will be associated with the correct HTTP-method later.' );
    
            if ( typeof options.endpoint !== 'string' )
                throw new Error( 'Can\'t prepare the HTTP request object, because the required property `endpoint` is NOT a type of `string`.' );
    
            if ( typeof options.asynchronous !== 'boolean' )
                throw new Error( 'Can\'t prepare the HTTP request object, because the required property `asynchronous` is NOT a type of `boolean`.' );
    
            httpObjectProperties.httpMethod = options.method;
            httpObjectProperties.urlEndpoint = options.endpoint;
            httpObjectProperties.asynchronous = options.asynchronous;
        };
    
        var handleHttpRequestOptionalOptions = function( httpObjectProperties, options ) {
            if ( typeof httpObjectProperties !== 'object' )
                throw new Error( 'Can\'t handle the optional HTTP-request options, because the input `httpObjectProperties` argument is NOT type of `object`.' );
    
            if ( typeof options !== 'object' )
                throw new Error( 'Can\'t handle the optional HTTP-request options, because the input `options` argument is NOT type of `object`.' );
    
            if ( options.hasOwnProperty( 'responseType' ) ) {
                if ( typeof options.responseType !== 'number' )
                    throw new Error( 'Can\'t prepare the HTTP request object, because the optional property `responseType` is NOT a type of `number`.' );
    
                httpObjectProperties.responseType = options.responseType;
            }            
    
            if ( options.hasOwnProperty( 'login' ) )
                if ( typeof options.login !== 'string' )
                    throw new Error( 'Can\'t prepare the HTTP request object, because the optional property `login` is NOT a type of `string`.' );
    
            if ( options.hasOwnProperty( 'password' ) )
                if ( typeof options.password !== 'string' )
                    throw new Error( 'Can\'t prepare the HTTP request object, because the optional property `password` is NOT a type of `string`.' );
    
            if ( !options.login && !options.password )
                httpObjectProperties.authentication = null;
            else {
                httpObjectProperties.authentication = new Gera.Ajax.AuthenticationData(
                    options.login,
                    options.password
                );
            }
        };
    
        var setHttpMethodStringForRequestObject = function( request ) {
            if ( !( request instanceof Gera.Ajax.Request ) )
                throw new Error( 'Can\'t set the HTTP-method string value for the request object, because the input request object is NOT an instance of `Gera.Ajax.Request`.' );
    
            if ( typeof request.httpMethod !== 'number' )
                throw new Error( 'Can\'t set the HTTP-method string value for the request object, because the request object property `httpMethod` is NOT a type of `number`.' );
    
            switch ( request.httpMethod ) {
                case 0:
                    request.httpMethodString = 'GET';
                    break;
                case 1:
                    request.httpMethodString = 'POST';
                    break;
                case 2:
                    request.httpMethodString = 'PUT';
                    break;
                case 3:
                    request.httpMethodString = 'DELETE';
                    break;
                case 4:
                    request.httpMethodString = 'COPY';
                    break;
                case 5:
                    request.httpMethodString = 'PATCH';
                    break;
                case 6:
                    request.httpMethodString = 'OPTIONS';
                    break;
                case 7:
                    request.httpMethodString = 'HEAD';
                    break;
                case 8:
                    request.httpMethodString = 'PURGE';
                    break;
                case 9:
                    request.httpMethodString = 'LINK';
                    break;
                case 10:
                    request.httpMethodString = 'UNLINK';
                    break;
                default:
                    throw new Error( 'Can\'t set the HTTP-method string value for the request object, because the request object property `httpMethod` value doesn\'t exist in `Gera.Ajax.HttpMethod` enumeration collection.' );
            }
        };
    
        var setResponseTypeStringForRequestObject = function( request ) {
            if ( !( request instanceof Gera.Ajax.Request ) )
                throw new Error( 'Can\'t prepare the `XMLHttpRequest` object, because the input `httpRequest` argument is NOT an instance of `Gera.Ajax.Request`.' );
    
            switch ( request.responseType ) {
                case 0:
                    request.responseTypeString = 'text';
                    break;
                case 1:
                    request.responseTypeString = 'arraybuffer';
                    break;
                case 2:
                    request.responseTypeString = 'blob';
                    break;
                case 3:
                    request.responseTypeString = 'document';
                    break;
                case 4:
                    request.responseTypeString = 'json';
                    break;
                default:
                    throw new Error( 'Can\'t set the HTTP-response type string value for the request object, because the request object property `responseType` value doesn\'t exist in `Gera.Ajax.ResponseType` enumeration collection.' );
            }
        };
    
        var sendXmlHttpRequest = function( httpRequest ) {
            if ( !( httpRequest instanceof Gera.Ajax.Request ) )
                throw new Error( 'Can\'t prepare the `XMLHttpRequest` object, because the input `httpRequest` argument is NOT an instance of `Gera.Ajax.Request`.' );
    
            var xmlHttpRequest = new XMLHttpRequest();
            xmlHttpRequest.promise = new Gera.Promise();
            xmlHttpRequest.open(
                httpRequest.httpMethodString,
                httpRequest.urlEndpoint,
                httpRequest.asynchronous,
                ( !httpRequest.authentication ) ? null : httpRequest.authentication.login,
                ( !httpRequest.authentication ) ? null : httpRequest.authentication.password
            );
    
            if ( httpRequest.responseTypeString === 'json' && checkIsEngineBrowserTrident() )
                xmlHttpRequest.responseType = 'text';
            else
                xmlHttpRequest.responseType = httpRequest.responseTypeString;
    
            xmlHttpRequest.managedResponseType = httpRequest.responseType;
            handleXmlHttpRequestEvents( xmlHttpRequest );
    
            if ( !httpRequest.messageContent )
                xmlHttpRequest.send();
            else
                xmlHttpRequest.send( httpRequest.messageContent );
    
            return xmlHttpRequest.promise;
        };
    
        var handleXmlHttpRequestEvents = function( xmlHttpRequest ) {
            if ( !( xmlHttpRequest instanceof XMLHttpRequest ) )
                throw new Error( 'Can\'t handle the XML HTTP-request events, because the input object is NOT an instance of `XMLHttpRequest`.' );
    
            xmlHttpRequest.onreadystatechange = handleOnReadyStateChangeEvent;
        };
    
        var handleOnReadyStateChangeEvent = function( event ) {
            if ( !( event instanceof Event ) )
                throw new Error( 'Can\'t handle `onReadyStateChange` event, because the input event is NOT an instance of `Event`.' );
    
            var xhrObject = event.target || event.currentTarget || event.srcElement;
    
            if ( !( xhrObject instanceof XMLHttpRequest ) )
                throw new Error( 'Can\'t handle `onReadyStateChange event, because the XML HTTP-request object, which was taken from event object is NOT an instance of `XMLHttpRequest`.' );
    
            if ( xhrObject.readyState === Gera.Ajax.ReadyState.Done && xhrObject.status === Gera.Ajax.HttpStatusCode.Ok ) {
                if ( xhrObject.managedResponseType === Gera.Ajax.ResponseType.Json ) {
                    if ( checkIsEngineBrowserTrident() ) {
                        xhrObject.promise.resolve( prepareJsonResponseForTridentEngine( xhrObject.response ) );
                        return;
                    }
                }
    
                xhrObject.promise.resolve( xhrObject.response );
            }
        };
    
        var checkIsEngineBrowserTrident = function() {
            return ( window.navigator.userAgent.toLowerCase().indexOf( 'trident' ) !== -1 ) ? true : false;
        };
    
        var prepareJsonResponseForTridentEngine = function( content ) {
            if ( typeof content === 'string' ) {
                if ( typeof JSON !== 'object' )
                    throw new Error( 'Can\'t prepare the JSON response for Trident browser engine, because it seems to be, that your browser doesn\'t support the JSON object ( window.JSON ) from browser JavaScript API, which is required for parsing the text data.' );
    
                var jsonObject = JSON.parse( content );
    
                if ( typeof jsonObject !== 'object' )
                    throw new Error( 'Can\'t prepare the JSON response for Trident browser engine, because the parsed JSON object is NOT a type of `object`.' );
    
                return ( jsonObject );
            }
    
            throw new Error( 'Can\'t prepare the JSON response for Trident browser engine, because the given content object is NOT a type of `string`. This type of error may occur, when you\'re trying to set the `responseType` property of the `XMLHttpRequest` object incorrectly using the Internet Explorer browser.' );
        };
    
    })( libraryObject );

    ( function( Gera ) {
    
        Gera.Bounds = function() {
            throw new Error( 'You\'re trying to create an instance of abstract `Gera.Bounds` prototype.' );
        };
    
        Gera.Bounds.Type = {
            Frustum: 0,
            Perspective: 1,
            Orthographic: 2
        };
    
        Gera.Bounds.Perspective = function() {
            if ( arguments.length === 0 )
                throw new Error( 'You didn\'t provide any arguments for `Gera.Bounds.Perspective` constructor.' );
    
            var argumentsCount = Object.keys( arguments[ 0 ] ).length;
    
            if ( argumentsCount !== 4 )
                throw new Error(
                    String.prototype.concat(
                        'There must be 4 properties in argument body for `Gera.Bounds.Perspective` constructor. You\'ve provided: ',
                        argumentsCount,
                        ' properties in it.'
                    )
                );
    
            for ( var item in arguments[ 0 ] ) {
                var result = validateBoundsSettingsFromArguments(
                    item,
                    arguments[ 0 ][ item ],
                    Gera.Bounds.Type.Perspective
                );
    
                if ( !result )
                    throw new Error( 'The bounds settings validation result is `false`, so can\'t bind any settings as the properties of object.' );
    
                this[ item ] = arguments[ 0 ][ item ];
            }
        };
    
        Gera.Bounds.Orthographic = function() {
            if ( arguments.length === 0 )
                throw new Error( 'You didn\'t provide any arguments for `Gera.Bounds.Orthographic` constructor.' );
    
            var argumentsCount = Object.keys( arguments[ 0 ] ).length;
    
            if ( argumentsCount !== 6 )
                throw new Error(
                    String.prototype.concat(
                        'There must be 6 properties in argument body for `Gera.Bounds.Orthographic` constructor. You\'ve provided: ',
                        argumentsCount,
                        ' properties in it.'
                    )
                );
    
            for ( var item in arguments[ 0 ] ) {
                var result = validateBoundsSettingsFromArguments(
                    item,
                    arguments[ 0 ][ item ],
                    Gera.Bounds.Type.Orthographic
                );
    
                if ( !result )
                    throw new Error( 'The bounds settings validation result is `false`, so can\'t bind any settings as the properties of object.' );
    
                this[ item ] = arguments[ 0 ][ item ];
            }
        };
    
        var validateBoundsSettingsFromArguments = function( argumentName, argumentValue, boundsType ) {
            if ( boundsType === undefined )
                throw new Error( 'Can\'t check the input argument, because vector type is undefined for the check.' );
    
            switch ( boundsType ) {
                case Gera.Bounds.Type.Perspective:
                    if ( [ 'fieldOfView', 'aspect', 'near', 'far' ].indexOf( argumentName ) === -1 )
                        throw new Error( 'The input argument name is not valid for `Gera.Bounds.Perspective` object. Possible property names are: [ fieldOfView, aspect, near, far ].' );
                    return true;
                case Gera.Bounds.Type.Orthographic:
                    if ( [ 'left', 'right', 'top', 'bottom', 'near', 'far' ].indexOf( argumentName ) === -1 )
                        throw new Error( 'The input argument name is not valid for `Gera.Bounds.Orthographic` object. Possible property names are: [ left, right, top, bottom, near, far ].' );
                    return true;
                case Gera.Bounds.Type.Frustum:
                    break;
                default:
                    throw new Error( 'Can\'t validate the bounds settings, because the given bounds type is NOT associated with any one type, existed in the `Gera.Bounds.Type` enumeration.' );
            }
    
            if ( typeof argumentValue !== 'number' )
                throw new Error(
                    String.prototype.concat(
                        'Input argument property `',
                        argumentName,
                        '` is not a type of `number`.'
                    )
                );
        };
    
    })( libraryObject );

    ( function( Gera ) {
    
        Gera.Vector2 = function() {
            if ( arguments.length === 0 ) {
                this.x = 0;
                this.y = 0;
            }
            else {
                checkInputArguments( arguments );
                var argumentsCount = Object.keys( arguments[ 0 ] ).length;
    
                if ( argumentsCount !== 2 )
                    throw new Error(
                        String.prototype.concat(
                            '`Gera.Vector2` constructor accepts only 2 properties in argument object, they are: [ x, y ]. You have provided: ',
                            argumentsCount,
                            ' arguments.'
                        )
                    );
    
                for ( var item in arguments[ 0 ] ) {
                    var result = validateCoordinateFromArguments(
                        item,
                        arguments[ 0 ][ item ],
                        VectorType.Double
                    );
    
                    if ( !result )
                        throw new Error( 'The coordinate validation result is `false`, so can\'t bind a coordinate as the property of object.' );
    
                    this[ item ] = arguments[ 0 ][ item ];
                }
            }
        };
    
        Gera.Vector3 = function() {
            if ( arguments.length === 0 ) {
                this.x = 0;
                this.y = 0;
                this.z = 0;
            }
            else {
                checkInputArguments( arguments );
                var argumentsCount = Object.keys( arguments[ 0 ] ).length;
    
                if ( argumentsCount !== 3 )
                    throw new Error(
                        String.prototype.concat(
                            '`Gera.Vector3` constructor accepts only 3 properties in argument object, they are: [ x, y, z ]. You have provided: ',
                            argumentsCount,
                            ' arguments.'
                        )
                    );
    
                for ( var item in arguments[ 0 ] ) {
                    var result = validateCoordinateFromArguments(
                        item,
                        arguments[ 0 ][ item ],
                        VectorType.Triple
                    );
    
                    if ( !result )
                        throw new Error( 'The coordinate validation result is `false`, so can\'t bind a coordinate as the property of object.' );
    
                    this[ item ] = arguments[ 0 ][ item ];
                }
            }
        };
    
        Gera.Vector4 = function() {
            if ( arguments.length === 0 ) {
                this.x = 0;
                this.y = 0;
                this.z = 0;
                this.i = 0;
            }
            else {
                checkInputArguments( arguments );
                var argumentsCount = Object.keys( arguments[ 0 ] ).length;
    
                if ( argumentsCount !== 4 )
                    throw new Error(
                        String.prototype.concat(
                            '`Gera.Vector4` constructor accepts only 4 properties in argument object, they are: [ x, y, z, i ]. You have provided: ',
                            argumentsCount,
                            ' arguments.'
                        )
                    );
    
                for ( var item in arguments[ 0 ] ) {
                    var result = validateCoordinateFromArguments(
                        item,
                        arguments[ 0 ][ item ],
                        VectorType.Quadro
                    );
    
                    if ( !result )
                        throw new Error( 'The coordinate validation result is `false`, so can\'t bind a coordinate as the property of object.' );
    
                    this[ item ] = arguments[ 0 ][ item ];
                }
            }
        };
    
        var VectorType = {
            Double: 0,
            Triple: 1,
            Quadro: 2
        };
    
        var checkInputArguments = function( inputArguments ) {
            if ( inputArguments.length !== 1 )
                throw new Error( 'There could be only the one input argument for the vector constructor.' );
    
            if ( typeof inputArguments[ 0 ] !== 'object' )
                throw new Error( 'Input argument is NOT a type of `object`.' );
        };
    
        var validateCoordinateFromArguments = function( argumentName, argumentValue, vectorType ) {
            if ( vectorType === undefined )
                throw new Error( 'Can\'t check the input argument, because vector type is undefined for the check.' );
    
            switch ( vectorType ) {
                case VectorType.Double:
                    if ( [ 'x', 'y' ].indexOf( argumentName ) === -1 )
                        throw new Error( 'The input argument name is NOT valid for `Gera.Vector2` object. Possible property names are: [ x, y ].' );
                    return true;
                case VectorType.Triple:
                    if ( [ 'x', 'y', 'z' ].indexOf( argumentName ) === -1 )
                        throw new Error( 'The input argument name is NOT valid for `Gera.Vector3` object. Possible property names are: [ x, y, z ].' );
                    return true;
                case VectorType.Quadro:
                    if ( [ 'x', 'y', 'z', 'i' ].indexOf( argumentName ) === -1 )
                        throw new Error( 'The input argument name is NOT valid for `Gera.Vector4` object. Possible property names are: [ x, y, z, i ].' );
                    return true;
                default:
                    return false;
            }
    
            if ( typeof argumentValue !== 'number' )
                throw new Error(
                    String.prototype.concat(
                        'Input argument property `',
                        argumentName,
                        '` is NOT a type of `number`.'
                    )
                );
        };
    
    })( libraryObject );

    ( function( Gera ) {
    
        Gera.Rotation = function() {
            var settings = handleInputArguments( arguments[ 0 ] );
    
            for ( var item in settings )
                this[ item ] = settings[ item ];
        };
    
        var handleInputArguments = function( inputArguments ) {
            if ( typeof inputArguments !== 'object' )
                throw new Error( 'Can\'t create a new `Gera.Rotation` object, because the given arguments object is NOT a type of `object`.' );
    
            var check = Gera.Global.checkElementsExistenceInArray;
    
            if ( !check( Object.keys( inputArguments ), [ 'vector', 'angle' ] ) )
                throw new Error( 'Can\'t create a new `Gera.Rotation` object, because the input arguments object doesn\'t have the required properties: [ vector, angle ].' );
    
            var vector = inputArguments.vector;
            var angle = inputArguments.angle;
    
            if ( typeof angle !== 'number' )
                throw new Error( 'Can\'t create a new `Gera.Rotation` object, because the given angle value is NOT a type of `number`.' );
    
            if ( angle < 0 || angle > 360 )
                throw new Error( 'Can\'t create a new `Gera.Rotation` object, because the given angle value has an incorrect value. The value must be NOT less than 0 and NOT greater than 360.' );
    
            if ( !( vector instanceof Gera.Vector3 ) )
                throw new Error( 'Can\'t create a new `Gera.Rotation` object, because the given vector object is NOT an instance of `Gera.Vector3`.' );
    
            for ( var key in vector )
                if ( [ -1, 0, 1 ].indexOf( vector[ key ] ) === -1 )
                    throw new Error( 'Can\'t create a new `Gera.Rotation` object, because one of values from the vector object is incorrect. Rotation vector may accept only the following values [ -1, 0, 1 ], because such values define the direction of the rotation.' );
    
            return {
                vector: vector,
                angle: angle
            };
        };
    
    })( libraryObject );

    ( function( Gera ) {
    
        Gera.Quaternion = function() {
            handleInputArguments.call( this, arguments[ 0 ] );
        };
    
        Gera.Quaternion.prototype.toMatrix = function() {
            return Gera.Math.convertQuaternionToMatrix( this );
        };
    
        Gera.Quaternion.prototype.multiplyByQuaternion = function( quaternion ) {
            if ( !( quaternion instanceof Gera.Quaternion ) )
                throw new Error( 'Can\'t use the given quaternion object for multiplication, because it\'s NOT an instance of `Gera.Quaternion`.' );
    
            return Gera.Math.multiplyQuaternions( this, quaternion );
        };
    
        var handleInputArguments = function( inputArguments ) {
            ( typeof inputArguments !== 'object' )
                ? setEmptyObject.call( this )
                : setNonEmptyObject.call( this, inputArguments );
        };
    
        var setEmptyObject = function() {
            var properties = [ 'x', 'y', 'z', 'w' ];
    
            for ( var item in properties )
                this[ properties[ item ] ] = 0;
        };
    
        var setNonEmptyObject = function( settings ) {
            if ( typeof settings !== 'object' )
                throw new Error( 'Can\'t set properties for the new `Gera.Quaternion` object, because the given settings object is NOT a type of `object`.' );
    
            if ( Object.keys( settings ).length !== 4 )
                throw new Error( 'Can\'t set properties for the new `Gera.Quaternion` object, because the count of the properties from the given settings object isn\'t equal 4.' );
    
            var check = Gera.Global.checkElementsExistenceInArray;
    
            if ( !check( Object.keys( settings ), [ 'x', 'y', 'z', 'w' ] ) )
                throw new Error( 'Can\'t set properties for the new `Gera.Quaternion` object, because the given settings object has the incorrect values. The correct values are: [ x, y, z, w ].' );
    
            if ( typeof settings.x !== 'number' )
                throw new Error( 'Can\'t set properties for the new `Gera.Quaternion` object, because the property `x` from the input arguments is NOT a type of `number`.' );
    
            if ( typeof settings.y !== 'number' )
                throw new Error( 'Can\'t set properties for the new `Gera.Quaternion` object, because the property `y` from the input arguments is NOT a type of `number`.' );
    
            if ( typeof settings.z !== 'number' )
                throw new Error( 'Can\'t set properties for the new `Gera.Quaternion` object, because the property `z` from the input arguments is NOT a type of `number`.' );
    
            if ( typeof settings.w !== 'number' )
                throw new Error( 'Can\'t set properties for the new `Gera.Quaternion` object, because the property `w` from the input arguments is NOT a type of `number`.' );
    
            this.x = settings.x;
            this.y = settings.y;
            this.z = settings.z;
            this.w = settings.w;
        };
    
    })( libraryObject );

    ( function( Gera ) {
    
        Gera.Math = function() {
            throw new Error( 'You\'re trying to create an instance of abstract `Gera.Math` prototype.' );
        };
    
        Gera.Math.convertDegreesToRadians = function( degrees ) {
            if ( typeof degrees !== 'number' )
                throw new Error( 'Can\'t convert degrees to radians, because the input value is NOT a type of `number`.' );
    
            return degrees * Math.PI / 180;
        };
    
        Gera.Math.createPerspectiveProjection = function( bounds ) {
            if ( !( bounds instanceof Gera.Bounds.Perspective ) )
                throw new Error( 'Can\'t create the perspective projection on given bounds, because it\'s NOT an instance of `Gera.Bounds.Perspective`.' );
    
            var top = bounds.near * Math.tan( bounds.fieldOfView * Math.PI / 360 );
            var right = top * bounds.aspect;
    
            return Gera.Matrix.Frustum(
                new Gera.Bounds.Orthographic({
                    left: -right,
                    right: right,
                    top: top,
                    bottom: -top,
                    near: bounds.near,
                    far: bounds.far
                })
            );
        };
    
        Gera.Math.createOrthographicProjection = function( bounds ) {
            if ( !( bounds instanceof Gera.Bounds.Orthographic ) )
                throw new Error( 'Can\'t create the orthographic projection on given bounds, because it\'s NOT an instance of `Gera.Bounds.Orthographic`.' );
    
            var matrix = new Gera.Matrix.Empty();
            var rightLeft = ( bounds.right - bounds.left );
            var topBottom = ( bounds.top - bounds.bottom );
            var farNear = ( bounds.far - bounds.near );
    
            for ( var i = 0; i < matrix.length; i++ ) {
                matrix[ i ] = 2 / rightLeft;
                matrix[ i ] = 0;
                matrix[ i ] = 0;
                matrix[ i ] = 0;
                matrix[ i ] = 0;
                matrix[ i ] = 2 / topBottom;
                matrix[ i ] = 0;
                matrix[ i ] = 0;
                matrix[ i ] = 0;
                matrix[ i ] = 0;
                matrix[ i ] = -2 / farNear;
                matrix[ i ] = 0;
                matrix[ i ] = -( left + right ) / rightLeft;
                matrix[ i ] = -( top + bottom ) / topBottom;
                matrix[ i ] = -( far + near ) / farNear;
                matrix[ i ] = 1;
            }
    
            return matrix;
        };
    
        Gera.Math.translateMatrixByVector = function( matrix, vector ) {
            if ( !( matrix instanceof Float32Array ) )
                throw new Error( 'Can\'t translate the input matrix by the input vector, because the input matrix is not an instance of `Float32Array`.' );
    
            if ( !( vector instanceof Gera.Vector3 ) )
                throw new Error( 'Can\'t translate the input matrix by the input vector, because the input vector is not an instance of `Gera.Vector3`.' );
    
            matrix[ 12 ] =
                matrix[ 0  ] * vector.x +
                matrix[ 4  ] * vector.y +
                matrix[ 8  ] * vector.z +
                matrix[ 12 ];
    
            matrix[ 13 ] =
                matrix[ 1  ] * vector.x +
                matrix[ 5  ] * vector.y +
                matrix[ 9  ] * vector.z +
                matrix[ 13 ];
    
            matrix[ 14 ] =
                matrix[ 2  ] * vector.x +
                matrix[ 6  ] * vector.y +
                matrix[ 10 ] * vector.z +
                matrix[ 14 ];
    
            matrix[ 15 ] =
                matrix[ 3  ] * vector.x +
                matrix[ 7  ] * vector.y +
                matrix[ 11 ] * vector.z +
                matrix[ 15 ];
    
            return matrix;
        };
    
        Gera.Math.multiplyMatrices = function( firstMatrix, secondMatrix ) {
            if ( !( firstMatrix instanceof Float32Array ) )
                throw new Error( 'Can\'t multiply the two matrices between each other, because the first matrix is NOT an instance of `Float32Array`.' );
    
            if ( !( secondMatrix instanceof Float32Array ) )
                throw new Error( 'Can\'t multiply the two matrices between each other, because the second matrix is NOT an instance of `Float32Array`.' );
    
            var resultMatrix = new Gera.Matrix.Empty();
    
            resultMatrix[ 0 ] =
                firstMatrix[ 0  ] * secondMatrix[ 0 ] +
                firstMatrix[ 4  ] * secondMatrix[ 1 ] +
                firstMatrix[ 8  ] * secondMatrix[ 2 ] +
                firstMatrix[ 12 ] * secondMatrix[ 3 ];
    
            resultMatrix[ 1 ] =
                firstMatrix[ 1  ] * secondMatrix[ 0 ] +
                firstMatrix[ 5  ] * secondMatrix[ 1 ] +
                firstMatrix[ 9  ] * secondMatrix[ 2 ] +
                firstMatrix[ 13 ] * secondMatrix[ 3 ];
    
            resultMatrix[ 2 ] =
                firstMatrix[ 2  ] * secondMatrix[ 0 ] +
                firstMatrix[ 6  ] * secondMatrix[ 1 ] +
                firstMatrix[ 10 ] * secondMatrix[ 2 ] +
                firstMatrix[ 14 ] * secondMatrix[ 3 ];
    
            resultMatrix[ 3 ] =
                firstMatrix[ 3  ] * secondMatrix[ 0 ] +
                firstMatrix[ 7  ] * secondMatrix[ 1 ] +
                firstMatrix[ 11 ] * secondMatrix[ 2 ] +
                firstMatrix[ 15 ] * secondMatrix[ 3 ];
    
            resultMatrix[ 4 ] =
                firstMatrix[ 0  ] * secondMatrix[ 4 ] +
                firstMatrix[ 4  ] * secondMatrix[ 5 ] +
                firstMatrix[ 8  ] * secondMatrix[ 6 ] +
                firstMatrix[ 12 ] * secondMatrix[ 7 ];
    
            resultMatrix[ 5 ] =
                firstMatrix[ 1  ] * secondMatrix[ 4 ] +
                firstMatrix[ 5  ] * secondMatrix[ 5 ] +
                firstMatrix[ 9  ] * secondMatrix[ 6 ] +
                firstMatrix[ 13 ] * secondMatrix[ 7 ];
    
            resultMatrix[ 6 ] =
                firstMatrix[ 2  ] * secondMatrix[ 4 ] +
                firstMatrix[ 6  ] * secondMatrix[ 5 ] +
                firstMatrix[ 10 ] * secondMatrix[ 6 ] +
                firstMatrix[ 14 ] * secondMatrix[ 7 ];
    
            resultMatrix[ 7 ] =
                firstMatrix[ 3  ] * secondMatrix[ 4 ] +
                firstMatrix[ 7  ] * secondMatrix[ 5 ] +
                firstMatrix[ 11 ] * secondMatrix[ 6 ] +
                firstMatrix[ 15 ] * secondMatrix[ 7 ];
    
            resultMatrix[ 8 ] =
                firstMatrix[ 0  ] * secondMatrix[ 8  ] +
                firstMatrix[ 4  ] * secondMatrix[ 9  ] +
                firstMatrix[ 8  ] * secondMatrix[ 10 ] +
                firstMatrix[ 12 ] * secondMatrix[ 11 ];
    
            resultMatrix[ 9 ] =
                firstMatrix[ 1  ] * secondMatrix[ 8  ] +
                firstMatrix[ 5  ] * secondMatrix[ 9  ] +
                firstMatrix[ 9  ] * secondMatrix[ 10 ] +
                firstMatrix[ 13 ] * secondMatrix[ 11 ];
    
            resultMatrix[ 10 ] =
                firstMatrix[ 2  ] * secondMatrix[ 8  ] +
                firstMatrix[ 6  ] * secondMatrix[ 9  ] +
                firstMatrix[ 10 ] * secondMatrix[ 10 ] +
                firstMatrix[ 14 ] * secondMatrix[ 11 ];
    
            resultMatrix[ 11 ] =
                firstMatrix[ 3  ] * secondMatrix[ 8  ] +
                firstMatrix[ 7  ] * secondMatrix[ 9  ] +
                firstMatrix[ 11 ] * secondMatrix[ 10 ] +
                firstMatrix[ 15 ] * secondMatrix[ 11 ];
    
            resultMatrix[ 12 ] =
                firstMatrix[ 0  ] * secondMatrix[ 12 ] +
                firstMatrix[ 4  ] * secondMatrix[ 13 ] +
                firstMatrix[ 8  ] * secondMatrix[ 14 ] +
                firstMatrix[ 12 ] * secondMatrix[ 15 ];
    
            resultMatrix[ 13 ] =
                firstMatrix[ 1  ] * secondMatrix[ 12 ] +
                firstMatrix[ 5  ] * secondMatrix[ 13 ] +
                firstMatrix[ 9  ] * secondMatrix[ 14 ] +
                firstMatrix[ 13 ] * secondMatrix[ 15 ];
    
            resultMatrix[ 14 ] =
                firstMatrix[ 2  ] * secondMatrix[ 12 ] +
                firstMatrix[ 6  ] * secondMatrix[ 13 ] +
                firstMatrix[ 10 ] * secondMatrix[ 14 ] +
                firstMatrix[ 14 ] * secondMatrix[ 15 ];
    
            resultMatrix[ 15 ] =
                firstMatrix[ 3  ] * secondMatrix[ 12 ] +
                firstMatrix[ 7  ] * secondMatrix[ 13 ] +
                firstMatrix[ 11 ] * secondMatrix[ 14 ] +
                firstMatrix[ 15 ] * secondMatrix[ 15 ];
    
            return resultMatrix;
        };
    
        Gera.Math.convertQuaternionToMatrix = function( quaternion ) {
            if ( !( quaternion instanceof Gera.Quaternion ) )
                throw new Error( 'Can\'t convert the given quaternion object to its matrix 4x4 representation, because it\'s NOT an instance of `Gera.Quaternion`.' );
    
            var matrix = new Gera.Matrix.Empty();
    
            for ( var i = 0; i < matrix.length; i++ ) {
                switch ( i ) {
                    case 0:
                        matrix[ i ] = 1 - ( quaternion.y * ( quaternion.y + quaternion.y ) + quaternion.z * ( quaternion.z + quaternion.z ) );
                        break;
                    case 1:
                        matrix[ i ] = quaternion.x * ( quaternion.y + quaternion.y ) + quaternion.w * ( quaternion.z + quaternion.z );
                        break;
                    case 2:
                        matrix[ i ] = quaternion.x * ( quaternion.z + quaternion.z ) - quaternion.w * ( quaternion.y + quaternion.y );
                        break;
                    case 4:
                        matrix[ i ] = quaternion.x * ( quaternion.y + quaternion.y ) - quaternion.w * ( quaternion.z + quaternion.z );
                        break;
                    case 5:
                        matrix[ i ] = 1 - ( quaternion.x * ( quaternion.x + quaternion.x ) + quaternion.z * ( quaternion.z + quaternion.z ) );
                        break;
                    case 6:
                        matrix[ i ] = quaternion.y * ( quaternion.z + quaternion.z ) + quaternion.w * ( quaternion.x + quaternion.x );
                        break;
                    case 8:
                        matrix[ i ] = quaternion.x * ( quaternion.z + quaternion.z ) + quaternion.w * ( quaternion.y + quaternion.y );
                        break;
                    case 9:
                        matrix[ i ] = quaternion.y * ( quaternion.z + quaternion.z ) - quaternion.w * ( quaternion.x + quaternion.x );
                        break;
                    case 10:
                        matrix[ i ] = 1 - ( quaternion.x * ( quaternion.x + quaternion.x ) + quaternion.y * ( quaternion.y + quaternion.y ) );
                        break;
                    case 3:
                    case 7:
                    case 11:
                    case 12:
                    case 13:
                    case 14:
                        matrix[ i ] = 0;
                        break;
                    case 15:
                        matrix[ i ] = 1;
                        break;
                    default:
                        throw new Error( 'Can\'t convert the given quaternion object to its matrix 4x4 representation, because it seems to be, that the size of the generated matrix wouldn\'t be the 4x4.' );
                }
            }
    
            return matrix;
        };
    
        Gera.Math.convertRotationToQuaternion = function( vector, angle ) {
            if ( !( vector instanceof Gera.Vector3 ) )
                throw new Error( 'Can\'t represent the given rotation settings as the quaternion object, because the given vector is NOT an instance of `Gera.Vector3`.' );
    
            if ( typeof angle !== 'number' )
                throw new Error( 'Can\'t represent the given rotation settings as the quaternion object, because the given angle is NOT a type of `number`.' );
    
            var angleInRadians = Gera.Math.convertDegreesToRadians( angle );
            return new Gera.Quaternion({
                x: vector.x * Math.sin( angleInRadians / 2 ),
                y: vector.y * Math.sin( angleInRadians / 2 ),
                z: vector.z * Math.sin( angleInRadians / 2 ),
                w: Math.cos( angleInRadians / 2 )
            });
        };
    
        Gera.Math.multiplyQuaternions = function( firstQuaternion, secondQuaternion ) {
            if ( !( firstQuaternion instanceof Gera.Quaternion ) )
                throw new Error( 'Can\'t multiply the two quaternions, because the first one is NOT an instance of `Gera.Quaternion`.' );
    
            if ( !( secondQuaternion instanceof Gera.Quaternion ) )
                throw new Error( 'Can\'t multiply the two quaternions, because the second one is NOT an instance of `Gera.Quaternion`.' );
    
            var resultQuartenion = new Gera.Quaternion();
    
            resultQuartenion.x =
                firstQuaternion.w * secondQuaternion.x +
                firstQuaternion.x * secondQuaternion.w +
                firstQuaternion.y * secondQuaternion.z -
                firstQuaternion.z * secondQuaternion.y;
    
            resultQuartenion.y =
                firstQuaternion.w * secondQuaternion.y -
                firstQuaternion.x * secondQuaternion.z +
                firstQuaternion.y * secondQuaternion.w +
                firstQuaternion.z * secondQuaternion.x;
    
            resultQuartenion.z =
                firstQuaternion.w * secondQuaternion.z +
                firstQuaternion.x * secondQuaternion.y -
                firstQuaternion.y * secondQuaternion.x +
                firstQuaternion.z * secondQuaternion.w;
    
            resultQuartenion.w =
                firstQuaternion.w * secondQuaternion.w -
                firstQuaternion.x * secondQuaternion.x -
                firstQuaternion.y * secondQuaternion.y -
                firstQuaternion.z * secondQuaternion.z;
    
            return resultQuartenion;
        };
    
        Gera.Math.checkIsIntegerPowerOf2 = function( value ) {
            if ( typeof value !== 'number' ) 
                throw new Error( 'Can\'t check if the given integer is a power of 2, because it\'s NOT a type of `number`.' );
    
            return ( value & ( value - 1 ) ) === 0;
        };
    
    })( libraryObject );

    ( function( Gera ) {
    
        Gera.Matrix = function() {
            throw new Error( 'You\'re trying to create an instance of abstract `Gera.Matrix` prototype.' );
        };
    
        Gera.Matrix.Type = {
            Empty: 0,
            Identity: 1,
            Frustum: 2,
            Custom: 3
        };
    
        Gera.Matrix.Empty = function() {
            if ( typeof Float32Array === 'undefined' )
                throw new Error( 'Can\'t create an empty matrix, because your browser doesn\'t support the typed JavaScript arrays, which are required for the WebGL work.' );
    
            return prepareEmptyMatrixEntity();
        };
    
        Gera.Matrix.Identity = function() {
            var matrix = new Gera.Matrix.Empty();
    
            for ( var i = 0; i < matrix.length; i++ ) {
                switch( i ) {
                    case 0:
                    case 5:
                    case 10:
                    case 15:
                        matrix[ i ] = 1;
                        break;
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                    case 6:
                    case 7:
                    case 8:
                    case 9:
                    case 11:
                    case 12:
                    case 13:
                    case 14:
                        matrix[ i ] = 0;
                        break;
                }
            }
    
            return matrix;
        };
    
        Gera.Matrix.Frustum = function( bounds ) {
            if ( !( bounds instanceof Gera.Bounds.Orthographic ) )
                throw new Error( 'Can\'t create a new frustum matrix, because the input frustum bounds object is NOT an instance of `Gera.Bounds.Orthographic`.' );
    
            var rightLeft = ( bounds.right - bounds.left );
            var topBottom = ( bounds.top - bounds.bottom );
            var farNear = ( bounds.far - bounds.near );
            var matrix = new Gera.Matrix.Empty();
    
            for ( var i = 0; i < matrix.length; i++ ) {
                switch( i ) {
                    case 0:
                        matrix[ i ] = ( bounds.near * 2 ) / rightLeft;
                        break;
                    case 5:
                        matrix[ i ] = ( bounds.near * 2 ) / topBottom;
                        break;
                    case 8:
                        matrix[ i ] = ( bounds.right + bounds.left ) / rightLeft;
                        break;
                    case 9:
                        matrix[ i ] = ( bounds.top + bounds.bottom ) / topBottom;
                        break;
                    case 10:
                        matrix[ i ] = -( bounds.far + bounds.near ) / farNear;
                        break;
                    case 11:
                        matrix[ i ] = -1;
                        break;
                    case 14:
                        matrix[ i ] = -( bounds.far * bounds.near * 2 ) / farNear;
                        break;
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                    case 6:
                    case 7:
                    case 12:
                    case 13:
                    case 15:
                        matrix[ i ] = 0;
                        break;
                }
            }
    
            return matrix;
        };
    
        Gera.Matrix.Custom = function() {
            handleCustomMatrixArguments.call( this, arguments );
        };
    
        var prepareEmptyMatrixEntity = function() {
            var matrix = new Float32Array( 16 );
            matrix.multiplyByMatrix = multiplyCurrentMatrixByInputMatrix;
            return matrix;
        };
    
        var multiplyCurrentMatrixByInputMatrix = function( matrix ) {
            if ( !( matrix instanceof Float32Array ) )
                throw new Error( 'Can\'t multiply the current matrix by the input matrix, because the given matrix object is NOT an instance of `Float32Array`.' );
    
            if ( !( this instanceof Float32Array ) )
                throw new Error( 'Can\'t multiply the current matrix by the input matrix, because the scope of the current matrix object is NOT an instance of `Float32Array`.' );
    
            var resultMatrix = Gera.Math.multiplyMatrices( this, matrix );
    
            if ( !( resultMatrix instanceof Float32Array ) )
                throw new Error( 'Can\'t multiply the current matrix by the input matrix, because the result matrix from the multiplication process is NOT an instance of `Float32Array`.' );
    
            if ( typeof this.length !== 'number' )
                throw new Error( 'Can\'t multiply the current matrix by the input matrix, because the binded `length` property is NOT a type of `number`.' );
    
            for ( var i = 0; i < this.length; i++ )
                this[ i ] = resultMatrix[ i ];
        };
    
        var handleCustomMatrixArguments = function( inputArguments ) {
            if ( typeof inputArguments !== 'object' )
                throw new Error( 'Can\'t handle the required arguments for creating a new `Gera.Custom.Matrix` object, because the given arguments object is NOT a type of `object`.' );
    
            if ( inputArguments.length === 0 )
                throw new Error( 'Can\'t handle the required arguments for creating a new `Gera.Custom.Matrix` object, because the properties count of the given object equals zero.' );
    
            var properties = extractCustomMatrixProperties( inputArguments[ 0 ] );
            this.typed = properties.vertices;
            this.generic = prepareGenericMatrix( properties.vertices, properties.size );
        };
    
        var extractCustomMatrixProperties = function( settings ) {
            if ( typeof settings !== 'object' )
                throw new Error( 'Can\'t extract the properties for creating a new `Gera.Custom.Matrix` object, because the given settings object is NOT a type of `object`.' );
    
            checkCustomMatrixArguments( settings.data, settings.size );
    
            return {
                vertices: settings.data,
                size: settings.size
            };
        };
    
        var checkCustomMatrixArguments = function( vertices, size ) {
            if ( !( vertices instanceof Float32Array ) )
                throw new Error( 'Can\'t prepare the new custom matrix, because the input vertices list is NOT an instance of `Float32Array`.' );
    
            if ( typeof size !== 'number' )
                throw new Error( 'Can\'t prepare the new custom matrix, because the input size component is NOT a type of `number`.' );
    
            if ( [ 2, 3, 4 ].indexOf( size ) === -1 )
                throw new Error( 'Can\'t prepare the new custom matrix, because the input size component has the incorrect value. Component size must be one of the following values: [ 2, 3, 4 ].' );
    
            if ( vertices.length % size !== 0 )
                throw new Error( 'Can\'t prepare the new custom matrix, because the vertices array length is NOT a multiply of the size value.' );
        };
    
        var prepareGenericMatrix = function( vertices, size ) {
            checkInputVertices( vertices );
    
            switch ( size ) {
                case 2:
                    return prepareTwoDimensionalMatrix( vertices );
                case 3:
                    return prepareThreeDimensionalMatrix( vertices );
                case 4:
                    return prepareFourDimensionalMatrix( vertices );
                default:
                    throw new Error( 'Can\'t create a new `Gera.Matrix.Custom` object, because the given size value is unacceptable for the dimension of the new matrix. Acceptable size value is in the next range: [ 2-4 ].' );
            }
        };
    
        var checkInputVertices = function( vertices ) {
            if ( !( vertices instanceof Float32Array ) )
                throw new Error( 'Can\'t check the input vertices object for creating a new matrix, because it\'s NOT an instance of `Float32Array`.' );
    
            if ( vertices.length < 2 )
                throw new Error( 'Input vertices can\'t be allowed to be used for creating a new matrix because the count of its elements is less than 2.' );
        };
    
        var prepareTwoDimensionalMatrix = function( vertices ) {
            var matrix = new Array();
    
            for ( var i = 0; i < vertices.length; i += 2 ) {
                matrix.push(
                    new Gera.Vector2({
                        x: vertices[ i ],
                        y: vertices[ i + 1 ]
                    })
                );
            }
    
            return matrix;
        };
    
        var prepareThreeDimensionalMatrix = function( vertices ) {
            var matrix = new Array();
    
            for ( var i = 0; i < vertices.length; i += 3 ) {
                matrix.push(
                    new Gera.Vector3({
                        x: vertices[ i ],
                        y: vertices[ i + 1 ],
                        z: vertices[ i + 2 ]
                    })
                );
            }
    
            return matrix;
        };
    
        var prepareFourDimensionalMatrix = function( vertices ) {
            var matrix = new Array();
    
            for ( var i = 0; i < vertices.length; i += 4 ) {
                matrix.push(
                    new Gera.Vector4({
                        x: vertices[ i ],
                        y: vertices[ i + 1 ],
                        z: vertices[ i + 2 ],
                        i: vertices[ i + 3 ]
                    })
                );
            }
    
            return matrix;
        };
    
    })( libraryObject );

    var Shader = function() {
        throw new Error( 'You\'re trying to create an instance of abstract `Gera.Shader` prototype.' );
    };
    
    Shader.Type = {
        Vertex: 0,
        Fragment: 1
    };

    var ShaderManager = function( webglContext ) {
        if ( !( webglContext instanceof WebGLRenderingContext ) )
            throw new Error( 'Given argument for the new shader manager is NOT an instance of `WebGLRenderingContext`.' );
    
        this.webglContext = webglContext;
    };
    
    ShaderManager.prototype.createShaderProgram = function() {
        if ( !( this.webglContext instanceof WebGLRenderingContext ) )
            throw new Error( 'Can\'t create a new shader program, because the current WebGL context is NOT an instance of `WebGLRenderingContext`.' );
    
        var shaderProgram = this.webglContext.createProgram();
    
        if ( !( shaderProgram instanceof WebGLProgram ) )
            throw new Error( 'Current WebGL context wasn\'t able to create a new `WebGLProgram` instance.' );
    
        var vertexShader = this.createShader( Shader.Type.Vertex );
        var fragmentShader = this.createShader( Shader.Type.Fragment );
    
        this.setShadersForShaderProgram(
            shaderProgram,
            vertexShader,
            fragmentShader
        );
    
        return shaderProgram;
    };
    
    ShaderManager.prototype.createShader = function( shaderType ) {
        if ( shaderType === Shader.Type.Vertex ) {
            var vertexShader = this.webglContext.createShader( this.webglContext.VERTEX_SHADER );
            this.handleShaderObject( vertexShader, this.getVertexShaderSource() );
            return vertexShader;
        }
        else if ( shaderType === Shader.Type.Fragment ) {
            var fragmentShader = this.webglContext.createShader( this.webglContext.FRAGMENT_SHADER );
            this.handleShaderObject( fragmentShader, this.getFragmentShaderSource() );
            return fragmentShader;
        }
        else
            throw new Error( 'Can\'t create a new shader object with the given shader type. Possible enumeration value is one of the next: [ Shader.Type.Vertex, Shader.Type.Fragment ].' );
    };
    
    ShaderManager.prototype.handleShaderObject = function( shaderObject, shaderSource ) {
        this.webglContext.shaderSource( shaderObject, shaderSource );
        this.webglContext.compileShader( shaderObject );
    
        if ( !this.webglContext.getShaderParameter( shaderObject, this.webglContext.COMPILE_STATUS ) ) {
            var errorMessage = this.webglContext.getShaderInfoLog( shaderProgram );
            this.webglContext.deleteProgram( shaderProgram );
            throw new Error(
                String.prototype.concat(
                    'Can\'t compile the shader with the given source code. Error message from the WebGL context about the shader compilation failure:\r\n',
                    errorMessage
                )
            );
        }
    };
    
    ShaderManager.prototype.setShadersForShaderProgram = function( shaderProgram, vertexShader, fragmentShader ) {
        if ( !( shaderProgram instanceof WebGLProgram ) )
            throw new Error( 'Can\'t initialize a new shader program with the given shaders, because input shader program is NOT an instance of `WebGLProgram`.' );
    
        if ( !( vertexShader instanceof WebGLShader ) )
            throw new Error( 'Can\'t initialize a new shader program with the given shaders, because input vertex shader is NOT an instance of `WebGLShader`.' );
    
        if ( !( fragmentShader instanceof WebGLShader ) )
            throw new Error( 'Can\'t initialize a new shader program with the given shaders, because input fragment shader is NOT an instance of `WebGLShader`.' );
    
        this.webglContext.attachShader( shaderProgram, vertexShader );
        this.webglContext.attachShader( shaderProgram, fragmentShader );
        this.webglContext.linkProgram( shaderProgram );
    
        if ( !this.webglContext.getProgramParameter( shaderProgram, this.webglContext.LINK_STATUS ) ) {
            var errorMessage = this.webglContext.getProgramInfoLog( shaderProgram );
            this.webglContext.deleteProgram( shaderProgram );
            throw new Error(
                String.prototype.concat(
                    'Can\'t link a shader program with the given shaders. Error message from the WebGL context about the linkage failure:\r\n',
                    errorMessage
                )
            );
        }
    
        this.prepareUniformsForShaderProgram( shaderProgram );
        this.prepareAttributesForShaderProgram( shaderProgram );
    };
    
    ShaderManager.prototype.prepareUniformsForShaderProgram = function( shaderProgram ) {
        if ( !( shaderProgram instanceof WebGLProgram ) )
            throw new Error( 'Can\'t prepare the uniforms locations for the shader program, because the shader program object is NOT an instance of `WebGLProgram`.' );
    
        shaderProgram.uniforms = {
            projectionMatrix: this.prepareUniformLocation( shaderProgram, 'projectionMatrix' ),
            modelViewMatrix: this.prepareUniformLocation( shaderProgram, 'modelViewMatrix' ),
            textureSampler: this.prepareUniformLocation( shaderProgram, 'textureSampler' ),
            alphaValue: this.prepareUniformLocation( shaderProgram, 'alphaValue' ),
            hasMeshTexture: this.prepareUniformLocation( shaderProgram, 'hasMeshTexture' )
        };
    };
    
    ShaderManager.prototype.prepareUniformLocation = function( shaderProgram, uniformName ) {
        if ( !( shaderProgram instanceof WebGLProgram ) )
            throw new Error( 'Can\'t prepare a uniform location for the shader program, because the shader program object is NOT an instance of `WebGLProgram`.' );
    
        if ( typeof uniformName !== 'string' )
            throw new Error( 'Can\'t prepare a uniform location for the shader program, because the uniform name is NOT a type of `string`.' );
    
        if ( uniformName.length === 0 )
            throw new Error( 'Can\'t prepare a uniform location for the shader program, because the uniform name is an empty string.' );
    
        var uniformLocation = this.webglContext.getUniformLocation( shaderProgram, uniformName );
    
        if ( !( uniformLocation instanceof WebGLUniformLocation ) )
            throw new Error(
                String.prototype.concat(
                    'Can\'t get the uniform location by name: `',
                    uniformName,
                    '` So, can\'t prepare a uniform location for the shader program object.'
                )
            );
    
        return uniformLocation;
    };
    
    ShaderManager.prototype.prepareAttributesForShaderProgram = function( shaderProgram ) {
        if ( !( shaderProgram instanceof WebGLProgram ) )
            throw new Error( 'Can\'t prepare the attributes locations for the shader program, because the shader program object is NOT an instance of `WebGLProgram`.' );
    
        shaderProgram.attributes = {
            vertexPosition: this.prepareAttributeLocation( shaderProgram, 'vertexPosition' ),
            vertexColor: this.prepareAttributeLocation( shaderProgram, 'vertexColor' ),
            vertexTexture: this.prepareAttributeLocation( shaderProgram, 'vertexTextureUv' )
        };
    
        this.enableVertexAttributes( shaderProgram.attributes );
    };
    
    ShaderManager.prototype.prepareAttributeLocation = function( shaderProgram, attributeName ) {
        if ( !( shaderProgram instanceof WebGLProgram ) )
            throw new Error( 'Can\'t prepare an attribute location for the shader program, because the shader program object is NOT an instance of `WebGLProgram`.' );
    
        if ( typeof attributeName !== 'string' )
            throw new Error( 'Can\'t prepare an attribute location for the shader program, because the attribute name is NOT a type of `string`.' );
    
        if ( attributeName.length === 0 )
            throw new Error( 'Can\'t prepare an attribute location for the shader program, because the attribute name is an empty string.' );
    
        var attributeLocation = this.webglContext.getAttribLocation( shaderProgram, attributeName );
    
        if ( typeof attributeLocation !== 'number' || attributeLocation === -1 )
            throw new Error(
                String.prototype.concat(
                    'Can\'t get the attribute location by name: `',
                    attributeName,
                    '` So, can\'t prepare an attribute location for the shader program object.'
                )
            );
    
        return attributeLocation;
    };
    
    ShaderManager.prototype.enableVertexAttributes = function( attributes ) {
        if ( typeof attributes !== 'object' )
            throw new Error( 'Can\'t enable the vertex attributes, because attributes object is NOT a type of `object`.' );
    
        this.enableVertexAtrributeArray( attributes.vertexPosition );
    };
    
    ShaderManager.prototype.enableVertexAtrributeArray = function( attributeIndex ) {
        if ( typeof attributeIndex !== 'number' )
            throw new Error( 'Can\'t enable the vertex attribute array, because the input attribute index is NOT a type of `number`.' );
    
        this.webglContext.enableVertexAttribArray( attributeIndex );
    };
    
    ShaderManager.prototype.getVertexShaderSource = function() {
        return 'attribute vec3 vertexPosition;\
                attribute vec4 vertexColor;\
                attribute vec2 vertexTextureUv;\
                uniform mat4 modelViewMatrix;\
                uniform mat4 projectionMatrix;\
                varying vec4 vertexColorReference;\
                varying vec2 vertexTextureUvReference;\
                \
                void main( void ) {\
                    gl_Position = projectionMatrix * modelViewMatrix * vec4( vertexPosition, 1.0 );\
                    vertexColorReference = vertexColor;\
                    vertexTextureUvReference = vertexTextureUv;\
                }';
    };
    
    ShaderManager.prototype.getFragmentShaderSource = function() {
        return 'precision mediump float;\
                uniform sampler2D textureSampler;\
                uniform float alphaValue;\
                uniform bool hasMeshTexture;\
                varying vec4 vertexColorReference;\
                varying vec2 vertexTextureUvReference;\
                \
                void main( void ) {\
                    if ( hasMeshTexture ) {\
                        vec4 texel = texture2D( textureSampler, vec2( vertexTextureUvReference.s, vertexTextureUvReference.t ) );\
                        gl_FragColor = vec4( texel.rgb, texel.a * alphaValue );\
                    }\
                    else\
                        gl_FragColor = vec4( vertexColorReference.rgb, vertexColorReference.a * alphaValue );\
                }';
    };

    ( function( Gera ) {
    
        Gera.Color = function() {
            this.needsUpdate = false;
    
            var properties = [
                'integer',
                'hexadecimalString',
                'rgba',
                'glFloat'
            ];
    
            for ( var item in properties )
                this[ properties[ item ] ] = null; 
        };
    
        Gera.Color.Type = {
            Integer: 0,
            HexadecimalString: 1,
            RgbaObject: 2,
            GlFloat: 3
        };
    
        Gera.Color.prototype.set = function( type, value ) {
            switch ( type ) {
                case Gera.Color.Type.Integer:
                    setColorByIntegerValue.call( this, value );
                    break;
                case Gera.Color.Type.HexadecimalString:
                    setColorByHexString.call( this, value );
                    break;
                case Gera.Color.Type.RgbaObject:
                    setColorByRgbaObject.call( this, value );
                    break;
                case Gera.Color.Type.GlFloat:
                    setColorByGlFloatObject.call( this, value );
                    break;
                default:
                    throw new Error( 'You didn\'t provide the correct color type for setting the new color.' );
            }
        };
    
        Gera.Color.Rgba = function() {
            checkInputArguments( arguments );
            setColorComponentProperties( this, arguments[ 0 ] );
        };
    
        Gera.Color.GlFloat = function() {
            checkInputArguments( arguments );
            setColorComponentProperties( this, arguments[ 0 ] );
        };
    
        var setColorByIntegerValue = function( integerValue ) {
            if ( typeof integerValue !== 'number' )
                throw new Error( 'Can\'t set a new color using integer value, because input value is NOT a type of `number`.' );
    
            this.integer = integerValue;
            this.hexadecimalString = this.convertIntegerToHexString( integerValue );
            this.rgba = this.convertIntegerToRgbaObject( integerValue );
            this.glFloat = this.convertIntegerToGlFloatObject( integerValue );
        };
    
        var setColorByHexString = function( hexadecimalString ) {
            if ( typeof hexadecimalString !== 'string' )
                throw new Error( 'Can\'t set a new color using hexadecimal string, because input value is NOT a type of `string`.' );
    
            this.hexadecimalString = hexadecimalString;
            this.integer = this.convertHexStringToInteger( hexadecimalString );
            this.rgba = this.convertHexStringToRgbaObject( hexadecimalString );
            this.glFloat = this.convertHexStringToGlFloatObject( hexadecimalString );
        };
    
        var setColorByRgbaObject = function( rgbaObject ) {
            if ( !( rgbaObject instanceof Gera.Color.Rgba ) )
                throw new Error( 'Can\'t set a new color using RGBA object, because input value is NOT an instance of `Gera.Color.Rgba`.' );
    
            this.rgba = rgbaObject;
            this.integer = this.convertRgbaObjectToInteger( rgbaObject );
            this.hexadecimalString = this.convertRgbaObjectToHexString( rgbaObject );
            this.glFloat = this.convertRgbaObjectToGlFloatObject( rgbaObject );
        };
    
        var setColorByGlFloatObject = function( glFloatObject ) {
            if ( !( glFloatObject instanceof Gera.Color.GlFloat ) )
                throw new Error( 'Can\'t set a new color using GL float object, because input value is NOT an instance of `Gera.Color.GlFloat`.' );
    
            this.glFloat = glFloatObject;
            this.integer = this.convertGlFloatObjectToInteger( glFloatObject );
            this.hexadecimalString = this.convertGlFloatObjectToHexString( glFloatObject );
            this.rgba = this.convertGlFloatObjectToRgbaObject( glFloatObject );
        };
    
        var checkInputArguments = function() {
            if ( arguments.length !== 1 )
                throw new Error( 'There could be only a one input argument for the color component constructor.' );
    
            if ( typeof arguments[ 0 ] !== 'object' )
                throw new Error( 'Input argument is not a type of `object`.' );
        };
    
        var setColorComponentProperties = function( colorComponentObject, properties ) {
            for ( var item in properties ) {
                switch( item ) {
                    case 'red':
                        colorComponentObject.red = properties[ item ];
                        break;
                    case 'green':
                        colorComponentObject.green = properties[ item ];
                        break;                    
                    case 'blue':
                        colorComponentObject.blue = properties[ item ];
                        break;
                    case 'alpha':
                        colorComponentObject.alpha = properties[ item ];
                        break;
                    default:
                        throw new Error(
                            String.prototype.concat(
                                'Can\'t set the color component properties, because the input property has an invalid name. You have provided the next value: `',
                                item,
                                '`. Possible value is the one from the next list: [ red, green, blue, alpha ].'
                            )
                        );
                }
            }
        };
    
    })( libraryObject );

    ( function( Gera ) {
    
        Gera.Color.prototype.convertRgbPartToInteger = function( rgbPartValue ) {
            if ( typeof rgbPartValue !== 'number' )
                throw new Error( 'Can\'t convert RGB part to the integer value, it\'s NOT a type of `number`.' );
    
            var hexString = this.convertRgbPartToHexString( rgbPartValue );
            var integerValue = parseInt( hexString, 16 );
            return integerValue;
        };
    
        Gera.Color.prototype.convertRgbPartToHexString = function( rgbPartValue ) {
            if ( typeof rgbPartValue !== 'number' )
                throw new Error( 'Can\'t convert RGB part to the hexadecimal string, because it\'s NOT a type of `number`.' );
    
            rgbPartValue = Math.max( 0, Math.min( rgbPartValue, 255 ) );
    
            var hexString = String.prototype.concat(
                '#',
                '0123456789abcdef'.charAt( ( rgbPartValue - rgbPartValue % 16 ) / 16 ),
                '0123456789abcdef'.charAt( rgbPartValue % 16 )
            );
    
            return hexString;
        };
    
        Gera.Color.prototype.convertRgbPartToGlFloatValue = function( rgbPartValue ) {
            if ( typeof rgbPartValue !== 'number' )
                throw new Error( 'Can\'t convert RGB part to the GL float value, because it\'s NOT a type of `number`.' );
    
            var glFloatValue = 1 / 255 * rgbPartValue;
            return glFloatValue;
        };
    
    })( libraryObject );

    ( function( Gera ) {
    
        Gera.Color.prototype.convertRgbaObjectToInteger = function( rgbaObject ) {
            if ( !( rgbaObject instanceof Gera.Color.Rgba ) )
                throw new Error( 'Can\'t convert RGBA object to the integer value, because it\'s NOT an instance of `Gera.Color.Rgba`.' );
    
            var hexString = String.prototype.concat(
                this.convertRgbPartToHexString( rgbaObject.red ),
                this.convertRgbPartToHexString( rgbaObject.green ),
                this.convertRgbPartToHexString( rgbaObject.blue )
            );
    
            var hexInteger = parseInt( hexString, 16 );
            return hexInteger;
        };
    
        Gera.Color.prototype.convertRgbaObjectToHexString = function( rgbaObject ) {
            if ( !( rgbaObject instanceof Gera.Color.Rgba ) )
                throw new Error( 'Can\'t convert RGBA object to the hexadecimal value, because it\'s NOT an instance of `Gera.Color.Rgba`.' );
    
            var hexString = String.prototype.concat(
                '#',
                this.convertRgbPartToHexString( rgbaObject.red ),
                this.convertRgbPartToHexString( rgbaObject.green ),
                this.convertRgbPartToHexString( rgbaObject.blue )
            );
    
            return hexString;
        };
    
        Gera.Color.prototype.convertRgbaObjectToGlFloatObject = function( rgbaObject ) {
            if ( !( rgbaObject instanceof Gera.Color.Rgba ) )
                throw new Error( 'Can\'t convert RGBA object to the GL float object, because it\'s NOT an instance of `Gera.Color.Rgba`.' );
    
            var glFloatObject = new Gera.Color.GlFloat({
                red: this.convertRgbPartToGlFloatValue( rgbaObject.red ),
                green: this.convertRgbPartToGlFloatValue( rgbaObject.green ),
                blue: this.convertRgbPartToGlFloatValue( rgbaObject.blue ),
                alpha: this.convertRgbPartToGlFloatValue( rgbaObject.alpha )
            });
    
            return glFloatObject;
        };
    
    })( libraryObject );

    ( function( Gera ) {
    
        Gera.Color.prototype.convertIntegerToHexString = function( integerValue ) {
            if ( typeof integerValue !== 'number' )
                throw new Error( 'Can\'t convert integer value to the hexadecimal string, because it\'s NOT a type of `number`.' );
    
            var hexString = String.prototype.concat( '#', integerValue.toString( 16 ) );
            return hexString;
        };
    
        Gera.Color.prototype.convertIntegerToRgbaObject = function( integerValue ) {
            if ( typeof integerValue !== 'number' )
                throw new Error( 'Can\'t convert integer value to the RGBA object, because it\'s NOT a type of `number`.' );
    
            if ( integerValue ) {
                var rgbaObject = new Gera.Color.Rgba({
                    red: ( integerValue >> 16 ) & 255,
                    green: ( integerValue >> 8 ) & 255,
                    blue: integerValue & 255,
                    alpha: 255
                });
    
                return rgbaObject;
            }
        };
    
        Gera.Color.prototype.convertIntegerToGlFloatObject = function( integerValue ) {
            if ( typeof integerValue !== 'number' )
                throw new Error( 'Can\'t convert integer value to the GL float object, because it\'s NOT a type of `number`.' );
    
            var glFloatObject = new Gera.Color.GlFloat({
                red: ( 1 / 255 * ( ( integerValue >> 16 ) & 255 ) ),
                green: ( 1 / 255 * ( ( integerValue >> 8 ) & 255 ) ),
                blue: ( 1 / 255 * ( integerValue & 255 ) ),
                alpha: 1 / 255 * 255
            });
    
            return glFloatObject;
        };
    
    })( libraryObject );

    ( function( Gera ) {
    
        Gera.Color.prototype.convertHexStringToInteger = function( hexString ) {
            if ( typeof hexString !== 'string' )
                throw new Error( 'Can\'t convert hexadecimal string to the integer value, because it\'s NOT a type of `string`.' );
    
            if ( hexString[ 0 ] !== '#' )
                throw new Error( 'Can\'t convert hexadecimal string to the integer value, because it was given in invalid format. The first character of string is NOT the `#` symbol. Valid format is the next: `#0000ff`.' );
    
            var cutString = hexString.substring( 1, hexString.length );
            var integerValue = parseInt( cutString, 16 );
            return integerValue;
        };
    
        Gera.Color.prototype.convertHexStringToRgbaObject = function( hexString ) {
            if ( typeof hexString !== 'string' )
                throw new Error( 'Can\'t convert hexadecimal string to the RGBA object, because it\'s NOT a type of `string`.' );
    
            if ( hexString[ 0 ] !== '#' )
                throw new Error( 'Can\'t convert hexadecimal string to the RGBA object, because it was given in invalid format. The first character of string is NOT the `#` symbol. Valid format is the next: `#0000ff`.' );
    
            var commaSeperatedHexString = '';
            var cutString = hexString.substring( 1, hexString.length );
            var integerValue = parseInt( cutString, 16 );
            return this.convertIntegerToRgbaObject( integerValue );
        };
    
        Gera.Color.prototype.convertHexStringToGlFloatObject = function( hexString ) {
            if ( typeof hexString !== 'string' )
                throw new Error( 'Can\'t convert hexadecimal string to the GL float object, because it\'s NOT a type of `string`.' );
    
            if ( hexString[ 0 ] !== '#' )
                throw new Error( 'Can\'t convert hexadecimal string to the RGBA object, because it was given in invalid format. The first character of string is NOT the `#` symbol. Valid format is the next: `#0000ff`.' );
    
            var commaSeperatedHexString = '';
            var cutString = hexString.substring( 1, hexString.length );
            var integerValue = parseInt( cutString, 16 );
            return this.convertIntegerToGlFloatObject( integerValue );
        };
    
    })( libraryObject );

    ( function( Gera ) {
    
        Gera.Color.prototype.convertGlFloatValueToRgbPart = function( glFloatValue ) {
            if ( typeof glFloatValue !== 'number' )
                throw new Error( 'Can\'t convert GL float value to the RGB part, because it\'s NOT a type of `number`.' );
    
            var rgbPartValue = Math.ceil( glFloatValue / ( 1 / 255 ) );
            return rgbPartValue;
        };
    
        Gera.Color.prototype.convertGlFloatObjectToInteger = function( glFloatObject ) {
            if ( !( glFloatObject instanceof Gera.Color.GlFloat ) )
                throw new Error( 'Can\'t convert GL float object to the integer value, because it\'s NOT an instance of `Gera.Color.GlFloat`.' );
    
            var rgbaObject = new Gera.Color.Rgba({
               red: this.convertGlFloatValueToRgbPart( glFloatObject.red ),
               green: this.convertGlFloatValueToRgbPart( glFloatObject.green ),
               blue: this.convertGlFloatValueToRgbPart( glFloatObject.blue ),
               alpha: this.convertGlFloatValueToRgbPart( glFloatObject.alpha ),
            });
    
            var integerValue = this.convertRgbaObjectToInteger( rgbaObject );
            return integerValue;
        };
    
        Gera.Color.prototype.convertGlFloatObjectToHexString = function() {
            if ( !( glFloatObject instanceof Gera.Color.GlFloat ) )
                throw new Error( 'Can\'t convert GL float object to the hexadecimal string, because it\'s NOT an instance of `Gera.Color.GlFloat`.' );
    
            var rgbaObject = new Gera.Color.Rgba({
               red: this.convertGlFloatValueToRgbPart( glFloatObject.red ),
               green: this.convertGlFloatValueToRgbPart( glFloatObject.green ),
               blue: this.convertGlFloatValueToRgbPart( glFloatObject.blue ),
               alpha: this.convertGlFloatValueToRgbPart( glFloatObject.alpha ),
            });
    
            var hexString = this.convertRgbaObjectToHexString( rgbaObject );
            return hexString;
        };
    
        Gera.Color.prototype.convertGlFloatObjectToRgbaObject = function() {
            if ( !( glFloatObject instanceof Gera.Color.GlFloat ) )
                throw new Error( 'Can\'t convert GL float object to the RGBA object, because it\'s NOT an instance of `Gera.Color.GlFloat`.' );
    
            var rgbaObject = new Gera.Color.Rgba({
               red: this.convertGlFloatValueToRgbPart( glFloatObject.red ),
               green: this.convertGlFloatValueToRgbPart( glFloatObject.green ),
               blue: this.convertGlFloatValueToRgbPart( glFloatObject.blue ),
               alpha: this.convertGlFloatValueToRgbPart( glFloatObject.alpha ),
            });
    
            return rgbaObject;
        };
    
    })( libraryObject );

    ( function( Gera ) {
    
        Gera.Geometry = function() {
            var settings = handleInputArguments( arguments );
            handleInputGeometry.call( this, settings );
        };
    
        Gera.Geometry.Type = {
            Custom: 0,
            Triangle: 1,
            Plane: 2,
            Cube: 3,
            Pyramid: 4,
            Sphere: 5
        };
    
        Gera.Geometry.Settings = function( properties ) {
            checkArgumentsForGeometrySettings( properties );
    
            for ( var item in properties )
                this[ item ] = properties[ item ];
        };
    
        Gera.Geometry.Extruded = function( vertices, level ) {
            if ( !( vertices instanceof Array ) )
                throw new Error( 'Can\'t prepare the extruded geometry object, because the input vertices argument is NOT an instance of `Array`.' );
    
            if ( vertices.length === 0 )
                throw new Error( 'Can\'t prepare the extruded geometry object, because the input vertices array length equals zero.' );
    
            if ( typeof level !== 'number' )
                throw new Error( 'Can\'t prepare the extruded geometry object, because the input level argument is NOT a type of `number`.' );
    
            if ( level < 0 )
                throw new Error( 'Can\'t prepare the extruded geometry object, because the input level argument is less than zero.' );
    
            return prepareVerticesForExtrudedGeometry( vertices, level );
        };
    
        var handleInputArguments = function( inputArguments ) {
            if ( inputArguments.length !== 1 ) {
                throw new Error(
                    String.prototype.concat(
                        'There could be only the one input argument for the `Gera.Geometry` constructor, but you\'ve provided the ',
                        inputArguments.length,
                        ' arguments for it.'
                    )
                );
            }
    
            var inputGeometry = inputArguments[ 0 ];
    
            if ( typeof inputGeometry !== 'object' )
                throw new Error( 'Can\'t handle the input geometry settings, because it\'s NOT a type of `object`.' );
    
            return new Gera.Geometry.Settings({
                type: inputGeometry.type,
                vertices: inputGeometry.vertices,
                indices: inputGeometry.indices,
                uvCoordinates: inputGeometry.uvCoordinates,
                uvIndices: inputGeometry.uvIndices
            });
        };
    
        var handleInputGeometry = function( settings ) {
            if ( !( settings instanceof Gera.Geometry.Settings ) )
                throw new Error( 'Can\'t handle the input geometry from client, because the given settings object is NOT an instance of `Gera.Geometry.Settings`.' );
    
            setGeometryType.call( this, settings.type );
    
            switch ( this.type ) {
                case Gera.Geometry.Type.Custom:
                    handleCustomGeometry.call( this, settings );
                    break;
                case Gera.Geometry.Type.Triangle:
                case Gera.Geometry.Type.Plane:
                case Gera.Geometry.Type.Cube:
                case Gera.Geometry.Type.Pyramid:
                case Gera.Geometry.Type.Sphere:
                    handlePrimitiveGeometry.call( this );
                    break;
                default:
                    throw new Error( 'Can\'t prepare a new geometry object, because the given geometry type is NOT associated with any one type, existed in the `Gera.Geometry.Type` enumeration.' );
            }
        };
    
        var setGeometryType = function( type ) {
            if ( typeof type !== 'number' )
                throw new Error( 'The property `type` from input geometry settings object is NOT a type of `number`.' );
    
            var typeValues = Object.keys( Gera.Geometry.Type ).map( function( key ) {
                return Gera.Geometry.Type[ key ];
            });
    
            if ( typeValues.indexOf( type ) === -1 )
                throw new Error( 'Can\'t set the geometry type for the input object, because its geometry type doesn\'t exist in `Gera.Geometry.Type` enumeration values.' );
    
            this.type = type;
        };
    
        var handleCustomGeometry = function( settings ) {
            if ( !( settings instanceof Gera.Geometry.Settings ) )
                throw new Error( 'Can\'t handle the custom geometry, because the given settings object is NOT an instance of `Gera.Geometry.Settings`.' );
    
            createVerticesMatrixForCustomGeometry.call(
                this,
                settings.vertices
            );
    
            createIndicesListForCustomGeometry.call(
                this,
                settings.indices
            );
    
            createUvMappingMatrixForCustomGeometry.call(
                this,
                settings.uvCoordinates
            );
    
            createUvIndicesListForCustomGeometry.call(
                this,
                settings.uvIndices
            );
        };
    
        var handlePrimitiveGeometry = function() {
            if ( typeof this.type !== 'number' )
                throw new Error( 'Can\'t handle the geometry of the some primitive, because the binded `type` property is NOT a type of `number`.' );
    
            var data = GeometryPrimitives.getDataByGeometryType( this.type );
    
            if ( typeof data !== 'object' )
                throw new Error( 'Can\'t handle the geometry of the some primitive, because the fetched data of the geometric primitive is NOT a type of `object`.' );
    
            for ( var item in data )
                this[ item ] = data[ item ];
        };
    
        var createVerticesMatrixForCustomGeometry = function( genericVertices ) {
            if ( !( genericVertices instanceof Array ) )
                throw new Error( 'Can\'t create a new matrix of vertices for the custom geometry object, because the input generic vertices list is NOT an instance of `Array`.' );
    
            var rawVertices = [];
    
            for ( var i = 0; i < genericVertices.length; i++ ) {
                var vertex = genericVertices[ i ];
    
                if ( !( vertex instanceof Gera.Vector3 ) )
                    throw new Error( 'Can\'t create a new matrix of vertices for the custom geometry object, because the vertex from the custom vertices list is NOT an instance of `Gera.Vector3`.' );
    
                rawVertices.push( vertex.x );
                rawVertices.push( vertex.y );
                rawVertices.push( vertex.z );
            }
    
            this.vertices = new Gera.Matrix.Custom({
                data: new Float32Array( rawVertices ),
                size: Object.keys( new Gera.Vector3 ).length
            });
        };
    
        var createIndicesListForCustomGeometry = function( inputIndices ) {
            this.indices = [];
    
            if ( inputIndices instanceof Array && inputIndices.length > 0 ) {
                for ( var i = 0; i < inputIndices.length; i++ ) {
                    if ( typeof inputIndices[ i ] !== 'number' )
                        throw new Error( 'Can\'t add an index from the input array, because it\'s NOT a type of `number`.' );
    
                    this.indices.push( inputIndices[ i ] );
                }
            }
            else {
                if ( !( this.vertices instanceof Gera.Matrix.Custom ) )
                    throw new Error( 'Can\'t prepare the indices from the vertices list, which is binded as `vertices` property, because it\'s NOT an instance of `Gera.Matrix.Custom`.' );
    
                for ( var i = 0; i < this.vertices.generic.length; i++ )
                    this.indices.push( i );
            }
    
            if ( this.indices.length === 0 )
                this.indices = null;
        };
    
        var createUvMappingMatrixForCustomGeometry = function( inputUvCoordinates ) {
            this.uvCoordinates = null;
    
            if ( inputUvCoordinates instanceof Array && inputUvCoordinates.length > 0 ) {
                var rawUvCoordinates = [];
    
                for ( var i = 0; i < inputUvCoordinates.length; i++ ) {
                    var vertex = inputUvCoordinates[ i ];
    
                    if ( !( vertex instanceof Gera.Vector2 ) )
                        throw new Error( 'Can\'t create a new matrix of UV-coordinates for the custom geometry object, because the UV-coordinate extracted from the given list is NOT an instance of `Gera.Vector2`.' );
    
                    rawUvCoordinates.push( vertex.x );
                    rawUvCoordinates.push( vertex.y );
                }
    
                this.uvCoordinates = new Gera.Matrix.Custom({
                    data: new Float32Array( rawUvCoordinates ),
                    size: Object.keys( new Gera.Vector2() ).length
                });
            }
        };
    
        var createUvIndicesListForCustomGeometry = function( inputUvIndices ) {
            this.uvIndices = null;
    
            if ( inputUvIndices instanceof Array && inputUvIndices.length > 0 ) {
                this.uvIndices = [];
    
                for ( var i = 0; i < inputUvIndices.length; i++ ) {
                    if ( typeof inputUvIndices[ i ] !== 'number' )
                        throw new Error( 'Can\'t add the UV-coordinate index from the UV-indices list, because it\'s NOT a type of `number`.' );
    
                    this.uvIndices.push( inputUvIndices[ i ] );
                }
            }
        };
    
        var checkArgumentsForGeometrySettings = function( properties ) {
            var propertyNames = [
                'type',
                'vertices',
                'indices',
                'uvCoordinates',
                'uvIndices'
            ];
    
            if ( !Gera.Global.checkElementsExistenceInArray( Object.keys( properties ), propertyNames ) )
                throw new Error( 'The properties, which were given as the geometry settings are incorrect. `Gera.Geometry.Settings` may accept only the following properties: [ type, vertices, indices, uvCoordinates, uvIndices ].' );
    
            for ( var item in properties ) {
                switch ( item ) {
                    case 'vertices':
                    case 'indices':
                    case 'uvCoordinates':
                    case 'uvIndices':
                        handleGeometryArrayFromSettings( properties[ item ], item );
                        break;
                    case 'type':
                        if ( typeof properties[ item ] !== 'number' )
                            throw new Error( 'Can\'t allow to create a new `Gera.Geometry.Settings` object, because the property `type` is NOT a type of `number`.' );
                        break;
                    default:
                        break;
                }
            }
        };
    
        var handleGeometryArrayFromSettings = function( geometry, name ) {
            if ( geometry !== undefined ) {
                if ( !( geometry instanceof Array ) ) {
                    throw new Error(
                        String.prototype.concat(
                            'Can\'t allow to create a new `Gera.Geometry.Settings` object, because the property `',
                            name,
                            '` is NOT an instance of `Array`.'
                        )
                    );
                }
            }
    
            geometry = null;
        };
    
        var prepareVerticesForExtrudedGeometry = function( vertices, level ) {
            var preparedVertices = [];
    
            for ( var i = 0; i < vertices.length; i++ ) {
                var vertex = vertices[ i ];
    
                if ( !( vertex instanceof Gera.Vector2 ) )
                    throw new Error( 'Can\'t prepare the extruded geometry object, because the vertex item in the vertices array is NOT an instance of `Gera.Vector2`.' );
    
                preparedVertices.push( new Gera.Vector3( { x: vertex.x, y: vertex.y, z: level } ) );
    
                if ( level > 0 )
                    preparedVertices.push( new Gera.Vector3( { x: vertex.x, y: vertex.y, z: 0 } ) );
            }
    
            return ( preparedVertices.length === 0 ) ? null : preparedVertices;
        };
    
    })( libraryObject );

    var GeometryPrimitives = function() {
        throw new Error( 'You\'re trying to create an instance of abstract `GeometryPrimitives` prototype.' );
    };
    
    GeometryPrimitives.getDataByGeometryType = function( type ) {
        if ( typeof type !== 'number' )
            throw new Error( 'Can\'t get the geometry data by the given type, because it\'s NOT a type of `number`.' );
    
        switch ( type ) {
            case Gera.Geometry.Type.Triangle:
                return prepareTriangleData();
            case Gera.Geometry.Type.Plane:
                return preparePlaneData();
            case Gera.Geometry.Type.Cube:
                return prepareCubeData();
            case Gera.Geometry.Type.Pyramid:
                return preparePyramidData();
            case Gera.Geometry.Type.Sphere:
                return prepareSphereData();
            default:
                throw new Error( 'Can\'t get the geometry data by the given type, because the given geometry type is NOT recognized as the primitive type.' );
        }
    };
    
    var prepareTriangleData = function() {
        return {
            vertices: new Gera.Matrix.Custom({
                data: new Float32Array([
                    -1.0, -1.0, 0.0,
                     1.0, -1.0, 0.0,
                     0.0,  1.0, 0.0
                ]),
                size: Object.keys( new Gera.Vector3 ).length
            }),
            indices: [ 0, 1, 2 ],
            uvCoordinates: null,
            uvIndices: null
        };
    };
    
    var preparePlaneData = function() {
        return {
            vertices: new Gera.Matrix.Custom({
                data: new Float32Array([
                    // First triangle
                    -1.0,  1.0, 0.0,
                    -1.0, -1.0, 0.0,
                     1.0,  1.0, 0.0,
    
                    // Second triangle
                    -1.0, -1.0, 0.0,
                     1.0, -1.0, 0.0,
                     1.0,  1.0, 0.0
                ]),
                size: Object.keys( new Gera.Vector3 ).length
            }),
            indices: [
                // First triangle
                0, 1, 2,
                // Second triangle
                3, 4, 5
            ],
            uvCoordinates: new Gera.Matrix.Custom({
                data: new Float32Array([
                    // First triangle
                    0.0, 1.0,
                    0.0, 0.0,
                    1.0, 1.0,
    
                    // Second triangle
                    0.0, 0.0,
                    1.0, 0.0,
                    1.0, 1.0
                ]),
                size: Object.keys( new Gera.Vector2 ).length
            }),
            uvIndices: null
        };
    };
    
    var prepareCubeData = function() {
        return {
            vertices: new Gera.Matrix.Custom({
                data: new Float32Array([
                    // Front face
                    -1.0, -1.0,  1.0,
                     1.0, -1.0,  1.0,
                     1.0,  1.0,  1.0,
                    -1.0,  1.0,  1.0,
    
                    // Back face
                    -1.0, -1.0, -1.0,
                    -1.0,  1.0, -1.0,
                     1.0,  1.0, -1.0,
                     1.0, -1.0, -1.0,
    
                    // Top face
                    -1.0,  1.0, -1.0,
                    -1.0,  1.0,  1.0,
                     1.0,  1.0,  1.0,
                     1.0,  1.0, -1.0,
    
                    // Bottom face
                    -1.0, -1.0, -1.0,
                     1.0, -1.0, -1.0,
                     1.0, -1.0,  1.0,
                    -1.0, -1.0,  1.0,
    
                    // Right face
                     1.0, -1.0, -1.0,
                     1.0,  1.0, -1.0,
                     1.0,  1.0,  1.0,
                     1.0, -1.0,  1.0,
    
                    // Left face
                    -1.0, -1.0, -1.0,
                    -1.0, -1.0,  1.0,
                    -1.0,  1.0,  1.0,
                    -1.0,  1.0, -1.0
                ]),
                size: Object.keys( new Gera.Vector3 ).length
            }),
            indices: [
                // Front face
                0, 1, 2,
                0, 2, 3,
    
                // Back face
                4, 5, 6,
                4, 6, 7,
    
                // Top face
                8, 9, 10,
                8, 10, 11,
    
                // Bottom face
                12, 13, 14,
                12, 14, 15,
    
                // Right face
                16, 17, 18,
                16, 18, 19,
    
                // Left face
                20, 21, 22,
                20, 22, 23
            ],
            uvCoordinates: null,
            uvIndices: null
        };
    };
    
    var preparePyramidData = function() {
        return {
            vertices: new Gera.Matrix.Custom({
                data: new Float32Array([
                    // Front face
                     0.0,  1.0,  0.0,
                    -1.0, -1.0,  1.0,
                     1.0, -1.0,  1.0,
    
                    // Right face
                     0.0,  1.0,  0.0,
                     1.0, -1.0,  1.0,
                     1.0, -1.0, -1.0,
    
                    // Back face
                     0.0,  1.0,  0.0,
                     1.0, -1.0, -1.0,
                    -1.0, -1.0, -1.0,
    
                    // Left face
                     0.0,  1.0,  0.0,
                    -1.0, -1.0, -1.0,
                    -1.0, -1.0,  1.0
                ]),
                size: Object.keys( new Gera.Vector3 ).length,
            }),
            indices: [
                // Front face
                0, 1, 2,
                // Right face
                3, 4, 5,
                // Back face
                6, 7, 8,
                // Left face
                9, 10, 11
            ],
            uvCoordinates: null,
            uvIndices: null
        };
    };
    
    var prepareSphereData = function() {
        var settings = {
            range: {
                latitude: 30,
                longitude: 30,
            },
            radius: 2
        };
    
        var sphereVertices = [];
        var sphereIndices = [];
    
        for ( var i = 0; i <= settings.range.latitude; i++ ) {
            var theta = i * Math.PI / settings.range.latitude;
            var sinTheta = Math.sin( theta );
            var cosTheta = Math.cos( theta );
    
            for ( var j = 0; j <= settings.range.longitude; j++ ) {
                var phi = j * 2 * Math.PI / settings.range.longitude;
                var sinPhi = Math.sin( phi );
                var cosPhi = Math.cos( phi );
    
                var vertex = new Gera.Vector3({
                    x: settings.radius * cosPhi * sinTheta,
                    y: settings.radius * cosTheta,
                    z: settings.radius * sinPhi * sinTheta
                });
    
                for ( var item in vertex )
                    sphereVertices.push( vertex[ item ] );
            }
        }
    
        for ( var i = 0; i < settings.range.latitude; i++ ) {
            for ( var j = 0; j < settings.range.longitude; j++ ) {
                var firstIndex = ( i * ( settings.range.longitude + 1 ) ) + j;
                var secondIndex = firstIndex + settings.range.longitude + 1;
    
                // First triangle
                sphereIndices.push( firstIndex );
                sphereIndices.push( secondIndex );
                sphereIndices.push( firstIndex + 1 );
    
                // Second triangle
                sphereIndices.push( secondIndex );
                sphereIndices.push( secondIndex + 1 );
                sphereIndices.push( firstIndex + 1 );
            }
        }
    
        return {
            vertices: new Gera.Matrix.Custom({
                data: new Float32Array( sphereVertices ),
                size: Object.keys( new Gera.Vector3 ).length
            }),
            indices: sphereIndices,
            uvCoordinates: null,
            uvIndices: null
        };
    };

    ( function( Gera ) {
    
        Gera.Texture = function() {
            handleInputArguments.call( this, arguments );
            this.guid = new Gera.Guid();
        };
    
        Gera.Texture.Type = {
            Color: 0,
            Image: 1
        };
    
        var handleInputArguments = function( inputArguments ) {
            if ( inputArguments.length !== 1 )
                throw new Error( 'Can\'t create a new `Gera.Texture` object, because it must accept some arguments.' );
    
            if ( typeof inputArguments[ 0 ] !== 'object' )
                throw new Error( 'Can\'t create a new `Gera.Texture` object, because the input arguments object is NOT a type of `object`.' );
    
            if ( Object.keys( inputArguments[ 0 ] ).length !== 2 )
                throw new Error( 'Can\'t create a new `Gera.Texture` object, because the count of the input arguments must equal 2.' );
    
            for ( var item in inputArguments[ 0 ] ) {
                switch ( item ) {
                    case 'type':
                        setTextureType.call( this, inputArguments[ 0 ][ item ] );
                        break;
                    case 'color':
                        setTextureColor.call( this, inputArguments[ 0 ][ item ] );
                        break;
                    case 'path':
                        setTextureImage.call( this, inputArguments[ 0 ][ item ] );
                        break;
                    default:
                        throw new Error( 'Can\'t create a new `Gera.Texture` object, because one of the properties from the input arguments has the incorrect name. Texture may contain the following properties: [ type, color, path ].' );
                }
            }
        };
    
        var setTextureType = function( value ) {
            if ( typeof value !== 'number' )
                throw new Error( 'Can\'t set a texture type, because the given type value is NOT a type of `number`.' );
    
            var objectProperties = Gera.Global.convertObjectPropertiesToArray( Gera.Texture.Type );
    
            if ( objectProperties.indexOf( value ) === -1 )
                throw new Error( 'Can\'t set a texture type, because the given type value is not one from `Gera.Texture.Type`.' );
    
            this.type = value;
        };
    
        var setTextureColor = function( value ) {
            if ( typeof value !== 'number' )
                throw new Error( 'Can\'t set a texture color, because the given color value is NOT a type of `number`.' );
    
            var colorObject = new Gera.Color();
            colorObject.set( Gera.Color.Type.Integer, value );
            this.color = colorObject;
        }
    
        var setTextureImage = function( imagePath ) {
            if ( typeof imagePath !== 'string' )
                throw new Error( 'Can\'t set a texture image, because the given image path value is NOT a type of `string`.' );
    
            this.path = imagePath;
            this.initialized = false;
            this.image = new Image();
            this.image.initialized = false;
    
            Gera.Ajax.sendRequest(
                new Gera.Ajax.Request({
                    method: Gera.Ajax.HttpMethod.Get,
                    endpoint: imagePath,
                    asynchronous: true,
                    responseType: Gera.Ajax.ResponseType.Blob
                })
            )
            .then( function( response ) {
                if ( !( response instanceof Blob ) )
                    throw new Error( 'Can\'t set the texture image, because the received BLOB object from AJAX request is NOT an instance of `Blob`.' );
    
                var blobUrl = window.URL.createObjectURL( response );
                this.image.src = blobUrl;
                this.image.initialized = true;
            }.bind( this ) );
        }
    
    })( libraryObject );

    ( function( Gera ) {
    
        Gera.Material = function( object ) {
            this.textures = null;
    
            if ( object instanceof Gera.Texture )
                handleSingleTextureObject.call( this, object );
            else if ( object instanceof Array )
                handleTextureObjects.call( this, object );
            else
                throw new Error( 'Can\'t add the input object to the material group, because it\'s NOT an instance of `Gera.Texture` or NOT an array of textures, where each element is an instance of `Gera.Texture`.' );
        };
    
        Gera.Material.prototype.get = function( guid ) {
            if ( guid instanceof Gera.Guid )
                getTextureByGuidObject.call( this, guid );
            else if ( typeof guid === 'string' )
                getTextureByGuidString.call( this, guid );
            else
                throw new Error( 'Can\'t get the texture from the material group, because the given GUID-object is NEITHER an instance of `Gera.Guid`, NOR a type of `string`.' );
        };
    
        Gera.Material.prototype.add = function( object ) {
            if ( object instanceof Gera.Texture )
                addSingleTextureObject.call( this, object );
            else if ( object instanceof Array )
                addSeveralTextureObjects.call( this, object );
            else
                throw new Error( 'Can\'t add the texture(s) to the material group, because the given object is NEITHER an instance of `Gera.Texture`, NOR an instance of `Array`.' );
        };
    
        Gera.Material.prototype.remove = function( guid ) {
            if ( guid instanceof Gera.Guid )
                removeTextureByGuidObject.call( this, guid );
            else if ( typeof guid === 'string' )
                removeTextureByGuidString.call( this, guid );
            else
                throw new Error( 'Can\'t remove the texture from the material group, because the given GUID-object is NEITHER an instance of `Gera.Guid`, NOR a type of `string`.' );
        };
    
        var getTextureByGuidObject = function( guid ) {
            if ( !( guid instanceof Gera.Guid ) )
                throw new Error( 'Can\'t get the texture from the material group, because the given GUID-object is NOT an instance of `Gera.Guid`.' );
    
            checkBindedTextureArray( this.textures );
    
            for ( var i = 0; i < this.textures.length; i++ )
                if ( this.textures[ i ].guid === guid )
                    return this.textures[ i ];
    
            return null;
        };
    
        var getTextureByGuidString = function( guidString ) {
            if ( typeof guidString !== 'string' )
                throw new Error( 'Can\'t get the texture from the material group, because the given GUID-sequence value is NOT an type of `string`.' );
    
            checkBindedTextureArray( this.textures );
    
            for ( var i = 0; i < this.textures.length; i++ )
                if ( this.textures[ i ].guid.sequence === guidString )
                    return this.textures[ i ];
    
            return null;
        };
    
        var addSingleTextureObject = function( texture ) {
            if ( !( texture instanceof Gera.Texture ) )
                throw new Error( 'Can\'t add the input texture to the material group, because it\'s NOT an instance of `Gera.Texture`.' );
    
            handleSingleTextureObject.call( this, texture );
        };
    
        var addSeveralTextureObjects = function( textures ) {
            if ( !( textures instanceof Array ) )
                throw new Error( 'Can\'t add the input array with textures to the material group, because the given object is NOT an instance of `Array`.' );
    
            handleTextureObjects.call( this, textures );
        };
    
        var removeTextureByGuidObject = function( guid ) {
            if ( !( guid instanceof Gera.Guid ) )
                throw new Error( 'Can\'t remove the texture from the material group, because the given GUID-object is NOT an instance of `Gera.Guid`.' );
    
            checkBindedTextureArray( this.textures );
    
            for ( var i = 0; i < this.textures.length; i++ )
                if ( this.textures[ i ].guid === guid )
                    this.textures.splice( i, 1 );
        };
    
        var removeTextureByGuidString = function( guidString ) {
            if ( typeof guidString !== 'string' )
                throw new Error( 'Can\'t remove the texture from the material group, because the given GUID-sequence value is NOT an type of `string`.' );
    
            checkBindedTextureArray( this.textures );
    
            for ( var i = 0; i < this.textures.length; i++ )
                if ( this.textures[ i ].guid.sequence === guidString )
                    this.textures.splice( i, 1 );
        };
    
        var handleSingleTextureObject = function( texture ) {
            if ( !( texture instanceof Gera.Texture ) )
                throw new Error( 'Can\'t handle the input texture object, because it\'s NOT an instance of `Gera.Texture`.' );
    
            if ( !( this.textures instanceof Array ) )
                this.textures = [];
    
            this.textures.push( texture );
        };
    
        var handleTextureObjects = function( inputTextures ) {
            if ( !( inputTextures instanceof Array ) )
                throw new Error( 'Can\t handle the input array with textures, because the given object is NOT an instance of `Array`.' );
    
            if ( !( this.textures instanceof Array ) )
                this.textures = [];
    
            for ( var i = 0; i < inputTextures.length; i++ ) {
                if ( !( inputTextures[ i ] instanceof Gera.Texture ) )
                    throw new Error( 'Can\'t continue to handle the input array with textures, because the texture element from the given array is NOT an instance of `Gera.Texture`.' );
    
                this.textures.push( texture );
            }
        };
    
        var checkBindedTextureArray = function( textureArray ) {
            if ( !( textureArray instanceof Array ) )
                throw new Error( 'Can\'t remove the texture from the material group, because the binded texture array is NOT an instance of `Array`.' );
    
            if ( textureArray.length === 0 )
                throw new Error( 'Can\'t remove the texture from the material group, because the binded texture array is empty.' );
        };
    
    })( libraryObject );

    ( function( Gera ) {
    
        Gera.Buffer = function() {
            throw new Error( 'You\'re trying to create an instance of abstract `Gera.Buffer` prototype.' );
        };
    
        Gera.Buffer.RenderingInfo = function() {
            if ( typeof arguments !== 'object' )
                throw new Error( 'Can\'t create a new `Gera.Buffer.RenderingInfo` object, because the input arguments object is not a type of `object`.' );
    
            if ( arguments.length === 0 )
                throw new Error( 'Can\'t create a new `Gera.Buffer.RenderingInfo` object, because the input arguments count equals zero.' );
    
            setRenderingInformation.call( this, arguments[ 0 ] );
        };
    
        var setRenderingInformation = function( info ) {
            if ( Object.keys( info ).length === 0 )
                throw new Error( 'Can\'t create a new `Gera.Buffer.RenderingInfo` object, because the properties length of the input object equals zero. It can\'t be, because the `Gera.Buffer.RenderingInfo` object requires to have two properties at least [ size, count ].' );
    
            for ( var item in info ) {
                switch ( item ) {
                    case 'size':
                        setSizeValue.call( this, info[ item ] );
                        break;
                    case 'count':
                        setCountValue.call( this, info[ item ] );
                        break;
                    default:
                        throw new Error( 'Can\'t create a new `Gera.Buffer.RenderingInfo` object, because one of the provided properties is NOT valid. For the `Gera.Buffer.RenderingInfo` object, it\'s required to use only the following properties: [ size, count ].' );
                }
            }
        };
    
        var setSizeValue = function( size ) {
            if ( typeof size !== 'number' )
                throw new Error( 'Can\'t create a new `Gera.Buffer.RenderingInfo` object, because the input size value is NOT a type of `number`.' );
    
            this.size = size;
        };
    
        var setCountValue = function( count ) {
            if ( typeof count !== 'number' )
                throw new Error( 'Can\'t create a new `Gera.Buffer.RenderingInfo` object, because the input count is NOT a type of `number`.' );
    
            this.count = count;
        };
    
    })( libraryObject );

    ( function( Gera ) {
    
        Gera.Object3d = function() {
            var propeties = handleInputArguments( arguments[ 0 ] );
    
            for ( var item in propeties )
                this[ item ] = propeties[ item ];
        };
    
        var handleInputArguments = function( inputArguments ) {
            if ( typeof inputArguments !== 'object' )
                throw new Error( 'Can\'t handle the input arguments for creating a new `Gera.Object3d` instance, because the input arguments object is NOT a type of `object`.' );
    
            var requiredProperties = [
                'vertices',
                'indices',
                'uvCoordinates',
                'uvIndices',
                'textures'
            ];
    
            var check = Gera.Global.checkElementsExistenceInArray;
    
            if ( !check( Object.keys( inputArguments ), requiredProperties ) )
                throw new Error( 'Can\'t handle the input arguments for creating a new `Gera.Object3d` instance, because the input arguments object doesn\'t content the required properties: [ vertices, indices, uvCoordinates, uvIndices, textures ].' );
    
            var preparedProperities = {
                vertices: inputArguments.vertices,
                indices: inputArguments.indices,
                uvCoordinates: inputArguments.uvCoordinates,
                uvIndices: inputArguments.uvIndices,
                textures: inputArguments.textures
            };
    
            checkPropertyValues( preparedProperities );
            return preparedProperities;
        };
    
        var checkPropertyValues = function( properties ) {
            if ( typeof properties !== 'object' )
                throw new Error( 'Can\'t check the values of the given properties object, because it\'s NOT a type of `object`.' );
    
            if ( !( properties.vertices instanceof Array ) )
                throw new Error( 'Can\'t allow to create a new `Gera.Object3d` instance, because the property `vertices` is NOT an instance of `Array`.' );
    
            if ( properties.vertices.length === 0 )
                throw new Error( 'Can\'t allow to create a new `Gera.Object3d` instance, because the property `vertices` is NOT an instance of `Array`.' );
    
            if ( properties.indices && !( properties.indices instanceof Array ) )
                throw new Error( 'Can\'t allow to create a new `Gera.Object3d` instance, because the optional property `indices` is NOT an instance of `Array`.' );
    
            if ( properties.uvCoordinates && !( properties.uvCoordinates instanceof Array ) )
                throw new Error( 'Can\'t allow to create a new `Gera.Object3d` instance, because the optional property `uvCoordinates` is NOT an instance of `Array`.' );
    
            if ( properties.uvIndices && !( properties.uvIndices instanceof Array ) )
                throw new Error( 'Can\'t allow to create a new `Gera.Object3d` instance, because the optional property `uvIndices` is NOT an instance of `Array`.' );
    
            if ( properties.textures instanceof Array ) {
                for ( var item in properties.textures ) {
                    if ( !( item instanceof Gera.Texture ) )
                        throw new Error( 'Can\'t allow to create a new `Gera.Object3d` instance, because one of the binded textures is NOT an instance of `Gera.Texture`.' );
                }
            }
        };
    
    })( libraryObject );

    ( function( Gera ) {
    
        Gera.Mesh = function() {
            var settings = handleInputArguments( arguments[ 0 ] );
            prepareMeshProperties.call( this, settings );
        };
    
        Gera.Mesh.prototype.setPositon = function( newPosition ) {
            if ( !( newPosition instanceof Gera.Vector3 ) )
                throw new Error( 'Can\'t set a new position vector for mesh object, because the input position vector object is NOT an instance of `Gera.Vector3`.' );
    
            this.position = newPosition;
        };
    
        Gera.Mesh.prototype.rotate = function( vector, angle ) {
            if ( !( vector instanceof Gera.Vector3 ) ) {
                throw new Error(
                    String.prototype.concat(
                        'Can\'t rotate the mesh object with GUID: `',
                        this.guid.sequence,
                        '`, because the given rotation vector is NOT an instance of `Gera.Vector3`.'
                    )
                );
            }
    
            if ( typeof angle !== 'number' ) {
                throw new Error(
                    String.prototype.concat(
                        'Can\'t rotate the mesh object with GUID: `',
                        this.guid.sequence,
                        '`, because the given angle for rotation is NOT a type of `number`.'
                    )
                );
            }
    
            var temporaryQuaternion = Gera.Math.convertRotationToQuaternion( vector, angle );
            this.quaternion = Gera.Math.multiplyQuaternions( this.quaternion, temporaryQuaternion );
        };
    
        Gera.Mesh.prototype.setQuaternion = function( newQuaternion ) {
            if ( !( newRotation instanceof Gera.Quaternion ) )
                throw new Error( 'Can\'t set a new quaternion object for mesh object, because the input quaternion object is NOT an instance of `Gera.Quaternion`.' );
    
            this.quaternion = newQuaternion;
        };
    
        Gera.Mesh.Wireframe = function( mode ) {
            var value = false;
    
            this.get = function() {
                return value;
            };
    
            this.set = function( inputValue ) {
                if ( typeof inputValue !== 'boolean' )
                    throw new Error( 'Can\'t set the wireframe mode for the mesh, because the given wireframe mode value is NOT a type of `boolean`.' );
    
                value = inputValue;
            };
    
            if ( mode )
                this.set( mode );
        };
    
        Gera.Mesh.Transparency = function( transparency ) {
            var value = 1.0;
    
            this.get = function() {
                return value;
            };
    
            this.set = function( inputValue ) {
                if ( typeof inputValue !== 'number' )
                    throw new Error( 'Can\'t set the transparency of the mesh, because the given value is NOT a type of `number`.' );
    
                value = inputValue;
            };
    
            if ( transparency )
                this.set( transparency );
        };
    
        Gera.Mesh.GlBuffer = {};
    
        Gera.Mesh.GlBuffer.Type = {
            Geometry: 0,
            Color: 1,
            Texture: 2
        };
    
        Gera.Mesh.GlBuffer.Options = function() {
            this.vertices = null;
            this.indices = null;
        };
    
        Gera.Mesh.GlBuffers = function() {
            if ( typeof arguments !== 'object' )
                throw new Error( 'Can\'t create a new `Gera.Mesh.GlBuffers` object, because the input arguments object is not a type of `object`.' );
    
            if ( arguments.length === 0 )
                throw new Error( 'Can\'t create a new `Gera.Mesh.GlBuffers` object, because the input arguments count equals zero.' );
    
            var properties = [ 'geometry', 'color', 'texture' ];
    
            for ( var item in properties )
                this[ properties[ item ] ] = new Gera.Mesh.GlBuffer.Options();
    
            prepareGlBuffersForMesh.call( this, arguments[ 0 ] );
        };
    
        var handleInputArguments = function( inputArguments ) {
            if ( typeof inputArguments !== 'object' )
                throw new Error( 'Can\'t handle the input arguments object for creating a new `Gera.Mesh` object, because it\'s NOT a type of `object`.' );
    
            var check = Gera.Global.checkElementsExistenceInArray;
    
            if ( !check( Object.keys( inputArguments ), [ 'geometry', 'material' ] ) )
                throw new Error( 'Can\'t create a new `Gera.Mesh` object, because the input arguments object doesn\'t have the required properties: [ geometry, material ].' );
    
            var settings = {
                geometry: inputArguments.geometry,
                material: inputArguments.material,
                drawMode: inputArguments.drawMode
            };
    
            if ( !( settings.geometry instanceof Gera.Geometry ) )
                throw new Error( 'Can\'t create a new `Gera.Mesh` object, because the given geometry object is NOT an instance of `Gera.Geometry`.' );
    
            if ( !( settings.material instanceof Gera.Material ) )
                throw new Error( 'Can\'t create a new `Gera.Mesh` object, because the given material object is NOT an instance of `Gera.Material`.' );
    
            if ( typeof settings.drawMode === 'number' ) {
                var typeValues = Object.keys( Gera.Renderer.DrawMode ).map( function( key ) {
                    return Gera.Renderer.DrawMode[ key ];
                });
    
                if ( typeValues.indexOf( settings.drawMode ) === -1 )
                    throw new Error( 'Can\'t create a new `Gera.Mesh` object, because, the given drawing mode type value is NOT associated with any one type, existed in the `Gera.Renderer.DrawMode` enumeration.' );
            }
            else
                settings.drawMode = null;
    
            return settings;
        };
    
        var prepareMeshProperties = function( settings ) {
            if ( typeof settings !== 'object' )
                throw new Error( 'Can\'t create a new `Gera.Mesh` object, because the handled settings object is NOT a type of `object`.' );
    
            this.guid = null;
            this.glBuffers = null;
            this.geometry = settings.geometry;
            this.material = settings.material;
            this.customDrawMode = settings.drawMode;
            this.wireframe = new Gera.Mesh.Wireframe();
            this.position = new Gera.Vector3();
            this.quaternion = Gera.Math.convertRotationToQuaternion( this.position, 0 );
            this.rotation = null;
            this.transparency = new Gera.Mesh.Transparency();
            this.initialized = false;
        };
    
        var prepareGlBuffersForMesh = function( buffers ) {
            if ( Object.keys( buffers ).length === 0 )
                throw new Error( 'Can\'t prepare the WebGL buffers for mesh, because the properties length of the input buffers object equals zero. It can\'t be, because the mesh object requires to have one WebGL buffer at least ( vertices ).' );
    
            for ( var item in buffers ) {
                if ( buffers[ item ] !== null && typeof buffers[ item ] !== 'object' )
                    throw new Error( 'Can\'t prepare the WebGL buffers for mesh, because one of them is NOT a type of `object`.' );
    
                switch ( item ) {
                    case 'geometry':
                        bindBufferData.call(
                            this,
                            Gera.Mesh.GlBuffer.Type.Geometry,
                            buffers[ item ].vertices,
                            buffers[ item ].indices
                        );
                        break;
                    case 'color':
                        bindBufferData.call(
                            this,
                            Gera.Mesh.GlBuffer.Type.Color,
                            buffers[ item ].vertices,
                            buffers[ item ].indices
                        );
                        break;
                    case 'texture':
                        bindBufferData.call(
                            this,
                            Gera.Mesh.GlBuffer.Type.Texture,
                            buffers[ item ].vertices,
                            buffers[ item ].indices
                        );
                        break;
                    default:
                        throw new Error( 'Can\'t prepare the WebGL buffers for mesh, because the input buffers object contains the incorrect properties. The valid properties are the next: [ geometry, color, texture ].' );
                }
            }
        };
    
        var bindBufferData = function( bufferType, vertices, indices ) {
            if ( typeof bufferType !== 'number' )
                throw new Error( 'Can\'t bind the buffer data, because the input buffer type is NOT a type of `number`.' );
    
            if ( vertices && !( vertices instanceof WebGLBuffer ) )
                throw new Error( 'Can\'t bind the WebGL buffer with vertices, because it\'s NOT an instance of `WebGLBuffer`.' );
    
            if ( indices && !( indices instanceof WebGLBuffer ) )
                throw new Error( 'Can\'t bind the WebGL buffer with indices, because it\'s NOT an instance of `WebGLBuffer`.' );
    
            switch ( bufferType ) {
                case Gera.Mesh.GlBuffer.Type.Geometry:
                    this.geometry.vertices = vertices;
                    this.geometry.indices = indices;
                    break;
                case Gera.Mesh.GlBuffer.Type.Color:
                    this.color.vertices = vertices;
                    this.color.indices = indices;
                    break;
                case Gera.Mesh.GlBuffer.Type.Texture:
                    this.texture.vertices = vertices;
                    this.texture.indices = indices;
                    break;
                default:
                    throw new Error( 'Can\'t bind the buffer data, because the input buffer type is NOT associated with any one type, existed in the `Gera.Mesh.GlBuffer.Type` enumeration.' );
            }
        };
    
    })( libraryObject );

    ( function( Gera ) {
    
        Gera.Dom = function() {};
    
        Gera.Dom.prototype.createNewCanvasElement = function( domId, appendToBody ) {
            var canvas = document.createElement( 'canvas' );
    
            if ( typeof domId !== 'string' || domId.length === 0 )
                canvas.id = this.prepareNewUniqueDomId();
            else
                canvas.id = domId;
    
            if ( typeof appendToBody === 'boolean' && appendToBody === true )
                document.body.appendChild( canvas );
    
            return canvas;
        };
    
        Gera.Dom.prototype.prepareNewUniqueDomId = function() {
            var newGuid = new Gera.Guid();
            return ( this.checkExistedDomId( newGuid.sequence ) )
                    ? this.prepareNewUniqueDomId()
                    : newGuid.sequence;
        };
    
        Gera.Dom.prototype.checkExistingObjectByDomId = function( domId ) {
            if ( typeof domId !== 'string' )
                throw new Error( 'Can\'t check DOM object existence, because the provided id is NOT a type of `string`.' );
    
            var object = document.getElementById( domId );
            return ( object ) ? true : false;
        };
    
        Gera.Dom.prototype.getExistingObjectByDomId = function( domId ) {
            if ( typeof domId !== 'string' )
                throw new Error( 'Can\'t check DOM object existence, because the provided id is NOT a type of `string`.' );
    
            var object = document.getElementById( domId );
    
            if ( !object )
                throw new Error( String.prototype.concat( 'Can\'t get the element from DOM by the given id: ', domId ) );
    
            return object;
        };
    
    })( libraryObject );

    ( function( Gera ) {
    
        Gera.Camera = function() {
            this.guid = null;
            this.projectionMatrix = new Gera.Matrix.Empty();
            this.position = new Gera.Vector3();
            this.type = undefined;
            this.bounds = undefined;
        };
    
        Gera.Camera.Type = {
            Perspective: 0,
            Orthographic: 1
        };
    
        Gera.Camera.prototype.setProjection = function( settings ) {
            if ( !settings )
                throw new Error( 'You didn\'t provide any arguments for setting a new camera projection view.' );
    
            if ( settings instanceof Gera.Bounds.Perspective )
                setPerspectiveProjection.call( this, settings );
            else if ( settings instanceof Gera.Bounds.Orthographic )
                setOrthographicProjection.call( this, settings );
            else
                throw new Error( 'You didn\'t provide the correct type of settings. Its object must be an instance of `Gera.Bounds.Perspective` or `Gera.Bounds.Orthographic`.' );
        };
    
        var setPerspectiveProjection = function( settings ) {
            if ( !( settings instanceof Gera.Bounds.Perspective ) )
                throw new Error( 'The given settings argument for perspective camera view is not an instance of `Gera.Bounds.Perspective`.' );
    
            this.type = Gera.Camera.Type.Perspective;
            this.bounds = settings;
            this.projectionMatrix = Gera.Math.createPerspectiveProjection( this.bounds );
        };
    
        var setOrthographicProjection = function( settings ) {
            if ( !( settings instanceof Gera.Bounds.Orthographic ) )
                throw new Error( 'The given settings argument for orthographic camera view is not an instance of `Gera.Bounds.Orthographic`.' );
    
            this.type = Gera.Camera.Type.Orthographic;
            this.bounds = settings;
            this.projectionMatrix = math.createOrthographicProjection( this.bounds );
        };
    
    })( libraryObject );

    ( function( Gera ) {
    
        Gera.Scene = function() {
            this.guid = new Gera.Guid();
            this.modelViewMatrix = new Gera.Matrix.Empty();
            this.children = [];
            this.timer = new Gera.Scene.Timer();
            this.activeCamera = null;
        };
    
        Gera.Scene.prototype.add = function( item ) {
            if ( !( this.children instanceof Array ) )
                throw new Error( 'Can\'t add any item to the children collection, because it\'s NOT an instance of `Array`.' );
    
            if ( !( item instanceof Gera.Camera ) && !( item instanceof Gera.Mesh ) )
                throw new Error( 'Can\'t add the item to the class collection, because its instance is different from the of them: [ Gera.Camera, Gera.Mesh ].' );
    
            item.guid = new Gera.Guid();
    
            while ( ( this.getByGuid( item.guid ) instanceof Gera.Guid === undefined ) )
                item.guid = new Gera.Guid();
    
            this.children.push( item );
        };
    
        Gera.Scene.prototype.getByGuid = function( guid ) {
            if ( !( guid instanceof Gera.Guid ) )
                throw new Error( 'Can\'t get the children from scene object by GUID, because the provided guid object is NOT an instance of `Gera.Guid`.' );
    
            for ( var i = 0; i < this.children.length; i++ )
                if ( this.children[ i ].guid === guid )
                    return this.children[ i ];
        };
    
        Gera.Scene.prototype.remove = function( item ) {
            if ( !( this.children instanceof Array ) )
                throw new Error( 'Can\'t remove any item from the children collection, because it\'s NOT an instance of `Array`.' );
    
            var itemIndex = this.children.indexOf( item );
    
            if ( itemIndex === -1 )
                throw new Error( 'You\'re trying to remove an object from scene, which doesn\'t exist in it.' );
            else if ( itemIndex > -1 )
                this.children.splice( itemIndex, 1 );
            else
                throw new Error( 'Some unhandled exception has occurred while removing the object from scene.' );
        };
    
        Gera.Scene.prototype.removeByGuid = function( guid ) {
            if ( !( guid instanceof Gera.Guid ) )
                throw new Error( 'Can\'t remove any item from the children collection, because the provided GUID object is NOT an instance of `Gera.Guid`.' );
    
            if ( !( this.children instanceof Array ) )
                throw new Error( 'Can\'t remove any item from the children collection, because it\'s NOT an instance of `Array`.' );
    
            for ( var item in this.children ) {
                if ( this.children[ item ].guid === guid ) {
                    this.children.splice( item, 1 );
                    return;
                }
            }
    
            throw new Error(
                String.prototype.concat(
                    'There is NO element in scene, with the following GUID-sequence: `',
                    guid.sequence,
                    '`.'
                )
            );
        };
    
        Gera.Scene.prototype.setActiveCamera = function( camera ) {
            if ( !( camera instanceof Gera.Camera ) )
                throw new Error( 'Can\'t set the input camera object as the active one, because it\'s NOT an instance of `Gera.Camera`.' );
    
            if ( !( this.children instanceof Array ) )
                throw new Error( 'Can\'t set the input camera object as the active one, because the `children` property is NOT an instance of `Array`.' );
    
            if ( this.children.length > 0 ) {
                if ( !Gera.Global.checkElementExistenceInArray( this.children, camera ) )
                    this.add( camera );
            }
            else
                this.add( camera );
    
            this.activeCamera = camera;
        };
    
        Gera.Scene.prototype.getTimer = function() {
            if ( !( this.timer instanceof Gera.Scene.Timer ) )
                throw new Error( 'Can\'t return the scene timer, because the binded timer object is NOT an instance of `Gera.Scene.Timer`.' );
    
            return this.timer;
        };
    
        Gera.Scene.Timer = function() {
            var properties = [ 'now', 'last', 'elapsed' ];
    
            for ( var item in properties )
                this[ item ] = properties[ item ];
        };
    
        Gera.Scene.Timer.prototype.updateCurrentTime = function() {
            if ( typeof Date !== 'function' )
                throw new Error( 'Can\'t update the current timer from the scene object, because your browser doesn\'t support `Date` object or it was overridden.' );
    
            this.now = new Date().getTime();
    
            if ( typeof this.last === 'number' && this.last !== 0 )
                this.elapsed = this.now - this.last;
    
            this.last = this.now;
        };
    
    })( libraryObject );

    ( function( Gera ) {
    
        Gera.Renderer = function() {
            this.canvas = undefined;
            this.webglContext = undefined;
            this.scene = undefined;
        };
    
        Gera.Renderer.DrawMode = {
            Points: 0,
            Lines: 1,
            LineStrip: 2,
            LineLoop: 3,
            Triangles: 4,
            TriangleStrip: 5,
            TriangleFan: 6
        };
    
        Gera.Renderer.Settings = function( properties ) {
            if ( !properties )
                throw new Error( 'Input properties can\'t be undefined for the new renderer settings.' );
    
            for ( var item in properties ) {
                if ( typeof properties[ item ] !== 'boolean' )
                    throw new Error( 'Input arguments for renderer settings can only be a type of `boolean`.' );
    
                if ( getWebGLRendererSettingsList().indexOf( item ) !== -1 )
                    this[ item ] = properties[ item ];
            }
    
            if ( Object.keys( this ).length === 0 )
                throw new Error( 'Renderer settings must contain at least one property.' );
        };
    
        Gera.Renderer.prototype.printVersionInfo = function() {
            if ( typeof Gera.version !== 'string' )
                throw new Error( 'The property, which defines the version of the current renderer object is `undefined`.' );
    
            console.log( String.prototype.concat( 'Gera WebGL Renderer ( version ', Gera.version, ' )' ) );
        };
    
        Gera.Renderer.prototype.setActiveCanvasElement = function( object ) {
            if ( !object )
                throw new Error( 'Can\'t set the active canvas element, because the input object is `undefined`. You must provide either the `string` value ( the DOM element id ) or the `HTMLCanvasElement` object.' );
    
            var domHandler = new Gera.Dom();
    
            if ( typeof object === 'string' ) {
                if ( !domHandler.checkExistingObjectByDomId( object ) )
                    object = domHandler.prepareNewUniqueDomId();
    
                this.canvas = domHandler.getExistingObjectByDomId( object );
            }
            else if ( object instanceof HTMLCanvasElement )
                this.canvas = object;
            else
                throw new Error( 'Can\'t set the active canvas element, because the input object is NOT a type of `string` or an instance of `HTMLCanvasElement`.' );
        };
    
        Gera.Renderer.prototype.createWebGLContext = function( canvasElement, rendererSettings ) {
            if ( !( canvasElement instanceof HTMLCanvasElement ) )
                throw new Error( 'Canvas element in document object is NOT an instance of `HTMLCanvasElement`.' );
    
            if ( !( rendererSettings instanceof Gera.Renderer.Settings ) )
                throw new Error( 'Input renderer settings object is NOT an instance of `Gera.Renderer.Settings`.' );
    
            var webglVendors = getWebGLVendorsList();
    
            for ( var item in webglVendors ) {
                var webglContext = canvasElement.getContext(
                    webglVendors[ item ],
                    rendererSettings
                );
    
                if ( webglContext instanceof WebGLRenderingContext ) {
                    var shaderManager = new ShaderManager( webglContext );
                    webglContext.shaderProgram = shaderManager.createShaderProgram();
                    return webglContext;
                }
            };
    
            throw new Error( 'Can\'t create a new WebGL context on based arguments.' );
        };
    
        Gera.Renderer.prototype.setCurrentWebGLContext = function( context ) {
            if ( !( context instanceof WebGLRenderingContext ) )
                throw new Error( 'Can\'t set the input context as the current one, because it\'s not an instance of `WebGLRenderingContext`.' );
    
            this.webglContext = context;
        };
    
        Gera.Renderer.prototype.getCurrentWebGLContext = function() {
            return this.webglContext;
        };
    
        Gera.Renderer.prototype.setCurrentScene = function( scene ) {
            if ( !( scene instanceof Gera.Scene ) )
                throw new Error( 'Can\'t set the input scene as the current one, because it\'s not an instance of `Gera.Scene`.' );
    
            this.scene = scene;
        };
    
        Gera.Renderer.prototype.clearCurrentScene = function() {
            if ( !this.scene )
                throw new Error( 'Can\'t clear the current scene, because it doesn\'t exist.' );
    
            if ( !( this.scene instanceof Gera.Scene ) )
                throw new Error( 'Can\'t clear the current scene object, because it isn\'t an instance of `Gera.Scene`.' );
    
            this.scene = new Gera.Scene();
        };
    
        Gera.Renderer.prototype.getCurrentScene = function() {
            return this.scene;
        };
    
        Gera.Renderer.prototype.renderScene = function() {
            this.requestFrameId = window.requestAnimationFrame( this.renderScene.bind( this ) );
            resizeWebGlContainer.call( this );
            drawScene.call( this );
            animateScene.call( this );
        };
    
        Gera.Renderer.prototype.setCurrentFrameBufferColor = function( glFloatObject ) {
            if ( !( glFloatObject instanceof Gera.Color.GlFloat ) )
                throw new Error( 'Can\'t set the current frame buffer color, because the input value is NOT an instance of `Gera.Color.GlFloat`.' );
    
            this.webglContext.frameBufferColor = glFloatObject;
        };
    
        Gera.Renderer.prototype.checkIsMeshTexturePowerOf2 = function( image ) {
            if ( !( image instanceof Image ) )
                throw new Error( 'Can\'t check the mesh texture width/height for being a power of 2, because the given image object is NOT an instance of `Image`.' );
    
            if ( Gera.Math.checkIsIntegerPowerOf2( image.width ) )
                return false;
    
            if ( Gera.Math.checkIsIntegerPowerOf2( image.height ) )
                return false;
    
            return true;
        };
    
        var resizeWebGlContainer = function() {
            this.canvas.width = this.canvas.offsetWidth;
            this.canvas.height = this.canvas.offsetHeight;
    
            if ( !( this.scene instanceof Gera.Scene ) )
                throw new Error( 'Can\'t resize the current WebGL container, because the scene object, which is linked to the renderer object is NOT an instance of `Gera.Scene`.' );
    
            if ( !( this.scene.activeCamera instanceof Gera.Camera ) )
                throw new Error( 'Can\'t resize the current WebGL container, because the active scene camera is NOT an instance of `Gera.Camera`.' );
    
            this.scene.activeCamera.bounds.aspect = this.canvas.width / this.canvas.height;
        };
    
        var animateScene = function() {
            if ( this.scene.timer instanceof Gera.Scene.Timer ) {
                this.scene.timer.updateCurrentTime();
    
                for ( var i = 0; i < this.scene.children.length; i++ ) {
                    var object = this.scene.children[ i ];
    
                    if ( object instanceof Gera.Mesh ) {
                        if ( object.rotation instanceof Gera.Rotation )
                            object.rotate( object.rotation.vector, object.rotation.angle );
                    }
                }
            }
            else
                throw new Error( 'Can\'t continue to animate the current scene, because the private scene animator object is NOT an instance of `Gera.Scene.Timer`.' );
        };
    
        var drawScene = function() {
            if ( !this.webglContext )
                terminateRendererWork( this, 'Can\'t draw a scene, because the current WebGL context is undefined.' );
    
            if ( !( this.webglContext instanceof WebGLRenderingContext ) )
                terminateRendererWork( this, 'Can\'t draw a scene, because the current WebGL context is not an instanceof of `WebGLRenderingContext`.' );
    
            if ( !( this.scene instanceof Gera.Scene ) )
                terminateRendererWork( this, 'Can\'t handle any scene object, because the current active scene in renderer object is NOT an instance of `Gera.Scene`.' );
    
            this.webglContext.viewport(
                0,
                0,
                this.webglContext.drawingBufferWidth,
                this.webglContext.drawingBufferHeight
            );
    
            this.webglContext.clear(
                this.webglContext.COLOR_BUFFER_BIT |
                this.webglContext.DEPTH_BUFFER_BIT |
                this.webglContext.STENCIL_BUFFER_BIT
            );
    
            clearCurrentColorBuffer.call( this );
    
            if ( !( this.webglContext.shaderProgram instanceof WebGLProgram ) )
                throw new Error( 'Can\'t draw a scene, because the shader WebGL program is NOT initialized correctly. It\'s NOT an instance of `WebGLProgram`.' );
    
            this.webglContext.useProgram( this.webglContext.shaderProgram );
            handleCurrentSceneObjects.call( this );
        }
    
        var clearCurrentColorBuffer = function() {
            if ( !( this.webglContext.frameBufferColor instanceof Gera.Color.GlFloat ) )
                terminateRendererWork( this, 'Can\'t clear the current frame buffer color, because the `frameBufferColor` property of the renderer object is NOT an instance of `Gera.Color.GlFloat`.' );
    
            this.webglContext.clearColor(
                this.webglContext.frameBufferColor.red,
                this.webglContext.frameBufferColor.green,
                this.webglContext.frameBufferColor.blue,
                this.webglContext.frameBufferColor.alpha
            );
        };
    
        var handleCurrentSceneObjects = function() {
            if ( !( this.scene.children instanceof Array ) )
                terminateRendererWork( this, 'Can\t handle any scene objects, because scene\'s children collection is NOT an instance of `Array`.' );
    
            if ( !( this.scene.activeCamera instanceof Gera.Camera ) )
                throw new Error( 'Can\'t handle the current scene objects, because the active camera is NOT an instance of `Gera.Camera`.' );
    
            handleCameraView.call( this );
    
            for ( var i = 0; i < this.scene.children.length; i++ ) {
                var item = this.scene.children[ i ];
    
                if ( item instanceof Gera.Mesh ) {
                    handleMeshObject.call( this, item );
                    drawMeshObject.call( this, item );
                    handlePostProcessingDraw.call( this );
                }
                else if ( !( item instanceof Gera.Camera ) && !( item instanceof Gera.Mesh ) )
                    terminateRendererWork( this, 'Can\'t render the current scene, because it has a child, which is NOT one of the valid instances. The scene object must only hold the elements, which are the instances of: [ Gera.Camera, Gera.Mesh ].' );
            }
        };
    
        var handleCameraView = function() {
            var camera = this.scene.activeCamera;
    
            if ( !( camera.projectionMatrix instanceof Float32Array ) )
                terminateRendererWork( this, 'Can\'t handle current camera view, because the camera\'s projection matrix is NOT an instance of `Float32Array`.' );        
    
            if ( camera.type === Gera.Camera.Type.Perspective )
                camera.projectionMatrix = Gera.Math.createPerspectiveProjection( camera.bounds );
            else if ( camera.type === Gera.Camera.Type.Orthographic )
                camera.projectionMatrix = Gera.Math.createOrthographicProjection( camera.bounds );
            else
                terminateRendererWork( this, 'Can\'t handle the camera view, because the type of camera is invalid. Valid camera types are: [ Gera.Camera.Type.Perspective, Gera.Camera.Type.Orthographic ].' );
    
            Gera.Math.translateMatrixByVector( camera.projectionMatrix, camera.position );
    
            this.webglContext.uniformMatrix4fv(
                this.webglContext.shaderProgram.uniforms.projectionMatrix,
                false,
                camera.projectionMatrix
            );
        };
    
        var handleMeshObject = function( mesh ) {
            if ( !( mesh instanceof Gera.Mesh ) )
                terminateRendererWork( this, 'Can\'t handle the input mesh object, because it\'s NOT an instance of `Gera.Mesh`.' );
    
            if ( !( this.scene.modelViewMatrix instanceof Float32Array ) )
                terminateRendererWork( this, 'Can\'t handle current camera view, because the input Model-View matrix is NOT an instance of `Float32Array`.' );
    
            if ( !mesh.initialized )
                initializeMeshObject.call( this, mesh );
    
            handleMeshMatrices.call( this, mesh );
            handleMeshGeometryBuffer.call( this, mesh );
            handleMeshTextures.call( this, mesh );
            handleMeshTransparency.call( this, mesh );
    
            this.webglContext.uniformMatrix4fv(
                this.webglContext.shaderProgram.uniforms.modelViewMatrix,
                false,
                this.scene.modelViewMatrix
            );
        };
    
        var handleMeshMatrices = function( mesh ) {
            if ( !( mesh instanceof Gera.Mesh ) )
                throw new Error( 'Can\'t set the position/rotation of mesh in scene, because the given mesh object is NOT an instance of `Gera.Mesh`.' );
    
            this.scene.modelViewMatrix = new Gera.Matrix.Identity();
            Gera.Math.translateMatrixByVector( this.scene.modelViewMatrix, mesh.position );
            this.scene.modelViewMatrix.multiplyByMatrix( mesh.quaternion.toMatrix() );
        };
    
        var handleMeshTextures = function( mesh ) {
            if ( !( mesh instanceof Gera.Mesh ) )
                throw new Error( 'Can\'t handle the mesh textures, because the given mesh object is NOT an instance of `Gera.Mesh`.' );
    
            for ( var i = 0; i < mesh.material.textures.length; i++ ) {
                var texture = mesh.material.textures[ i ];
    
                if ( texture.type === Gera.Texture.Type.Color ) {
                    setVertexColorAttributeOnly.call( this );
                    setBuffersForColorVertices.call( this, mesh );
                }
                else if ( texture.type === Gera.Texture.Type.Image ) {
                    setVertexTextureAttributeOnly.call( this );
    
                    if ( !texture.initialized )
                        initializeTextureImage.call( this, texture );
    
                    setBuffersForTextureVertices.call( this, mesh );
                }
                else
                    throw new Error( 'Can\'t continue to render the current scene, because the given mesh doesn\'t have any texture in its material group. Any mesh must have one texture of any type at least.' );
            }
        };
    
        var setVertexColorAttributeOnly = function() {
            this.webglContext.disableVertexAttribArray( 2 );
            this.webglContext.enableVertexAttribArray( 1 );
            this.webglContext.uniform1i( this.webglContext.shaderProgram.uniforms.hasMeshTexture, 0 );
        };
    
        var setVertexTextureAttributeOnly = function() {
            this.webglContext.disableVertexAttribArray( 1 );
            this.webglContext.enableVertexAttribArray( 2 );
            this.webglContext.uniform1i( this.webglContext.shaderProgram.uniforms.hasMeshTexture, 1 );
        };
    
        var handleMeshGeometryBuffer = function( mesh ) {
            if ( !( mesh instanceof Gera.Mesh ) )
                throw new Error( 'Can\'t set buffers for the vertices of mesh, because the given mesh object is NOT an instance of `Gera.Mesh`.' );
    
            this.webglContext.bindBuffer(
                this.webglContext.ARRAY_BUFFER,
                mesh.glBuffers.geometry.vertices
            );
    
            this.webglContext.vertexAttribPointer(
                this.webglContext.shaderProgram.attributes.vertexPosition,
                mesh.glBuffers.geometry.vertices.info.size,
                this.webglContext.FLOAT,
                false,
                0,
                0
            );
    
            if ( mesh.glBuffers.geometry.indices instanceof WebGLBuffer ) {
                this.webglContext.bindBuffer(
                    this.webglContext.ELEMENT_ARRAY_BUFFER,
                    mesh.glBuffers.geometry.indices
                );
            }
        };
    
        var setBuffersForColorVertices = function( mesh ) {
            if ( !( mesh instanceof Gera.Mesh ) )
                throw new Error( 'Can\'t set buffers for the color vertices of mesh, because the given mesh object is NOT an instance of `Gera.Mesh`.' );
    
            this.webglContext.bindBuffer(
                this.webglContext.ARRAY_BUFFER,
                mesh.glBuffers.color.vertices
            );
    
            this.webglContext.vertexAttribPointer(
                this.webglContext.shaderProgram.attributes.vertexColor,
                mesh.glBuffers.color.vertices.info.size,
                this.webglContext.FLOAT,
                false,
                0,
                0
            );
    
            if ( mesh.glBuffers.color.indices instanceof WebGLBuffer ) {
                this.webglContext.bindBuffer(
                    this.webglContext.ELEMENT_ARRAY_BUFFER,
                    mesh.glBuffers.color.indices
                );
            }
        };
    
        var setBuffersForTextureVertices = function( mesh ) {
            if ( !( mesh instanceof Gera.Mesh ) )
                throw new Error( 'Can\'t set buffers for the texture vertices of mesh, because the given mesh object is NOT an instance of `Gera.Mesh`.' );
    
            this.webglContext.bindBuffer(
                this.webglContext.ARRAY_BUFFER,
                mesh.glBuffers.texture.vertices
            );
    
            this.webglContext.vertexAttribPointer(
                this.webglContext.shaderProgram.attributes.vertexTexture,
                mesh.glBuffers.texture.vertices.info.size,
                this.webglContext.FLOAT,
                false,
                0,
                0
            );
    
            if ( mesh.glBuffers.texture.indices instanceof WebGLBuffer ) {
                this.webglContext.bindBuffer(
                    this.webglContext.ELEMENT_ARRAY_BUFFER,
                    mesh.glBuffers.texture.indices
                );
            }
        };
    
        var initializeTextureImage = function( texture ) {
            if ( !( texture instanceof Gera.Texture ) )
                throw new Error( 'Can\'t handle the uninitialized texture image, because the subproperty `texture` of property `material` from the given mesh object is NOT an instance of `Gera.Texture`.' );
    
            if ( !( texture.image instanceof Image ) )
                throw new Error( 'Can\'t handle the uninitialized texture image, because the subproperty `image` of subproperty `texture` from the given mesh object is NOT an instance of `Image`.' );
    
            if ( typeof texture.image.initialized !== 'boolean' )
                throw new Error( 'Can\'t handle the uninitialized texture image, because the subproperty `initialized` of subproperty `texture` from the given mesh object is NOT a type of `boolean`.' );
    
            if ( texture.image.initialized && texture.image.complete ) {
                createGlTextureObjectForMesh.call( this, texture );
    
                ( this.checkIsMeshTexturePowerOf2.call( this, texture.image ) )
                    ? generateMipmappingForTexture.call( this )
                    : setFilterNonPowerOf2Texture.call( this );
    
                completeTextureInitialization.call( this, texture );
            }
        };
    
        var createGlTextureObjectForMesh = function( texture ) {
            if ( !( texture instanceof Gera.Texture ) )
                throw new Error( 'Can\'t create the WebGL-texture object for mesh, because the input object is NOT an instance of `Gera.Texture`.' );
    
            texture.glTexture = this.webglContext.createTexture();
    
            this.webglContext.bindTexture( this.webglContext.TEXTURE_2D, texture.glTexture );
            this.webglContext.pixelStorei( this.webglContext.UNPACK_FLIP_Y_WEBGL, true );
            this.webglContext.texImage2D(
                this.webglContext.TEXTURE_2D,
                0,
                this.webglContext.RGBA,
                this.webglContext.RGBA,
                this.webglContext.UNSIGNED_BYTE,
                texture.image
            );
        };
    
        var generateMipmappingForTexture = function() {
            this.webglContext.generateMipmap( this.webglContext.TEXTURE_2D );
            this.webglContext.texParameteri(
                this.webglContext.TEXTURE_2D,
                this.webglContext.TEXTURE_MIN_FILTER,
                this.webglContext.LINEAR_MIPMAP_LINEAR
            );
        };
    
        var setFilterNonPowerOf2Texture = function() {
            this.webglContext.texParameteri(
                this.webglContext.TEXTURE_2D,
                this.webglContext.TEXTURE_WRAP_S,
                this.webglContext.CLAMP_TO_EDGE
            );
    
            this.webglContext.texParameteri(
                this.webglContext.TEXTURE_2D,
                this.webglContext.TEXTURE_WRAP_T,
                this.webglContext.CLAMP_TO_EDGE
            );
    
            this.webglContext.texParameteri(
                this.webglContext.TEXTURE_2D,
                this.webglContext.TEXTURE_MIN_FILTER,
                this.webglContext.LINEAR
            );
        };
    
        var completeTextureInitialization = function( texture ) {
            if ( !( texture instanceof Gera.Texture ) )
                throw new Error( 'Can\'t complete the texture initialization, because the given texture is NOT an instance of `Gera.Texture`.' );
    
            this.webglContext.uniform1i(
                this.webglContext.shaderProgram.uniforms.textureSampler,
                0
            );
    
            this.webglContext.uniform1i(
                this.webglContext.shaderProgram.uniforms.hasMeshTexture,
                1
            );
    
            this.webglContext.activeTexture( this.webglContext.TEXTURE0 );
            this.webglContext.bindTexture( this.webglContext.TEXTURE_2D, texture.glTexture );
    
            texture.initialized = true;
        };
    
        var handleMeshTransparency = function( mesh ) {
            if ( !( mesh instanceof Gera.Mesh ) )
                throw new Error( 'Can\'t handle the transparency of the mesh, because the given mesh object is NOT an instance of `Gera.Mesh`.' );
    
            var transparency = mesh.transparency.get();
    
            if ( typeof transparency !== 'number' )
                throw new Error( 'Can\'t handle the transparency of the mesh, because the binded transparency value is NOT a type of `number`.' );
    
            if ( transparency < 0 || transparency > 1.0 )
                throw new Error( 'Can\'t handle the transparency of the mesh, because the binded transparency value has the incorrect value. Transparency may have the value equal from 0 to 1.' );
    
            this.webglContext.uniform1f(
                this.webglContext.shaderProgram.uniforms.alphaValue,
                transparency
            );
    
            this.webglContext.enable( this.webglContext.BLEND );
            this.webglContext.blendFunc(
                this.webglContext.SRC_ALPHA,
                this.webglContext.ONE_MINUS_SRC_ALPHA
            );
    
            this.webglContext.disable( this.webglContext.DEPTH_TEST );
        };
    
        var drawMeshObject = function( mesh ) {
            ( !mesh.customDrawMode && typeof mesh.customDrawMode !== 'number' )
                ? drawMeshObjectInStandardMode.call( this, mesh )
                : drawMeshObjectInCustomMode.call( this, mesh );
        };
    
        var drawMeshObjectInStandardMode = function( mesh ) {
            if ( !( mesh instanceof Gera.Mesh ) )
                throw new Error( 'Can\'t draw the mesh object in standard mode, because the given mesh object is NOT an instance of `Gera.Mesh`.' );
    
            var wireframeValue = mesh.wireframe.get();
    
            if ( typeof wireframeValue !== 'boolean' )
                throw new Error( 'Can\'t draw the mesh object in standard mode, because the binded wireframe mode value is NOT a type of `boolean`.' );
    
            mesh.customDrawMode = null;
    
            switch ( mesh.geometry.type ) {
                case Gera.Geometry.Type.Sphere:
                    this.webglContext.drawElements(
                        ( !wireframeValue )
                            ? this.webglContext.TRIANGLES
                            : this.webglContext.LINE_STRIP,
                        mesh.glBuffers.geometry.indices.info.count,
                        this.webglContext.UNSIGNED_SHORT,
                        0
                    );
                    break;
                case Gera.Geometry.Type.Custom:
                    this.webglContext.drawElements(
                        ( !wireframeValue )
                            ? this.webglContext.TRIANGLES
                            : this.webglContext.LINES,
                        mesh.glBuffers.geometry.indices.info.count,
                        this.webglContext.UNSIGNED_SHORT,
                        0
                    );
                    break;
                default:
                    this.webglContext.drawElements(
                        ( !wireframeValue )
                            ? this.webglContext.TRIANGLES
                            : this.webglContext.LINE_LOOP,
                        mesh.glBuffers.geometry.indices.info.count,
                        this.webglContext.UNSIGNED_SHORT,
                        0
                    );
                    break;
            }
        };
    
        var drawMeshObjectInCustomMode = function( mesh ) {
            if ( !( mesh instanceof Gera.Mesh ) )
                throw new Error( 'Can\'t draw the mesh object in custom mode, because the given mesh object is NOT an instance of `Gera.Mesh`.' );
    
            var drawModeValue = getWebGlDrawModeValue.call( this, mesh.customDrawMode );
    
            if ( typeof drawModeValue !== 'number' )
                throw new Error( 'Can\'t draw the mesh object in custom mode, because the binded draw mode value is NOT a type of `number`.' );
    
            updateWireframeForCustomMeshDraw( mesh, drawModeValue );
    
            switch ( mesh.geometry.type ) {
                case Gera.Geometry.Type.Sphere:
                    this.webglContext.drawElements(
                        drawModeValue,
                        mesh.glBuffers.geometry.indices.info.count,
                        this.webglContext.UNSIGNED_SHORT,
                        0
                    );
                    break;
                case Gera.Geometry.Type.Custom:
                    this.webglContext.drawElements(
                        drawModeValue,
                        mesh.glBuffers.geometry.indices.info.count,
                        this.webglContext.UNSIGNED_SHORT,
                        0
                    );
                    break;
                default:
                    this.webglContext.drawElements(
                        drawModeValue,
                        mesh.glBuffers.geometry.indices.info.count,
                        this.webglContext.UNSIGNED_SHORT,
                        0
                    );
                    break;
            }
        };
    
        var updateWireframeForCustomMeshDraw = function( mesh, drawMode ) {
            if ( !( mesh instanceof Gera.Mesh ) )
                throw new Error( 'Can\'t update the wireframe property of the given mesh object in custom draw mode, because the given mesh object is NOT an instance of `Gera.Mesh`.' );
    
            if ( typeof drawModeValue !== 'number' )
                throw new Error( 'Can\'t update the wireframe property of the given mesh object in custom draw mode, because the fetched draw mode value from mesh is NOT a type of `number`.' );
    
            switch ( drawModeValue ) {
                case Gera.Renderer.DrawMode.Points:
                case Gera.Renderer.DrawMode.Lines:
                case Gera.Renderer.DrawMode.LineStrip:
                case Gera.Renderer.DrawMode.LineLoop:
                    mesh.wireframe.set( true );
                    break;
                case Gera.Renderer.DrawMode.Triangles:
                case Gera.Renderer.DrawMode.TriangleStrip:
                case Gera.Renderer.DrawMode.TriangleFan:
                    mesh.wireframe.set( false );
                    break;
                default:
                    throw new Error( 'Can\'t update the wireframe property of the given mesh object in custom draw mode, because the binded draw mode value is NOT associated with any one type, existed in the `Gera.Renderer.DrawMode` enumeration.' );
            }
        };
    
        var getWebGlDrawModeValue = function( drawMode ) {
            if ( !( this.webglContext instanceof WebGLRenderingContext ) )
                throw new Error( 'Can\'t return the native draw mode value from the WebGL-context, because the given WebGL-context object is NOT an instance of `WebGLRenderingContext`.' );
    
            if ( typeof drawMode !== 'number' )
                throw new Error( 'Can\'t return the native draw mode value from the WebGL-context, because the given draw mode is NOT a type of `number`.' );
    
            switch ( drawMode ) {
                case Gera.Renderer.DrawMode.Points:
                    return this.webglContext.POINTS;
                case Gera.Renderer.DrawMode.Lines:
                    return this.webglContext.LINES;
                case Gera.Renderer.DrawMode.LineStrip:
                    return this.webglContext.LINE_STRIP;
                case Gera.Renderer.DrawMode.LineLoop:
                    return this.webglContext.LINE_LOOP;
                case Gera.Renderer.DrawMode.Triangles:
                    return this.webglContext.TRIANGLES;
                case Gera.Renderer.DrawMode.TriangleStrip:
                    return this.webglContext.TRIANGLE_STRIP;
                case Gera.Renderer.DrawMode.TriangleFan:
                    return this.webglContext.TRIANGLE_FAN;
                default:
                    throw new Error( 'Can\'t return the native draw mode value from the WebGL-context, because the given draw mode is NOT associated with any value from the `Gera.Renderer.DrawMode` enumeration.' );
            }
        };
    
        var initializeMeshObject = function( mesh ) {
            if ( !( mesh instanceof Gera.Mesh ) )
                terminateRendererWork( this, 'Can\'t handle the input mesh object, because it\'s NOT an instance of `Gera.Mesh`.' );
    
            switch ( mesh.material.textures[ 0 ].type ) {
                case Gera.Texture.Type.Color:
                    initializeGlBuffersForColorOnly.call( this, mesh );
                    break;
                case Gera.Texture.Type.Image:
                    initializeGlBuffersForTextureOnly.call( this, mesh );
                    break;
                default:
                    throw new Error( 'Can\'t initialize the mesh object, because the texture type is not valid. ' );
            }
    
            mesh.initialized = true;
        };
    
        var initializeGlBuffersForColorOnly = function( mesh ) {
            mesh.glBuffers = new Gera.Mesh.GlBuffers({
                geometry: {
                    vertices: createVertexBufferForMesh.call( this, mesh ),
                    indices: createIndexBufferForMesh.call( this, mesh )
                },
                color: {
                    vertices: createColorBufferForMesh.call( this, mesh ),
                    indices: null
                },
                texture: {
                    vertices: null,
                    indices: null
                }
            });
        };
    
        var initializeGlBuffersForTextureOnly = function( mesh ) {
            mesh.glBuffers = new Gera.Mesh.GlBuffers({
                geometry: {
                    vertices: createVertexBufferForMesh.call( this, mesh ),
                    indices: createIndexBufferForMesh.call( this, mesh )
                },
                color: {
                    vertices: null,
                    indices: null
                },
                texture: {
                    vertices: createTextureBufferForMesh.call( this, mesh ),
                    indices: createTextureIndexBufferForMesh.call( this, mesh )
                }
            });
        };
    
        var createVertexBufferForMesh = function( mesh ) {
            if ( !( mesh instanceof Gera.Mesh ) )
                throw new Error( 'Can\'t create a new vertex buffer for mesh, because the input mesh object is NOT an instance of `Gera.Mesh`.' );
    
            if ( typeof Float32Array !== 'function' )
                throw new Error( 'Can\'t create a new vertex buffer for mesh. Seems to be, that your browser doesn\'t support the typed arrays. Required `Float32Array` type is NOT supported in your browser.' );
    
            var webglBuffer = this.webglContext.createBuffer();
    
            this.webglContext.bindBuffer(
                this.webglContext.ARRAY_BUFFER,
                webglBuffer
            );
    
            this.webglContext.bufferData(
                this.webglContext.ARRAY_BUFFER,
                mesh.geometry.vertices.typed,
                this.webglContext.DYNAMIC_DRAW
            );
    
            var itemSize = Object.keys( new Gera.Vector3 ).length;
    
            webglBuffer.info = new Gera.Buffer.RenderingInfo({
                size: itemSize,
                count: mesh.geometry.vertices.typed.length / itemSize
            });
    
            return webglBuffer;
        };
    
        var createColorBufferForMesh = function( mesh ) {
            if ( !( mesh instanceof Gera.Mesh ) )
                throw new Error( 'Can\'t create a new color buffer for mesh, because the input mesh object is NOT an instance of `Gera.Mesh`.' );
    
            if ( typeof Float32Array !== 'function' )
                throw new Error( 'Can\'t create a new color buffer for mesh. Seems to be, that your browser doesn\'t support the typed arrays. Required `Float32Array` type is NOT supported in your browser.' );
    
            var texture = mesh.material.textures[ 0 ];
    
            if ( !( texture instanceof Gera.Texture ) )
                throw new Error( 'Can\'t create a new color buffer for mesh, because the binded texture object to the mesh is NOT an instance of `Gera.Texture`.' );
    
            if ( texture.type === Gera.Texture.Type.Color ) {
                var webglBuffer = this.webglContext.createBuffer();
    
                this.webglContext.bindBuffer(
                    this.webglContext.ARRAY_BUFFER,
                    webglBuffer
                );
    
                var colorMatrix = [];
    
                for ( var i = 0; i < mesh.geometry.vertices.generic.length; i++ ) {
                    colorMatrix.push( texture.color.glFloat.red );
                    colorMatrix.push( texture.color.glFloat.green );
                    colorMatrix.push( texture.color.glFloat.blue );
                    colorMatrix.push( texture.color.glFloat.alpha );
                }
    
                this.webglContext.bufferData(
                    this.webglContext.ARRAY_BUFFER,
                    new Float32Array( colorMatrix ),
                    this.webglContext.DYNAMIC_DRAW
                );
    
                var itemSize = Object.keys( new Gera.Vector4 ).length;
    
                webglBuffer.info = new Gera.Buffer.RenderingInfo({
                    size: itemSize,
                    count: colorMatrix.length / itemSize
                });
    
                return webglBuffer;
            }
    
            throw new Error( 'Can\'t create a new color buffer for mesh, because the type of the binded texture object is NOT the `Gera.Texture.Type.Color`.' );
        };
    
        var createTextureBufferForMesh = function( mesh ) {
            if ( !( mesh instanceof Gera.Mesh ) )
                throw new Error( 'Can\'t create a new texture buffer for mesh, because the input mesh object is NOT an instance of `Gera.Mesh`.' );
    
            if ( typeof Float32Array !== 'function' )
                throw new Error( 'Can\'t create a new texture buffer for mesh. Seems to be, that your browser doesn\'t support the typed arrays. Required `Float32Array` type is NOT supported in your browser.' );
    
            var texture = mesh.material.textures[ 0 ];
    
            if ( !( texture instanceof Gera.Texture ) )
                throw new Error( 'Can\'t create a new texture buffer for mesh, because the binded texture object to the mesh is NOT an instance of `Gera.Texture`.' );
    
            if ( texture.type === Gera.Texture.Type.Image ) {
                var webglBuffer = this.webglContext.createBuffer();
    
                this.webglContext.bindBuffer(
                    this.webglContext.ARRAY_BUFFER,
                    webglBuffer
                );
    
                this.webglContext.bufferData(
                    this.webglContext.ARRAY_BUFFER,
                    mesh.geometry.uvCoordinates.typed,
                    this.webglContext.DYNAMIC_DRAW
                );
    
                var itemSize = Object.keys( new Gera.Vector2 ).length;
    
                webglBuffer.info = new Gera.Buffer.RenderingInfo({
                    size: itemSize,
                    count: mesh.geometry.uvCoordinates.typed.length / itemSize
                });
    
                return webglBuffer;
            }
    
            throw new Error( 'Can\'t create a new texture buffer for mesh, because the type of the binded texture object is NOT the `Gera.Texture.Type.Image`.' );
        };
    
        var createIndexBufferForMesh = function( mesh ) {
            if ( !( mesh instanceof Gera.Mesh ) )
                throw new Error( 'Can\'t create a new index buffer for mesh, because the input mesh object is NOT an instance of `Gera.Mesh`.' );
    
            if ( typeof Uint16Array !== 'function' )
                throw new Error( 'Can\'t create a new index buffer for mesh. Seems to be, that your browser doesn\'t support the typed arrays. Required `Uint16Array` type is NOT supported in your browser.' );
    
            if ( mesh.geometry.indices instanceof Array ) {
                var webglBuffer = this.webglContext.createBuffer();
    
                this.webglContext.bindBuffer(
                    this.webglContext.ELEMENT_ARRAY_BUFFER,
                    webglBuffer
                );
    
                this.webglContext.bufferData(
                    this.webglContext.ELEMENT_ARRAY_BUFFER,
                    new Uint16Array( mesh.geometry.indices ),
                    this.webglContext.DYNAMIC_DRAW
                );
    
                webglBuffer.info = new Gera.Buffer.RenderingInfo({
                    size: 1,
                    count: mesh.geometry.indices.length
                });
    
                return webglBuffer;
            }
    
            return null;
        };
    
        var createTextureIndexBufferForMesh = function( mesh ) {
            if ( !( mesh instanceof Gera.Mesh ) )
                throw new Error( 'Can\'t create a new texture index buffer for mesh, because the input mesh object is NOT an instance of `Gera.Mesh`.' );
    
            if ( typeof Uint16Array !== 'function' )
                throw new Error( 'Can\'t create a new texture index buffer for mesh. Seems to be, that your browser doesn\'t support the typed arrays. Required `Uint16Array` type is NOT supported in your browser.' );
    
            if ( mesh.geometry.uvIndices instanceof Array ) {
                var webglBuffer = this.webglContext.createBuffer();
    
                this.webglContext.bindBuffer(
                    this.webglContext.ELEMENT_ARRAY_BUFFER,
                    webglBuffer
                );
    
                this.webglContext.bufferData(
                    this.webglContext.ELEMENT_ARRAY_BUFFER,
                    new Uint16Array( mesh.geometry.uvIndices ),
                    this.webglContext.DYNAMIC_DRAW
                );
    
                webglBuffer.info = new Gera.Buffer.RenderingInfo({
                    size: 1,
                    count: mesh.geometry.uvIndices.length
                });
    
                return webglBuffer;
            }
    
            return null;
        };
    
        var handlePostProcessingDraw = function() {
            this.webglContext.enable( this.webglContext.DEPTH_TEST );
        };
    
        var terminateRendererWork = function( renderer, exceptionMessage ) {
            if ( !( renderer instanceof Gera.Renderer ) )
                throw new Error( 'Can\'t terminate the current renderer work, because the input renderer object is NOT an instance of `Gera.Renderer`.' );
    
            if ( typeof exceptionMessage !== 'string' )
                throw new Error( 'Can\'t terminate the current renderer work, because the input exception message is NOT a type of `string`.' );
    
            window.cancelAnimationFrame( renderer.requestFrameId );
            renderer.requestFrameId = undefined;
    
            if ( renderer.webglContext instanceof WebGLRenderingContext )
                if ( renderer.webglContext.shaderProgram instanceof WebGLProgram )
                    renderer.webglContext.deleteProgram( renderer.webglContext.shaderProgram );
    
            renderer.webglContext = undefined;
        };
    
        var getWebGLVendorsList = function() {
            return [
                'webgl',
                'experimental-webgl',
                'webkit-3d',
                'moz-webgl',
                '3d',
                'webgl2',
                'experimental-webgl2'
            ];
        };
    
        var getWebGLRendererSettingsList = function() {
            return [
                'alpha',
                'antialias',
                'depth',
                'stencil',
                'premultipliedAlpha',
                'preserveDrawingBuffer'
            ];
        };
    
    })( libraryObject );

    ( function( Gera ) {
    
        Gera.Parser = function() {};
    
        Gera.Parser.Json = function() {};
    
        Gera.Parser.Json.prototype.parse = function( content ) {
            var object = null;
    
            if ( typeof content === 'string' )
                object = JSON.parse( content );
            else if ( typeof content === 'object' )
                object = content;
            else
                throw new Error( 'Can\'t parse the given content into JSON 3D-model, because it\'s NOT a type of `string` or `object`.' );
    
            if ( !( object.indices instanceof Array ) || object.indices.length === 0 )
                object = null;
    
            return new Gera.Object3d({
                vertices: serializeVertices( object.vertices ),
                indices: object.indices,
                uvCoordinates: serializeTextureUvCoordinates( object.textureCoordinates ),
                uvIndices: null,
                textures: null
            });
        };
    
        var serializeVertices = function( rawVertices ) {
            if ( !( rawVertices instanceof Array ) )
                throw new Error( 'Can\'t serialize the input raw vertices list into generic one, because it\'s NOT an instance of `Array`.' );
    
            var serializedVertices = [];
    
            for ( var i = 0; i < rawVertices.length; i += 3 ) {
                serializedVertices.push(
                    new Gera.Vector3({
                        x: rawVertices[ i ],
                        y: rawVertices[ i + 1 ],
                        z: rawVertices[ i + 2 ]
                    })
                );
            }
    
            return ( serializedVertices.length === 0 ) ? null : serializedVertices;
        };
    
        var serializeTextureUvCoordinates = function( rawTextureUvs ) {
            var serializedTextureUvs = null;
    
            if ( rawTextureUvs instanceof Array ) {
                var serializedTextureUvs = [];
    
                for ( var i = 0; i < rawTextureUvs.length; i += 2 ) {
                    serializedTextureUvs.push(
                        new Gera.Vector2({
                            x: rawTextureUvs[ i ],
                            y: rawTextureUvs[ i + 1 ]
                        })
                    );
                }
    
                if ( serializedTextureUvs.length === 0 )
                    serializedTextureUvs = null;
            }
    
            return serializedTextureUvs;
        };
    
    })( libraryObject );

})( window, 'Gera' );