/*


*/

var moment = require('moment');
var Parser = require('../parser').Parser;
var ParsedResult = require('../../result').ParsedResult;

var PATTERN = /(\W|^)(hier soir|hier|ce\s*(matin|soir)|cet\s*(après-midi|après\s*midi)|cette\s*(nuit)|(avant-hier|avant\s*hier)|(après-demain|après\s*demain)|maintenant|aujourd'hui|demain)(?=\W|$)/i;

exports.Parser = function FRCasualDateParser(){
    console.log('ybo');

    Parser.apply(this, arguments);

    this.pattern = function() { return PATTERN; }

    this.extract = function(text, ref, match, opt){

        var text = match[0].substr(match[1].length);
        var index = match.index + match[1].length;
        var result = new ParsedResult({
            index: index,
            text: text,
            ref: ref,
        });

        var refMoment = moment(ref);
        var startMoment = refMoment.clone();
        var lowerText = text.toLowerCase();

        if(lowerText.contains('nuit')){
            // Normally means this coming midnight
            result.start.imply('hour', 22);
            result.start.imply('meridiem', 1);

        } else if(lowerText == 'demain'){

            // Check not "Tomorrow" on late night
            if(refMoment.hour() > 1) {
                startMoment.add(1, 'day');
            }

        } else if(lowerText == 'hier') {

            startMoment.add(-1, 'day');
        }
        else if(lowerText == 'hier soir') {

            result.start.imply('hour', 0);
            if (refMoment.hour() > 6) {
                startMoment.add(-1, 'day');
            }

        } else if (lowerText.match("ce")) {
            console.log(match);
            var secondMatch = match[3].toLowerCase();
            if (secondMatch == "soir") {

                result.start.imply('hour', 18);

            } else if (secondMatch == "matin") {

                result.start.imply('hour', 6);
            }

        } else if (lowerText.match("cet")) { 
            console.log(match);
            var secondMatch = match[3].toLowerCase();
            if (secondMatch == "après-midi" || secondMatch.match('après\s*midi')) {
                result.start.imply('hour', 15);
            }
        }
        else if (lowerText.match("maintenant")) {

          result.start.imply('hour', refMoment.hour());
          result.start.imply('minute', refMoment.minute());
          result.start.imply('second', refMoment.second());
          result.start.imply('millisecond', refMoment.millisecond());

        }

        result.start.assign('day', startMoment.date())
        result.start.assign('month', startMoment.month() + 1)
        result.start.assign('year', startMoment.year())
        result.tags['FRCasualDateParser'] = true;
        return result;
    }
}
