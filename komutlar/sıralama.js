const Discord = require("discord.js");
const db = require('quick.db');

exports.run = async (client, message, args) => { 
  const sorted = message.guild.members.cache.filter(m=>db.has(`${message.guild.id}_${m.id}_bakiye`)&&!m.user.bot).array().sort((a, b) => {//Bakiyesi olmayanları ve botları filtrele.
    return (db.fetch(`${message.guild.id}_${b.user.id}_bakiye`) || 0) - (db.fetch(`${message.guild.id}_${a.user.id}_bakiye`) || 0);
  });
  const top10 = sorted.splice(0, args[0] || 10);//Filtrelenenlerden (eğer belirtilmişse belirtilen sayıda) değilse 10 tanesini al ve "top10" sabit değişkenine ata.
  var sira = 1;
  const map = top10.map(s=>`• ${sira++}. **${s.user}** | ${db.fetch(`${message.guild.id}_${s.user.id}_bakiye`)||0} TL`).join('\n')//"top10" sabit değişkenindeki her bir bakiye için işlem yap.
  const embed = new Discord.MessageEmbed()
  .setAuthor(`İlk 10`)//Embed başlığı
  .setDescription(map||`• Burada gösterilecek birşey yok.`)//Embed açıklaması
  return message.channel.send(embed);//Embed çıktısı
};

exports.conf = {
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: "sıralama",
  description: "Sunucudaki bakiye sıralama tablosunu gösterir.",
  usage: "sıralama"
};
