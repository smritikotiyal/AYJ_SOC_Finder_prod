function modalOpen(){
    jQuery('[data-toggle="modal"]').on('touchstart click',function (e) {
        e.preventDefault();
        var modalTarget = jQuery(this).data('target');
        jQuery(modalTarget).addClass('show').siblings().removeClass('show');
        $('body').addClass('modal-open');
        $('body').append('<div class="modal-backdrop fade show"></div>');
    });
    $('[data-dismiss="modal"]').on('touchstart click', function(){
        $('.modal').removeClass('show');
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();
    });
    $(document).on('touchstart click','.modal', function(e){
        var closearea = jQuery(".modal-content");
        if (closearea.has(e.target).length === 0) {
            $('.modal').removeClass('show');
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();
        }
    });
}

function suggestionCheck() {
    $( ".suggestion-list .suggestion-item label" ).on( "click", function() {
        $('.suggestion-list .suggestion-item label').removeClass('active');
        $(this).addClass('active');
    });
}

$(function() {
    modalOpen();
    suggestionCheck();
});

var findSoc = document.getElementById( "find-soc" );
var socSubmit = document.getElementById( "soc-form" );
findSoc.addEventListener( "click", function( event ) {
    event.preventDefault();
    var message = document.querySelector( '.job-message' );
    var hiddenDiv = document.querySelector( '.select-suggestion' );
    var errorSucessElement = document.querySelector( ".alert-message" );
    var errorElement = document.querySelector( "#job_message_error" );
    var active = document.querySelector( '.active' );
    var radioHtmlBox = document.querySelector( ".suggestion-list" );
    var hiddenInputElement = document.querySelector( ".hidden-input" );
    
    if ( message && message.value.trim() != '' ) {
   
        function df() {
            var tmp = null;
            $.ajax({
                async: false,
                type: "POST",
                url: "/#findSOC",
                data: { 'jd' : message.value},
                'success': function (data) {
                    tmp = data;
                }
            });
           return tmp;
        };

        data = df();
        
        var radioHtml = '';
        var hiddenInput = '';
        var socInput = ''
        var count = 1;
        // console.log('data : ', data)

        data['jd2'] = message.value;
        // var data =  {'SOC1': '2424', 'SOC1_desc_1': 'BUSINESS AND FINANCIAL PROJECT MANAGEMENT PROFESSIONALS', 'SOC2': '3545', 'SOC2_desc_2': 'SALES ACCOUNTS AND BUSINESS DEVELOPMENT MANAGERS', 'SOC3': '2135', 'SOC3_desc_3': 'IT BUSINESS ANALYSTS~ ARCHITECTS AND SYSTEMS DESIGNERS', 'M1': '2424', 'M2': '3545', 'M3': '2135', 'M4': '3545', 'M5': '2424', 'M6': '2135'};

        for (var i = 1; i < Object.keys(data).length; i++) {
            if ( data[ 'SOC' + i ] ) {
                var socVal = data[ 'SOC' + i ];
                var socDesc = data[ 'SOC' + i + '_desc_' + i ] ? data[ 'SOC' + i + '_desc_' + i ] : '';
                radioHtml += '<div class="suggestion-item"> <div class="box"> <div class="info"> <a href="https://onsdigital.github.io/dp-classification-tools/standard-occupational-classification/data/SingleClass.html?soc='+data[ 'SOC' + i ]+'" target="_blank"><svg class="svg-icon"><use xlink:href="../static/images/svg-sprite.svg#info-circle"></use></svg></a> </div>'
                radioHtml += '<div class="text"> <label for="radio_'+i+'">'+socVal+', '+socDesc+'</br> </br>';
                radioHtml += '<div class="detail"><details><summary>Eligibility criteria</summary><ul><li>PhD: '+data[ 'SOC' + i + '_phd_' + i ]+'</li><li>ICT and ICGT: '+data[ 'SOC' + i + '_ict_icgt_' + i ]+'</li><li>SW Visa: '+data[ 'SOC' + i + '_eligible_' + i ]+'</li><li>Skill Level: '+data[ 'SOC' + i + '_rqf_' + i ]+'</li><li>NOTE: '+data[ 'SOC' + i + '_note_' + i ]+'</li></ul></details></div><input type="radio" name="s'+i+'" class="radio-input" id="radio_'+i+'" value="'+socVal+'"><span class="checkmark"></span></label></div></div></div>';
                radioHtmlBox.innerHTML = radioHtml;

                socInput += '<input type="text" name="s'+ i +'" value="' + data[ 'SOC' + i ] + '">';
                hiddenInputElement.innerHTML = socInput;
            }

            if ( data[ 'M' + i ] ) {
                hiddenInput += '<input type="hidden" name="M'+ i +'" id="M'+ i + '" value="' + data[ 'M' + i ] + '">';
                hiddenInputElement.innerHTML = hiddenInput;
            }
        }
        errorSucessElement.classList.remove( 'alert-error' );
    	errorSucessElement.classList.remove( 'alert-success' );
    	errorSucessElement.classList.remove( 'show-notice' );
        hiddenDiv.classList.remove( 'soc-hidden' );
        errorElement.classList.add( 'soc-hidden' );
        window.location = '/#soc-form'
    } else {
        errorSucessElement.classList.remove( 'show-notice' );
        errorElement.classList.remove( 'soc-hidden' );
		socSubmit.reset();
        if ( active ) {
            active.classList.remove( 'active' );
        }
        hiddenDiv.classList.add( 'soc-hidden' );
    }  
} );

