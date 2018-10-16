function round(number, precision) {
    number = +number;
    precision = precision ? +precision : 0;
    if (precision == 0) {
      return Math.round(number);
    }
    var sign = 1;
    if (number < 0) {
      sign = -1;
      number = Math.abs(number);
    }
  
    // Shift
    number = number.toString().split('e');
    number = Math.round(+(number[0] + 'e' + (number[1] ? (+number[1] + precision) : precision)));
    // Shift back
    number = number.toString().split('e');
    return +(number[0] + 'e' + (number[1] ? (+number[1] - precision) : -precision)) * sign;
  }

  module.exports.round = round;