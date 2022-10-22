//Gerekli modülleri içe aktar.
const db = require("quick.db");

//Komut çalıştığında işlem yap.
exports.run = (client, mesaj, argumanlar) => {

  //Kullanıcının bakiye verisini çağır ve veriyi "bakiye" değişkenine ata.
  var bakiye = db.get(`${mesaj.guild.id}_${mesaj.author.id}_bakiye`);
  //"{mesaj.guild.id}_${mesaj.author.id}_bakiye" sadece o sunucu için ayarlar, eğer tüm sunucularda geçerli olacaksa "{mesaj.author.id}_bakiye" şeklinde ayarla.
  
  //Eğer bakiye değeri yoksa, 0 olarak göster.
  if (bakiye === null) bakiye = 0;

  //Komudun yazıldığı kanala çıktı gönder.
  mesaj.channel.send(`${mesaj.author} kullanıcısının bakiyesi **${bakiye}**.`)
};

exports.conf = {
  //Alternatif kullanımlar.
  aliases: [],
  //Gerektirdiği yetki.
  permLevel: 0
};

exports.help = {
  //Komudun ana kullanımı.
  name: 'bakiye',
  //İsteğe bağlı açıklama.
  description: 'Bakiye sorgular.'
};
