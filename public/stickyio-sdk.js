const stickyio = ( function() {
    const iframeUrl = `https://cdn.sticky.io/jssdk/iframe/index.html?appKey=${window.stickyAppKey}`;
    const creditCardForm = function( appId, cardCallback ) {
        const cardContainer = document.getElementById( 'stickyio_card' );
        const submitButton = document.getElementById( 'stickyio_submit' );
        const iframe = cardContainer && document.createElement( 'iframe' );

        const readOnly = function( container = true, button = true ) {
            cardContainer.className = container ? 'read-only' : '';
            submitButton.className = button ? 'stickyio-btn read-only' : 'stickyio-btn';
        }

        if ( cardContainer ) {
            iframe.setAttribute( 'src', iframeUrl );
            iframe.className = 'stickyio-iframe';

            cardContainer.appendChild( iframe );
        }

        if ( submitButton ) {
            submitButton.className = 'stickyio-btn read-only';
            submitButton.onclick = () => {
                readOnly();
                iframe.contentWindow.postMessage( {
                    app_id: appId,
                    tokenize: true
                }, '*' );
            };
        }

        iframe.onload = () => {
            iframe.contentWindow.postMessage( { app_id: appId }, '*' );
        };

        window.addEventListener( 'message', ( e ) => {
            if ( e.data ) {
                if ( e.data.card !== undefined ) {
                    readOnly( false, true );
                    cardCallback( e.data.card );
                }

                if ( e.data.valid !== undefined ) {
                    readOnly( false, !e.data.valid );
                }
            }
        }, false );
    };

    function appendStyles() {
        const style = document.createElement( 'style' );
        style.type = 'text/css';
        style.innerHTML = `
.stickyio-btn {
margin: 0;
padding: 1em 2em;
font-size: 14px;
border: none;
background-color: #3cb4e5;
border-radius: 4px;
cursor: pointer;
color: white;
box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.25);
font-weight: bold;
}

.stickyio-btn:hover {
background-color: #2ca4d5;
}

.stickyio-btn:active {
box-shadow: none;
}

.stickyio-iframe {
border: 0;
width: 420px;
height: 115px;
}

.read-only {
opacity: 0.5;
pointer-events: none;
}
`;

        document.getElementsByTagName( 'head' )[ 0 ].appendChild( style );
    }

    appendStyles();

    return {
        version: '1.0.0.3',
        creditCardForm: creditCardForm,
    };
}() );






​
Auto
