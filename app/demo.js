var five = require('johnny-five'),
    blendMicroIO = require('blend-micro-io'),
    Oled = require('oled-js'),
    font = require('oled-font-5x7'),
    pngtolcd = require('png-to-lcd'),
    temporal = require('temporal');

var board = new five.Board({
  io: new blendMicroIO()
});

board.on('ready', function() {
  console.log('johnny-five found the kitty kube!');

  // new oled
  var oled = new Oled(board, five, 128, 64, 0x3D, 'I2C');

  // inject into the repl for fun console taims
  this.repl.inject({
    oled: oled
  });

  test(oled);

  // sequence of test displays
  function test(oled) {

    // if it was already scrolling, stop
    oled.stopscroll();

    // clear first just in case
    oled.update();

    // make it prettier 
    oled.dimDisplay(true);

    temporal.queue([
      {
        delay: 100,
        task: function() {
          // draw some test pixels
          oled.drawPixel([
            [127, 0, 1],
            [127, 31, 1],
            [127, 16, 1],
            [64, 16, 1]
          ]);
        }
      },
      {
        delay: 10000,
        task: function() {
          oled.clearDisplay();
          // display a bitmap
          pngtolcd(__dirname + '/../node_modules/oled-js/tests/images/cat-128x64.png', true, function(err, bitmapbuf) {
            oled.buffer = bitmapbuf;
            oled.update();
          });
          
        }
      },
      {
        delay: 10000,
        task: function() {
          oled.clearDisplay();
          // display text
          oled.setCursor(0, 0);
          oled.writeString(font, 1, 'Cats and dogs are really cool animals, you know.', 1, true);
        }
      },
      {
        delay: 10000,
        task: function() {
          oled.clearDisplay();
          // draw some lines
          oled.drawLine(0, 0, 127, 31, 1);
          oled.drawLine(64, 16, 127, 16, 1);
          oled.drawLine(0, 10, 40, 10, 1);
        }
      },
      {
        delay: 10000,
        task: function() {
          oled.clearDisplay();
          // draw a rectangle
          oled.fillRect(0, 0, 10, 20, 1);
        }
      },
      {
        delay: 10000,
        task: function() {
          oled.clearDisplay();
          // display text
          oled.setCursor(0, 7);
          oled.writeString(font, 2, 'SCROLL!', 1, true);
          oled.startscroll('left', 0, 6);
        }
      }
    ]);
  }
});