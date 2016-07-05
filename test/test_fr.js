

test("Test - Date + Time Expression", function() {

    var text = "Quelque chose arrive le 18/04/2014 13:00 - 16:00";
    var results = chrono.parse(text, new Date(2012,7,10));
    ok(results.length == 1, JSON.stringify( results ) )
    ok(results[0].text == '18/04/2014 13:00 - 16:00')
    
});


test("Test - Compare with native js", function() {

    var text = 'Sam 05 Nov 1994 22:45:30 GMT+0200 (UTC)';
    var result = chrono.parse(text)[0];
    var expect = new Date(text);
    
    ok(result.text == text, result.text);
    ok(Math.abs(expect.getTime() - result.start.date().getTime()) <= 1000)
});

