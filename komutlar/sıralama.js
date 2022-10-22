//Gerekli modülleri içe aktar.
const { MessageEmbed } = require("discord.js");
const db = require('quick.db');

//Komut çalıştığında işlem yap.
exports.run = async (client, mesaj, argumanlar) => {

  //Botları ve bakiyesi olmayanları filtrele.
  const sorted = mesaj.guild.members.cache.filter(m => db.has(`${mesaj.guild.id}_${m.id}_bakiye`) && !m.user.bot).array().sort(a, b => {
    return (db.get(`${mesaj.guild.id}_${b.user.id}_bakiye`) || 0) - (db.get(`${mesaj.guild.id}_${a.user.id}_bakiye`) || 0);
  });

  //Filtrelenenlerden (eğer belirtilmişse belirtilen sayıda) değilse 10 tanesini al ve "top10" sabit değişkenine ata.
  const top10 = sorted.splice(0, argumanlar[0] || 10);
  var sira = 1;

  //"top10" sabit değişkenindeki her bir bakiye için işlem yap.
  const map = top10.map(s => `• ${sira++}. **${s.user}** | ${db.get(`${mesaj.guild.id}_${s.user.id}_bakiye`) || 0}`).join('\n')
  const embed = new MessageEmbed()
  //Embed başlığı.
  .setAuthor('İlk 10')
  //Embed açıklaması: map dizisinde sıralanabilir değer yoksa mesaj göster.
  .setDescription(map || '• Burada gösterilecek birşey yok.')

  //Embed çıktısı.
  return mesaj.channel.send(embed);
};

exports.conf = {
  //Alternatif kullanımlar.
  aliases: [],
  //Gerektirdiği yetki.
  permLevel: 0
};

exports.help = {
  //Komudun ana kullanımı.
  name: 'sıralama',
  //İsteğe bağlı açıklama.
  description: 'Sunucudaki bakiye sıralama tablosunu gösterir.'
};
