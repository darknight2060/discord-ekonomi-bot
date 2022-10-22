//Gerekli modülleri içe aktar.
const { Collection, Client, Intents } = require('discord.js');
const fs = require("fs");

//Client ayarları.
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

//Ayarları içe aktar.
const { prefix, sahip, token } = require("./ayarlar.json");

//Komutlar listesini topla.
client.commands = new Collection();
client.aliases = new Collection();


//Komutları /komutlar dizininden oku.
fs.readdir("./komutlar/", (err, files) => {

  //Okumaya başlarken komut sayısını konsola yazdır.
  console.log(`${files.length} komut yüklenecek.`);

  //Komut dosyası başına döngüyü bir kez çalıştır.
  files.forEach(f => {
    //Komut dosyasını içe aktar.
    let props = require(`./komutlar/${f}`);

    //Komut adını yazdır.
    console.log(`Yüklenen komut: ${props.help.name}.`);

    //Komudu client.commands koleksiyonuna ekle.
    client.commands.set(props.help.name, props);

    //Komudun alternatif kullanımlarını client.aliases koleksiyonuna ekle.
    props.conf.aliases.forEach(alias => {
      //Alternatifi client.aliases koleksiyonuna ekle.
      client.aliases.set(alias, props.help.name);
    });
  });
});


//Mesaj geldiğinde çalıştır.
client.on('messageCreate', async mesaj => {

  //Mesaj sahibi botsa işlem yapma.
  if (mesaj.author.bot) return;
  //Mesaj prefix ile başlamıyorsa işlem yapma.
  if (!mesaj.content.startsWith(prefix)) return;

  //...
  let komut;

  //Mesajdan girilen komudu ayıkla.
  let command = mesaj.content.split(' ')[0].slice(prefix.length);
  //Mesajdan girilen argümanı ayıkla.
  let argumanlar = mesaj.content.split(' ').slice(1);

  //Yetkilendirmeleri denetle.
  let yetkiler = client.yetkilendirme(mesaj);

  //Girilen komudun varolduğunu doğrula.
  if (client.commands.has(command)) {
    //Girilen komudu çağır.
    komut = client.commands.get(command);
  } else if (client.aliases.has(command)) {
    //Girilen komut alternatifini çağır.
    komut = client.commands.get(client.aliases.get(command));
  }

  //Komut geçerli ise çalıştır.
  if (komut) {
    //Komut için gerekli yetki yoksa işlem yapma.
    if (yetkiler < komut.conf.permLevel) return;

    //Komudu çalıştır.
    komut.run(client, mesaj, argumanlar, yetkiler);
  }
});


//Bot hazır olduğunda çalıştır.
client.on('ready', () => {

  //...
  console.log(`${client.user.username} şimdi aktif!`);

  //Botun durum kısmını ayarla.
  client.user.setActivity(`${prefix}yardım`);
});


//Yetkilendirme ayarları.
client.yetkilendirme = mesaj => {

  //Mesaj bir sunucudan gönderilmediyse işlem yapma.
  if (!mesaj.guild) return;

  //Varsayılan yetkiyi ayarla.
  let yetkiLevel = 0;

  //Eğer banlama yetkisi var ise yetkilendir.
  if (mesaj.member.permissions.has("BAN_MEMBERS")) yetkiLevel = 2;
  //Eğer yönetici yetkisi var ise yetkilendir.
  if (mesaj.member.permissions.has("ADMINISTRATOR")) yetkiLevel = 3;
  //Eğer bot sahibi ise yetkilendir. (bkz. ayarlar.json)
  if (mesaj.author.id === sahip) yetkiLevel = 4;

  //Fonksiyon yetki denetimi sonucunu iletsin.
  return yetkiLevel;
};


//Bot giriş yaparak aktif hale gelsin.
client.login(token);