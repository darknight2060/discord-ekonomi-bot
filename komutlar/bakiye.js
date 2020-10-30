const db = require("quick.db");

exports.run = function (client, message) {

  var bakiye = db.fetch(`${message.guild.id}_${message.author.id}_bakiye`);//Kullanıcının bakiye verisini çağır ve veriyi "bakiye" değişkenine ata.
  //"{message.guild.id}_${message.author.id}_bakiye" sadece o sunucu için ayarlar, eğer tüm sunucularda aynı olacaksa "{message.author.id}_bakiye" olarak ayarla.

  if (bakiye === null) bakiye = 0; //Eğer bakiye daha önce belirtilmemişse, 0 olarak ayarla.


  message.channel.send(`${message.author} kişisinde **${bakiye}** TL var.`)//Komudun yazıldığı kanala çıktı gönder.
};

exports.conf = {
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'bakiye',
  description: 'Bakiye sorgular.',
  usage: 'bakiye',
};
