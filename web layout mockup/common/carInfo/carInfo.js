/** carInfo ver1.0 */
/* rent by hour */
    
    var booked = ['2016-09-26 19:00','2016-09-27 17:00','2016-09-28 13:00','2016-09-28 14:00'];
    var time = [];
    var allTime = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24];
    
    $('#rent-day').datetimepicker({
        defaultDate: new Date(),
        format: 'YYYY-MM-DD',
        minDate: new Date(),
    });
    $('#rent-time').datetimepicker({
        defaultDate: new Date(),
        format: 'HH:00',
        minDate: new Date(),
    });
    
    for(var i=0; i<booked.length; i++) {
        if(booked[i].substr(0,10) === $('#rent-day').val()) {
            time.push(parseInt(booked[i].substr(11,2)));
        }
    }
    $('#rent-time').data("DateTimePicker").enabledHours(allTime);
    $('#rent-time').data("DateTimePicker").disabledHours(time);
    
    $('#rent-day').on('dp.change', function() {
        time = [];
        today = moment(new Date()).format("YYYY-MM-DD");
        
        for(var i=0; i<booked.length; i++) {
            if(booked[i].substr(0,10) === $('#rent-day').val()) {            
                time.push(parseInt(booked[i].substr(11,2)));
            }
        }
        $('#rent-time').data("DateTimePicker").enabledHours(allTime);
        $('#rent-time').data("DateTimePicker").disabledHours(time);
        
        if($('#rent-day').val() !== today.toString()) {
            $('#rent-time').data("DateTimePicker").minDate(false);
        }
        if($('#rent-day').val() === today.toString()) {
            $('#rent-time').data("DateTimePicker").minDate(moment(new Date()).format("HH:00"));
        }
    });
    
    /* rent by day */
    // start
    $('#start-day').datetimepicker({
        defaultDate: new Date(),
        format: 'YYYY-MM-DD',
        minDate: new Date(),
    });
    //end
    $('#end-day').datetimepicker({
        //defaultDate: new Date(),
        format: 'YYYY-MM-DD',
        minDate: new Date(),
        useCurrent: false,
    });
    // start
    $('#start-time').datetimepicker({
        defaultDate: new Date(),
        format: 'HH:00',
        minDate: new Date(),
    });
    // end
    $('#end-time').datetimepicker({
        //defaultDate: new Date(),
        format: 'HH:00',
        minDate: new Date(),
        useCurrent: false,
    });
    
    $('#start-day').on('dp.change',function(e) {
        $('#end-day').data("DateTimePicker").minDate(e.date);
    })
    $('#end-day').on('dp.change',function(e) {
        $('#start-day').data("DateTimePicker").maxDate(e.date);
    })
    
    $(document).ready(function(){
        
        $('.product-images').slick({
            dots: true
        });

        $('#phone-view').on('click', function() {
            $('#phone-view').html('<i class="fa fa-phone"></i> ');
            $('#phone-view').append(' 01687548624');
            
        });
        $('#email-view').on('click', function() {
            $('#email-view').html('<i class="fa fa-envelope"></i> ');
            $('#email-view').append(' thanh@gmail.com');
        });
        
        // test
        $('#end-time').change(function() {
//            var s = $('#end-time').val();
//            var st = moment(s).format("YYYY-MM-DD HH:mm");
//            $('#start-time').datetimepicker('setEndDate', st);
        });
        $('#start-time').change(function() {
            var s = $('#start-time').val();
            var e = $('#end-time').val();
            
            var st = moment(s).format("YYYY-MM-DD HH:mm");
            var et = moment(e).format("YYYY-MM-DD HH:mm");
            if(e) {
                
                if(st > et) {
                    et = moment(s).add(1, 'days').format("YYYY-M-D HH:mm");
                    $('#end-time').val(et);
                }
            }
            $('#end-time').datetimepicker('setStartDate', st);
        });
        
        
        // total hour price
        var total = parseInt($('#hour-price').val()) + parseInt($('#h-fee').text().replace(",",""));
        total = total.toString();
        if (total.length >= 4) {
            total = total.replace(/(\d)(?=(\d{3})+$)/g, '$1,');
        }
        $('#h-total-price').text(total);
        
        $('#hour-price').on('change', function() {
            var total = parseInt($('#hour-price').val()) + parseInt($('#h-fee').text().replace(",",""));
            total = total.toString();
            if (total.length >= 4) {
                total = total.replace(/(\d)(?=(\d{3})+$)/g, '$1,');
            }
            
            $('#h-total-price').text(total);
        });
        
        // total day price
        $('#start-day, #end-day').on('dp.change', function() {
            if($('#start-day').val()) {
                if($('#end-day').val()) {
                    var s = $('#start-day').val();
                    s = moment(s);
                    
                    var e = $('#end-day').val();
                    e = moment(e);
                    
                    var duration = moment.duration(e.diff(s));
                    var days = duration.asDays() + 1;
                    days = parseInt(days);
                    var total = parseInt($('#day-price').text().replace(",",""))*days + parseInt($('#d-fee').text().replace(",",""));
                    total = total.toString();
                    if (total.length >= 4) {
                        total = total.replace(/(\d)(?=(\d{3})+$)/g, '$1,');
                    }
                    $('#d-total-price').text(total);
                }
            }
        });
        
        $('#checkout-day').on('click', function() {
            alert();
        });
    });