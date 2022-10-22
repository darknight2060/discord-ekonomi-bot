# Quick.db Ekonomi Bot Kodları

Botun genel ayarlarını `ayarlar.json` dosyasından düzenleyebilirsin.  
Tüm bot kodları discord.js V13 içindir, quick.db@9.0.0 ve sonrası ile uyumlu değildir.

Yorum satırlarını olabildiğince fazla tutmaya çalıştım, anlaşılır kalacağını umuyorum.  
Kod çeşitliliğinden çok anlaşılabilirliğe önem verdim.

## Kurulum

### Node.JS (Gerekli)

- https://nodejs.org/ adresinden LTS versiyonunu indir ve kur. (Yeniden başlatma gerektirir)
- Unutma: Discord.js V13, Node.js 16.6 veya üstü gerektirir.

### Bot

1. Kodları indir veya `git clone` (git gerektirir) kullanarak kopyala.

2. Proje klasörü içinde komut satırı açarak `npm install` komuduyla modülleri indir.

3. [Buradan](https://discord.com/developers/applications) bir Discord botu oluştur. Eğer bilgin yoksa internetteki videolardan yardım alabilirsin.

4. `ayarlar.json` dosyasındaki Token, Sahip, Prefix değerlerini ayarla. Sahip kısmına kendi Discord ID'ni yazmalısın. Prefix komutların başına yazılacaktır. (**!komut** gibi)

5. Hazırız! `node main.js` komuduyla botu çalıştır. Her şey yolunda giderse bot aktif olacaktır.
