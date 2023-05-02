const Jimp = require('jimp');
try {
  (async function () {

    const image = await Jimp.read('images/purp.png');
    image.resize(16*25, 9*25)
    const font = await Jimp.loadFont(Jimp.FONT_SANS_128_WHITE);
    image.print(font, 0, 0, '2200');
    console.log("done")
    image.write('images/team.png');
  
  })();
} catch (error) {
  console.log(error)
}