socSubmit.addEventListener( "submit", function( e ) {
	 e.preventDefault();
	var radioInput = document.querySelector( 'input[type="radio"]:checked' );
    // console.log('radioInput : ', radioInput)
    var result = radioInput; // radio button value 
	radioInput = radioInput ? true : false;
	var socCode    = document.querySelector( '.soc-code-input' ); // manual soc value entered
    // console.log('socCode : ', socCode.value);
    // console.log('socSubmit : ', socSubmit)
	var errorSuccesElement = document.querySelector( ".alert-message" );
    var errorElement = document.querySelector( "#soc_message_error" );
    var hiddenDiv = document.querySelector( '.select-suggestion' );
    var active = document.querySelector( '.active' );
    var message = document.querySelector( '.job-message' );

	if ( radioInput == false && socCode.value == '' ) {
		errorElement.classList.remove( 'soc-hidden' );
        errorElement.innerHTML = 'Please select suggestions or enter your own SOC Code';
	} else {
        if ( radioInput == true && socCode.value != '' ) {
            // console.log('Here')
            errorElement.classList.remove( 'soc-hidden' );
            errorElement.innerHTML = 'You are allowed to select only one option.';
        } else {
            // console.log('THere')
            // var soc1 = document.getElementById('M1').value
            // console.log('soc1 : ', soc1)
            // console.log('result 2 : ', result)
            if(result != null){
                data['radio'] = result.value;
                
            }
            else{
                data['manual'] = socCode.value;
            }
            // console.log('data soc : ', data)

            function df() {
                var tmp = null;
                $.ajax({
                    async: false,
                    type: "POST",
                    url: "/#socCode",
                    data: data,
                    'success': function (out) {
                        tmp = out;
                    }
                });
               return tmp;
            };
    
            message = df();
            // console.log('message : ', message)

            // jQuery.post(window.location.href);
    		document.getElementById( 'error-notice-text' ).innerHTML = 'Your SOC Code has been submitted successfully';
            errorElement.classList.add( 'soc-hidden' );
    		errorSuccesElement.classList.add( 'alert-error' );
    		errorSuccesElement.classList.add( 'show-notice' );
    		errorSuccesElement.classList.add( 'alert-success' );
            document.querySelector( '.job-message' ).value = ' ';
            socSubmit.reset();
            if ( active ) {
                active.classList.remove( 'active' );
            }
            hiddenDiv.classList.add( 'soc-hidden' );
        
        }
	}
} );
