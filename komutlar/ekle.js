const qdb = require('quick.db');

exports.run = async (client, message, args) => {
  var kişi = message.mentions.users.first() || message.author;//Eğer etiketlenen biri var ise onu al, yoksa mesaj sahibini al ve "kişi" değişkenine ata.
  var girilen = args[0];//Komuttan sonraki ilk kelimeyi al ve "girilen" değişkenine ata.

  if (!girilen) return message.reply(`Bir miktar girmelisin!`);//Eğer "girilen" değeri yoksa bir uyarı ver.
  if (isNaN(girilen)) return message.reply(`Bu bir sayı değil, bir sayı girmelisin!`)//Eğer "girilen" bir sayı değilse uyarı verç


  qdb.add(`${message.guild.id}_${kişi.id}_bakiye`, girilen);//Belirtilen kişinin bakiyesine belirtilen miktarda ekle.
  //"{message.guild.id}_${message.author.id}_bakiye" sadece o sunucu için ayarlar, eğer tüm sunucularda aynı olacaksa "{message.author.id}_bakiye" olarak ayarla.
  
  message.channel.send(`${kişi} kişisine **${girilen}** TL eklendi.`);//Komudun yazıldığı kanala çıktı gönder.
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 4
};

exports.help = {
  name: "ekle",
  description: "Belirtilen kullanıcının bakiyesine belirtilen miktarda ekler.",
  usage: "ekle"
};
