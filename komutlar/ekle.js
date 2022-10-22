//Gerekli modülleri içe aktar.
const db = require('quick.db');

//Komut çalıştığında işlem yap.
exports.run = async (client, mesaj, argumanlar) => {

  //Eğer etiketlenen biri var ise onu al, yoksa mesaj sahibini al ve "kişi" değişkenine ata.
  var kişi = mesaj.mentions.users.first() || mesaj.author;
  //Komuttan sonraki ilk argümanı al ve "girilen" değişkenine ata.
  var girilen = argumanlar[0];

  //Eğer "girilen" değeri yoksa bir uyarı ver.
  if (!girilen) return mesaj.reply('Bir miktar girmelisin!');
  //Eğer "girilen" bir sayı değilse uyarı ver.
  if (isNaN(girilen)) return mesaj.reply('Bu bir sayı değil, bir sayı girmelisin!');

  //Belirtilen kişinin bakiyesine belirtilen miktarda ekle.
  db.add(`${mesaj.guild.id}_${kişi.id}_bakiye`, girilen);
  //"{mesaj.guild.id}_${mesaj.author.id}_bakiye" sadece o sunucu için ayarlar, eğer tüm sunucularda geçerli olacaksa "{mesaj.author.id}_bakiye" olarak ayarla.
  
  //Komudun yazıldığı kanala çıktı gönder.
  mesaj.channel.send(`${kişi} kullanıcısının bakiyesine **${girilen}** eklendi. (Şimdi **${db.get(`${mesaj.guild.id}_${kişi.id}_bakiye`)}**)`);
};

exports.conf = {
  //Alternatif kullanımlar.
  aliases: [],
  //Gerektirdiği yetki.
  permLevel: 1
};

exports.help = {
  //Komudun ana kullanımı.
  name: 'ekle',
  //İsteğe bağlı açıklama.
  description: 'Belirtilen kullanıcının bakiyesine belirtilen miktarda ekler.'
};
